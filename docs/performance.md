---
title: Performance
description: Understand what affects Fuse.js indexing and search speed, and how to benchmark with your own data.
---

# Performance

## What affects performance

#### Indexing

When you create a `new Fuse(list, options)`, the library walks every item and builds an internal index. The cost scales with:

- **List size** — more items means more work. 10k items is near-instant; 100k+ may take tens of milliseconds.
- **Number of keys** — each key is indexed separately, so `keys: ['title']` is cheaper than `keys: ['title', 'author', 'description', 'tags']`.
- **Value length** — longer strings take more time to process during indexing.

If indexing time matters (e.g. large datasets on page load), you can pre-build the index with `Fuse.createIndex()` and pass it in:

```js
const index = Fuse.createIndex(keys, list)
const fuse = new Fuse(list, options, index)
```

#### Search

Search speed depends on:

- **List size** — search is linear in the number of indexed entries.
- **Query length** — the default matcher (Myers) makes a single pass over each text, so its cost grows with text length, not with how many typos the threshold allows. Patterns longer than 32 characters are matched in 32-character chunks, one pass per chunk.
- **Threshold** — with the default matcher, a more lenient `threshold` widens the part of each text that can match, but the text is still scanned once. With `matchAlgorithm: 'bitap'`, a more lenient threshold costs much more, because Bitap rescans the text once per allowed typo.
- **Token search** — `useTokenSearch: true` runs a separate fuzzy pass for each query term, so multi-word queries scale with the number of terms.
- **Extended search** — operators like prefix match (`^term`) and inverse match (`!term`) add per-operator cost.

#### Memory

The index stores processed string values and metadata for each key of each item, so it grows with your data. With 3 keys and about 30 words per item, expect roughly 7 MB per 10,000 items (about 70 MB at 100k). Token search adds an inverted index on top, roughly 3x the base index (about 225 MB at 100k). If memory is a concern, index fewer keys, and only enable `useTokenSearch` when you need multi-word queries.

## Guidelines

::: tip New in v7.6.0
Fuzzy search is **2 to 7 times faster**, thanks to a single-pass matching algorithm (Myers) that replaces Bitap's one-scan-per-typo approach. The biggest gains are on queries with typos and on multi-word token search. See [Match Algorithm](/fuzzy-search#match-algorithm).
:::

Measured on an Apple M5 Max with Node 24, 3 searchable keys (`title`, `body`, `tags`), and about 30 words per item. Search times are for a one-typo query (`"javascrpt"`); token search is a two-word query with a typo.

| List size | Index creation | With token search | Fuzzy search | Token search |
|-----------|---------------|-------------------|--------------|--------------|
| 1,000 | ~1ms | ~5ms | ~0.8ms | ~2.6ms |
| 10,000 | ~7ms | ~44ms | ~7ms | ~19ms |
| 50,000 | ~40ms | ~220ms | ~37ms | ~96ms |
| 100,000 | ~77ms | ~444ms | ~74ms | ~193ms |

For comparison, the same fuzzy search with `matchAlgorithm: 'bitap'` takes about 4x as long (~28ms at 10k items, ~282ms at 100k). String-only lists (no keys) index around 6ms for 100k items.

At 50k+ items, consider running search in a [Web Worker](/web-workers) so typing stays smooth on slower devices.

*Your results will vary based on hardware, key count, and value length. Use the benchmark below to measure with your own data.*

## Try it on your machine

See how Fuse.js performs on your hardware. The benchmark runs inside a Web Worker so the page stays responsive.

<PerfDemo />

<sub>Documents are randomly generated from a dictionary of common words. See the [benchmark script](#benchmark-script) below for details.</sub>

## Benchmark script

The most reliable way to answer "is Fuse.js fast enough for my use case?" is to measure it. Copy the script below and adjust the dataset to match yours:

```js
import Fuse from 'fuse.js'

// -- Configure to match your use case --
const LIST_SIZE = 10_000
const KEYS = ['title', 'description', 'category', 'tags']
const QUERY = 'javascript'
const OPTIONS = { keys: KEYS, threshold: 0.4 }
const SEARCH_RUNS = 100

// -- Generate sample data --
const words = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot',
  'golf', 'hotel', 'india', 'juliet', 'kilo', 'lima', 'mike', 'november',
  'oscar', 'papa', 'quebec', 'romeo', 'sierra', 'tango', 'uniform',
  'victor', 'whiskey', 'xray', 'yankee', 'zulu', 'javascript', 'typescript',
  'python', 'rust', 'golang', 'swift', 'kotlin', 'scala', 'elixir']

function randomSentence(len) {
  return Array.from({ length: len }, () =>
    words[Math.floor(Math.random() * words.length)]
  ).join(' ')
}

const list = Array.from({ length: LIST_SIZE }, () => ({
  title: randomSentence(4),
  description: randomSentence(12),
  category: randomSentence(2),
  tags: randomSentence(6)
}))

// -- Benchmark indexing --
const indexStart = performance.now()
const fuse = new Fuse(list, OPTIONS)
const indexTime = performance.now() - indexStart

// -- Benchmark search (average over multiple runs) --
const searchStart = performance.now()
for (let i = 0; i < SEARCH_RUNS; i++) {
  fuse.search(QUERY)
}
const searchTime = (performance.now() - searchStart) / SEARCH_RUNS

// -- Results --
console.log(`List size:    ${LIST_SIZE.toLocaleString()} items`)
console.log(`Keys:         ${KEYS.join(', ')}`)
console.log(`Index time:   ${indexTime.toFixed(2)}ms`)
console.log(`Search time:  ${searchTime.toFixed(2)}ms (avg over ${SEARCH_RUNS} runs)`)
console.log(`Results:      ${fuse.search(QUERY).length} matches`)
```

Run it with Node:

```sh
node --input-type=module bench.mjs
```

Or paste it into a browser console to measure client-side performance.
