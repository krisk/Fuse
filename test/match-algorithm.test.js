import { describe, test, expect } from 'vitest'
import Fuse from '../dist/fuse.mjs'

// Deterministic xorshift so the randomized checks are reproducible.
const makeRng = (seed) => () => {
  seed ^= seed << 13
  seed >>>= 0
  seed ^= seed >>> 17
  seed ^= seed << 5
  seed >>>= 0
  return seed / 4294967296
}

// Brute-force reference for Fuse's fuzzy score (patterns up to 32 chars):
// for every start s, the fewest edits turning the pattern into some substring
// beginning at s, scored as errors/m + |s - location|/distance; the best
// score within the threshold wins. Mirrors the documented formula, not either
// implementation.
function minEditsFrom(pattern, text, start) {
  const sub = text.slice(start)
  let prev = Array.from({ length: sub.length + 1 }, (_, j) => j)
  for (let i = 1; i <= pattern.length; i += 1) {
    const cur = [i]
    for (let j = 1; j <= sub.length; j += 1) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (pattern[i - 1] === sub[j - 1] ? 0 : 1)
      )
    }
    prev = cur
  }
  return Math.min(...prev)
}

function oracleScore(pattern, text, o) {
  if (pattern === text) return 0
  const m = pattern.length
  const loc = Math.max(0, Math.min(o.location, text.length))
  let best = Infinity
  for (let s = 0; s < text.length; s += 1) {
    const e = minEditsFrom(pattern, text, s)
    if (e >= m) continue
    const acc = e / m
    const score = o.ignoreLocation
      ? acc
      : !o.distance
        ? Math.abs(loc - s)
          ? 1
          : acc
        : acc + Math.abs(loc - s) / o.distance
    if (score <= o.threshold && score < best) best = score
  }
  return best === Infinity ? null : Math.max(0.001, best)
}

