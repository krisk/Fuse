const Fuse = require('../dist/fuse')
const Books = require('./fixtures/books.json')

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
  })
})
