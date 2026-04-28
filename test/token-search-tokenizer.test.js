import Fuse from '../dist/fuse.mjs'
import { createAnalyzer } from '../src/search/token/analyzer'

describe('Token search — custom tokenizer (regex form)', () => {
  test('regex form lets node.js, c++, U.S.A be searchable as single tokens', () => {
    const docs = [
      { text: 'I love node.js for backend work' },
      { text: 'C++ is a fast systems language' },
      { text: 'I visited the U.S.A last summer' },
      { text: 'Plain JavaScript everywhere' }
    ]
    const fuse = new Fuse(docs, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text'],
      tokenize: /[\w.+-]+/g
    })

    const node = fuse.search('node.js')
    expect(node.length).toBeGreaterThanOrEqual(1)
    expect(node[0].item.text).toContain('node.js')

    const cpp = fuse.search('c++')
    expect(cpp.length).toBeGreaterThanOrEqual(1)
    expect(cpp[0].item.text).toContain('C++')

    const usa = fuse.search('U.S.A')
    expect(usa.length).toBeGreaterThanOrEqual(1)
    expect(usa[0].item.text).toContain('U.S.A')
  })

  test('default regex still drops dots (preserves backward-compatible Latin behavior for "node.js" splits)', () => {
    // Default tokenizer is /[\p{L}\p{M}\p{N}_]+/gu — `.` is not a word char,
    // so `node.js` tokenizes to ['node', 'js']. Document this so users know
    // when to reach for the custom regex.
    const docs = [{ text: 'node.js backend' }]
    const fuse = new Fuse(docs, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text']
    })
    // 'node' alone matches because it's a token
    expect(fuse.search('node').length).toBeGreaterThanOrEqual(1)
  })
})

describe('Token search — default unicode-aware tokenizer', () => {
  // These tests inspect the analyzer's tokens directly, not just end-to-end
  // search results. End-to-end search runs Bitap against raw field text, so
  // it would still find docs even with a mark-dropping regex; only direct
  // tokenizer inspection proves \p{M} is genuinely in the default.

  test('default analyzer keeps CJK as a single token (was [] under old /\\b\\w+\\b/g)', () => {
    const a = createAnalyzer()
    expect(a.tokenize('东京は素晴らしい')).toEqual(['东京は素晴らしい'])
  })

  test('default analyzer keeps Devanagari combining marks attached', () => {
    // Without \p{M}, हिन्दी splits into ['ह','न','द'] (mark-stripping shatters
    // the syllable cluster). With \p{M}, the whole word stays one token.
    const a = createAnalyzer()
    expect(a.tokenize('हिन्दी')).toEqual(['हिन्दी'])
  })

  test('default analyzer preserves NFD-normalized Latin combining marks', () => {
    // 'café'.normalize('NFD') is 'cafe' + U+0301. Without \p{M}, the regex
    // returns ['cafe'] (mark stripped). With \p{M}, the NFD token is kept;
    // it round-trips to 'café' under NFC.
    const nfd = 'café'.normalize('NFD')
    expect(nfd).not.toBe('café'.normalize('NFC')) // sanity: actually NFD
    // Analyzer lowercases by default; café is unchanged by toLowerCase.
    const tokens = createAnalyzer().tokenize(nfd)
    expect(tokens).toHaveLength(1)
    expect(tokens[0]).not.toBe('cafe')
    expect(tokens[0].normalize('NFC')).toBe('café')
  })

  test('default analyzer end-to-end: CJK doc is now indexable (was empty df)', () => {
    const docs = [{ text: '东京は素晴らしい' }]
    const fuse = new Fuse(docs, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text']
    })
    // Old default returned [] for CJK so df was empty; new default registers
    // the term in df. We can verify via _invertedIndex.df.
    expect(fuse._invertedIndex.df.size).toBeGreaterThan(0)
    const result = fuse.search('东京は素晴らしい')
    expect(result.length).toBe(1)
  })
})

