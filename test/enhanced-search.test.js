const Fuse = require('../dist/fuse')

describe('Searching using extended search', () => {
  const list = [
    {
      text: 'hello word'
    },
    {
      text: 'how are you'
    },
    {
      text: 'indeed fine hello foo'
    },
    {
      text: 'I am fine'
    }
  ]

  const options = {
    useExtendedSearch: true,
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 0,
    minMatchCharLength: 4,
    keys: ['text']
  }
  const fuse = new Fuse(list, options)

  test('Search: exact-match', () => {
    let result = fuse.search("'hello")
    expect(result.length).toBe(2)
    expect(result[0].item.text).toBe('hello word')
  })

  test('Search: prefix-exact-match', () => {
    let result = fuse.search('^hello')
    expect(result.length).toBe(1)
    expect(result[0].item.text).toBe('hello word')
  })

  test('Search: suffix-exact-match', () => {
    let result = fuse.search('fine$')
    expect(result.length).toBe(1)
    expect(result[0].item.text).toBe('I am fine')
  })

  test('Search: inverse-exact-match', () => {
    let result = fuse.search('!indeed')
    expect(result.length).toBe(3)
  })

  test('Search: inverse-prefix-exact-match', () => {
    let result = fuse.search('!^hello')
    expect(result.length).toBe(3)
  })

  test('Search: inverse-suffix-exact-match', () => {
    let result = fuse.search('!foo$')
    expect(result.length).toBe(3)
  })

  test('Search: all', () => {
    let result = fuse.search('!foo$ !^how')
    expect(result.length).toBe(2)
  })

  test('Search: literal', () => {
    let result = fuse.search('\'"indeed fine"')
    expect(result.length).toBe(1)
  })

  test('Search: literal', () => {
    let result = fuse.search('\'"indeed fine" foo$ | \'are')
    expect(result.length).toBe(2)
  })
})
