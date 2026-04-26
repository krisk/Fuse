// Unit tests for FuseWorker — mocks the Worker global so we can verify
// the sharding/refIndex rewrite logic without spawning real workers.

import { describe, test, expect, beforeAll, afterAll } from 'vitest'

process.env.EXTENDED_SEARCH_ENABLED = 'true'
process.env.TOKEN_SEARCH_ENABLED = 'true'

const { default: Fuse } = await import('../src/entry')
const { default: FuseWorker } = await import('../src/workers/FuseWorker')

// Mock Worker: each instance owns a real Fuse over its assigned chunk and
// responds to init / search / add / setCollection messages synchronously.
class MockWorker {
  constructor() {
    this._fuse = null
    this.onmessage = null
    this.onerror = null
    MockWorker.instances.push(this)
  }

  postMessage(msg) {
    queueMicrotask(() => this._handle(msg))
  }

  _handle({ id, method, args }) {
    try {
      let result
      switch (method) {
        case 'init': {
          this._fuse = new Fuse(args[0], args[1])
          result = true
          break
        }
        case 'search':
          result = this._fuse.search(args[0], args[1])
          break
        case 'add':
          this._fuse.add(args[0])
          result = true
          break
        case 'setCollection':
          this._fuse.setCollection(args[0])
          result = true
          break
      }
      this.onmessage?.({ data: { id, result } })
    } catch (err) {
      this.onmessage?.({ data: { id, error: err.message } })
    }
  }

  terminate() {}
}

MockWorker.instances = []

const Books = [
  { title: 'Old Man\'s War', author: 'Scalzi' },
  { title: 'The Lock Artist', author: 'Hamilton' },
  { title: 'HTML5', author: 'Sharp' },
  { title: 'A Brief History of Time', author: 'Hawking' },
  { title: 'The Shock of the Fall', author: 'Filer' },
  { title: 'The Great Gatsby', author: 'Fitzgerald' },
  { title: 'The DaVinci Code', author: 'Brown' },
  { title: 'Angels & Demons', author: 'Brown' },
  { title: 'The Rosie Project', author: 'Simsion' }
]

describe('FuseWorker sharding', () => {
  let originalWorker

  beforeAll(() => {
    originalWorker = globalThis.Worker
    globalThis.Worker = MockWorker
  })

  afterAll(() => {
    globalThis.Worker = originalWorker
  })

  test('search results carry global refIndex, not shard-local', async () => {
    MockWorker.instances = []
    const fw = new FuseWorker(Books, { keys: ['title', 'author'], includeScore: true }, { numWorkers: 3 })

    const results = await fw.search('brown')

    // Both "Brown" author entries should be found
    const titles = results.map(r => r.item.title).sort()
    expect(titles).toEqual(['Angels & Demons', 'The DaVinci Code'])

    // refIndex must point back to Books (global)
    for (const r of results) {
      expect(Books[r.refIndex]).toBe(r.item)
    }

    fw.terminate()
  })

  test('add() appends globally and subsequent search returns correct refIndex', async () => {
    MockWorker.instances = []
    const fw = new FuseWorker(Books.slice(), { keys: ['title', 'author'] }, { numWorkers: 3 })

    // Prime workers
    await fw.search('xyz')

    const newDoc = { title: 'Brown Bear', author: 'Someone' }
    await fw.add(newDoc)

    const results = await fw.search('brown')
    const added = results.find(r => r.item.title === 'Brown Bear')
    expect(added).toBeDefined()
    // Added doc's refIndex should equal its global append position
    expect(added.refIndex).toBe(Books.length)

    fw.terminate()
  })

  test('interleaved search/add/setCollection keeps refIndex consistent', async () => {
    MockWorker.instances = []
    const initial = Books.slice(0, 4)
    const fw = new FuseWorker(initial, { keys: ['title', 'author'] }, { numWorkers: 2 })

    const globalDocs = initial.slice()

    // Round 1: search before any add
    let results = await fw.search('war')
    for (const r of results) {
      expect(globalDocs[r.refIndex]).toBe(r.item)
    }

    // Round 2: add two docs, then search
    const added1 = { title: 'War Stories', author: 'Writer A' }
    const added2 = { title: 'Peace and War', author: 'Writer B' }
    await fw.add(added1)
    globalDocs.push(added1)
    await fw.add(added2)
    globalDocs.push(added2)

    results = await fw.search('war')
    for (const r of results) {
      expect(globalDocs[r.refIndex]).toBe(r.item)
    }
    // Specifically, the added docs must map to their append positions
    const a1 = results.find(r => r.item === added1)
    const a2 = results.find(r => r.item === added2)
    expect(a1?.refIndex).toBe(initial.length)
    expect(a2?.refIndex).toBe(initial.length + 1)

    // Round 3: setCollection resets, then add and search again
    const reset = Books.slice(4, 7)
    await fw.setCollection(reset)
    const globalDocs2 = reset.slice()

    const added3 = { title: 'Brown Ale', author: 'Brewer' }
    await fw.add(added3)
    globalDocs2.push(added3)

    results = await fw.search('brown')
    for (const r of results) {
      expect(globalDocs2[r.refIndex]).toBe(r.item)
    }
    const a3 = results.find(r => r.item === added3)
    expect(a3?.refIndex).toBe(reset.length)

    fw.terminate()
  })

  test('setCollection rebuilds mapping so refIndex matches new collection', async () => {
    MockWorker.instances = []
    const fw = new FuseWorker(Books, { keys: ['title', 'author'] }, { numWorkers: 2 })
    await fw.search('xyz') // force init

    const newDocs = [
      { title: 'Alpha', author: 'A' },
      { title: 'Bravo', author: 'B' },
      { title: 'Charlie Brown', author: 'C' },
      { title: 'Delta', author: 'D' },
      { title: 'Brown Fox', author: 'E' }
    ]

    await fw.setCollection(newDocs)

    const results = await fw.search('brown')
    for (const r of results) {
      expect(newDocs[r.refIndex]).toBe(r.item)
    }

    fw.terminate()
  })
})

