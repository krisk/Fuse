import { describe, test, expect, vi } from 'vitest'
import Fuse from '../dist/fuse.mjs'

// Compact saved index format: FuseIndex.serialize() + Fuse.parseIndex().

const save = (index) => JSON.parse(JSON.stringify(index.serialize()))
const results = (fuse, query) =>
  JSON.stringify(
    fuse.search(query, { includeScore: true, includeMatches: true })
  )

const books = [
  {
    title: 'Old Man War',
    author: { name: 'John Scalzi' },
    tags: ['sci-fi', 'war']
  },
  { title: 'The Lock Artist', author: { name: 'Steve Hamilton' }, tags: [] },
  { title: '   ', author: { name: 'Nobody' }, tags: [' ', ''] },
  { title: 'Old Yeller', tags: ['dog'] },
  {}
]
const bookKeys = ['title', 'author.name', { name: 'tags', weight: 2 }]

describe('round trip', () => {
  test.each([
    ['object list', bookKeys, books, ['old', 'scalzi', 'dog', '!old']],
    [
      'string list',
      [],
      ['apple pie', '', 'banana bread', '  ', 'cherry tart'],
      ['apple', 'bread', 'tart']
    ]
  ])('%s: same toJSON() and search results', (_, keys, docs, queries) => {
    const original = Fuse.createIndex(keys, docs)
    const loaded = Fuse.parseIndex(save(original))
    expect(JSON.stringify(loaded.toJSON())).toBe(
      JSON.stringify(original.toJSON())
    )
    const options = { keys, useExtendedSearch: true }
    const a = new Fuse(docs, options, original)
    const b = new Fuse(docs, options, loaded)
    for (const q of queries) expect(results(b, q)).toBe(results(a, q))
  })

  test('getFn keys: search after loading matches', () => {
    const keys = [
      { name: 'upper', getFn: (d) => (d.title || '').toUpperCase() }
    ]
    const original = Fuse.createIndex(keys, books)
    const loaded = Fuse.parseIndex(save(original))
    const a = new Fuse(books, { keys }, original)
    const b = new Fuse(books, { keys }, loaded)
    expect(results(b, 'OLD')).toBe(results(a, 'OLD'))
  })

  test('mutations before saving: removed entries are not written', () => {
    const fuse = new Fuse(books.slice(), { keys: bookKeys })
    fuse.removeAt(0)
    fuse.add({ title: 'Brave New World', tags: ['classic'] })
    const index = fuse.getIndex()
    const data = save(index)
    const live = index.toJSON().records.reduce((n, r) => {
      return (
        n +
        Object.values(r.$).reduce(
          (m, f) => m + (Array.isArray(f) ? Math.max(1, f.length) : 1),
          0
        )
      )
    }, 0)
    expect(data.values).toHaveLength(live)
    expect(JSON.stringify(Fuse.parseIndex(data).toJSON())).toBe(
      JSON.stringify(index.toJSON())
    )
  })

  test('mutations after loading behave like on the original', () => {
    const docs = books.slice()
    const a = new Fuse(docs.slice(), { keys: bookKeys })
    const b = new Fuse(
      docs.slice(),
      { keys: bookKeys },
      Fuse.parseIndex(save(a.getIndex()))
    )
    for (const fuse of [a, b]) {
      fuse.add({ title: 'Old Glory', tags: ['flag', 'old'] })
      fuse.removeAt(1)
      fuse.remove((d) => d.title === 'Old Yeller')
    }
    expect(JSON.stringify(b.getIndex().toJSON())).toBe(
      JSON.stringify(a.getIndex().toJSON())
    )
    expect(results(b, 'old')).toBe(results(a, 'old'))
  })

  test('the output is plain JSON data', () => {
    const data = Fuse.createIndex(bookKeys, books).serialize()
    expect(JSON.parse(JSON.stringify(data))).toEqual(data)
    expect(data.format).toBe('fuse-index')
    expect(data.version).toBe(1)
  })

  test('norms JSON cannot represent survive exactly', () => {
    const index = Fuse.createIndex([], [])
    index.setIndexRecords([
      { v: 'a', i: 0, n: -0 },
      { v: 'b', i: 1, n: NaN },
      { v: 'c', i: 2, n: Infinity },
      { v: 'd', i: 3, n: -Infinity },
      { v: 'e', i: 4, n: 0.5 }
    ])
    const norms = Fuse.parseIndex(save(index))
      .toJSON()
      .records.map((r) => r.n)
    expect(Object.is(norms[0], -0)).toBe(true)
    expect(norms[1]).toBeNaN()
    expect(norms.slice(2)).toEqual([Infinity, -Infinity, 0.5])
  })

  test('duplicate and colliding key ids', () => {
    const keys = [['a.b'], 'a.b', 'title', 'title']
    const docs = [{ 'a.b': 'dotted', a: { b: 'nested' }, title: 'apple' }]
    const original = Fuse.createIndex(keys, docs)
    const loaded = Fuse.parseIndex(save(original))
    expect(JSON.stringify(loaded.toJSON())).toBe(
      JSON.stringify(original.toJSON())
    )
  })
})

