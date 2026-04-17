// Verifies that _lastSearcher is invalidated on collection mutation.
// Without the fix, token-search IDF weights stay frozen from construction,
// so the same query against a mutated collection returns stale scoring.

import { describe, test, expect } from 'vitest'

process.env.EXTENDED_SEARCH_ENABLED = 'true'
process.env.TOKEN_SEARCH_ENABLED = 'true'

const { default: Fuse } = await import('../src/entry')

describe('searcher cache invalidation on mutation', () => {
  const options = {
    keys: ['title'],
    useTokenSearch: true,
    includeScore: true
  }

  test('setCollection invalidates _lastSearcher', () => {
    const fuse = new Fuse([{ title: 'apple' }, { title: 'banana' }], options)
    fuse.search('apple')
    expect(fuse._lastSearcher).not.toBeNull()

    fuse.setCollection([{ title: 'cherry' }])
    expect(fuse._lastSearcher).toBeNull()
    expect(fuse._lastQuery).toBeNull()
  })

  test('add invalidates _lastSearcher', () => {
    const fuse = new Fuse([{ title: 'apple' }], options)
    fuse.search('apple')
    expect(fuse._lastSearcher).not.toBeNull()

    fuse.add({ title: 'banana' })
    expect(fuse._lastSearcher).toBeNull()
  })

  test('remove invalidates _lastSearcher', () => {
    const fuse = new Fuse(
      [{ title: 'apple' }, { title: 'banana' }, { title: 'cherry' }],
      options
    )
    fuse.search('apple')
    expect(fuse._lastSearcher).not.toBeNull()

    fuse.remove((doc) => doc.title === 'banana')
    expect(fuse._lastSearcher).toBeNull()
  })

  test('remove with no matches does not invalidate', () => {
    const fuse = new Fuse([{ title: 'apple' }], options)
    fuse.search('apple')
    const cached = fuse._lastSearcher

    fuse.remove((doc) => doc.title === 'zebra')
    expect(fuse._lastSearcher).toBe(cached)
  })

  test('removeAt invalidates _lastSearcher', () => {
    const fuse = new Fuse([{ title: 'apple' }, { title: 'banana' }], options)
    fuse.search('apple')
    expect(fuse._lastSearcher).not.toBeNull()

    fuse.removeAt(0)
    expect(fuse._lastSearcher).toBeNull()
  })

  test('same query after add returns docs added post-construction', () => {
    const fuse = new Fuse([{ title: 'foo bar' }], options)

    // Prime cache with this query
    const first = fuse.search('quux')
    expect(first.length).toBe(0)

    fuse.add({ title: 'quux quux' })

    // Without invalidation, the cached searcher would run against stale state
    const second = fuse.search('quux')
    expect(second.length).toBe(1)
    expect(second[0].item.title).toBe('quux quux')
  })
})
