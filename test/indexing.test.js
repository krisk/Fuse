import Fuse from '../dist/fuse.mjs'
import Books from './fixtures/books.json' assert { type: 'json' }

// The removal ledger's per-doc state, independent of pool layout.
const ledgerOf = (index) =>
  index.docFields.map((fields, d) => [
    fields,
    Array.from(
      { length: index.docLen[d] },
      (_, k) => index.pool[index.docStart[d] + k]
    )
  ])

const idx = (result) => result.map((obj) => obj.refIndex)
const idxMap = (fuse) => fuse.getIndex().records.map((item) => [item.v, item.i])

describe('Searching', () => {
  const options = {
    useExtendedSearch: true,
    includeMatches: true,
    includeScore: true,
    threshold: 0.3,
    keys: ['title', 'author.firstName', 'author.lastName']
  }

  test('createIndex: ensure properties exist', () => {
    let myIndex = Fuse.createIndex(options.keys, Books)

    expect(myIndex.records).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('createIndex: ensure keys can be created with objects', () => {
    let myIndex = Fuse.createIndex(
      [{ name: 'title' }, { name: 'author.firstName' }],
      Books
    )
    expect(myIndex.records).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('createIndex: ensure keys can be created with getFn', () => {
    let myIndex = Fuse.createIndex(
      [
        { name: 'title', getFn: (book) => book.title },
        { name: 'author.firstName', getFn: (book) => book.author.firstName }
      ],
      Books
    )
    expect(myIndex.records).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('parseIndex: ensure index can be exported and Fuse can be initialized', () => {
    const myIndex = Fuse.createIndex(options.keys, Books)
    expect(myIndex.size()).toBe(Books.length)

    const data = myIndex.toJSON()
    expect(data.records).toBeDefined()
    expect(data.keys).toBeDefined()

    const parsedIndex = Fuse.parseIndex(data)
    expect(parsedIndex.size()).toBe(Books.length)

    const fuse = new Fuse(Books, options, parsedIndex)
    const result = fuse.search({ title: 'old man' })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
  })

  test('parseIndex: search with getFn', () => {
    const fuse = new Fuse(Books, {
      useExtendedSearch: true,
      includeMatches: true,
      includeScore: true,
      threshold: 0.3,
      keys: [
        { name: 'bookTitle', getFn: (book) => book.title },
        { name: 'authorName', getFn: (book) => book.author.firstName }
      ]
    })
    const result = fuse.search({ bookTitle: 'old man' })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
  })

  test('toJSON: strips getFn from keys for serialization', () => {
    const myIndex = Fuse.createIndex(
      [
        { name: 'title', getFn: (book) => book.title },
        { name: 'author.firstName' }
      ],
      Books
    )
    const data = myIndex.toJSON()

    // getFn should not appear in any key
    data.keys.forEach((key) => {
      expect(key).not.toHaveProperty('getFn')
    })

    // Should be safe to serialize (no functions)
    expect(() => JSON.parse(JSON.stringify(data))).not.toThrow()

    // Should still be parseable
    const parsedIndex = Fuse.parseIndex(data)
    expect(parsedIndex.size()).toBe(Books.length)
  })

  test('Fuse can be instantiated with an index', () => {
    let myIndex = Fuse.createIndex(options.keys, Books)
    const fuse = new Fuse(Books, options, myIndex)

    let result = fuse.search({ title: 'old man' })

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
    expect(result[0].matches[0].indices).toMatchObject([
      [0, 2],
      [4, 6]
    ])
  })

  test('Throws on invalid index format', () => {
    expect(() => {
      new Fuse(Books, options, [])
    }).toThrow()
  })

  test('Add object to Index', () => {
    const fuse = new Fuse(Books, options)

    fuse.add({
      title: 'book',
      author: {
        firstName: 'Kiro',
        lastName: 'Risk'
      }
    })

    let result = fuse.search('kiro')

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([Books.length - 1])
  })

  test('Add string to Index', () => {
    const fruits = ['apple', 'orange']
    const fuse = new Fuse(fruits, { includeScore: true })

    fuse.add('banana')

    let result = fuse.search('banana')

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([2])
  })

  test('Remove string from the Index', () => {
    const fruits = ['apple', 'orange', 'banana', 'pear']
    const fuse = new Fuse(fruits)

    expect(fuse.getIndex().size()).toBe(4)
    expect(idxMap(fuse)).toMatchObject([
      ['apple', 0],
      ['orange', 1],
      ['banana', 2],
      ['pear', 3]
    ])

    fuse.removeAt(1)

    expect(fuse.getIndex().size()).toBe(3)
    expect(idxMap(fuse)).toMatchObject([
      ['apple', 0],
      ['banana', 1],
      ['pear', 2]
    ])

    const results = fuse.remove((doc) => {
      return doc === 'banana' || doc === 'pear'
    })

    expect(results.length).toBe(2)
    expect(fuse.getIndex().size()).toBe(1)
    expect(fuse._docs.length).toBe(1)
  })

  test('removeAll: batch removal preserves correct indices', () => {
    const fruits = ['apple', 'orange', 'banana', 'pear', 'grape']
    const fuse = new Fuse(fruits)

    // Remove indices 1 (orange) and 3 (pear)
    fuse.remove((doc) => doc === 'orange' || doc === 'pear')

    expect(fuse.getIndex().size()).toBe(3)
    expect(idxMap(fuse)).toMatchObject([
      ['apple', 0],
      ['banana', 1],
      ['grape', 2]
    ])
  })

  test('removeAll: removing all items leaves empty index', () => {
    const fruits = ['apple', 'orange']
    const fuse = new Fuse(fruits)

    fuse.remove(() => true)

    expect(fuse.getIndex().size()).toBe(0)
    expect(fuse._docs.length).toBe(0)
  })

  test('removeAll: search works correctly after batch removal', () => {
    const fruits = ['apple', 'orange', 'banana', 'pear', 'grape']
    const fuse = new Fuse(fruits, { includeScore: true })

    fuse.remove((doc) => doc === 'apple' || doc === 'banana' || doc === 'grape')

    const result = fuse.search('orange')
    expect(result.length).toBe(1)
    expect(result[0].item).toBe('orange')
  })
})

describe('Fuse<string> blank-doc alignment (Plan 013)', () => {
  // Records for blank string docs are not created (see FuseIndex._createStringRecord),
  // so records.length < _docs.length when blanks are present. Mutation paths must
  // still speak doc-index, not records-array offset.

  test('construct + search across blanks: blanks are not searchable but do not shift surrounding doc-indices', () => {
    const fuse = new Fuse(['', 'apple', 'banana', ''])

    const apple = fuse.search('apple')
    expect(apple.length).toBe(1)
    expect(apple[0].refIndex).toBe(1)
    expect(apple[0].item).toBe('apple')

    const banana = fuse.search('banana')
    expect(banana.length).toBe(1)
    expect(banana[0].refIndex).toBe(2)
    expect(banana[0].item).toBe('banana')
  })

  test('removeAt of a non-blank between blanks: search returns correct refIndex on survivors', () => {
    // Headline repro: pre-fix, search('apple') returned banana via refIndex:1.
    const fuse = new Fuse(['', 'apple', 'banana'])
    fuse.removeAt(1)

    expect(fuse._docs).toEqual(['', 'banana'])
    expect(fuse.search('apple')).toEqual([])

    const banana = fuse.search('banana')
    expect(banana.length).toBe(1)
    expect(banana[0].refIndex).toBe(1)
    expect(banana[0].item).toBe('banana')
  })

  test('removeAt of a blank doc: surviving non-blank shifts down', () => {
    const fuse = new Fuse(['', 'apple'])
    fuse.removeAt(0)

    expect(fuse._docs).toEqual(['apple'])
    const apple = fuse.search('apple')
    expect(apple.length).toBe(1)
    expect(apple[0].refIndex).toBe(0)
    expect(apple[0].item).toBe('apple')
  })

  test('remove(predicate) across blanks: surviving non-blank shifts correctly', () => {
    const fuse = new Fuse(['', 'apple', 'banana', '', 'cherry'])
    fuse.remove((doc) => doc === 'apple' || doc === 'cherry')

    expect(fuse._docs).toEqual(['', 'banana', ''])

    const banana = fuse.search('banana')
    expect(banana.length).toBe(1)
    expect(banana[0].refIndex).toBe(1)
    expect(banana[0].item).toBe('banana')
  })

  test('remove(predicate) of only blank docs: non-blank survivors shift to contiguous indices', () => {
    const fuse = new Fuse(['', 'apple', '', 'banana'])
    fuse.remove((doc) => doc === '')

    expect(fuse._docs).toEqual(['apple', 'banana'])
    const records = fuse.getIndex().records
    expect(records.map((r) => r.i)).toEqual([0, 1])

    const apple = fuse.search('apple')
    expect(apple[0].refIndex).toBe(0)
    expect(apple[0].item).toBe('apple')

    const banana = fuse.search('banana')
    expect(banana[0].refIndex).toBe(1)
    expect(banana[0].item).toBe('banana')
  })

  test('add after construction with blanks: new record gets the correct doc-index, no duplicate .i', () => {
    const fuse = new Fuse(['', 'apple'])
    fuse.add('cherry')

    const cherry = fuse.search('cherry')
    expect(cherry.length).toBe(1)
    expect(cherry[0].refIndex).toBe(2)
    expect(cherry[0].item).toBe('cherry')

    const records = fuse.getIndex().records
    const indices = records.map((r) => r.i)
    expect(new Set(indices).size).toBe(indices.length)
  })

  test('add after remove (detached _docs reference): docIndex parameter survives Fuse.remove reassignment', () => {
    // Pre-fix Fuse.remove reassigns this._docs = this._docs.filter(...), creating
    // a new array. FuseIndex.docs (set via setSources at construction) still
    // points at the old array. The docIndex-as-parameter approach avoids
    // reading this.docs.length inside FuseIndex.add. Two removals so a stale
    // length read couldn't coincidentally produce the right answer.
    const fuse = new Fuse(['apple', 'banana', 'cherry'])
    fuse.remove((doc) => doc === 'apple' || doc === 'banana')
    fuse.add('date')

    const result = fuse.search('date')
    expect(result.length).toBe(1)
    expect(result[0].refIndex).toBe(1)
    expect(result[0].item).toBe('date')
  })

  test('token-search parity: records and inverted-index keys shift after removeAt', () => {
    // Asserts the bookkeeping shift, not FuzzySearch's fuzzy result (Bitap with
    // default threshold can still fuzzy-match across token boundaries; that's
    // pre-existing token-search behavior and orthogonal to this fix).
    const fuse = new Fuse(['', 'apple pie', 'banana bread'], {
      useTokenSearch: true
    })
    fuse.removeAt(1)

    expect(fuse._docs).toEqual(['', 'banana bread'])

    // banana's record shifted from i:2 to i:1 alongside _docs.
    const records = fuse.getIndex().records
    expect(records.length).toBe(1)
    expect(records[0].v).toBe('banana bread')
    expect(records[0].i).toBe(1)

    // Inverted-index per-doc maps must have shifted from old doc-index 2 to new doc-index 1.
    const inverted = fuse._invertedIndex
    expect(inverted.docFields[2] || 0).toBe(0)
    expect(inverted.docFields[1]).toBeGreaterThan(0)

    // df for "apple" / "pie" was decremented to 0 and removed.
    expect(inverted.df.has('apple')).toBe(false)
    expect(inverted.df.has('pie')).toBe(false)
    // df for "banana" / "bread" survives unchanged.
    expect(inverted.df.get('banana')).toBe(1)
    expect(inverted.df.get('bread')).toBe(1)

    // Search for "banana" — clearly distinct token, exact match — returns the survivor
    // at the new refIndex. (Routing check: refIndex is the doc-index in current _docs.)
    const banana = fuse.search('banana')
    expect(banana.length).toBe(1)
    expect(banana[0].refIndex).toBe(1)
    expect(banana[0].item).toBe('banana bread')
  })

  test('token-search add("") to a nonblank collection: df unchanged, no re-ingest of previous doc', () => {
    const fuse = new Fuse(['apple pie'], { useTokenSearch: true })

    // Snapshot df before.
    const dfBefore = new Map(fuse._invertedIndex.df)
    const fieldCountBefore = fuse._invertedIndex.fieldCount

    fuse.add('')

    expect(fuse._docs).toEqual(['apple pie', ''])
    expect(fuse.getIndex().records.length).toBe(1)
    // df and fieldCount must be untouched — no addToInvertedIndex call should
    // have fired for the blank-skipped doc.
    expect(fuse._invertedIndex.df).toEqual(dfBefore)
    expect(fuse._invertedIndex.fieldCount).toBe(fieldCountBefore)

    // Search still works correctly against the original record.
    const apple = fuse.search('apple')
    expect(apple.length).toBe(1)
    expect(apple[0].refIndex).toBe(0)
  })

  test('token-search add("") to an all-blank collection: no throw, records stays empty', () => {
    const fuse = new Fuse(['', ''], { useTokenSearch: true })

    expect(() => fuse.add('')).not.toThrow()

    expect(fuse.getIndex().records.length).toBe(0)
    expect(fuse._docs.length).toBe(3)
    expect(fuse.search('anything')).toEqual([])
  })

  test('Fuse.removeAt rejects invalid indices atomically', () => {
    const fuse = new Fuse(['alpha', 'beta', 'gamma'])
    const docsBefore = [...fuse._docs]
    const recordsBefore = fuse.getIndex().records.map((r) => ({ ...r }))

    expect(() => fuse.removeAt(-1)).toThrow()
    expect(() => fuse.removeAt(NaN)).toThrow()
    expect(() => fuse.removeAt(1.5)).toThrow()
    expect(() => fuse.removeAt(99)).toThrow()

    expect(fuse._docs).toEqual(docsBefore)
    expect(fuse.getIndex().records).toEqual(recordsBefore)
  })

  test('Fuse.removeAt invalid index does not corrupt the inverted index either', () => {
    const fuse = new Fuse(['apple pie', 'banana bread'], {
      useTokenSearch: true
    })

    const fieldCountBefore = fuse._invertedIndex.fieldCount
    const dfBefore = new Map(fuse._invertedIndex.df)
    const ledgerBefore = JSON.stringify(ledgerOf(fuse._invertedIndex))

    expect(() => fuse.removeAt(-1)).toThrow()

    // The guard must fire before removeAndShiftInvertedIndex is called.
    expect(fuse._invertedIndex.fieldCount).toBe(fieldCountBefore)
    expect(fuse._invertedIndex.df).toEqual(dfBefore)
    expect(JSON.stringify(ledgerOf(fuse._invertedIndex))).toBe(ledgerBefore)
  })

  test('FuseIndex.removeAt (direct call) rejects invalid indices', () => {
    const idx = Fuse.createIndex([], ['apple', 'banana'])
    expect(() => idx.removeAt(-1)).toThrow()
    // idx greater than every existing record.i is a no-op (loop finds nothing).
    const recordsBefore = idx.records.map((r) => ({ ...r }))
    idx.removeAt(99)
    expect(idx.records).toEqual(recordsBefore)
  })

  test('FuseIndex.removeAll (direct call) sanitizes invalid entries', () => {
    const idx = Fuse.createIndex([], ['apple', 'banana'])
    idx.removeAll([0, -1, 1.5, NaN])

    // Only doc-index 0 was valid → "apple" removed, "banana" survives at i=0.
    expect(idx.records.length).toBe(1)
    expect(idx.records[0].v).toBe('banana')
    expect(idx.records[0].i).toBe(0)
  })

  test('FuseIndex.add (direct call) rejects invalid docIndex', () => {
    const idx = Fuse.createIndex([], ['apple'])
    expect(() => idx.add('banana', -1)).toThrow()
    expect(() => idx.add('banana', undefined)).toThrow()
    expect(() => idx.add('banana', 1.5)).toThrow()
  })

  test('FuseIndex.removeAt handles unsorted records (parseIndex-input shape)', () => {
    // Build an index with records deliberately out of source order, mimicking
    // a hand-rolled parseIndex input where records aren't guaranteed sorted by .i.
    const idx = Fuse.createIndex([], ['apple', 'banana', 'cherry'])
    // Swap two records to break the sort invariant. `records` is a detached
    // snapshot, so load the reordered records back with setIndexRecords().
    const records = idx.records
    ;[records[0], records[2]] = [records[2], records[0]]
    idx.setIndexRecords(records)
    // Records are now: [{v:cherry, i:2}, {v:banana, i:1}, {v:apple, i:0}]

    idx.removeAt(1)

    // banana (i=1) removed; cherry (i=2) decrements to i=1; apple (i=0) unchanged.
    const remaining = idx.records.map((r) => ({ v: r.v, i: r.i }))
    expect(remaining).toEqual(
      expect.arrayContaining([
        { v: 'cherry', i: 1 },
        { v: 'apple', i: 0 }
      ])
    )
    expect(remaining.length).toBe(2)
    expect(remaining.find((r) => r.v === 'banana')).toBeUndefined()
  })
})

describe('Fuse.parseIndex owns its records', () => {
  const options = { keys: ['title'], includeScore: true }
  const docs = [
    { title: 'apple pie' },
    { title: 'banana split' },
    { title: 'apple tart' },
    { title: 'cherry' }
  ]
  const summarize = (results) =>
    results.map((r) => [r.refIndex, r.item.title])

  test('mutating one instance does not affect another built from the same data', () => {
    const data = JSON.parse(JSON.stringify(Fuse.createIndex(options.keys, docs)))
    const a = new Fuse(docs.slice(), options, Fuse.parseIndex(data))
    const b = new Fuse(docs.slice(), options, Fuse.parseIndex(data))
    const before = summarize(b.search('apple'))

    a.add({ title: 'apple crumble' })
    a.removeAt(0)

    expect(summarize(b.search('apple'))).toEqual(before)
  })

  test('instances sharing one FuseIndex copy it before mutating', () => {
    const index = Fuse.parseIndex(
      JSON.parse(JSON.stringify(Fuse.createIndex(options.keys, docs)))
    )
    const recordsBefore = JSON.stringify(index.records)
    const a = new Fuse(docs.slice(), options, index)
    const b = new Fuse(docs.slice(), options, index)
    const before = summarize(b.search('apple'))

    a.add({ title: 'apple crumble' })
    a.removeAt(0)
    a.remove((doc) => doc.title === 'cherry')

    expect(summarize(b.search('apple'))).toEqual(before)
    expect(JSON.stringify(index.records)).toBe(recordsBefore)
    expect(summarize(a.search('apple'))).toEqual(
      summarize(new Fuse(a._docs.slice(), options).search('apple'))
    )
  })

  test('token search stays correct on a shared index', () => {
    const tokenOptions = { ...options, useTokenSearch: true }
    const index = Fuse.createIndex(options.keys, docs)
    const a = new Fuse(docs.slice(), tokenOptions, index)
    const b = new Fuse(docs.slice(), tokenOptions, index)
    const before = JSON.stringify(b.search('apple'))

    a.add({ title: 'apple crumble' })
    a.removeAt(1)

    expect(JSON.stringify(b.search('apple'))).toBe(before)
    expect(JSON.stringify(a.search('apple'))).toBe(
      JSON.stringify(new Fuse(a._docs.slice(), tokenOptions).search('apple'))
    )
  })

  test("leaves the caller's data untouched", () => {
    const data = JSON.parse(JSON.stringify(Fuse.createIndex(options.keys, docs)))
    const snapshot = JSON.stringify(data)
    const fuse = new Fuse(docs.slice(), options, Fuse.parseIndex(data))

    fuse.add({ title: 'apple crumble' })
    fuse.removeAt(0)
    fuse.remove((doc) => doc.title === 'cherry')

    expect(JSON.stringify(data)).toBe(snapshot)
  })
})
