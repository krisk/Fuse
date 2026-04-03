import Fuse from '../dist/fuse.mjs'

describe('Token search (per-term fuzzy + IDF)', () => {
  const docs = [
    { title: 'JavaScript: The Good Parts', body: 'A deep dive into the good parts of JavaScript' },
    { title: 'JavaScript Patterns', body: 'Exploring common patterns in JavaScript programming' },
    { title: 'Learning Python', body: 'A comprehensive guide to Python programming language' },
    { title: 'The Art of Computer Science', body: 'Fundamental concepts in computer science and algorithms' },
    { title: 'Programming Pearls', body: 'Classic programming problems and elegant solutions' }
  ]

  const options = {
    useTokenSearch: true,
    includeScore: true,
    keys: ['title', 'body']
  }

  test('Typo tolerance: "javascrpt paterns" finds "JavaScript Patterns"', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search('javascrpt paterns')

    expect(result.length).toBeGreaterThanOrEqual(1)
    const titles = result.map((r) => r.item.title)
    expect(titles).toContain('JavaScript Patterns')
  })

  test('Multi-term query matches documents with more matching terms', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search('JavaScript programming')

    expect(result.length).toBeGreaterThanOrEqual(2)
    // JS Patterns doc matches both terms (title + body), should rank high
    const topTitles = result.slice(0, 2).map((r) => r.item.title)
    expect(topTitles).toContain('JavaScript Patterns')
  })

  test('IDF weighting: rare terms rank higher', () => {
    const corpus = [
      { text: 'the cat sat on the mat' },
      { text: 'the dog sat on the log' },
      { text: 'the cat chased the dog' },
      { text: 'a rare unique zebra appeared' }
    ]

    const fuse = new Fuse(corpus, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text']
    })

    const result = fuse.search('zebra')
    expect(result.length).toBeGreaterThanOrEqual(1)
    // The exact-match doc should rank first
    expect(result[0].item.text).toContain('zebra')
  })

  test('IDF weighting with fuzzy: typo for rare term still matches', () => {
    const corpus = [
      { text: 'the cat sat on the mat' },
      { text: 'the dog sat on the log' },
      { text: 'a rare unique zebra appeared' }
    ]

    const fuse = new Fuse(corpus, {
      useTokenSearch: true,
      includeScore: true,
      keys: ['text']
    })

    const result = fuse.search('zebr')
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].item.text).toContain('zebra')
  })

  test('Partial matching: 2 of 3 terms still returns results', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search('JavaScript Python algorithms')

    // Multiple docs match at least one term
    expect(result.length).toBeGreaterThanOrEqual(2)
  })

  test('Case insensitive by default', () => {
    const fuse = new Fuse(docs, options)
    const upper = fuse.search('JAVASCRIPT')
    const lower = fuse.search('javascript')

    expect(upper.length).toBe(lower.length)
    expect(upper[0].item.title).toBe(lower[0].item.title)
  })

  test('Case sensitive when configured', () => {
    const fuse = new Fuse(docs, {
      ...options,
      isCaseSensitive: true
    })

    // "javascript" (lowercase) should not match "JavaScript" (capitalized)
    const result = fuse.search('javascript')
    // With fuzzy matching, no docs should have lowercase "javascript"
    const exactMatches = result.filter((r) => r.score < 0.01)
    expect(exactMatches.length).toBe(0)
  })

  test('Word order independence', () => {
    const fuse = new Fuse(docs, options)
    const a = fuse.search('patterns javascript')
    const b = fuse.search('javascript patterns')

    expect(a.length).toBe(b.length)
    expect(a[0].item.title).toBe(b[0].item.title)
    expect(a[0].score).toBeCloseTo(b[0].score, 5)
  })

  test('Long multi-word query works (>32 chars total)', () => {
    const fuse = new Fuse(docs, options)
    // 6 terms, well over 32 chars total
    const result = fuse.search('deep dive good parts javascript programming')

    expect(result.length).toBeGreaterThanOrEqual(1)
    // "The Good Parts" doc should rank high — matches many terms
    const titles = result.map((r) => r.item.title)
    expect(titles).toContain('JavaScript: The Good Parts')
  })

  test('includeMatches returns valid merged indices', () => {
    const fuse = new Fuse(docs, {
      ...options,
      includeMatches: true
    })

    const result = fuse.search('JavaScript patterns')
    expect(result.length).toBeGreaterThanOrEqual(1)

    const match = result.find((r) => r.item.title === 'JavaScript Patterns')
    expect(match).toBeDefined()
    expect(match.matches).toBeDefined()
    expect(match.matches.length).toBeGreaterThanOrEqual(1)

    // Check that indices are valid tuples
    for (const m of match.matches) {
      for (const [start, end] of m.indices) {
        expect(start).toBeGreaterThanOrEqual(0)
        expect(end).toBeGreaterThanOrEqual(start)
      }
    }
  })

  test('Scores are between 0 and 1', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search('JavaScript')

    result.forEach((r) => {
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(1)
    })
  })

  test('Non-matching query returns empty with strict threshold', () => {
    const fuse = new Fuse(docs, {
      ...options,
      threshold: 0.2
    })
    const result = fuse.search('xylophone')
    expect(result.length).toBe(0)
  })

  test('Empty query returns all docs', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search('')
    expect(result.length).toBe(docs.length)
  })

  test('String list search', () => {
    const list = [
      'apple banana cherry',
      'banana date elderberry',
      'cherry fig grape',
      'apple apple apple'
    ]

    const fuse = new Fuse(list, {
      useTokenSearch: true,
      includeScore: true,
      threshold: 0.2
    })

    const result = fuse.search('apple')
    expect(result.length).toBe(2)
  })

  test('add() updates the inverted index', () => {
    const fuse = new Fuse(docs, options)

    // "Ruby" not in corpus — no exact or close fuzzy match
    let result = fuse.search('Ruby')
    const beforeCount = result.length

    fuse.add({ title: 'Programming Ruby', body: 'The definitive guide to Ruby programming' })

    result = fuse.search('Ruby')
    expect(result.length).toBeGreaterThan(beforeCount)
    expect(result[0].item.title).toBe('Programming Ruby')
  })

  test('remove() updates the inverted index', () => {
    const fuse = new Fuse([...docs], options)

    let result = fuse.search('Python')
    const beforeCount = result.length
    expect(beforeCount).toBeGreaterThanOrEqual(1)
    expect(result[0].item.title).toBe('Learning Python')

    fuse.remove((doc) => doc.title === 'Learning Python')

    result = fuse.search('Python')
    expect(result.length).toBeLessThan(beforeCount)
  })

  test('limit option works', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search('programming', { limit: 2 })
    expect(result.length).toBe(2)
  })

  test('weighted keys affect ranking', () => {
    const fuse = new Fuse(docs, {
      useTokenSearch: true,
      includeScore: true,
      keys: [
        { name: 'title', weight: 2 },
        { name: 'body', weight: 1 }
      ]
    })

    const result = fuse.search('programming')
    // "Programming Pearls" has the term in the title (weighted higher)
    expect(result[0].item.title).toBe('Programming Pearls')
  })
})
