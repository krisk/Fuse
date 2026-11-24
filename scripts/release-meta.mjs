// Release metadata for the publish workflow and `npm run release:approve`.
//
//   node scripts/release-meta.mjs
//
// Prints the version and the npm dist-tag it publishes under, and in GitHub
// Actions writes them as step outputs. Checks:
//   - on a tag push, the tag is exactly `v<package.json version>`;
//   - the version is newer than what its dist-tag points to on npm, so no
//     channel (latest, beta, ...) can move backwards.
// Manual (workflow_dispatch) runs are dry runs from a branch whose version is
// usually already published, so the ordering check only warns there.

import { readFileSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Semantic versions without build metadata: no leading zeros, no empty
// prerelease identifiers.
const NUM = '(0|[1-9]\\d*)'
const PRE_ID = '(?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*)'
const SEMVER = new RegExp(
  `^${NUM}\\.${NUM}\\.${NUM}(?:-(${PRE_ID}(?:\\.${PRE_ID})*))?$`
)

export function parseVersion(version) {
  const match = SEMVER.exec(version)
  if (!match) throw new Error(`Not a release version: ${version}`)
  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    pre: match[4] ? match[4].split('.') : []
  }
}

// The dist-tag for a version: a prerelease goes under its first identifier
// (7.6.0-beta.6 -> beta, 8.0.0-rc.1 -> rc), anything else under latest.
export function distTagFor(version) {
  const { pre } = parseVersion(version)
  if (!pre.length) return 'latest'
  if (!/^[a-z]+$/.test(pre[0])) {
    throw new Error(
      `Prerelease identifier "${pre[0]}" isn't a plain lowercase word (beta, rc, ...)`
    )
  }
  return pre[0]
}

// Semver precedence: -1, 0 or 1.
export function compareVersions(a, b) {
  const va = parseVersion(a)
  const vb = parseVersion(b)
  for (let i = 0; i < 3; i += 1) {
    if (va.core[i] !== vb.core[i]) return va.core[i] < vb.core[i] ? -1 : 1
  }
  // A release ranks above its prereleases.
  if (!va.pre.length || !vb.pre.length) {
    return va.pre.length === vb.pre.length ? 0 : va.pre.length ? -1 : 1
  }
  for (let i = 0; i < Math.max(va.pre.length, vb.pre.length); i += 1) {
    if (i >= va.pre.length) return -1
    if (i >= vb.pre.length) return 1
    const x = va.pre[i]
    const y = vb.pre[i]
    if (x === y) continue
    const xn = /^\d+$/.test(x)
    const yn = /^\d+$/.test(y)
    if (xn && yn) return Number(x) < Number(y) ? -1 : 1
    if (xn !== yn) return xn ? -1 : 1
    return x < y ? -1 : 1
  }
  return 0
}

function main() {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
  const version = pkg.version
  const distTag = distTagFor(version)
  const dryRun = process.env.GITHUB_EVENT_NAME === 'workflow_dispatch'

  if (process.env.GITHUB_REF_TYPE === 'tag') {
    const tag = process.env.GITHUB_REF_NAME
    if (tag !== `v${version}`) {
      throw new Error(
        `Tag ${tag} doesn't match package.json version ${version}`
      )
    }
  }

  const tags = JSON.parse(
    execFileSync('npm', ['view', pkg.name, 'dist-tags', '--json'], {
      encoding: 'utf8'
    })
  )
  const current = tags[distTag]
  if (current && compareVersions(version, current) <= 0) {
    const message = `${version} is not newer than the current "${distTag}" (${current})`
    if (!dryRun) throw new Error(message)
    console.log(`warning: ${message} (dry run, continuing)`)
  }

  console.log(`version=${version}`)
  console.log(`dist-tag=${distTag}`)
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `version=${version}\ndist-tag=${distTag}\n`
    )
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
