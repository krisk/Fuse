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
    includeMatches: true,
    includeScore: true,
    threshold: 0.5,
    minMatchCharLength: 4,
    keys: ['text']
  }
  const fuse = new Fuse(list, options)

  test('Search: exact-match', () => {
    let result = fuse.search("'hello")
    expect(result.length).toBe(2)
    expect(result[0].item.text).toBe('hello word')
    expect(result[0].matches[0].indices).toMatchObject([[0, 4]])
    expect(result[1].matches[0].indices).toMatchObject([[12, 16]])
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
    expect(result[0].matches[0].indices).toMatchObject([[5, 8]])
  })

  test('Search: inverse-exact-match', () => {
    let result = fuse.search('!indeed')
    expect(result.length).toBe(3)
    expect(result[0].matches[0].indices).toMatchObject([[0, 9]])
    expect(result[1].matches[0].indices).toMatchObject([[0, 10]])
    expect(result[2].matches[0].indices).toMatchObject([[0, 8]])
  })

  test('Search: inverse-prefix-exact-match', () => {
    let result = fuse.search('!^hello')
    expect(result.length).toBe(3)
    expect(result[0].refIndex).toBe(1)
    expect(result[1].refIndex).toBe(3)
    expect(result[2].refIndex).toBe(2)

    expect(result[0].matches[0].indices).toMatchObject([[0, 10]])
    expect(result[1].matches[0].indices).toMatchObject([[0, 8]])
    expect(result[2].matches[0].indices).toMatchObject([[0, 20]])
  })

  test('Search: inverse-suffix-exact-match', () => {
    let result = fuse.search('!foo$')
    expect(result.length).toBe(3)
    expect(result[0].matches[0].indices).toMatchObject([[0, 9]])
    expect(result[1].matches[0].indices).toMatchObject([[0, 10]])
    expect(result[2].matches[0].indices).toMatchObject([[0, 8]])
  })

  test('Search: all', () => {
    let result = fuse.search('!foo$ !^how')
    expect(result.length).toBe(2)
  })

  test('Search: single literal match', () => {
    let result = fuse.search('\'"indeed fine"')
    expect(result.length).toBe(1)
    expect(result[0].matches[0].indices).toMatchObject([[0, 10]])
  })

  test('Search: literal match with regular match', () => {
    let result = fuse.search('\'"indeed fine" foo$ | \'are')
    expect(result.length).toBe(2)
    expect(result[0].matches[0].indices).toMatchObject([
      [0, 10],
      [18, 20]
    ])
    expect(result[1].matches[0].indices).toMatchObject([[4, 6]])
  })

  test('Search: literal match with fuzzy match', () => {
    let result = fuse.search('\'"indeed fine" foo$ | helol')
    expect(result.length).toBe(2)
    expect(result[0].matches[0].indices).toMatchObject([[0, 4]])
    expect(result[1].matches[0].indices).toMatchObject([
      [0, 10],
      [18, 20]
    ])
  })
})
