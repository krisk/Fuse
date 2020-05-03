const Fuse = require('../dist/fuse')
const Books = require('./fixtures/books.json')

const util = require('util')

const print = (result) => {
  console.log(util.inspect(result, false, null, true /* enable colors */))
}

const idx = (result) => result.map((obj) => obj.refIndex)

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

    expect(myIndex.index).toBeDefined()
    expect(myIndex.keys).toBeDefined()
  })

  test('Fuse can be instantiated with an index', () => {
    let myIndex = Fuse.createIndex(options.keys, Books)
    const fuse = new Fuse(Books, options, myIndex)

    let result = fuse.search({ title: 'old man' })

    expect(result.length).toBe(1)
    expect(result[0].refIndex).toBe(0)
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
    const fruits = ['apple', 'oranges']
    const fuse = new Fuse(fruits, { includeScore: true })

    fuse.add('banana')

    let result = fuse.search('banana')

    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([fruits.length - 1])
  })
})
