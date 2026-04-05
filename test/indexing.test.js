import Fuse from '../dist/fuse.mjs'
import Books from './fixtures/books.json' assert { type: 'json' }

const idx = (result) => result.map((obj) => obj.refIndex)
const idxMap = (fuse) => fuse.getIndex().records.map((item) => [item.v, item.i])

describe('Searching', () => {
  const options = {
    useExtendedSearch: true,
    includeMatches: true,
    includeScore: true,
    threshold: 0.3,
    keys: ['title', 'author.firstName', 'author.lastName']
  }

  test('createIndex: ensure properties exist', () => {
    let myIndex = Fuse.createIndex(options.keys, Books)

    expect(myIndex.records).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('createIndex: ensure keys can be created with objects', () => {
    let myIndex = Fuse.createIndex(
      [{ name: 'title' }, { name: 'author.firstName' }],
      Books
    )
    expect(myIndex.records).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('createIndex: ensure keys can be created with getFn', () => {
    let myIndex = Fuse.createIndex(
      [
        { name: 'title', getFn: (book) => book.title },
        { name: 'author.firstName', getFn: (book) => book.author.firstName }
      ],
      Books
    )
    expect(myIndex.records).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('parseIndex: ensure index can be exported and Fuse can be initialized', () => {
    const myIndex = Fuse.createIndex(options.keys, Books)
    expect(myIndex.size()).toBe(Books.length)

    const data = myIndex.toJSON()
    expect(data.records).toBeDefined()
    expect(data.keys).toBeDefined()

    const parsedIndex = Fuse.parseIndex(data)
    expect(parsedIndex.size()).toBe(Books.length)

    const fuse = new Fuse(Books, options, parsedIndex)
    const result = fuse.search({ title: 'old man' })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
  })

  test('parseIndex: search with getFn', () => {
    const fuse = new Fuse(Books, {
      useExtendedSearch: true,
      includeMatches: true,
      includeScore: true,
      threshold: 0.3,
      keys: [
        { name: 'bookTitle', getFn: (book) => book.title },
        { name: 'authorName', getFn: (book) => book.author.firstName }
      ]
    })
    const result = fuse.search({ bookTitle: 'old man' })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
  })

  test('toJSON: strips getFn from keys for serialization', () => {
    const myIndex = Fuse.createIndex(
      [
        { name: 'title', getFn: (book) => book.title },
        { name: 'author.firstName' }
      ],
      Books
    )
    const data = myIndex.toJSON()

    // getFn should not appear in any key
    data.keys.forEach((key) => {
      expect(key).not.toHaveProperty('getFn')
    })

    // Should be safe to serialize (no functions)
    expect(() => JSON.parse(JSON.stringify(data))).not.toThrow()

    // Should still be parseable
    const parsedIndex = Fuse.parseIndex(data)
    expect(parsedIndex.size()).toBe(Books.length)
  })

  test('Fuse can be instantiated with an index', () => {
    let myIndex = Fuse.createIndex(options.keys, Books)
    const fuse = new Fuse(Books, options, myIndex)

    let result = fuse.search({ title: 'old man' })

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
    expect(result[0].matches[0].indices).toMatchObject([
      [0, 2],
      [4, 6]
    ])
  })

  test('Throws on invalid index format', () => {
    expect(() => {
      new Fuse(Books, options, [])
    }).toThrow()
  })

  test('Add object to Index', () => {
    const fuse = new Fuse(Books, options)

    fuse.add({
      title: 'book',
      author: {
        firstName: 'Kiro',
        lastName: 'Risk'
      }
    })

    let result = fuse.search('kiro')

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([Books.length - 1])
  })

  test('Add string to Index', () => {
    const fruits = ['apple', 'orange']
    const fuse = new Fuse(fruits, { includeScore: true })

    fuse.add('banana')

    let result = fuse.search('banana')

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([2])
  })

  test('Remove string from the Index', () => {
    const fruits = ['apple', 'orange', 'banana', 'pear']
    const fuse = new Fuse(fruits)

    expect(fuse.getIndex().size()).toBe(4)
    expect(idxMap(fuse)).toMatchObject([
      ['apple', 0],
      ['orange', 1],
      ['banana', 2],
      ['pear', 3]
    ])

    fuse.removeAt(1)

    expect(fuse.getIndex().size()).toBe(3)
    expect(idxMap(fuse)).toMatchObject([
      ['apple', 0],
      ['banana', 1],
      ['pear', 2]
    ])

    const results = fuse.remove((doc) => {
      return doc === 'banana' || doc === 'pear'
    })

    expect(results.length).toBe(2)
    expect(fuse.getIndex().size()).toBe(1)
    expect(fuse._docs.length).toBe(1)
  })

  test('removeAll: batch removal preserves correct indices', () => {
    const fruits = ['apple', 'orange', 'banana', 'pear', 'grape']
    const fuse = new Fuse(fruits)

    // Remove indices 1 (orange) and 3 (pear)
    fuse.remove((doc) => doc === 'orange' || doc === 'pear')

    expect(fuse.getIndex().size()).toBe(3)
    expect(idxMap(fuse)).toMatchObject([
      ['apple', 0],
      ['banana', 1],
      ['grape', 2]
    ])
  })

  test('removeAll: removing all items leaves empty index', () => {
    const fruits = ['apple', 'orange']
    const fuse = new Fuse(fruits)

    fuse.remove(() => true)

    expect(fuse.getIndex().size()).toBe(0)
    expect(fuse._docs.length).toBe(0)
  })

  test('removeAll: search works correctly after batch removal', () => {
    const fruits = ['apple', 'orange', 'banana', 'pear', 'grape']
    const fuse = new Fuse(fruits, { includeScore: true })

    fuse.remove((doc) => doc === 'apple' || doc === 'banana' || doc === 'grape')

    const result = fuse.search('orange')
    expect(result.length).toBe(1)
    expect(result[0].item).toBe('orange')
  })
})
