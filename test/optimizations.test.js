import Fuse from '../dist/fuse.mjs'

const books = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { title: '1984', author: 'George Orwell' },
  { title: 'Pride and Prejudice', author: 'Jane Austen' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { title: 'Lord of the Flies', author: 'William Golding' },
  { title: 'Animal Farm', author: 'George Orwell' },
  { title: 'Brave New World', author: 'Aldous Huxley' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury' }
]

const fruits = ['apple', 'orange', 'banana', 'pear', 'grape', 'kiwi', 'mango', 'plum']

// ----------------------------
// MaxHeap / limit tests
// ----------------------------
describe('Search with limit', () => {
  const fuse = new Fuse(fruits)

  test('limit=3 returns exactly 3 results', () => {
    const results = fuse.search('an', { limit: 3 })
    expect(results).toHaveLength(3)
  })

  test('limit larger than result count returns all matches', () => {
    const results = fuse.search('apple', { limit: 100 })
    expect(results.length).toBeGreaterThan(0)
    expect(results.length).toBeLessThanOrEqual(fruits.length)
  })

  test('limit=1 returns best match', () => {
    const all = fuse.search('orange')
    const limited = fuse.search('orange', { limit: 1 })
    expect(limited).toHaveLength(1)
    expect(limited[0].refIndex).toBe(all[0].refIndex)
  })

  test('limit results match top-N of unlimited results', () => {
    const all = fuse.search('an')
    const limited = fuse.search('an', { limit: 3 })
    expect(limited).toHaveLength(3)
    for (let i = 0; i < 3; i++) {
      expect(limited[i].refIndex).toBe(all[i].refIndex)
    }
  })
})

describe('Search with limit on object list', () => {
  const fuse = new Fuse(books, {
    keys: ['title', 'author'],
    includeScore: true
  })

  test('limit=2 returns 2 results', () => {
    const results = fuse.search('the', { limit: 2 })
    expect(results).toHaveLength(2)
  })

  test('limit results have same scores as unlimited top-N', () => {
    const all = fuse.search('George')
    const limited = fuse.search('George', { limit: 2 })
    expect(limited).toHaveLength(2)
    for (let i = 0; i < limited.length; i++) {
      expect(limited[i].score).toBeCloseTo(all[i].score, 10)
    }
  })

  test('limit=5 with includeMatches', () => {
    const fuse2 = new Fuse(books, {
      keys: ['title', 'author'],
      includeMatches: true
    })
    const results = fuse2.search('the', { limit: 5 })
    expect(results.length).toBeLessThanOrEqual(5)
    results.forEach((r) => {
      expect(r.matches).toBeDefined()
      expect(r.matches.length).toBeGreaterThan(0)
    })
  })
})

// ----------------------------
// Batch remove tests
// ----------------------------
describe('Batch remove', () => {
  test('remove non-contiguous items', () => {
    const fuse = new Fuse([...fruits])
    // Remove first, third, and fifth items
    const removed = fuse.remove((doc, i) => i === 0 || i === 2 || i === 4)
    expect(removed).toEqual(['apple', 'banana', 'grape'])
    expect(fuse.getIndex().size()).toBe(5)
    expect(fuse._docs).toEqual(['orange', 'pear', 'kiwi', 'mango', 'plum'])

    // Verify re-indexing: indices should be 0..4
    const records = fuse.getIndex().records
    records.forEach((r, idx) => {
      expect(r.i).toBe(idx)
    })
  })

  test('remove all items', () => {
    const fuse = new Fuse([...fruits])
    const removed = fuse.remove(() => true)
    expect(removed).toHaveLength(fruits.length)
    expect(fuse.getIndex().size()).toBe(0)
    expect(fuse._docs).toEqual([])
  })

  test('remove single item via predicate', () => {
    const fuse = new Fuse([...fruits])
    fuse.remove((doc) => doc === 'kiwi')
    expect(fuse._docs).not.toContain('kiwi')
    expect(fuse.getIndex().size()).toBe(fruits.length - 1)
  })

  test('search works correctly after batch remove', () => {
    const fuse = new Fuse([...fruits])
    fuse.remove((doc) => doc === 'apple' || doc === 'orange')
    const results = fuse.search('banana')
    expect(results).toHaveLength(1)
    expect(results[0].item).toBe('banana')
  })

  test('batch remove from object list', () => {
    const fuse = new Fuse([...books], { keys: ['title', 'author'], threshold: 0.2 })
    const before = fuse.search('Orwell')
    expect(before.length).toBeGreaterThan(0)

    const removed = fuse.remove((doc) => doc.author === 'George Orwell')
    expect(removed).toHaveLength(2)

    const after = fuse.search('Orwell')
    expect(after).toHaveLength(0)
  })
})

// ----------------------------
// Fuse.use() plugin registration
// ----------------------------
describe('Fuse.use()', () => {
  test('registers a custom searcher plugin', () => {
    // Create a mock searcher that always matches
    class AlwaysMatch {
      constructor(pattern) {
        this.pattern = pattern
      }
      static condition(_, options) {
        return options.useAlwaysMatch
      }
      searchIn() {
        return { isMatch: true, score: 0.5, indices: [[0, 0]] }
      }
    }

    Fuse.use(AlwaysMatch)

    const fuse = new Fuse(['hello', 'world'], {
      useAlwaysMatch: true,
      includeScore: true
    })
    const results = fuse.search('zzz')
    // AlwaysMatch should match everything
    expect(results).toHaveLength(2)
  })
})

// ----------------------------
// Searcher cache tests
// ----------------------------
describe('Searcher cache', () => {
  test('repeated searches with same query return consistent results', () => {
    const fuse = new Fuse(fruits)
    const r1 = fuse.search('apple')
    const r2 = fuse.search('apple')
    expect(r1).toEqual(r2)
  })

  test('different queries return different results', () => {
    const fuse = new Fuse(fruits)
    const r1 = fuse.search('apple')
    const r2 = fuse.search('orange')
    expect(r1).not.toEqual(r2)
  })

  test('search works correctly after setCollection', () => {
    const fuse = new Fuse(fruits)
    const r1 = fuse.search('apple')
    expect(r1.length).toBeGreaterThan(0)

    fuse.setCollection(['cat', 'dog', 'bird'])
    const r2 = fuse.search('apple')
    // apple should not be found in the new collection
    expect(r2).toHaveLength(0)

    const r3 = fuse.search('cat')
    expect(r3.length).toBeGreaterThan(0)
  })

  test('search works correctly after add', () => {
    const fuse = new Fuse([...fruits])
    const r1 = fuse.search('watermelon')
    fuse.add('watermelon')
    const r2 = fuse.search('watermelon')
    expect(r2.length).toBeGreaterThan(r1.length)
  })
})