describe('FuseWorker ordering parity with Fuse', () => {
  let originalWorker

  beforeAll(() => {
    originalWorker = globalThis.Worker
    globalThis.Worker = MockWorker
  })

  afterAll(() => {
    globalThis.Worker = originalWorker
  })

  // refIndex is the only stable identifier — score is stripped when
  // includeScore: false, so we compare the ordering by refIndex.
  const refIndices = (results) => results.map((r) => r.refIndex)

  test('default search order matches Fuse when includeScore is false', async () => {
    MockWorker.instances = []
    const opts = { keys: ['title', 'author'] }
    const fw = new FuseWorker(Books, opts, { numWorkers: 3 })
    const fuse = new Fuse(Books, opts)

    const fwResults = await fw.search('the')
    const fuseResults = fuse.search('the')

    // None of the worker results carry a score (includeScore default is false)
    for (const r of fwResults) {
      expect(r.score).toBeUndefined()
    }
    expect(refIndices(fwResults)).toEqual(refIndices(fuseResults))

    fw.terminate()
  })

  test('equal-score ties fall back to global refIndex, not shard order', async () => {
    MockWorker.instances = []
    // Build a collection where multiple docs match identically — exact-match
    // queries on `useExtendedSearch` produce score 0 for every hit, so any
    // surviving order has to come from the (score, idx) tie-break.
    const docs = [
      { tag: 'apple' },
      { tag: 'banana' },
      { tag: 'apple' },
      { tag: 'cherry' },
      { tag: 'apple' },
      { tag: 'date' },
      { tag: 'apple' },
      { tag: 'fig' },
      { tag: 'apple' }
    ]
    const opts = { keys: ['tag'], useExtendedSearch: true, includeScore: true }
    const fw = new FuseWorker(docs, opts, { numWorkers: 4 })
    const fuse = new Fuse(docs, opts)

    const fwResults = await fw.search('=apple')
    const fuseResults = fuse.search('=apple')

    // All matches share the same (very small) score — tie-break is the only
    // thing that determines order.
    const scores = new Set(fwResults.map((r) => r.score))
    expect(scores.size).toBe(1)
    expect(refIndices(fwResults)).toEqual(refIndices(fuseResults))
    expect(refIndices(fwResults)).toEqual([0, 2, 4, 6, 8])

    fw.terminate()
  })

  test('post-add() search ordering matches Fuse after the same adds', async () => {
    MockWorker.instances = []
    const opts = { keys: ['title', 'author'] }
    const fw = new FuseWorker(Books.slice(), opts, { numWorkers: 3 })
    const fuse = new Fuse(Books.slice(), opts)

    const newDocs = [
      { title: 'Brown Bear', author: 'X' },
      { title: 'The Brown Sisters', author: 'Y' }
    ]
    for (const d of newDocs) {
      await fw.add(d)
      fuse.add(d)
    }

    const fwResults = await fw.search('brown')
    const fuseResults = fuse.search('brown')
    expect(refIndices(fwResults)).toEqual(refIndices(fuseResults))

    fw.terminate()
  })

  test('post-setCollection() search ordering matches Fuse', async () => {
    MockWorker.instances = []
    const opts = { keys: ['title', 'author'] }
    const fw = new FuseWorker(Books, opts, { numWorkers: 3 })
    const fuse = new Fuse(Books, opts)

    const reset = [
      { title: 'Brown Sugar', author: 'A' },
      { title: 'Charlie Brown', author: 'B' },
      { title: 'Brown Fox', author: 'C' },
      { title: 'Greenhouse', author: 'D' },
      { title: 'Browser History', author: 'E' }
    ]

    await fw.setCollection(reset)
    fuse.setCollection(reset)

    const fwResults = await fw.search('brown')
    const fuseResults = fuse.search('brown')
    expect(refIndices(fwResults)).toEqual(refIndices(fuseResults))

    fw.terminate()
  })

  test('shouldSort: false returns global collection order before any add()', async () => {
    MockWorker.instances = []
    const opts = { keys: ['title', 'author'], shouldSort: false }
    const fw = new FuseWorker(Books, opts, { numWorkers: 4 })

    const results = await fw.search('the')
    const ordered = refIndices(results)
    expect(ordered).toEqual([...ordered].sort((a, b) => a - b))
    // Sanity: all returned items match the global collection at the indices
    for (const r of results) {
      expect(Books[r.refIndex]).toBe(r.item)
    }

    fw.terminate()
  })

  test('shouldSort: false returns global collection order after add()', async () => {
    MockWorker.instances = []
    const opts = { keys: ['title', 'author'], shouldSort: false }
    const fw = new FuseWorker(Books.slice(), opts, { numWorkers: 4 })
    const local = Books.slice()

    // Round-robin add across shards. With the old code, shard order would
    // surface in the merged results — the new code restores global order.
    const newDocs = [
      { title: 'Brown One', author: 'A' },
      { title: 'Brown Two', author: 'B' },
      { title: 'Brown Three', author: 'C' },
      { title: 'Brown Four', author: 'D' },
      { title: 'Brown Five', author: 'E' }
    ]
    for (const d of newDocs) {
      await fw.add(d)
      local.push(d)
    }

    const results = await fw.search('brown')
    const ordered = refIndices(results)
    expect(ordered).toEqual([...ordered].sort((a, b) => a - b))
    for (const r of results) {
      expect(local[r.refIndex]).toBe(r.item)
    }

    fw.terminate()
  })

  test('shouldSort: false returns global collection order after setCollection()', async () => {
    MockWorker.instances = []
    const opts = { keys: ['title', 'author'], shouldSort: false }
    const fw = new FuseWorker(Books, opts, { numWorkers: 4 })
    await fw.search('xyz') // force init

    const reset = [
      { title: 'Brown 0', author: 'A' },
      { title: 'Green 1', author: 'B' },
      { title: 'Brown 2', author: 'C' },
      { title: 'Brown 3', author: 'D' },
      { title: 'Yellow 4', author: 'E' },
      { title: 'Brown 5', author: 'F' },
      { title: 'Brown 6', author: 'G' }
    ]
    await fw.setCollection(reset)

    const results = await fw.search('brown')
    const ordered = refIndices(results)
    expect(ordered).toEqual([...ordered].sort((a, b) => a - b))
    for (const r of results) {
      expect(reset[r.refIndex]).toBe(r.item)
    }

    fw.terminate()
  })
})

