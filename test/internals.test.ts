import norm from '../src/tools/fieldNorm'
import {
  buildInvertedIndex,
  addToInvertedIndex,
  removeFromInvertedIndex,
  removeAndShiftInvertedIndex
} from '../src/search/token/InvertedIndex'
import { createAnalyzer } from '../src/search/token/analyzer'
import type { IndexRecord } from '../src/types'

describe('fieldNorm', () => {
  test('returns a valid norm for a normal string', () => {
    const n = norm(1, 3)
    expect(n.get('hello world')).toBeCloseTo(0.707, 3)
  })

  test('does not throw on an empty string', () => {
    const n = norm(1, 3)
    // Empty string has no word tokens — should fall back to 1 token, not crash
    expect(() => n.get('')).not.toThrow()
    expect(n.get('')).toBe(1)
  })

  test('treats consecutive spaces as a single separator', () => {
    const n = norm(1, 3)
    // "hello    world" has 2 words regardless of spacing
    expect(n.get('hello    world')).toBe(n.get('hello world'))
  })

  test('caches results for the same token count', () => {
    const n = norm(1, 3)
    const a = n.get('one two three')
    const b = n.get('foo bar baz')
    expect(a).toBe(b)
  })
})

describe('InvertedIndex', () => {
  const analyzer = createAnalyzer()

  function makeRecords(): IndexRecord[] {
    return [
      // doc 0: 2 keys, key 0 has 2 unique terms, key 1 has 3
      { i: 0, $: { 0: { v: 'hello world', n: 1 }, 1: { v: 'foo bar baz', n: 1 } } },
      // doc 1: 1 key, 2 unique terms
      { i: 1, $: { 0: { v: 'hello there', n: 1 } } },
      // doc 2: 1 key, 3 unique terms
      { i: 2, $: { 0: { v: 'goodbye cruel world', n: 1 } } }
    ]
  }

  test('fieldCount is correct after build', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // doc 0 contributes 2 fields (key 0, key 1)
    // doc 1 contributes 1 field (key 0)
    // doc 2 contributes 1 field (key 0)
    expect(index.fieldCount).toBe(4)
  })

  test('fieldCount is correct after removal', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)
    expect(index.fieldCount).toBe(4)

    // Remove doc 0 (which had 2 fields)
    removeFromInvertedIndex(index, 0)
    expect(index.fieldCount).toBe(2)

    // Remove doc 1 (which had 1 field)
    removeFromInvertedIndex(index, 1)
    expect(index.fieldCount).toBe(1)
  })

  test('removing a non-existent doc is a no-op', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)
    const before = index.fieldCount

    removeFromInvertedIndex(index, 999)
    expect(index.fieldCount).toBe(before)
  })

  test('terms unique to a removed doc are deleted from the index', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // "foo", "bar", "baz" only appear in doc 0
    expect(index.terms.has('foo')).toBe(true)

    removeFromInvertedIndex(index, 0)
    expect(index.terms.has('foo')).toBe(false)
    expect(index.terms.has('bar')).toBe(false)
    expect(index.terms.has('baz')).toBe(false)
  })

  test('shared terms survive removal of one doc', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // "hello" is in doc 0 and doc 1
    expect(index.terms.get('hello')!.length).toBe(2)

    removeFromInvertedIndex(index, 0)

    // "hello" should still exist with 1 posting
    expect(index.terms.has('hello')).toBe(true)
    expect(index.terms.get('hello')!.length).toBe(1)
    expect(index.terms.get('hello')![0].docIdx).toBe(1)
  })

  test('addToInvertedIndex updates fieldCount and terms', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    const newRecord: IndexRecord = {
      i: 3,
      $: { 0: { v: 'unique unicorn', n: 1 } }
    }

    addToInvertedIndex(index, newRecord, 2, analyzer)

    expect(index.fieldCount).toBe(5)
    expect(index.terms.has('unicorn')).toBe(true)
    expect(index.docTerms.has(3)).toBe(true)
  })

  test('docTerms tracks terms per document', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    expect(index.docTerms.get(0)).toEqual(new Set(['hello', 'world', 'foo', 'bar', 'baz']))
    expect(index.docTerms.get(1)).toEqual(new Set(['hello', 'there']))

    removeFromInvertedIndex(index, 0)
    expect(index.docTerms.has(0)).toBe(false)
  })

  test('removeAndShiftInvertedIndex renumbers surviving postings', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // Remove doc 0 — docs 1, 2 must shift down to 0, 1
    removeAndShiftInvertedIndex(index, [0])

    expect(index.docTerms.has(0)).toBe(true)
    expect(index.docTerms.has(1)).toBe(true)
    expect(index.docTerms.has(2)).toBe(false)
    expect(index.docTerms.get(0)).toEqual(new Set(['hello', 'there']))
    expect(index.docTerms.get(1)).toEqual(new Set(['goodbye', 'cruel', 'world']))

    const helloPostings = index.terms.get('hello')!
    expect(helloPostings.length).toBe(1)
    expect(helloPostings[0].docIdx).toBe(0)

    const worldPostings = index.terms.get('world')!
    expect(worldPostings.length).toBe(1)
    expect(worldPostings[0].docIdx).toBe(1)
  })

  test('batch remove + shift handles non-contiguous indices', () => {
    const records: IndexRecord[] = [
      { i: 0, $: { 0: { v: 'alpha', n: 1 } } },
      { i: 1, $: { 0: { v: 'beta', n: 1 } } },
      { i: 2, $: { 0: { v: 'gamma', n: 1 } } },
      { i: 3, $: { 0: { v: 'delta', n: 1 } } },
      { i: 4, $: { 0: { v: 'epsilon', n: 1 } } }
    ]
    const index = buildInvertedIndex(records, 1, analyzer)

    // Remove docs 1 and 3 — remaining (0, 2, 4) become (0, 1, 2)
    removeAndShiftInvertedIndex(index, [1, 3])

    expect(index.docTerms.get(0)).toEqual(new Set(['alpha']))
    expect(index.docTerms.get(1)).toEqual(new Set(['gamma']))
    expect(index.docTerms.get(2)).toEqual(new Set(['epsilon']))
    expect(index.docTerms.has(3)).toBe(false)
    expect(index.docTerms.has(4)).toBe(false)

    expect(index.terms.get('gamma')![0].docIdx).toBe(1)
    expect(index.terms.get('epsilon')![0].docIdx).toBe(2)
  })

  test('removing every doc leaves an empty index', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    removeAndShiftInvertedIndex(index, [0, 1, 2])

    expect(index.fieldCount).toBe(0)
    expect(index.docTerms.size).toBe(0)
    expect(index.terms.size).toBe(0)
    expect(index.df.size).toBe(0)
  })

  test('subsequent add after shift uses the new contiguous index', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    removeAndShiftInvertedIndex(index, [0])

    // After shift: 2 surviving docs at indices 0, 1. A new add gets index 2.
    const newRecord: IndexRecord = {
      i: 2,
      $: { 0: { v: 'fresh doc', n: 1 } }
    }
    addToInvertedIndex(index, newRecord, 2, analyzer)

    expect(index.docTerms.get(2)).toEqual(new Set(['fresh', 'doc']))
    expect(index.terms.get('fresh')![0].docIdx).toBe(2)
  })
})