describe('matchAlgorithm option', () => {
  test('defaults to myers', () => {
    expect(Fuse.config.matchAlgorithm).toBe('myers')
  })

  test('myers equals the brute-force score of the documented formula', () => {
    const rnd = makeRng(0x2545f491)
    const pick = (a) => a[Math.floor(rnd() * a.length)]
    const word = (n, al) => Array.from({ length: n }, () => pick(al)).join('')
    for (let k = 0; k < 3000; k += 1) {
      const al = pick([['a', 'b'], ['a', 'b', 'c'], [...'abcde']])
      const text = word(1 + Math.floor(rnd() * 24), al)
      const pattern = word(2 + Math.floor(rnd() * 6), al)
      const o = {
        location: pick([0, 3, 10]),
        distance: pick([0, 1, 5, 100]),
        threshold: pick([0.2, 0.4, 0.6, 0.8]),
        ignoreLocation: rnd() < 0.3,
        isCaseSensitive: true,
        matchAlgorithm: 'myers'
      }
      const want = oracleScore(pattern, text, o)
      const r = Fuse.match(pattern, text, o)
      const got = r.isMatch ? r.score : null
      if (want === null) {
        expect(got).toBeNull()
      } else {
        expect(got).toBeCloseTo(want, 10)
      }
    }
  })

  test('myers and bitap give identical results at realistic settings', () => {
    const rnd = makeRng(0x9e3779b1)
    const pick = (a) => a[Math.floor(rnd() * a.length)]
    const vocab =
      'search fuzzy index query apple banana javascript typescript optimization performance library matching string pattern location distance threshold score ranking token word document field'.split(
        ' '
      )
    const sentence = () =>
      Array.from({ length: 1 + Math.floor(rnd() * 10) }, () =>
        pick(vocab)
      ).join(' ')
    const typo = (w) => {
      const a = [...w]
      const k = Math.floor(rnd() * a.length)
      if (rnd() < 0.5) a.splice(k, 1)
      else a[k] = pick([...'abcdefghijklmnopqrstuvwxyz'])
      return a.join('')
    }
    const docs = Array.from({ length: 150 }, () => ({
      title: sentence(),
      body: `${sentence()} ${sentence()}`
    }))
    const configs = [
      {},
      { ignoreLocation: true },
      { threshold: 0.3 },
      { includeMatches: true },
      { location: 20, distance: 50 },
      { useExtendedSearch: true },
      { useTokenSearch: true }
    ]
    for (const extra of configs) {
      const opts = { keys: ['title', 'body'], includeScore: true, ...extra }
      const myers = new Fuse(docs, { ...opts, matchAlgorithm: 'myers' })
      const bitap = new Fuse(docs, { ...opts, matchAlgorithm: 'bitap' })
      for (let q = 0; q < 40; q += 1) {
        const query = rnd() < 0.5 ? pick(vocab) : typo(pick(vocab))
        expect(JSON.stringify(myers.search(query))).toBe(
          JSON.stringify(bitap.search(query))
        )
      }
    }
  })

  describe('documented semantic difference (distance < pattern length)', () => {
    const text = 'the javascript handbook'

    test('myers applies the formula exactly; bitap does not', () => {
      expect(
        Fuse.match('javascript', text, { distance: 5, matchAlgorithm: 'bitap' })
          .isMatch
      ).toBe(false)
      const myers = Fuse.match('javascript', text, {
        distance: 5,
        matchAlgorithm: 'myers'
      })
      expect(myers.isMatch).toBe(true)
      expect(myers.score).toBeCloseTo(0.4, 10)
    })

    test('the boundary applies per 32-character chunk', () => {
      // A 64-char pattern is two 32-char chunks. With distance 5, the 32-char
      // chunk boundary (not the 64-char pattern length) decides whether
      // leading-typo starts can pay off.
      const head = 'abcdefghijklmnopqrstuvwxyzabcdef'
      const tail = 'qrstuvwxqrstuvwxqrstuvwxqrstuvwx'
      const pattern = head + tail
      const shifted = 'zz' + head + tail
      const opts = { distance: 5 }
      const myers = Fuse.match(pattern, shifted, {
        ...opts,
        matchAlgorithm: 'myers'
      })
      expect(myers.isMatch).toBe(true)
      // Each chunk: start 2 away from its expected location at 0 typos
      // (2/5 = 0.4) or start at 0 with 2 leading typos (2/32 = 0.0625).
      expect(myers.score).toBeCloseTo(0.0625, 10)
    })

    test('the option reaches string extended search', () => {
      const opts = { useExtendedSearch: true, distance: 5 }
      expect(
        new Fuse([text], { ...opts, matchAlgorithm: 'bitap' }).search(
          'javascript'
        )
      ).toHaveLength(0)
      expect(
        new Fuse([text], { ...opts, matchAlgorithm: 'myers' }).search(
          'javascript'
        )
      ).toHaveLength(1)
    })

    test('the option reaches object $fuzzy queries', () => {
      const docs = [{ title: text }]
      const opts = { keys: ['title'], distance: 5 }
      const query = { title: { $fuzzy: 'javascript' } }
      expect(
        new Fuse(docs, { ...opts, matchAlgorithm: 'bitap' }).search(query)
      ).toHaveLength(0)
      expect(
        new Fuse(docs, { ...opts, matchAlgorithm: 'myers' }).search(query)
      ).toHaveLength(1)
    })

    test('the option reaches logical queries', () => {
      const docs = [{ title: text }]
      const opts = { keys: ['title'], distance: 5 }
      const query = { $and: [{ title: 'javascript' }] }
      expect(
        new Fuse(docs, { ...opts, matchAlgorithm: 'bitap' }).search(query)
      ).toHaveLength(0)
      expect(
        new Fuse(docs, { ...opts, matchAlgorithm: 'myers' }).search(query)
      ).toHaveLength(1)
    })
  })

  test('token search forwards the option to every term searcher', () => {
    // Token search always runs with ignoreLocation, where both matchers agree,
    // so check the option each term searcher actually received.
    const docs = ['apple pie recipe', 'banana bread', 'apple tart']
    for (const matchAlgorithm of ['myers', 'bitap']) {
      const fuse = new Fuse(docs, { useTokenSearch: true, matchAlgorithm })
      fuse.search('aple tart')
      const terms = fuse._lastSearcher.termSearchers
      expect(terms.length).toBe(2)
      for (const term of terms) {
        expect(term.options.matchAlgorithm).toBe(matchAlgorithm)
      }
    }
  })

  test('negative distance falls back to bitap under myers', () => {
    const rnd = makeRng(0x1234567)
    const pick = (a) => a[Math.floor(rnd() * a.length)]
    const word = (n) =>
      Array.from({ length: n }, () => pick([...'abcd'])).join('')
    for (let k = 0; k < 500; k += 1) {
      const text = word(1 + Math.floor(rnd() * 30))
      const pattern = word(2 + Math.floor(rnd() * 6))
      const o = { distance: -pick([1, 5, 50]), location: pick([0, 5]) }
      expect(
        Fuse.match(pattern, text, { ...o, matchAlgorithm: 'myers' })
      ).toEqual(Fuse.match(pattern, text, { ...o, matchAlgorithm: 'bitap' }))
    }
  })

  test('non-integer location: myers returns the formula optimum', () => {
    // Bitap indexes its rows by location, so a fractional location can make it
    // miss a hit; Myers evaluates the formula at every start position.
    const o = { location: 2.5, distance: 10, isCaseSensitive: true }
    const text = 'abxcdefgh'
    const myers = Fuse.match('cde', text, { ...o, matchAlgorithm: 'myers' })
    expect(myers.isMatch).toBe(true)
    expect(myers.score).toBeCloseTo(
      oracleScore('cde', text, { ...o, threshold: 0.6 }),
      10
    )
  })
})

describe('convertMaskToIndices', async () => {
  const { default: convertMaskToIndices } =
    await import('../src/search/bitap/convertMaskToIndices')

  test('default path over a plain array is unchanged', () => {
    expect(convertMaskToIndices([0, 1, 1, 0, 1], 1)).toEqual([
      [1, 2],
      [4, 4]
    ])
    expect(convertMaskToIndices([0, 1, 1, 0, 1], 2)).toEqual([[1, 2]])
  })

  test('accepts a Uint8Array', () => {
    expect(convertMaskToIndices(new Uint8Array([1, 1, 0, 1]), 1)).toEqual([
      [0, 1],
      [3, 3]
    ])
  })

  test('honors [from, to) bounds', () => {
    const mask = new Uint8Array([0, 0, 1, 1, 1, 0, 1, 1])
    expect(convertMaskToIndices(mask, 1, 2, 6)).toEqual([[2, 4]])
    expect(convertMaskToIndices(mask, 1, 5, 8)).toEqual([[6, 7]])
    expect(convertMaskToIndices(mask, 1, 4, 4)).toEqual([])
  })
})