describe('FuseWorker rejects function-valued options', () => {
  let originalWorker

  beforeAll(() => {
    originalWorker = globalThis.Worker
    globalThis.Worker = MockWorker
  })

  afterAll(() => {
    globalThis.Worker = originalWorker
  })

  test('throws when sortFn is a function', () => {
    expect(
      () => new FuseWorker(Books, {
        keys: ['title'],
        sortFn: (a, b) => a.score - b.score
      })
    ).toThrowError(/sortFn/)
  })

  test('throws when top-level getFn is a function', () => {
    expect(
      () => new FuseWorker(Books, {
        keys: ['title'],
        getFn: (obj, path) => obj[path]
      })
    ).toThrowError(/getFn/)
  })

  test('throws when keys[].getFn is a function and names the offending key', () => {
    expect(
      () => new FuseWorker(Books, {
        keys: [
          'title',
          { name: 'author', getFn: (obj) => obj.author }
        ]
      })
    ).toThrowError(/keys\[author\]\.getFn/)
  })

  test('does not throw when key.name is an array path (no getFn)', () => {
    expect(
      () => new FuseWorker([{ a: { b: 'x' } }], {
        keys: [{ name: ['a', 'b'] }]
      })
    ).not.toThrow()
  })

  test('throws when useTokenSearch is true', () => {
    // Token search needs global corpus stats; per-shard stats would diverge
    // from single-thread Fuse, so FuseWorker rejects it upfront.
    expect(
      () => new FuseWorker(Books, { keys: ['title'], useTokenSearch: true })
    ).toThrowError(/useTokenSearch/)
  })
})
