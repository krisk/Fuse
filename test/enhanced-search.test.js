const Fuse = require('./base')
const books = require('./fixtures/books.json')
const { get } = require('../src/utils')

const verbose = false

const defaultList = ['Apple', 'Orange', 'Banana']
const defaultOptions = {
  location: 0,
  distance: 100,
  threshold: 0.6,
  isCaseSensitive: false,
  tokenSeparator: / +/g,
  findAllMatches: false,
  minMatchCharLength: 1,
  id: null,
  keys: [],
  shouldSort: true,
  getFn: get,
  sortFn: (a, b) => (a.score - b.score),
  matchAllTokens: false,
  includeMatches: false,
  includeScore: false,
  useExtendedSearch: true,
  verbose
}

const setup = (itemList, overwriteOptions) => {
  const list = itemList || defaultList
  const options = { ...defaultOptions, ...overwriteOptions }

  return new Fuse(list, options)
}

describe('Searching using plugins', () => {
  const list = [{
    text: 'hello word'
  }, {
    text: 'how are you'
  }, {
    text: 'indeed fine hello foo'
  }, {
    text: 'I am fine'
  }]

  const options = {
    useExtendedSearch: true,
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 0,
    minMatchCharLength: 4,
    keys: [
      'text'
    ]
  }
  const fuse = new Fuse(list, options)

  test('Search: exact-match', () => {
    let result = fuse.search("'hello")
    expect(result.length).toBe(2)
    expect(result[0].text).toBe('hello word')
  })

  test('Search: prefix-exact-match', () => {
    let result = fuse.search("^hello")
    expect(result.length).toBe(1)
    expect(result[0].text).toBe('hello word')
  })

  test('Search: suffix-exact-match', () => {
    let result = fuse.search("fine$")
    expect(result.length).toBe(1)
    expect(result[0].text).toBe('I am fine')
  })

  test('Search: inverse-exact-match', () => {
    let result = fuse.search("!indeed")
    expect(result.length).toBe(3)
  })

  test('Search: inverse-prefix-exact-match', () => {
    let result = fuse.search("!^hello")
    expect(result.length).toBe(3)
  })

  test('Search: inverse-suffix-exact-match', () => {
    let result = fuse.search("!foo$")
    expect(result.length).toBe(3)
  })

  test('Search: all', () => {
    let result = fuse.search("!foo$ !^how")
    expect(result.length).toBe(2)
  })
})
