import { describe, test, expect, vi } from 'vitest'
import Fuse from '../dist/fuse.mjs'

// Columnar FuseIndex: the record format stays observable through toJSON(),
// the deprecated `records` snapshot, add() and custom sortFn items, and must
// match the pre-columnar shapes exactly.

const FuseIndex = Fuse.createIndex([], ['x']).constructor

describe('deprecated records snapshot', () => {
  test('warns once per module, on the first access only', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const index = Fuse.createIndex([], ['apple', 'banana'])
    void index.records
    void index.records
    const deprecations = warn.mock.calls.filter(([msg]) =>
      String(msg).includes('FuseIndex.records is deprecated')
    )
    expect(deprecations).toHaveLength(1)
    warn.mockRestore()
  })

  test('toJSON() does not go through the deprecated getter', () => {
    const getter = vi.spyOn(FuseIndex.prototype, 'records', 'get')
    const index = Fuse.createIndex(['title'], [{ title: 'apple pie' }])
    index.toJSON()
    expect(getter).not.toHaveBeenCalled()
    getter.mockRestore()
  })

  test('returns a fresh, detached copy on each access', () => {
    const fuse = new Fuse(['apple pie', 'banana bread'])
    const first = fuse.getIndex().records
    const second = fuse.getIndex().records
    expect(first).not.toBe(second)
    expect(first).toEqual(second)
    first[0].v = 'cherry tart'
    first.pop()
    expect(fuse.getIndex().records).toEqual(second)
    expect(fuse.search('apple').map((r) => r.item)).toEqual(['apple pie'])
  })
})

describe('record format and field shapes', () => {
  const keys = ['title', 'tags', 'blanks', 'scalar', 'one', 'missing', 'blank']
  const doc = {
    title: 'quick brown fox',
    tags: [],
    blanks: [' ', null, ''],
    scalar: 'x',
    one: ['y'],
    blank: '   '
  }

  test('object records keep empty arrays as [] and omit missing or blank fields', () => {
    const { records } = Fuse.createIndex(keys, [doc]).toJSON()
    const fields = records[0].$
    expect(Object.keys(records[0])).toEqual(['i', '$'])
    expect(Object.keys(fields)).toEqual(['0', '1', '2', '3', '4'])
    expect(Object.keys(fields[0])).toEqual(['v', 'n'])
    expect(fields[1]).toEqual([])
    expect(fields[2]).toEqual([])
    expect(fields[3].v).toBe('x')
    expect(fields[4]).toHaveLength(1)
    expect(Object.keys(fields[4][0])).toEqual(['v', 'i', 'n'])
  })

  test('string records keep the { v, i, n } property order', () => {
    const { records } = Fuse.createIndex([], ['apple', '', 'pear']).toJSON()
    expect(records.map((r) => Object.keys(r))).toEqual([
      ['v', 'i', 'n'],
      ['v', 'i', 'n']
    ])
    expect(records.map((r) => r.i)).toEqual([0, 2])
  })

  test('toJSON survives a parseIndex round trip byte for byte', () => {
    const docs = [doc, { title: 'lazy dog', one: ['a', 'b'] }, {}]
    const json = JSON.stringify(Fuse.createIndex(keys, docs).toJSON())
    const again = JSON.stringify(Fuse.parseIndex(JSON.parse(json)).toJSON())
    expect(again).toBe(json)
  })

  test('add() returns a detached record in the record format', () => {
    const index = Fuse.createIndex(['title'], [{ title: 'apple' }])
    const record = index.add({ title: 'banana split' }, 1)
    expect(Object.keys(record)).toEqual(['i', '$'])
    record.$[0].v = 'changed'
    expect(index.toJSON().records[1].$[0].v).toBe('banana split')
  })

  test('records passed to setIndexRecords or assigned are copied in', () => {
    const records = Fuse.createIndex([], ['apple', 'banana']).toJSON().records
    const index = Fuse.createIndex([], ['x'])
    index.setIndexRecords(records)
    records[0].v = 'changed'
    expect(index.toJSON().records[0].v).toBe('apple')

    const assigned = Fuse.createIndex([], ['x'])
    const more = Fuse.createIndex([], ['cherry']).toJSON().records
    assigned.records = more
    more[0].v = 'changed'
    expect(assigned.toJSON().records[0].v).toBe('cherry')
  })
})