describe('field-norm weight', () => {
  test.each([0, 2])('weight %s is restored, so later additions match', (w) => {
    const docs = ['one', 'one two three four']
    const added = 'five six seven'
    const unsaved = Fuse.createIndex([], docs, { fieldNormWeight: w })
    unsaved.add(added, 2)
    const loaded = Fuse.parseIndex(
      save(Fuse.createIndex([], docs, { fieldNormWeight: w }))
    )
    loaded.add(added, 2)
    expect(loaded.toJSON()).toEqual(unsaved.toJSON())
  })
})

describe('legacy format', () => {
  test('toJSON() output is unchanged and still loads', () => {
    const index = Fuse.createIndex(bookKeys, books)
    const legacy = JSON.parse(JSON.stringify(index))
    expect(legacy).toEqual(index.toJSON())
    expect(legacy.format).toBeUndefined()
    expect(Fuse.parseIndex(legacy).toJSON()).toEqual(index.toJSON())
  })
})

describe('validation', () => {
  const valid = () =>
    save(
      Fuse.createIndex(
        ['title', 'tags'],
        [
          { title: 'apple', tags: ['red', 'green'] },
          { title: 'pear', tags: [] }
        ]
      )
    )
  const strings = () => save(Fuse.createIndex([], ['apple', 'pear']))
  const rejects = (data, message = /Invalid serialized index/) =>
    expect(() => Fuse.parseIndex(data)).toThrow(message)

  test('a valid index loads', () => {
    expect(() => Fuse.parseIndex(valid())).not.toThrow()
  })

  test('unknown version', () => {
    rejects(
      { ...valid(), version: 2 },
      /Unsupported serialized index version: 2/
    )
  })

  test.each([
    ['records.doc missing', (d) => delete d.records.doc],
    ['entries.key not an array', (d) => (d.entries.key = {})],
    ['values missing', (d) => delete d.values],
    ['record columns differ', (d) => d.records.kind.pop()],
    ['entry columns differ', (d) => d.values.pop()],
    ['doc out of range', (d) => (d.records.doc[0] = 2 ** 31)],
    ['doc negative', (d) => (d.records.doc[0] = -1)],
    ['doc not an integer', (d) => (d.records.doc[0] = 0.5)],
    ['kind not 0 or 1', (d) => (d.records.kind[0] = 2)],
    ['len past the end', (d) => (d.records.len[1] = 99)],
    ['entries left over', (d) => (d.records.len[1] = 0)],
    ['key beyond keys', (d) => (d.entries.key[1] = 5)],
    [
      'keys out of order',
      (d) => ((d.entries.key[0] = 1), (d.entries.key[1] = 0))
    ],
    ['pos out of range', (d) => (d.entries.pos[1] = 2 ** 31)],
    ['pos -3', (d) => (d.entries.pos[1] = -3)],
    ['scalar followed by same key', (d) => (d.entries.pos[1] = -1)],
    ['norm id out of range', (d) => (d.entries.norm[0] = 999)],
    ['value not a string', (d) => (d.values[0] = 5)],
    ['NaN number norm', (d) => (d.norms[0] = NaN)],
    ['unknown norm string', (d) => (d.norms[0] = 'big')],
    ['fieldNormWeight negative', (d) => (d.fieldNormWeight = -1)],
    ['keys not an array', (d) => (d.keys = {})],
    ['key path empty', (d) => (d.keys[0].path = [])],
    ['key id mismatch', (d) => (d.keys[0].id = 'other')],
    ['key src wrong type', (d) => (d.keys[0].src = 5)],
    ['key weight zero', (d) => (d.keys[0].weight = 0)],
    ['key weight infinite', (d) => (d.keys[0].weight = Infinity)]
  ])('%s', (_, corrupt) => {
    const data = valid()
    corrupt(data)
    rejects(data)
  })

  test.each([
    [
      'string record with two entries',
      (d) => ((d.records.len[0] = 2), (d.records.len[1] = 0))
    ],
    ['string record with key 1', (d) => (d.entries.key[0] = 1)],
    ['string record that is not scalar', (d) => (d.entries.pos[0] = 0)]
  ])('%s', (_, corrupt) => {
    const data = strings()
    corrupt(data)
    rejects(data)
  })

  test('the input is not modified, and later edits to it do not reach the index', () => {
    const data = valid()
    const before = JSON.stringify(data)
    const index = Fuse.parseIndex(data)
    expect(JSON.stringify(data)).toBe(before)
    data.values[0] = 'changed'
    data.keys[0].path[0] = 'changed'
    expect(index.toJSON().records[0].$[0].v).toBe('apple')
    expect(index.keys[0].path[0]).toBe('title')
  })
})

