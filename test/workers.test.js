import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Fuse from '../dist/fuse.mjs'

const Books = [
  { title: "Old Man's War", author: { firstName: 'John', lastName: 'Scalzi' } },
  {
    title: 'The Lock Artist',
    author: { firstName: 'Steve', lastName: 'Hamilton' }
  },
  { title: 'HTML5', author: { firstName: 'Remy', lastName: 'Sharp' } },
  {
    title: 'A Brief History of Time',
    author: { firstName: 'Stephen', lastName: 'Hawking' }
  },
  {
    title: 'The Shock of the Fall',
    author: { firstName: 'Nathan', lastName: 'Filer' }
  },
  {
    title: 'The Great Gatsby',
    author: { firstName: 'F. Scott', lastName: 'Fitzgerald' }
  },
  {
    title: 'The DaVinci Code',
    author: { firstName: 'Dan', lastName: 'Brown' }
  },
  { title: 'Angels & Demons', author: { firstName: 'Dan', lastName: 'Brown' } },
  {
    title: 'The Rosie Project',
    author: { firstName: 'Graeme', lastName: 'Simsion' }
  },
  { title: 'Gone Girl', author: { firstName: 'Gillian', lastName: 'Flynn' } },
  { title: 'Sapiens', author: { firstName: 'Yuval Noah', lastName: 'Harari' } },
  {
    title: "Surely You're Joking, Mr. Feynman!",
    author: { firstName: 'Richard', lastName: 'Feynman' }
  }
]

const options = {
  keys: ['title', 'author.firstName', 'author.lastName'],
  includeScore: true,
  threshold: 0.4
}

// Helper: run a search across N workers, each getting a slice of docs
function parallelSearch(docs, options, query, numWorkers) {
  const workerPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'worker-thread-helper.mjs'
  )
  const chunkSize = Math.ceil(docs.length / numWorkers)

  return new Promise((resolve, reject) => {
    const results = []
    let done = 0

    for (let i = 0; i < numWorkers; i++) {
      const chunk = docs.slice(i * chunkSize, (i + 1) * chunkSize)
      const worker = new Worker(workerPath, {
        workerData: { docs: chunk, options, query }
      })

      worker.on('message', (msg) => {
        results.push(...msg)
        done++
        if (done === numWorkers) {
          results.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
          resolve(results)
        }
      })

      worker.on('error', reject)
    }
  })
}

describe('Parallel worker search', () => {
  test('produces same results as single-thread search', async () => {
    const fuse = new Fuse(Books, options)
    const singleResults = fuse.search('dan')

    const parallelResults = await parallelSearch(Books, options, 'dan', 2)

    expect(parallelResults.length).toBe(singleResults.length)

    // Same items found (order may differ slightly due to merge)
    const singleTitles = singleResults.map((r) => r.item.title).sort()
    const parallelTitles = parallelResults.map((r) => r.item.title).sort()
    expect(parallelTitles).toEqual(singleTitles)
  })

  test('works with different worker counts', async () => {
    const fuse = new Fuse(Books, options)
    const expected = fuse.search('brown')

    for (const n of [1, 2, 3, 4]) {
      const results = await parallelSearch(Books, options, 'brown', n)
      expect(results.length).toBe(expected.length)
    }
  })

  test('handles queries with no matches', async () => {
    const results = await parallelSearch(Books, options, 'zzzzzzz', 2)
    expect(results.length).toBe(0)
  })

  test('handles fuzzy matching across shards', async () => {
    const fuse = new Fuse(Books, options)
    const singleResults = fuse.search('stphn')

    const parallelResults = await parallelSearch(Books, options, 'stphn', 3)

    const singleTitles = singleResults.map((r) => r.item.title).sort()
    const parallelTitles = parallelResults.map((r) => r.item.title).sort()
    expect(parallelTitles).toEqual(singleTitles)
  })

  test('scores are consistent across single and parallel', async () => {
    const fuse = new Fuse(Books, options)
    const singleResults = fuse.search('gatsby')
    const parallelResults = await parallelSearch(Books, options, 'gatsby', 2)

    expect(parallelResults.length).toBe(singleResults.length)

    // Scores should be identical for the same items
    for (const sr of singleResults) {
      const pr = parallelResults.find((r) => r.item.title === sr.item.title)
      expect(pr).toBeDefined()
      expect(pr.score).toBeCloseTo(sr.score, 10)
    }
  })

  // Drive the REAL built worker script (dist/fuse.worker.mjs) through its actual
  // init/search message protocol. This is what verifies worker.ts's own
  // registerObjectCompiler wiring — a mock running dist/fuse.mjs would not.
  function workerEntrySearch(docs, options, query) {
    const workerPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      'worker-entry-helper.mjs'
    )
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: { docs, options, query }
      })
      worker.on('message', (msg) => {
        resolve(msg)
        worker.terminate()
      })
      worker.on('error', reject)
    })
  }

  test('object query through the real worker entry equals main-thread', async () => {
    const query = { 'author.lastName': { $startsWith: 'B' } }
    const fuse = new Fuse(Books, options)
    const single = fuse.search(query)

    const viaWorker = await workerEntrySearch(Books, options, query)

    expect(viaWorker.map((r) => r.item.title).sort()).toEqual(
      single.map((r) => r.item.title).sort()
    )
    for (const sr of single) {
      const wr = viaWorker.find((r) => r.item.title === sr.item.title)
      expect(wr).toBeDefined()
      expect(wr.score).toBeCloseTo(sr.score, 10)
    }
  })

  // Object ("MongoDB-style") queries cross the postMessage boundary as
  // structured-clonable objects and shard cleanly (per-record scoring, no corpus
  // stats). The matches span both chunks, so this also exercises the merge.
  test('object query shards cleanly (structured-clone + merge)', async () => {
    const query = { 'author.lastName': { $startsWith: 'F' } } // Filer, Fitzgerald, Flynn, Feynman
    const fuse = new Fuse(Books, options)
    const singleResults = fuse.search(query)
    expect(singleResults.length).toBeGreaterThan(1)

    const parallelResults = await parallelSearch(Books, options, query, 2)

    const singleTitles = singleResults.map((r) => r.item.title).sort()
    const parallelTitles = parallelResults.map((r) => r.item.title).sort()
    expect(parallelTitles).toEqual(singleTitles)

    for (const sr of singleResults) {
      const pr = parallelResults.find((r) => r.item.title === sr.item.title)
      expect(pr).toBeDefined()
      expect(pr.score).toBeCloseTo(sr.score, 10)
    }
  })
})
