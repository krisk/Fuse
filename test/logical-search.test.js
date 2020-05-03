const Fuse = require('../dist/fuse')
const Books = require('./fixtures/books.json')

const util = require('util')

const print = (result) => {
  console.log(util.inspect(result, false, null, true /* enable colors */))
}

const idx = (result) => result.map((obj) => obj.refIndex)

describe('Searching using logical search', () => {
  const options = {
    useExtendedSearch: true,
    includeMatches: true,
    includeScore: true,
    keys: ['title', 'author.firstName', 'author.lastName']
  }
  const fuse = new Fuse(Books, options)

  test('Search: implicit AND', () => {
    let result = fuse.search({ title: 'old man' })
    expect(result.length).toBe(1)
    expect(result[0].refIndex).toBe(0)
    expect(result[0].matches[0].indices).toMatchObject([
      [0, 2],
      [4, 6]
    ])
  })

  test('Search: AND with single item', () => {
    let result = fuse.search({ $and: [{ title: 'old man' }] })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
    expect(result[0].matches[0].indices).toMatchObject([
      [0, 2],
      [4, 6]
    ])
  })

  test('Search: AND with multiple entries', () => {
    let result = fuse.search({
      $and: [{ 'author.lastName': 'Woodhose' }, { title: 'the' }]
    })
    expect(result.length).toBe(2)
    expect(idx(result)).toMatchObject([4, 5])
  })

  test('Search: AND with multiple entries + exact match', () => {
    let result = fuse.search({
      $and: [{ 'author.lastName': 'Woodhose' }, { title: "'The" }]
    })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([4])
  })

  test('Search: OR with multiple entries', () => {
    let result = fuse.search({
      $or: [{ title: 'angls' }, { title: 'incmpetnce' }]
    })
    expect(result.length).toBe(3)
    expect(idx(result)).toMatchObject([14, 7, 0])
  })

  test('Search: OR with multiple entries', () => {
    let result = fuse.search({
      $or: [
        { title: 'angls' },
        { $and: [{ title: '!dwarf' }, { title: 'bakwrds' }] }
      ]
    })
    expect(result.length).toBe(2)
    expect(idx(result)).toMatchObject([7, 0])
  })
})
