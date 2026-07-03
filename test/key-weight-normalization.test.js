import Fuse from '../dist/fuse.mjs'

// KeyStore normalises key weights so they sum to 1. Scoring must always use
// those normalised weights, never the raw user-supplied values carried on the
// index — otherwise large weights push Math.pow(Number.EPSILON, weight * norm)
// to underflow, and scores diverge between query forms.

describe('key weight normalisation in scoring', () => {
  describe('single key (always normalises to 1.0)', () => {
    test('weight:1 and weight:2 produce the same score', () => {
      const f1 = new Fuse([{ text: 'hello' }], {
        keys: [{ name: 'text', weight: 1 }],
        includeScore: true
      })
      const f2 = new Fuse([{ text: 'hello' }], {
        keys: [{ name: 'text', weight: 2 }],
        includeScore: true
      })

      expect(f1.search('hello')[0].score).toBe(f2.search('hello')[0].score)
    })

    test('weight:100 does not underflow to 0', () => {
      const f1 = new Fuse([{ text: 'hello' }], {
        keys: [{ name: 'text', weight: 1 }],
        includeScore: true
      })
      const f100 = new Fuse([{ text: 'hello' }], {
        keys: [{ name: 'text', weight: 100 }],
        includeScore: true
      })

      const score = f100.search('hello')[0].score
      expect(score).toBeGreaterThan(0)
      expect(score).toBe(f1.search('hello')[0].score)
    })
  })

  describe('multi-key: scaling all weights by a constant is a no-op', () => {
    const docs = [
      { title: 'JavaScript Guide', author: 'Alice' },
      { title: 'Python Cookbook', author: 'JavaScript Bob' }
    ]

    test('ordering and scores are unchanged when every weight is scaled', () => {
      const norm = new Fuse(docs, {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'author', weight: 0.3 }
        ],
        includeScore: true,
        threshold: 1
      })
      const scaled = new Fuse(docs, {
        keys: [
          { name: 'title', weight: 7 },
          { name: 'author', weight: 3 }
        ],
        includeScore: true,
        threshold: 1
      })

      const rNorm = norm.search('javascript')
      const rScaled = scaled.search('javascript')

      expect(rNorm.map((r) => r.item.title)).toEqual(
        rScaled.map((r) => r.item.title)
      )
      rNorm.forEach((result, i) => {
        expect(result.score).toBeCloseTo(rScaled[i].score, 10)
      })
    })
  })

  describe('consistency across query forms', () => {
    const build = (weight) =>
      new Fuse([{ text: 'hello' }], {
        keys: [{ name: 'text', weight }],
        includeScore: true,
        useExtendedSearch: true
      })

    test('keyless logical query matches string-query score (no underflow)', () => {
      const f1 = build(1)
      const f100 = build(100)

      const keylessScore = f100.search({ $or: ['hello'] })[0].score
      expect(keylessScore).toBeGreaterThan(0)
      expect(keylessScore).toBe(f1.search({ $or: ['hello'] })[0].score)
      // and matches the plain string form
      expect(keylessScore).toBe(f100.search('hello')[0].score)
    })

    test('keyed logical query matches string-query score', () => {
      const f100 = build(100)
      expect(f100.search({ text: 'hello' })[0].score).toBe(
        f100.search('hello')[0].score
      )
    })
  })

  describe('pre-built index whose key order differs from options.keys', () => {
    test('weights and reported keys stay aligned to their values', () => {
      const docs = [{ title: 'alpha', author: 'omega' }]
      const index = Fuse.createIndex(
        [
          { name: 'title', weight: 1 },
          { name: 'author', weight: 3 }
        ],
        docs
      )
      // options.keys in the reverse order of how the index was built
      const fuse = new Fuse(
        docs,
        {
          keys: [
            { name: 'author', weight: 3 },
            { name: 'title', weight: 1 }
          ],
          includeScore: true,
          includeMatches: true
        },
        index
      )

      const match = fuse.search('alpha')[0].matches[0]
      // The value 'alpha' lives under 'title'; the reported key must agree.
      expect(match.value).toBe('alpha')
      expect(match.key).toBe('title')
    })
  })
})
