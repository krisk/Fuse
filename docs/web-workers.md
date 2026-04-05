---
title: Web Workers
description: Run Fuse.js search across multiple Web Workers for parallel speedup and zero UI jank on large datasets.
---

# Web Workers <Badge type="warning" text="Beta" />

`FuseWorker` distributes search across multiple Web Workers, searching dataset shards in parallel. The UI stays completely responsive — no jank, no frozen frames — even on 100K+ item datasets.

::: warning Beta
This feature is new and the API may change based on feedback. If you run into issues or have thoughts on the API surface, please open an issue on [GitHub](https://github.com/krisk/Fuse/issues).
:::

## Try It

Click **Search** on each side and watch the balls. The FPS counter tells the story.

<WorkerDemo />

<sub>Dataset: randomly generated people with name, email, company, and description fields — searched across all 4 keys.</sub>

## When to Use It

The standard `Fuse` class searches synchronously on the main thread. For most datasets (hundreds to a few thousand items), this is fast enough. But with 10K+ items, search can take hundreds of milliseconds or more, visibly freezing the UI.

`FuseWorker` is designed for these cases:

- **Large datasets** — 10K+ items where single-thread search causes noticeable lag
- **Search-as-you-type** — where every keystroke triggers a search and frame drops are unacceptable
- **Mobile devices** — where slower CPUs make the problem worse

If your dataset is small enough that `Fuse` feels instant, stick with `Fuse`. Simpler, synchronous, no cleanup needed.

#### Why not just use Web Workers yourself?

You can — it's not too complicated. But `FuseWorker` handles the parts that are tedious to get right: splitting the dataset into shards, spawning and managing worker lifecycle, dispatching queries to all workers in parallel, and merging results back in sorted order. It's boilerplate you'd write every time, bundled into a [drop-in class](https://github.com/krisk/Fuse/blob/main/src/workers/FuseWorker.ts) with the same API you already know.

## Quick Start

Web Workers require the beta release:

```sh
npm install fuse.js@beta
```

```js
import { FuseWorker } from 'fuse.js/worker'

const fuse = new FuseWorker(docs, {
  keys: ['title', 'author', 'description'],
  threshold: 0.4,
  includeScore: true
})

const results = await fuse.search('javascript')

// Clean up when done
fuse.terminate()
```

Same options and same results as `Fuse` — the only difference is that `search()` returns a Promise.

## How It Works

1. **Lazy initialization** — Workers are not created until the first `search()` call.
2. **Data sharding** — The dataset is split evenly across N workers. Each worker creates its own `Fuse` instance with its shard.
3. **Parallel search** — A search query is sent to all workers simultaneously. Each worker searches its shard independently.
4. **Merge** — Results from all workers are merged and sorted by score on the main thread.

```
Main Thread                           Worker Threads
───────────                           ──────────────
FuseWorker.search('query')
  ├── postMessage ──────────────────▶ Worker 1: Fuse.search('query') on shard 1
  ├── postMessage ──────────────────▶ Worker 2: Fuse.search('query') on shard 2
  ├── postMessage ──────────────────▶ Worker 3: Fuse.search('query') on shard 3
  └── postMessage ──────────────────▶ Worker 4: Fuse.search('query') on shard 4
                                        │
  merge + sort ◀────────────────────────┘
```

## API

#### Constructor

```js
const fuse = new FuseWorker(docs, options?, workerOptions?)
```

- **`docs`** — Array of documents to search (same as `Fuse`)
- **`options`** — Fuse.js options (same as `Fuse`: `keys`, `threshold`, `includeScore`, etc.)
- **`workerOptions`** — Worker-specific options:

| Option | Type | Default | Description |
|---|---|---|---|
| `numWorkers` | `number` | `navigator.hardwareConcurrency` (max 8) | Number of parallel workers |
| `workerUrl` | `string \| URL` | Auto-resolved | Custom path to the worker script |

#### `search(query, options?)`

```js
const results = await fuse.search('query')
const limited = await fuse.search('query', { limit: 10 })
```

Returns `Promise<FuseResult[]>`. Supports the same query types as `Fuse`: strings, and expression objects (logical search).

#### `add(doc)`

```js
await fuse.add({ title: 'New Item', author: 'Jane' })
```

Adds a document to one of the worker shards (round-robin distribution).

#### `setCollection(docs)`

```js
await fuse.setCollection(newDocs)
```

Replaces the entire dataset. Redistributes across workers and rebuilds indexes. Use this instead of `remove()` — filter your array, then call `setCollection`.

#### `terminate()`

```js
fuse.terminate()
```

Terminates all workers and cleans up resources. Always call this when you're done searching.

## Performance

Benchmarked in Chrome on 100,000 documents with 4 searchable keys:

| Method | Time | Speedup |
|---|---|---|
| Fuse (single thread) | 6,276ms | 1.00x |
| FuseWorker (2 workers) | 3,514ms | 1.79x |
| FuseWorker (4 workers) | 1,909ms | 3.29x |
| FuseWorker (8 workers) | 1,338ms | 4.69x |

Scaling is near-linear. The sweet spot is typically 4 workers — beyond that, the marginal gains diminish and memory usage increases (each worker holds a copy of its shard).

Want to run more detailed benchmarks? See [`benchmark/parallel-browser`](https://github.com/krisk/Fuse/tree/main/benchmark/parallel-browser) in the repo.

#### Overhead

Workers add overhead from data serialization (`postMessage`) and worker startup. For small datasets, this overhead outweighs the parallelism benefit. As a rule of thumb:

- **< 5K items** — Use `Fuse`. Workers add latency.
- **5K–10K items** — Either works. Test with your data.
- **10K+ items** — `FuseWorker` is faster and keeps the UI responsive.

## Differences from Fuse

| | Fuse | FuseWorker |
|---|---|---|
| `search()` return type | `FuseResult[]` | `Promise<FuseResult[]>` |
| UI blocking | Yes | No |
| `remove(predicate)` | Supported | Use `setCollection()` instead |
| `getIndex()` | Supported | Not available |
| Result object references | Same as input docs | Copies (structured clone) |
| Custom `sortFn` | Supported | Not available (sorts by score) |
| Cleanup required | No | Call `terminate()` |

## Worker URL

By default, `FuseWorker` resolves the worker script automatically via `import.meta.url`. If your bundler or deployment setup requires a different path, you can specify it:

```js
const fuse = new FuseWorker(docs, options, {
  workerUrl: '/static/fuse.worker.mjs'
})
```

The worker script is available at `fuse.js/worker-script`:

```js
import workerUrl from 'fuse.js/worker-script'
```

## Browser Support

Web Workers are supported in all modern browsers (Chrome, Firefox, Safari, Edge). `FuseWorker` will not work in:

- **Server-side rendering (Node.js)** — the `Worker` API doesn't exist. Use `Fuse` on the server.
- **Restrictive CSP policies** — some Content Security Policies block `new Worker()`. Check your CSP headers if workers fail to spawn.
