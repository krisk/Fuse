import Fuse from '../dist/fuse.mjs'

// `tokenMatch: 'all'` makes token search require EVERY query word to match
// somewhere in a record (record-level AND), vs the default `'any'` (OR).
// A strict threshold is used so fuzzy matches don't blur the AND boundary.
describe('Token search tokenMatch: all (AND)', () => {
  const strict = { useTokenSearch: true, threshold: 0.2 }

  test('flat string list: AND keeps only records with every word', () => {
    const list = ['red shirt', 'red hat', 'blue shirt', 'green pants']
    const fuse = new Fuse(list, { ...strict, tokenMatch: 'all' })
    const items = fuse.search('red shirt').map((r) => r.item)
    expect(items).toEqual(['red shirt'])
  })

  test('default (any) returns OR matches; all narrows the same query', () => {
    const list = ['red shirt', 'red hat', 'blue shirt']
    const orItems = new Fuse(list, strict).search('red shirt').map((r) => r.item)
    const andItems = new Fuse(list, { ...strict, tokenMatch: 'all' })
      .search('red shirt')
      .map((r) => r.item)

    expect(orItems.sort()).toEqual(['blue shirt', 'red hat', 'red shirt'])
    expect(andItems).toEqual(['red shirt'])
  })

  test('AND is document-level: words split across fields still match', () => {
    const docs = [
      { title: 'Red', description: 'cotton shirt' },
      { title: 'Red dress', description: 'silk' }
    ]
    const fuse = new Fuse(docs, {
      ...strict,
      tokenMatch: 'all',
      keys: ['title', 'description']
    })
    const titles = fuse.search('red shirt').map((r) => r.item.title)
    expect(titles).toEqual(['Red'])
  })

  test('AND is document-level: words split across array elements still match', () => {
    const docs = [
      { title: 'JS Guide', tags: ['programming', 'web', 'frontend'] },
      { title: 'Py Handbook', tags: ['programming', 'data'] }
    ]
    const fuse = new Fuse(docs, {
      ...strict,
      tokenMatch: 'all',
      keys: ['title', 'tags']
    })
    expect(fuse.search('frontend web').map((r) => r.item.title)).toEqual(['JS Guide'])
    // No record has both "frontend" and "python" → excluded
    expect(fuse.search('frontend python')).toEqual([])
  })

  test('single-token query: AND result set equals OR result set', () => {
    const list = ['red shirt', 'red hat', 'blue shirt', 'green pants']
    const or = new Fuse(list, strict).search('red').map((r) => r.item).sort()
    const and = new Fuse(list, { ...strict, tokenMatch: 'all' })
      .search('red')
      .map((r) => r.item)
      .sort()
    expect(and).toEqual(or)
  })

  test('fuzzy term still counts toward coverage', () => {
    const list = ['javascript patterns', 'python guide', 'java basics']
    const fuse = new Fuse(list, { useTokenSearch: true, threshold: 0.3, tokenMatch: 'all' })
    // "javascrpt" (typo) + "patterns" → only the doc with both
    const items = fuse.search('javascrpt patterns').map((r) => r.item)
    expect(items).toEqual(['javascript patterns'])
  })

  test('duplicate query terms are satisfied without crashing', () => {
    const list = ['red shirt', 'red hat', 'blue shirt']
    const fuse = new Fuse(list, { ...strict, tokenMatch: 'all' })
    const items = fuse.search('red red').map((r) => r.item).sort()
    expect(items).toEqual(['red hat', 'red shirt'])
  })

  test('limit returns the same top-N as unlimited AND (string list)', () => {
    const list = ['red shirt', 'red shirt blue', 'red blue shirt', 'red hat']
    const opts = { ...strict, tokenMatch: 'all' }
    const full = new Fuse(list, opts).search('red shirt').map((r) => r.item)
    const limited = new Fuse(list, opts)
      .search('red shirt', { limit: 2 })
      .map((r) => r.item)
    expect(limited).toEqual(full.slice(0, 2))
    // "red hat" never appears (missing "shirt"), even unlimited
    expect(full).not.toContain('red hat')
  })

  test('limit returns the same top-N as unlimited AND (object list)', () => {
    const docs = [
      { title: 'red shirt premium' },
      { title: 'red shirt basic' },
      { title: 'red cap' }
    ]
    const opts = { ...strict, tokenMatch: 'all', keys: ['title'] }
    const full = new Fuse(docs, opts).search('red shirt').map((r) => r.item.title)
    const limited = new Fuse(docs, opts)
      .search('red shirt', { limit: 1 })
      .map((r) => r.item.title)
    expect(limited).toEqual(full.slice(0, 1))
    expect(full).not.toContain('red cap')
  })

  test('boundary: exactly 31 query terms (numeric mask fast path)', () => {
    const terms = Array.from({ length: 31 }, (_, i) => `w${i}`)
    const all = terms.join(' ')
    const list = [all, terms.slice(0, 30).join(' ')] // second missing w30
    const fuse = new Fuse(list, { useTokenSearch: true, threshold: 0, tokenMatch: 'all' })
    const items = fuse.search(all).map((r) => r.item)
    expect(items).toEqual([all])
  })

  test('boundary: exactly 32 query terms (Set fallback)', () => {
    const terms = Array.from({ length: 32 }, (_, i) => `w${i}`)
    const all = terms.join(' ')
    const list = [all, terms.slice(0, 31).join(' ')] // second missing w31
    const fuse = new Fuse(list, { useTokenSearch: true, threshold: 0, tokenMatch: 'all' })
    const items = fuse.search(all).map((r) => r.item)
    expect(items).toEqual([all])
  })

  test('tokenMatch is ignored without useTokenSearch', () => {
    const list = ['red shirt', 'red hat']
    // No useTokenSearch → tokenMatch has no effect; falls back to fuzzy search
    const fuse = new Fuse(list, { threshold: 0.2, tokenMatch: 'all' })
    expect(fuse.search('red shirt').map((r) => r.item)).toContain('red shirt')
  })

  test('empty query still returns all docs under AND', () => {
    const list = ['red shirt', 'blue hat']
    const fuse = new Fuse(list, { ...strict, tokenMatch: 'all' })
    expect(fuse.search('').length).toBe(2)
  })
})
