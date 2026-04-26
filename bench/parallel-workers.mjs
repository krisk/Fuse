/**
 * Benchmark: Single-thread Fuse.js vs Parallel Web Workers
 *
 * Run: node bench/parallel-workers.mjs
 *
 * Generates a large dataset and compares search performance across
 * 1 (single-thread), 2, 4, and 8 workers.
 */

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import Fuse from '../dist/fuse.mjs'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DATASET_SIZE = 100_000
const QUERIES = ['john smith', 'quantum', 'xyz corp', 'engineering', 'banana']
const WORKER_COUNTS = [2, 4, 8]
const WARMUP_RUNS = 2
const BENCH_RUNS = 5

const FUSE_OPTIONS = {
  keys: ['name', 'email', 'company', 'description'],
  threshold: 0.4
}

// ---------------------------------------------------------------------------
// Dataset generation
// ---------------------------------------------------------------------------
const firstNames = [
  'John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank',
  'Grace', 'Hank', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mona', 'Nick',
  'Olivia', 'Paul', 'Quinn', 'Rita', 'Sam', 'Tina', 'Uma', 'Victor'
]
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White'
]
const companies = [
  'Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Co', 'Stark Industries',
  'Wayne Enterprises', 'XYZ Corp', 'Quantum Labs', 'Nova Systems', 'Apex Digital'
]
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'work.org']
const words = [
  'engineering', 'marketing', 'sales', 'design', 'research', 'quantum',
  'neural', 'cloud', 'data', 'analytics', 'platform', 'mobile', 'security',
  'infrastructure', 'development', 'operations', 'strategy', 'innovation',
  'optimization', 'integration', 'automation', 'visualization', 'banana'
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateDescription() {
  const len = 5 + Math.floor(Math.random() * 10)
  return Array.from({ length: len }, () => pick(words)).join(' ')
}

function generateDataset(size) {
  const docs = []
  for (let i = 0; i < size; i++) {
    const first = pick(firstNames)
    const last = pick(lastNames)
    docs.push({
      id: i,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(domains)}`,
      company: pick(companies),
      description: generateDescription()
    })
  }
  return docs
}

// ---------------------------------------------------------------------------
// Worker thread: receives a slice and searches it
// ---------------------------------------------------------------------------
if (!isMainThread) {
  const { docs, options, queries } = workerData
  const fuse = new Fuse(docs, options)

  const results = {}
  for (const q of queries) {
    results[q] = fuse.search(q)
  }

  parentPort.postMessage(results)
  process.exit(0)
}

// ---------------------------------------------------------------------------
// Main thread
// ---------------------------------------------------------------------------

function mergeResults(workerResults, sortFn) {
  // workerResults: array of { [query]: FuseResult[] }
  const merged = {}
  const queries = Object.keys(workerResults[0])

  for (const q of queries) {
    const all = []
    for (const wr of workerResults) {
      all.push(...wr[q])
    }
    all.sort(sortFn || ((a, b) => (a.score ?? 0) - (b.score ?? 0)))
    merged[q] = all
  }
  return merged
}

function searchSingleThread(docs, options, queries) {
  const fuse = new Fuse(docs, { ...options, includeScore: true })
  const results = {}
  for (const q of queries) {
    results[q] = fuse.search(q)
  }
  return results
}

function searchParallel(docs, options, queries, numWorkers) {
  const chunkSize = Math.ceil(docs.length / numWorkers)
  const chunks = []
  for (let i = 0; i < numWorkers; i++) {
    chunks.push(docs.slice(i * chunkSize, (i + 1) * chunkSize))
  }

  return new Promise((resolve) => {
    const workerResults = []
    let done = 0

    for (const chunk of chunks) {
      const worker = new Worker(fileURLToPath(import.meta.url), {
        workerData: {
          docs: chunk,
          options: { ...options, includeScore: true },
          queries
        }
      })

      worker.on('message', (result) => {
        workerResults.push(result)
        done++
        if (done === numWorkers) {
          resolve(mergeResults(workerResults))
        }
      })
    }
  })
}

async function bench(label, fn, runs) {
  // Warmup
  for (let i = 0; i < WARMUP_RUNS; i++) {
    await fn()
  }

  const times = []
  for (let i = 0; i < runs; i++) {
    const start = performance.now()
    await fn()
    times.push(performance.now() - start)
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)

  return { label, avg, min, max }
}

async function main() {
  console.log(`Generating ${DATASET_SIZE.toLocaleString()} documents...`)
  const docs = generateDataset(DATASET_SIZE)
  console.log(`Dataset ready. Searching for: ${QUERIES.join(', ')}\n`)

  // -- Single thread --
  const single = await bench(
    'Single thread',
    () => searchSingleThread(docs, FUSE_OPTIONS, QUERIES),
    BENCH_RUNS
  )

  // -- Parallel workers --
  const parallel = []
  for (const n of WORKER_COUNTS) {
    const result = await bench(
      `${n} workers`,
      () => searchParallel(docs, FUSE_OPTIONS, QUERIES, n),
      BENCH_RUNS
    )
    parallel.push(result)
  }

  // -- Verify correctness --
  const singleResults = searchSingleThread(docs, FUSE_OPTIONS, QUERIES)
  const parallelResults = await searchParallel(docs, FUSE_OPTIONS, QUERIES, 4)

  let correct = true
  for (const q of QUERIES) {
    const sCount = singleResults[q].length
    const pCount = parallelResults[q].length
    if (sCount !== pCount) {
      console.log(`⚠ Result count mismatch for "${q}": single=${sCount}, parallel=${pCount}`)
      correct = false
    }
  }

  // -- Print results --
  console.log('='.repeat(60))
  console.log(`Benchmark: ${DATASET_SIZE.toLocaleString()} docs, ${QUERIES.length} queries, ${BENCH_RUNS} runs`)
  console.log('='.repeat(60))
  console.log()

  const allResults = [single, ...parallel]
  const baselineAvg = single.avg

  console.log(
    'Method'.padEnd(20),
    'Avg (ms)'.padStart(10),
    'Min (ms)'.padStart(10),
    'Max (ms)'.padStart(10),
    'Speedup'.padStart(10)
  )
  console.log('-'.repeat(60))

  for (const r of allResults) {
    const speedup = baselineAvg / r.avg
    console.log(
      r.label.padEnd(20),
      r.avg.toFixed(1).padStart(10),
      r.min.toFixed(1).padStart(10),
      r.max.toFixed(1).padStart(10),
      `${speedup.toFixed(2)}x`.padStart(10)
    )
  }

  console.log()
  if (correct) {
    console.log('Correctness: PASS (result counts match)')
  } else {
    console.log('Correctness: MISMATCH (see warnings above)')
  }
}

main()
