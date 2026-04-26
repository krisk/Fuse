import Fuse from '../dist/fuse.mjs'
import FuseBasic from '../dist/fuse.basic.mjs'
import * as ErrorMsg from '../src/core/errorMessages'

describe('Fuse.match', () => {
  test('returns a match for a fuzzy match', () => {
    const result = Fuse.match('apple', 'Paul likes apples')
    expect(result.isMatch).toBe(true)
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThan(1)
  })

  test('returns a perfect score for an exact match', () => {
    const result = Fuse.match('apple', 'apple')
    expect(result.isMatch).toBe(true)
    expect(result.score).toBe(0)
  })

  test('returns no match when strings are unrelated', () => {
    const result = Fuse.match('xyz', 'apple')
    expect(result.isMatch).toBe(false)
    expect(result.score).toBe(1)
  })

  test('includes indices when includeMatches is true', () => {
    const result = Fuse.match('apple', 'apple pie', { includeMatches: true })
    expect(result.isMatch).toBe(true)
    expect(result.indices).toBeDefined()
    expect(result.indices.length).toBeGreaterThan(0)
  })

  test('does not include indices by default', () => {
    const result = Fuse.match('apple', 'apple pie')
    expect(result.indices).toBeUndefined()
  })

  test('respects isCaseSensitive option', () => {
    const insensitive = Fuse.match('APPLE', 'apple')
    expect(insensitive.isMatch).toBe(true)

    const sensitive = Fuse.match('APPLE', 'apple', { isCaseSensitive: true })
    expect(sensitive.isMatch).toBe(false)
  })

  test('respects threshold option', () => {
    const loose = Fuse.match('aple', 'apple', { threshold: 0.6 })
    expect(loose.isMatch).toBe(true)

    const strict = Fuse.match('aple', 'apple', { threshold: 0 })
    expect(strict.isMatch).toBe(false)
  })

  test('respects minMatchCharLength option', () => {
    const result = Fuse.match('app', 'apple', {
      includeMatches: true,
      minMatchCharLength: 3
    })
    expect(result.isMatch).toBe(true)
    expect(result.indices).toBeDefined()
    result.indices.forEach(([start, end]) => {
      expect(end - start + 1).toBeGreaterThanOrEqual(3)
    })
  })

  // Token search needs corpus-level statistics (df, fieldCount) that a one-off
  // string comparison can't provide. Both builds must reject it explicitly —
  // the full build used to crash with an opaque TypeError, the basic build
  // used to silently fall back to plain fuzzy matching.
  test('throws when useTokenSearch is true (full build)', () => {
    expect(() =>
      Fuse.match('apple', 'apple pie', { useTokenSearch: true })
    ).toThrowError(ErrorMsg.FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED)
  })

  test('throws when useTokenSearch is true (basic build)', () => {
    expect(() =>
      FuseBasic.match('apple', 'apple pie', { useTokenSearch: true })
    ).toThrowError(ErrorMsg.FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED)
  })

  test('still works when useTokenSearch is explicitly false', () => {
    const result = Fuse.match('apple', 'apple pie', { useTokenSearch: false })
    expect(result.isMatch).toBe(true)
  })
})
