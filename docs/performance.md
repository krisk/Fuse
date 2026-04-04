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
- **Query length** — the Bitap algorithm is O(n × m) where n is the text length and m is the pattern length. The default 32-character pattern limit keeps this bounded.
- **Threshold** — a lower `threshold` (stricter matching) prunes more candidates early, which can be faster.
- **Token search** — `useTokenSearch: true` runs a separate Bitap pass for each query term, so multi-word queries scale with the number of terms.
- **Extended search** — operators like prefix match (`^term`) and inverse match (`!term`) add per-operator cost.

#### Memory

The index stores processed string values and metadata for each key of each item. For typical use cases (under 100k items), memory overhead is modest — a few MB at most. If memory is a concern, index fewer keys.

## Guidelines

| List size | Indexing | Search | Notes |
|-----------|----------|--------|-------|
| 1,000 | < 1ms | < 1ms | No concerns |
| 10,000 | ~5ms | ~5–10ms | Fine for interactive use |
| 100,000 | ~50ms | ~50–100ms | Consider pre-built index; debounce search input |
| 1,000,000 | ~500ms+ | ~500ms+ | Use a Web Worker or server-side |

*Times are rough estimates on a modern machine. Your results will vary based on hardware, key count, and value length. Use the benchmark script below to measure with your own data.*

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