describe('Token search — function tokenizer', () => {
  test('function tokenizer is exercised on a fixture (Intl.Segmenter optional)', () => {
    const docs = [
      { text: '我喜欢北京' },
      { text: '東京タワー' },
      { text: 'Hello World' }
    ]
    let calls = 0
    const fuse = new Fuse(docs, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text'],
      tokenize: (text) => {
        calls++
        // Trivial per-character segmenter; a real user would pass
        // Intl.Segmenter with isWordLike filtering.
        return Array.from(text).filter((c) => /[\p{L}\p{M}\p{N}]/u.test(c))
      }
    })
    expect(calls).toBeGreaterThan(0)

    const result = fuse.search('北京')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.text).toBe('我喜欢北京')
  })

  test.skipIf(typeof Intl === 'undefined' || typeof Intl.Segmenter === 'undefined')(
    'Intl.Segmenter recipe with isWordLike filter segments Chinese into words',
    () => {
      const docs = [
        { text: '我喜欢北京的故宫博物院' },
        { text: '今天天气很好' },
        { text: 'JavaScript everywhere' }
      ]
      const fuse = new Fuse(docs, {
        useTokenSearch: true,
        includeScore: true,
        keys: ['text'],
        tokenize: (text) => {
          const seg = new Intl.Segmenter('zh', { granularity: 'word' })
          return Array.from(seg.segment(text), (s) => (s.isWordLike ? s.segment : null)).filter(
            Boolean
          )
        }
      })

      const result = fuse.search('北京')
      expect(result.length).toBeGreaterThanOrEqual(1)
      expect(result[0].item.text).toBe('我喜欢北京的故宫博物院')
    }
  )
})

describe('Token search — index/query tokenizer parity', () => {
  test('same custom tokenizer applied at index time and query time', () => {
    const docs = [{ text: 'node.js c++ U.S.A' }]
    const calls = []
    const fuse = new Fuse(docs, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text'],
      tokenize: (text) => {
        calls.push(text)
        return text.match(/[\w.+-]+/g) || []
      }
    })
    // Build-time call (one field) is in calls already.
    const buildCalls = calls.length
    expect(buildCalls).toBeGreaterThanOrEqual(1)

    const result = fuse.search('node.js')
    expect(result.length).toBe(1)
    // Query-time also invoked the same tokenizer.
    expect(calls.length).toBeGreaterThan(buildCalls)
  })
})

describe('Token search — add() respects custom tokenizer', () => {
  test('docs added post-construction are retrievable via the same tokenizer', () => {
    const fuse = new Fuse(
      [{ text: 'initial doc' }],
      {
        useTokenSearch: true,
        includeScore: true,
        keys: ['text'],
        tokenize: /[\w.+-]+/g
      }
    )
    fuse.add({ text: 'now uses node.js' })
    const result = fuse.search('node.js')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.text).toContain('node.js')
  })
})

describe('Token search — remove() under custom tokenizer keeps stats correct', () => {
  test('removeAt drops df contributions from the right doc', () => {
    const fuse = new Fuse(
      [
        { text: 'node.js one' },
        { text: 'node.js two' },
        { text: 'node.js three' }
      ],
      {
        useTokenSearch: true,
        includeScore: true,
        keys: ['text'],
        tokenize: /[\w.+-]+/g
      }
    )
    expect(fuse.search('node.js').length).toBe(3)
    fuse.removeAt(1)
    const after = fuse.search('node.js')
    expect(after.length).toBe(2)
    expect(after.map((r) => r.item.text)).not.toContain('node.js two')
  })
})

describe('Token search — dev-mode validation', () => {
  const ORIG_ENV = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = ORIG_ENV
  })

  test('dev-mode warns once when tokenize is a non-global regex', async () => {
    process.env.NODE_ENV = 'development'
    const warnings = []
    const origWarn = console.warn
    console.warn = (...args) => warnings.push(args.join(' '))
    try {
      // Re-import a fresh module copy so the warned-set is fresh and the
      // dev-mode env is read at module-eval time. We import the source
      // entry rather than dist because dist hardcodes NODE_ENV at build.
      const { createAnalyzer } = await import('../src/search/token/analyzer.ts?dev-warn-once')
      const a = createAnalyzer({ tokenize: /[a-z]+/ }) // missing /g
      a.tokenize('hello world')
      a.tokenize('hello world') // same regex — should not double-warn
      expect(warnings.some((w) => /global flag/i.test(w))).toBe(true)
      const matching = warnings.filter((w) => /global flag/i.test(w))
      expect(matching.length).toBe(1)
    } finally {
      console.warn = origWarn
    }
  })

  test('dev-mode throws when function tokenizer returns non-array', async () => {
    process.env.NODE_ENV = 'development'
    const { createAnalyzer } = await import('../src/search/token/analyzer.ts?dev-throw-nonarray')
    const a = createAnalyzer({
      tokenize: () => 'not-an-array'
    })
    expect(() => a.tokenize('hello')).toThrowError(/string\[\]/)
  })

  test('dev-mode throws when function tokenizer returns array containing non-strings', async () => {
    process.env.NODE_ENV = 'development'
    const { createAnalyzer } = await import('../src/search/token/analyzer.ts?dev-throw-nonstring')
    const a = createAnalyzer({
      tokenize: () => ['ok', 42, 'also-ok']
    })
    expect(() => a.tokenize('hello')).toThrowError(/string\[\]/)
  })
})