describe('docs', () => {
  test('serialize() does not warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    Fuse.createIndex(bookKeys, books).serialize()
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('review fixes', () => {
  const valid = () =>
    save(
      Fuse.createIndex(
        ['title', 'tags'],
        [
          { title: 'apple', tags: ['red', 'green'] },
          { title: 'pear', tags: [] }
        ]
      )
    )
  const rejects = (data) =>
    expect(() => Fuse.parseIndex(data)).toThrow(/Invalid serialized index/)

  test.each([
    ['missing', (d) => delete d.format],
    ['misspelled', (d) => (d.format = 'oops')],
    ['not a string', (d) => (d.format = 1)]
  ])(
    'compact data with the format marker %s is rejected, not loaded empty',
    (_, corrupt) => {
      const data = valid()
      corrupt(data)
      rejects(data)
    }
  )

  test('an inherited format marker is read like an own one', () => {
    const data = valid()
    delete data.format
    const proto = { format: 'fuse-index' }
    const inherited = Object.assign(Object.create(proto), data)
    expect(Fuse.parseIndex(inherited).toJSON()).toEqual(
      Fuse.parseIndex(valid()).toJSON()
    )
  })

  test.each([
    [
      'a hole in norms',
      (d) => {
        d.norms = new Array(d.norms.length + 1)
        d.norms[0] = 1
      }
    ],
    [
      'a hole in keys',
      (d) => {
        d.keys = [d.keys[0], , d.keys[1]]
      }
    ],
    [
      'a hole in a key path',
      (d) => {
        d.keys[0].path = new Array(1)
      }
    ],
    [
      'a hole in a key src',
      (d) => {
        d.keys[0].src = new Array(1)
      }
    ],
    [
      'a hole in values',
      (d) => {
        delete d.values[0]
      }
    ],
    [
      'a hole in entries.norm',
      (d) => {
        delete d.entries.norm[0]
      }
    ],
    [
      'a huge sparse column',
      (d) => {
        d.values.length = 2 ** 31
        d.entries.key.length = 2 ** 31
        d.entries.pos.length = 2 ** 31
        d.entries.norm.length = 2 ** 31
      }
    ]
  ])('%s is rejected', (_, corrupt) => {
    const data = valid()
    corrupt(data)
    rejects(data)
  })

  test.each([
    ['an empty path', [[]]],
    ['an empty path with a getFn', [{ name: [], getFn: (d) => d.title }]]
  ])('keys with %s round-trip', (_, keys) => {
    const docs = [{ title: 'apple' }, { title: 'pear' }]
    const original = Fuse.createIndex(keys, docs)
    const loaded = Fuse.parseIndex(save(original))
    expect(JSON.stringify(loaded.toJSON())).toBe(
      JSON.stringify(original.toJSON())
    )
  })

  test('changing serialize() output does not reach the index', () => {
    const index = Fuse.createIndex(
      [['meta', 'title']],
      [{ meta: { title: 'apple' } }]
    )
    const data = index.serialize()
    data.keys[0].path[0] = 'changed'
    data.keys[0].src[0] = 'changed'
    expect(index.keys[0].path).toEqual(['meta', 'title'])
    expect(index.keys[0].src).toEqual(['meta', 'title'])
  })

  test('parseIndex rejects non-objects', () => {
    expect(() => Fuse.parseIndex(null)).toThrow()
    expect(() => Fuse.parseIndex('{}')).toThrow()
  })
})

describe('review fixes, round 2', () => {
  const valid = () =>
    save(Fuse.createIndex(['title'], [{ title: 'apple' }, { title: 'pear' }]))

  test('compact data without format and records is rejected, not loaded empty', () => {
    const data = valid()
    delete data.format
    delete data.records
    expect(() => Fuse.parseIndex(data)).toThrow(/Invalid serialized index/)
  })

  test('a legacy object without records still loads empty, as before', () => {
    expect(Fuse.parseIndex({ keys: [] }).size()).toBe(0)
  })

  test('each value is read once, so a getter cannot pass validation and store another value', () => {
    const data = valid()
    let reads = 0
    Object.defineProperty(data.records.doc, 0, {
      get: () => (reads++ === 0 ? 0 : 2 ** 31),
      enumerable: true
    })
    const loaded = Fuse.parseIndex(data)
    expect(reads).toBe(1)
    expect(loaded.toJSON().records[0].i).toBe(0)
  })
})

test('a record kind that changes between reads cannot break the layout', () => {
  const data = save(
    Fuse.createIndex(
      ['title', 'tags'],
      [{ title: 'apple', tags: ['red', 'green'] }]
    )
  )
  let reads = 0
  Object.defineProperty(data.records.kind, 0, {
    get: () => (reads++ === 0 ? 1 : 0),
    enumerable: true
  })
  // Read once: either it loads as the object record it claimed to be, or it
  // is rejected. It must never become a string record with three entries.
  let loaded
  try {
    loaded = Fuse.parseIndex(data)
  } catch (error) {
    expect(String(error)).toMatch(/Invalid serialized index/)
    return
  }
  expect(reads).toBe(1)
  expect(loaded.toJSON().records[0].$[1]).toHaveLength(2)
})

test('an index with removals saves only the norms still in use, and reloads', () => {
  const docs = Array.from({ length: 20 }, (_, i) =>
    Array.from({ length: i + 1 }, () => 'w').join(' ')
  )
  const fuse = new Fuse(docs.slice())
  fuse.remove((_, i) => i < 19)
  const data = save(fuse.getIndex())
  expect(data.norms).toHaveLength(1)
  expect(JSON.stringify(Fuse.parseIndex(data).toJSON())).toBe(
    JSON.stringify(fuse.getIndex().toJSON())
  )
})

test('a key path cell is read once, so a getter cannot pass validation and store another value', () => {
  const data = save(Fuse.createIndex(['title'], [{ title: 'apple' }]))
  let reads = 0
  Object.defineProperty(data.keys[0].path, 0, {
    get: () => (reads++ === 0 ? 'title' : 7),
    enumerable: true
  })
  const loaded = Fuse.parseIndex(data)
  expect(reads).toBe(1)
  expect(loaded.keys[0].path).toEqual(['title'])
})
