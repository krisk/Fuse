// Regression tests for https://github.com/krisk/Fuse/issues/833
//
// _searchObjectList previously used this._myIndex.keys (raw user-specified
// weights) instead of this._keyStore.keys() (normalised weights that sum to
// 1). This caused two observable bugs:
//
//   1. For a single key, weight:N always normalises to 1.0 (only key = 100 %),
//      so any two weight values must produce identical scores. With the raw
//      weight in the exponent, Math.pow(Number.EPSILON, N * fieldNorm)
//      underflows to exactly 0 for large N.
//
//   2. Scores from plain string queries (_searchObjectList, raw weights) differ
//      from scores for the same search expressed as an Expression query
//      (_searchLogical, normalised KeyStore weights).

import { describe, test, expect } from 'vitest'

process.env.EXTENDED_SEARCH_ENABLED = 'true'
process.env.LOGICAL_SEARCH_ENABLED = 'true'

const { default: Fuse } = await import('../src/entry')

describe('key weight normalisation in _searchObjectList', () => {
  // ── single-key weight invariance ─────────────────────────────────────────
  //
  // A single key always normalises to weight=1.0 regardless of its raw value,
  // so any two raw weight values must produce the same score.

  test('single key weight:1 and weight:2 produce the same score', () => {
    const fuseW1 = new Fuse([{ text: 'hello' }], {
      keys: [{ name: 'text', weight: 1 }],
      includeScore: true
    })
    const fuseW2 = new Fuse([{ text: 'hello' }], {
      keys: [{ name: 'text', weight: 2 }],
      includeScore: true
    })

    const r1 = fuseW1.search('hello')
    const r2 = fuseW2.search('hello')

    expect(r1).toHaveLength(1)
    expect(r2).toHaveLength(1)
    // After normalisation both instances have key.weight == 1.0, so the
    // computed score must be identical.
    expect(r1[0].score).toBe(r2[0].score)
  })

  test('single key weight:100 does not underflow to 0', () => {
    // Math.pow(Number.EPSILON, 100 * fieldNorm) underflows to exactly 0 when
    // the raw weight (100) is used; the normalised weight (1.0) does not.
    const fuseW1 = new Fuse([{ text: 'hello' }], {
      keys: [{ name: 'text', weight: 1 }],
      includeScore: true
    })
    const fuseW100 = new Fuse([{ text: 'hello' }], {
      keys: [{ name: 'text', weight: 100 }],
      includeScore: true
    })

    const rW1 = fuseW1.search('hello')
    const rW100 = fuseW100.search('hello')

    expect(rW1).toHaveLength(1)
    expect(rW100).toHaveLength(1)

    // weight:100 must not underflow to 0
    expect(rW100[0].score).toBeGreaterThan(0)
    // and must equal the weight:1 result (both normalise to 1.0)
    expect(rW100[0].score).toBe(rW1[0].score)
  })

  // ── multi-key: proportional weight ratio is preserved ─────────────────────
  //
  // Scaling all weights by the same factor (e.g. ×10) must not change the
  // result ordering because normalisation collapses the factor.

  test('scaling all weights by the same factor does not change result ordering', () => {
    const docs = [
      { title: 'JavaScript Guide', author: 'Alice' },
      { title: 'Python Cookbook', author: 'JavaScript Bob' }
    ]

    const fuseNorm = new Fuse(docs, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'author', weight: 0.3 }
      ],
      includeScore: true,
      threshold: 1
    })
    const fuseScaled = new Fuse(docs, {
      keys: [
        { name: 'title', weight: 7 },   // ×10 — same ratio
        { name: 'author', weight: 3 }
      ],
      includeScore: true,
      threshold: 1
    })

    const rNorm   = fuseNorm.search('javascript')
    const rScaled = fuseScaled.search('javascript')

    expect(rNorm.length).toBeGreaterThan(0)
    expect(rScaled.length).toBeGreaterThan(0)

    // Ordering must be the same after normalisation
    const orderNorm   = rNorm.map(r => r.item.title)
    const orderScaled = rScaled.map(r => r.item.title)
    expect(orderNorm).toEqual(orderScaled)

    // Absolute scores must also match (normalisation collapses the ×10 factor)
    rNorm.forEach((result, i) => {
      expect(result.score).toBeCloseTo(rScaled[i].score, 10)
    })
  })
})
