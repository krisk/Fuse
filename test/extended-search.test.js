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
    },
    {
      text: 'smithee'
    },
    {
      text: 'smith'
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
    let result = fuse.search('=smith')
    expect(result).toMatchSnapshot()
  })

  test('Search: include-match', () => {
    let result = fuse.search("'hello")
    expect(result).toMatchSnapshot()
  })

  test('Search: prefix-exact-match', () => {
    let result = fuse.search('^hello')
    expect(result).toMatchSnapshot()
  })

  test('Search: suffix-exact-match', () => {
    let result = fuse.search('fine$')
    expect(result).toMatchSnapshot()
  })

  test('Search: inverse-exact-match', () => {
    let result = fuse.search('!indeed')
    expect(result).toMatchSnapshot()
  })

  test('Search: inverse-prefix-exact-match', () => {
    let result = fuse.search('!^hello')
    expect(result).toMatchSnapshot()
  })

  test('Search: inverse-suffix-exact-match', () => {
    let result = fuse.search('!foo$')
    expect(result).toMatchSnapshot()
  })

  test('Search: all', () => {
    let result = fuse.search('!foo$ !^how')
    expect(result).toMatchSnapshot()
  })

  test('Search: single literal match', () => {
    let result = fuse.search('\'"indeed fine"')
    expect(result).toMatchSnapshot()
  })

  test('Search: literal match with regular match', () => {
    let result = fuse.search('\'"indeed fine" foo$ | \'are')
    expect(result).toMatchSnapshot()
  })

  test('Search: literal match with fuzzy match', () => {
    let result = fuse.search('\'"indeed fine" foo$ | helol')
    expect(result).toMatchSnapshot()
  })
})
