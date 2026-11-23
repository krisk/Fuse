// Columnar index shape check: base index memory (heap + ArrayBuffers) for the
// record layout vs the columnar layout, and that the deprecated `records`
// snapshot is not retained once dropped.
//
//   node bench/columnar-shape.mjs
//
// The record layout is the `records` snapshot: the exact shape pre-columnar
// versions held, sharing the documents' strings as they did (the index that
// produced it is released). Each representation is built inside a function
// whose frame exits before measuring, so V8 can't keep the previous one alive.

import v8 from 'node:v8'
import vm from 'node:vm'
import Fuse from '../dist/fuse.mjs'
import { random } from './rng.mjs'

v8.setFlagsFromString('--expose-gc')
const gc = vm.runInNewContext('gc')
console.warn = () => {}

const SIZE = 100_000
const words =
  'apple banana cherry search fuzzy index query javascript typescript optimization performance library matching string pattern location distance threshold score result ranking token document field record value design system data model network server client browser render cache memory'.split(
    ' '
  )
const pick = () => words[Math.floor(random() * words.length)]
const sentence = (n) => Array.from({ length: n }, pick).join(' ')

const shapes = {
  objects: {
    keys: ['title', 'body', 'tags'],
    docs: Array.from({ length: SIZE }, () => ({
      title: sentence(3 + Math.floor(random() * 5)),
      body: sentence(15 + Math.floor(random() * 25)),
      tags: [pick(), pick(), pick()]
    }))
  },
  strings: {
    keys: [],
    docs: Array.from({ length: SIZE }, () =>
      sentence(3 + Math.floor(random() * 6))
    )
  }
}

const used = () => {
  gc()
  gc()
  const { heapUsed, arrayBuffers } = process.memoryUsage()
  return heapUsed + arrayBuffers
}

const median = (values) => [...values].sort((a, b) => a - b)[values.length >> 1]

// Memory retained by whatever build() returns, median of 3.
const retainedBy = (build) => {
  const deltas = []
  let kept = null
  for (let i = 0; i < 3; i += 1) {
    kept = null
    const before = used()
    kept = build()
    deltas.push(used() - before)
  }
  if (!kept) throw new Error('unreachable')
  return median(deltas)
}

const mb = (bytes) => `${(bytes / 1e6).toFixed(2)}MB`

for (const [name, { keys, docs }] of Object.entries(shapes)) {
  const records = () => Fuse.createIndex(keys, docs).records
  const columnar = () => Fuse.createIndex(keys, docs)

  const recordBytes = retainedBy(records)
  const columnarBytes = retainedBy(columnar)
  const saving = 1 - columnarBytes / recordBytes
  console.log(
    `  ${name} ${SIZE.toLocaleString('en-US')} records: median=${mb(recordBytes)}`
  )
  console.log(
    `  ${name} ${SIZE.toLocaleString('en-US')} columnar: median=${mb(columnarBytes)}` +
      `  (${(saving * 100).toFixed(0)}% less)`
  )

  // The snapshot costs memory only while it is held.
  let index = Fuse.createIndex(keys, docs)
  const base = used()
  let snapshot = index.records
  const holding = used() - base
  snapshot = null
  const after = used() - base
  console.log(
    `  ${name} snapshot held: ${mb(holding)}, after release: ${mb(after)}` +
      (after > holding / 10 ? '  <-- snapshot retained!' : '')
  )
  index = null
  void snapshot
  void index
}
