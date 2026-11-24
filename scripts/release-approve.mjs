// Approves the publish workflow run that is waiting on the `npm` environment.
//
//   npm run release:approve
//
// Shows exactly what the run will publish (event, tag, commit, the version in
// package.json at that commit, dist-tag), checks they agree, then approves it
// with the GitHub CLI as the logged-in user. Run it yourself: the approval is
// the human check before a release goes public.

import { execFileSync } from 'node:child_process'
import { distTagFor } from './release-meta.mjs'

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' }).trim()
const fail = (message) => {
  throw new Error(message)
}

function main() {
  const repo = gh(
    'repo',
    'view',
    '--json',
    'nameWithOwner',
    '--jq',
    '.nameWithOwner'
  )
  const runs = JSON.parse(
    gh(
      'run',
      'list',
      '--workflow',
      'publish.yml',
      '--status',
      'waiting',
      '--json',
      'databaseId,headBranch,headSha,event,url'
    )
  )
  if (runs.length === 0) {
    console.log('No publish run is waiting for approval.')
    return
  }
  if (runs.length > 1) {
    console.error('More than one publish run is waiting; approve on GitHub:')
    for (const run of runs) console.error(`  ${run.url}`)
    process.exit(1)
  }

  const [run] = runs
  if (run.event !== 'push' && run.event !== 'workflow_dispatch') {
    fail(`Unexpected event "${run.event}"; approve on GitHub if intended`)
  }
  const dryRun = run.event === 'workflow_dispatch'

  // The version as committed at the run's exact commit.
  const pkg = JSON.parse(
    Buffer.from(
      gh(
        'api',
        `repos/${repo}/contents/package.json?ref=${run.headSha}`,
        '--jq',
        '.content'
      ),
      'base64'
    ).toString('utf8')
  )
  const version = pkg.version
  const distTag = distTagFor(version)
  if (!dryRun && run.headBranch !== `v${version}`) {
    fail(`Tag ${run.headBranch} doesn't match package.json version ${version}`)
  }

  const pending = JSON.parse(
    gh(
      'api',
      `repos/${repo}/actions/runs/${run.databaseId}/pending_deployments`
    )
  )
  const names = pending.map((p) => p.environment.name)
  if (names.length !== 1 || names[0] !== 'npm') {
    fail(
      `Expected one pending "npm" environment, found: ${names.join(', ') || 'none'}`
    )
  }

  console.log(dryRun ? 'DRY RUN (nothing is published)' : 'PUBLISH to npm')
  console.log(`  package:  ${pkg.name}@${version}`)
  console.log(`  dist-tag: ${distTag}`)
  console.log(`  ref:      ${run.headBranch} (${run.event})`)
  console.log(`  commit:   ${run.headSha}`)
  console.log(`  run:      ${run.url}`)

  gh(
    'api',
    '-X',
    'POST',
    `repos/${repo}/actions/runs/${run.databaseId}/pending_deployments`,
    '-F',
    `environment_ids[]=${pending[0].environment.id}`,
    '-f',
    'state=approved',
    '-f',
    'comment=Approved with npm run release:approve'
  )
  console.log(`Approved. Follow it with: gh run watch ${run.databaseId}`)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
