// Index efficiency benchmark: memory, serialized size, and startup paths.
//
//   node bench/index-memory.mjs              # 10k and 100k items
//   BENCH_LARGE=1 node bench/index-memory.mjs  # also 1M (slow, needs RAM)
//
// For each shape (objects with 3 keys, plain strings) and mode (fuzzy, token
// search), reports:
//   - memory retained by the index (documents excluded), after a full GC:
//     JS heap plus ArrayBuffer storage, which lives outside heapUsed
//   - build time: new Fuse(docs, options)
//   - build + first search: construction plus the first query on it
//   - serialized index size: JSON.stringify(fuse.getIndex().toJSON())
//   - parse time: JSON.parse + Fuse.parseIndex + new Fuse(docs, options, index)
//
// Lines use `label: median=<value><unit>` so `npm run bench:compare` can diff
// them. Every metric is lower-is-better. Data comes from the seeded PRNG in
// ./rng.mjs, so both sides of a comparison index identical documents.

import v8 from 'node:v8'
import vm from 'node:vm'
import Fuse from '../dist/fuse.mjs'
import { random } from './rng.mjs'

v8.setFlagsFromString('--expose-gc')
const gc = vm.runInNewContext('gc')

const RUNS = 5
const sizes = [10_000, 100_000]
if (process.env.BENCH_LARGE) sizes.push(1_000_000)

const words =
  'apple banana cherry search fuzzy index query javascript typescript optimization performance library matching string pattern location distance threshold score result ranking token document field record value design system data model network server client browser render cache memory'.split(
    ' '
  )
const pick = () => words[Math.floor(random() * words.length)]
const sentence = (n) => Array.from({ length: n }, pick).join(' ')

const makeObjects = (n) =>
  Array.from({ length: n }, () => ({
    title: sentence(3 + Math.floor(random() * 5)),
    body: sentence(15 + Math.floor(random() * 25)),
    tags: [pick(), pick(), pick()]
  }))
const makeStrings = (n) =>
  Array.from({ length: n }, () => sentence(3 + Math.floor(random() * 6)))

const median = (values) => [...values].sort((a, b) => a - b)[values.length >> 1]

const time = (fn, runs = RUNS) => {
  const samples = []
  for (let i = 0; i < runs; i += 1) {
    gc()
    const start = performance.now()
    fn()
    samples.push(performance.now() - start)
  }
  return median(samples)
}

// Typed arrays keep their data in ArrayBuffers, which heapUsed doesn't count.
const retained = () => {
  const { heapUsed, arrayBuffers } = process.memoryUsage()
  return heapUsed + arrayBuffers
}

// Median of several samples: heapUsed deltas are noisy even after a full GC.
// The previous sample's instance is released explicitly before each baseline;
// otherwise V8 can keep it alive in the loop and the deltas cancel out.
const heapRetained = (build, samples = 3) => {
  const deltas = []
  let kept = null
  for (let i = 0; i < samples; i += 1) {
    kept = null
    gc()
    gc()
    const before = retained()
    kept = build()
    gc()
    gc()
    deltas.push(retained() - before)
  }
  if (!kept) throw new Error('unreachable')
  return median(deltas)
}

const fmtBytes = (bytes) =>
  bytes >= 1e6
    ? `${(bytes / 1e6).toFixed(2)}MB`
    : `${(bytes / 1e3).toFixed(1)}KB`

const report = (label, value) => console.log(`  ${label}: median=${value}`)

for (const [shape, make, keys] of [
  ['objects', makeObjects, ['title', 'body', 'tags']],
  ['strings', makeStrings, undefined]
]) {
  for (const size of sizes) {
    const docs = make(size)
    const query = 'javascrpt optimizaton'
    for (const token of [false, true]) {
      const options = keys
        ? { keys, useTokenSearch: token }
        : { useTokenSearch: token }
      const tag = `${shape} ${size.toLocaleString('en-US')} ${token ? 'token' : 'fuzzy'}`
      console.log(`\n=== ${tag} ===`)

      report(
        `${tag} heap`,
        fmtBytes(heapRetained(() => new Fuse(docs, options)))
      )

      const runs = size >= 1_000_000 ? 3 : RUNS
      report(
        `${tag} build`,
        `${time(() => new Fuse(docs, options), runs).toFixed(2)}ms`
      )
      report(
        `${tag} build+first search`,
        `${time(() => new Fuse(docs, options).search(query), runs).toFixed(2)}ms`
      )

      // Serialization covers the record index only (toJSON does not include
      // the token-search inverted index), so measure it once per shape/size.
      if (!token) {
        const json = JSON.stringify(new Fuse(docs, options).getIndex().toJSON())
        report(`${tag} serialized`, fmtBytes(Buffer.byteLength(json)))
        report(
          `${tag} parse+construct`,
          `${time(() => new Fuse(docs, options, Fuse.parseIndex(JSON.parse(json))), runs).toFixed(2)}ms`
        )
      }
    }
  }
}
