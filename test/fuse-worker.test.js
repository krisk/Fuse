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
