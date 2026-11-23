#!/usr/bin/env node
// A/B benchmark: the working tree vs another git ref (default: main).
//
//   npm run bench:compare                 # working tree vs main
//   npm run bench:compare -- v7.5.0       # vs any ref
//   npm run bench:compare -- main --rounds 5 --scripts search,extended
//
// Builds the other ref in a temporary git worktree, then runs the *current*
// bench/ scripts against both builds so the harness and the seeded corpora
// (bench/rng.mjs) are identical on both sides. Runs alternate A/B per round
// to spread out thermal and background noise, and the table reports medians
// across rounds. Rows more than 5% slower than the baseline are flagged.
//
// Local only: shared CI runners vary too much for a pass/fail gate.

import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, rmSync, symlinkSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
// Flag rows where HEAD takes more than 5% longer than the baseline.
const SLOWER_RATIO = 1.05

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const ref =
  args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')) ??
  'main'
const rounds = Number(flag('rounds', 3))
if (!Number.isInteger(rounds) || rounds < 1) {
  console.error('--rounds must be a positive integer')
  process.exit(1)
}
const scripts = flag(
  'scripts',
  'search,extended,token-search,index-creation'
).split(',')

const run = (cmd, cmdArgs, cwd) =>
  execFileSync(cmd, cmdArgs, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  })

const work = mkdtempSync(join(tmpdir(), 'fuse-bench-'))
const baseTree = join(work, 'base-tree')
const sides = { base: join(work, 'base'), head: join(work, 'head') }

const cleanup = () => {
  try {
    run('git', ['worktree', 'remove', '--force', baseTree], ROOT)
  } catch {}
  rmSync(work, { recursive: true, force: true })
}
process.on('SIGINT', () => {
  cleanup()
  process.exit(130)
})

try {
  console.log(`Building ${ref} in a temporary worktree...`)
  run('git', ['worktree', 'add', '--detach', baseTree, ref], ROOT)
  symlinkSync(join(ROOT, 'node_modules'), join(baseTree, 'node_modules'))
  run('npm', ['run', 'build'], baseTree)

  console.log('Building the working tree...')
  run('npm', ['run', 'build'], ROOT)

  // Each side gets the current bench/ scripts next to its own dist/.
  for (const [side, dir] of Object.entries(sides)) {
    cpSync(join(ROOT, 'bench'), join(dir, 'bench'), { recursive: true })
    cpSync(join(side === 'base' ? baseTree : ROOT, 'dist'), join(dir, 'dist'), {
      recursive: true
    })
  }

  // samples[script][rowIndex] = { label, base: [], head: [] }
  const samples = {}
  for (let r = 1; r <= rounds; r += 1) {
    console.log(`Round ${r}/${rounds}`)
    for (const script of scripts) {
      // Alternate which side goes first each round to cancel order bias.
      const order = r % 2 ? ['base', 'head'] : ['head', 'base']
      for (const side of order) {
        const file = join(sides[side], 'bench', `${script}.mjs`)
        if (!existsSync(file))
          throw new Error(`No such bench script: ${script}`)
        const out = run('node', [file], sides[side])
        let row = 0
        for (const line of out.split('\n')) {
          const parsed = parseLine(line)
          if (!parsed) continue
          const rows = (samples[script] ??= [])
          rows[row] ??= { label: parsed.label, base: [], head: [] }
          rows[row][side].push(parsed.ms)
          row += 1
        }
      }
    }
  }

  printTable(samples)
} finally {
  cleanup()
}

// "label: median=12.04ms ..." or "Label:   61µs"
function parseLine(line) {
  let m = line.match(/^\s*(.+?):\s+median=([\d.]+)(ms|µs)/)
  if (!m) m = line.match(/^\s*(.+?):\s+([\d.]+)(ms|µs)\s*$/)
  if (!m) return null
  const value = Number(m[2])
  return { label: m[1].trim(), ms: m[3] === 'µs' ? value / 1000 : value }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[sorted.length >> 1]
}

function printTable(samples) {
  const fmt = (ms) =>
    ms < 1 ? `${(ms * 1000).toFixed(0)}µs` : `${ms.toFixed(2)}ms`
  console.log(
    `\n${'benchmark'.padEnd(52)}${ref.padStart(11)}${'HEAD'.padStart(11)}${'speedup'.padStart(9)}`
  )
  let flagged = 0
  for (const [script, rows] of Object.entries(samples)) {
    for (const { label, base, head } of rows) {
      const b = median(base)
      const h = median(head)
      const speedup = b / h
      const slow = h / b > SLOWER_RATIO
      if (slow) flagged += 1
      const name = `${script}: ${label}`.slice(0, 51)
      console.log(
        `${name.padEnd(52)}${fmt(b).padStart(11)}${fmt(h).padStart(11)}${`${speedup.toFixed(2)}x`.padStart(9)}${slow ? '  <-- >5% slower' : ''}`
      )
    }
  }
  console.log(
    `\n${rounds} alternating round(s), medians. ${flagged ? `${flagged} row(s) more than 5% slower than ${ref}; rerun with --rounds 5 to confirm.` : `No row more than 5% slower than ${ref}.`}`
  )
}