describe('empty-array sentinel and token search', () => {
  // A tokenizer is allowed to return tokens for ''. The sentinel that marks
  // an empty array carries no text and must never reach it.
  const tokenize = (text) => (text === '' ? ['EMPTY'] : text.split(/\s+/))
  const options = { keys: ['title', 'tags'], useTokenSearch: true, tokenize }

  test('empty and all-blank arrays contribute nothing at build time', () => {
    const fuse = new Fuse(
      [
        { title: 'apple pie', tags: [] },
        { title: 'banana', tags: [' ', ''] }
      ],
      options
    )
    expect(fuse._invertedIndex.df.has('EMPTY')).toBe(false)
    expect(fuse._invertedIndex.fieldCount).toBe(2)
  })

  test('and nothing after add()', () => {
    const fuse = new Fuse([{ title: 'apple pie', tags: ['red'] }], options)
    fuse.add({ title: 'banana', tags: [] })
    expect(fuse._invertedIndex.df.has('EMPTY')).toBe(false)
    expect(fuse._invertedIndex.fieldCount).toBe(3)
  })
})

describe('custom sortFn sees the record-format item', () => {
  const books = [
    { title: 'Old Man War', author: 'Scalzi' },
    { title: 'The Lock Artist', author: 'Hamilton' },
    { title: 'Old Yeller', author: 'Gipson' }
  ]
  const capture = () => {
    const seen = []
    const sortFn = (a, b) => {
      seen.push(a.item, b.item)
      return a.score - b.score
    }
    return { seen, sortFn }
  }

  test.each([undefined, 1])('object search (limit %s)', (limit) => {
    const { seen, sortFn } = capture()
    const fuse = new Fuse(books, { keys: ['title', 'author'], sortFn })
    fuse.search('old', limit ? { limit } : undefined)
    expect(seen.length).toBeGreaterThan(0)
    for (const item of seen) {
      expect(Object.keys(item[0])).toEqual(['v', 'n'])
      expect(typeof item[0].v).toBe('string')
    }
  })

  test.each([undefined, 1])('string search (limit %s)', (limit) => {
    const { seen, sortFn } = capture()
    const fuse = new Fuse(['old man', 'old yeller', 'lock'], { sortFn })
    fuse.search('old', limit ? { limit } : undefined)
    expect(seen.length).toBeGreaterThan(0)
    for (const item of seen) expect(typeof item).toBe('string')
  })

  test('logical search', () => {
    const { seen, sortFn } = capture()
    const fuse = new Fuse(books, { keys: ['title', 'author'], sortFn })
    fuse.search({ $or: [{ title: 'old' }, { author: 'gipson' }] })
    expect(seen.length).toBeGreaterThan(0)
    for (const item of seen) expect(Object.keys(item)).toContain('0')
  })
})

describe('copy-on-write for borrowed indexes', () => {
  test('adding to a borrowed empty string index', () => {
    const fuse = new Fuse([], {}, Fuse.createIndex([], []))
    fuse.add('apple')
    expect(fuse.search('apple').map((r) => r.item)).toEqual(['apple'])
  })

  test('adding to a borrowed object index whose records have no entries', () => {
    const docs = [{}, {}]
    const fuse = new Fuse(docs, { keys: ['t'] }, Fuse.createIndex(['t'], docs))
    fuse.add({ t: 'apple' })
    expect(fuse.search('apple').map((r) => r.item)).toEqual([{ t: 'apple' }])
  })
})

describe('record validation', () => {
  const bad = [2 ** 31, -1, 1.5, NaN, '3']

  test.each(bad)('parseIndex rejects document index %s', (i) => {
    const json = { keys: [], records: [{ v: 'apple', i, n: 1 }] }
    expect(() => Fuse.parseIndex(json)).toThrow(/Invalid index record/)
  })

  test.each(bad)('parseIndex rejects array position %s', (i) => {
    const json = {
      keys: [{ path: ['t'], id: 't', weight: 1, src: 't' }],
      records: [{ i: 0, $: { 0: [{ v: 'apple', i, n: 1 }] } }]
    }
    expect(() => Fuse.parseIndex(json)).toThrow(/Invalid index record/)
  })

  test('setIndexRecords and assignment reject out-of-range indexes', () => {
    const index = Fuse.createIndex([], ['x'])
    const records = [{ v: 'apple', i: 2 ** 31, n: 1 }]
    expect(() => index.setIndexRecords(records)).toThrow(/Invalid index record/)
    expect(() => {
      index.records = records
    }).toThrow(/Invalid index record/)
  })
})

describe('norms', () => {
  test('are stored exactly, including -0', () => {
    const records = [
      { v: 'a', i: 0, n: 0 },
      { v: 'b', i: 1, n: -0 },
      { v: 'c', i: 2, n: 0.1 + 0.2 }
    ]
    const index = Fuse.createIndex([], ['x'])
    index.setIndexRecords(records)
    const norms = index.toJSON().records.map((r) => r.n)
    expect(Object.is(norms[0], 0)).toBe(true)
    expect(Object.is(norms[1], -0)).toBe(true)
    expect(norms[2]).toBe(0.1 + 0.2)
  })
})
