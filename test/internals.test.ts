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
      {
        i: 0,
        $: { 0: { v: 'hello world', n: 1 }, 1: { v: 'foo bar baz', n: 1 } }
      },
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
    expect(index.docFieldCount.get(0)).toBe(2)
    expect(index.docFieldCount.get(1)).toBe(1)
    expect(index.docFieldCount.get(2)).toBe(1)
  })

  test('df is incremented once per (doc, term, field)', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // "hello" appears in doc 0 key 0 and doc 1 key 0 → df 2
    expect(index.df.get('hello')).toBe(2)
    // "world" appears in doc 0 key 0 and doc 2 key 0 → df 2
    expect(index.df.get('world')).toBe(2)
    // "foo" only in doc 0 key 1 → df 1
    expect(index.df.get('foo')).toBe(1)
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

  test('terms unique to a removed doc are deleted from df', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // "foo", "bar", "baz" only appear in doc 0
    expect(index.df.has('foo')).toBe(true)

    removeFromInvertedIndex(index, 0)
    expect(index.df.has('foo')).toBe(false)
    expect(index.df.has('bar')).toBe(false)
    expect(index.df.has('baz')).toBe(false)
  })

  test('shared terms survive removal of one doc with correct df', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // "hello" is in doc 0 and doc 1 → df 2
    expect(index.df.get('hello')).toBe(2)

    removeFromInvertedIndex(index, 0)

    // "hello" should still exist with df 1 (only doc 1 left)
    expect(index.df.get('hello')).toBe(1)
  })

  test('addToInvertedIndex updates fieldCount, df, and per-doc maps', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    const newRecord: IndexRecord = {
      i: 3,
      $: { 0: { v: 'unique unicorn', n: 1 } }
    }

    addToInvertedIndex(index, newRecord, 2, analyzer)

    expect(index.fieldCount).toBe(5)
    expect(index.df.get('unicorn')).toBe(1)
    expect(index.docFieldCount.get(3)).toBe(1)
    expect(index.docTermFieldHits.get(3)?.get('unicorn')).toBe(1)
  })

  test('docTermFieldHits tracks per-doc, per-term field counts', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    expect(index.docTermFieldHits.get(0)).toEqual(
      new Map([
        ['hello', 1],
        ['world', 1],
        ['foo', 1],
        ['bar', 1],
        ['baz', 1]
      ])
    )
    expect(index.docTermFieldHits.get(1)).toEqual(
      new Map([
        ['hello', 1],
        ['there', 1]
      ])
    )

    removeFromInvertedIndex(index, 0)
    expect(index.docTermFieldHits.has(0)).toBe(false)
  })

  test('repeated term across multiple keys: df counts each (doc, field)', () => {
    // Same term "rust" in two distinct fields of one doc
    const records: IndexRecord[] = [
      {
        i: 0,
        $: {
          0: { v: 'rust', n: 1 },
          1: { v: 'rust systems', n: 1 }
        }
      }
    ]
    const index = buildInvertedIndex(records, 2, analyzer)

    // df["rust"] = 2: appeared in 2 fields of doc 0
    expect(index.df.get('rust')).toBe(2)
    expect(index.docTermFieldHits.get(0)?.get('rust')).toBe(2)
    expect(index.docFieldCount.get(0)).toBe(2)

    removeFromInvertedIndex(index, 0)

    // df should be fully cleared, not stuck at 1
    expect(index.df.has('rust')).toBe(false)
    expect(index.fieldCount).toBe(0)
    expect(index.docFieldCount.has(0)).toBe(false)
    expect(index.docTermFieldHits.has(0)).toBe(false)
  })

  test('repeated term within same field counts once for df', () => {
    // "rust rust rust" in one field is still one (doc, term, field) increment
    const records: IndexRecord[] = [
      { i: 0, $: { 0: { v: 'rust rust rust', n: 1 } } }
    ]
    const index = buildInvertedIndex(records, 1, analyzer)

    expect(index.df.get('rust')).toBe(1)
    expect(index.docTermFieldHits.get(0)?.get('rust')).toBe(1)
    expect(index.fieldCount).toBe(1)

    removeFromInvertedIndex(index, 0)
    expect(index.df.has('rust')).toBe(false)
    expect(index.fieldCount).toBe(0)
  })

  test('array sub-records: each sub counts as its own field', () => {
    // Array key — each element is its own field/sub-record.
    const records: IndexRecord[] = [
      {
        i: 0,
        $: {
          0: [
            { v: 'rust', i: 0, n: 1 },
            { v: 'rust', i: 1, n: 1 },
            { v: 'systems', i: 2, n: 1 }
          ]
        }
      }
    ]
    const index = buildInvertedIndex(records, 1, analyzer)

    // 3 sub-records → 3 field contributions
    expect(index.fieldCount).toBe(3)
    expect(index.docFieldCount.get(0)).toBe(3)
    // "rust" in 2 sub-records → df 2
    expect(index.df.get('rust')).toBe(2)
    // "systems" in 1 sub-record → df 1
    expect(index.df.get('systems')).toBe(1)

    removeFromInvertedIndex(index, 0)
    expect(index.fieldCount).toBe(0)
    expect(index.df.size).toBe(0)
    expect(index.docFieldCount.size).toBe(0)
  })

  test('removeAndShiftInvertedIndex renumbers per-doc maps', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    // Remove doc 0 — docs 1, 2 must shift down to 0, 1
    removeAndShiftInvertedIndex(index, [0])

    expect(index.docFieldCount.has(0)).toBe(true)
    expect(index.docFieldCount.has(1)).toBe(true)
    expect(index.docFieldCount.has(2)).toBe(false)
    expect(index.docTermFieldHits.get(0)).toEqual(
      new Map([
        ['hello', 1],
        ['there', 1]
      ])
    )
    expect(index.docTermFieldHits.get(1)).toEqual(
      new Map([
        ['goodbye', 1],
        ['cruel', 1],
        ['world', 1]
      ])
    )

    expect(index.df.get('hello')).toBe(1)
    expect(index.df.get('world')).toBe(1)
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

    expect(index.docTermFieldHits.get(0)).toEqual(new Map([['alpha', 1]]))
    expect(index.docTermFieldHits.get(1)).toEqual(new Map([['gamma', 1]]))
    expect(index.docTermFieldHits.get(2)).toEqual(new Map([['epsilon', 1]]))
    expect(index.docTermFieldHits.has(3)).toBe(false)
    expect(index.docTermFieldHits.has(4)).toBe(false)

    expect(index.docFieldCount.get(0)).toBe(1)
    expect(index.docFieldCount.get(1)).toBe(1)
    expect(index.docFieldCount.get(2)).toBe(1)
  })

  test('batch remove + shift with array sub-records and repeated terms', () => {
    // Doc 1 has "rust" in 2 fields (its own array sub-records) — verifies that
    // df decrements correctly when shifting away docs with multi-field terms.
    const records: IndexRecord[] = [
      { i: 0, $: { 0: { v: 'alpha', n: 1 } } },
      {
        i: 1,
        $: {
          0: { v: 'rust', n: 1 },
          1: [
            { v: 'rust', i: 0, n: 1 },
            { v: 'systems', i: 1, n: 1 }
          ]
        }
      },
      { i: 2, $: { 0: { v: 'gamma', n: 1 } } }
    ]
    const index = buildInvertedIndex(records, 2, analyzer)

    // df["rust"] = 2 (two fields of doc 1)
    expect(index.df.get('rust')).toBe(2)
    expect(index.fieldCount).toBe(1 + 3 + 1)

    removeAndShiftInvertedIndex(index, [1])

    // After removing doc 1, "rust" and "systems" should be gone entirely
    expect(index.df.has('rust')).toBe(false)
    expect(index.df.has('systems')).toBe(false)
    expect(index.fieldCount).toBe(2)

    // Doc 2 should now be at index 1
    expect(index.docTermFieldHits.get(1)).toEqual(new Map([['gamma', 1]]))
    expect(index.docTermFieldHits.has(2)).toBe(false)
  })

  test('removing every doc leaves an empty index', () => {
    const records = makeRecords()
    const index = buildInvertedIndex(records, 2, analyzer)

    removeAndShiftInvertedIndex(index, [0, 1, 2])

    expect(index.fieldCount).toBe(0)
    expect(index.docFieldCount.size).toBe(0)
    expect(index.docTermFieldHits.size).toBe(0)
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

    expect(index.docTermFieldHits.get(2)).toEqual(
      new Map([
        ['fresh', 1],
        ['doc', 1]
      ])
    )
    expect(index.df.get('fresh')).toBe(1)
  })
})
