import Fuse from '../dist/fuse.mjs'

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

describe('ignoreLocation when useExtendedSearch is true', () => {
  const list = [
    {
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum apple.'
    }
  ]

  test('Search: literal match with fuzzy match', () => {
    const options = {
      threshold: 0.2,
      useExtendedSearch: true,
      ignoreLocation: true,
      keys: ['document']
    }
    const fuse = new Fuse(list, options)

    let result = fuse.search('Apple')
    expect(result).toHaveLength(1)
  })
})

describe('Searching using extended search ignoring diactrictics', () => {
  const list = [
    {
      text: 'déjà'
    },
    {
      text: 'cafe'
    }
  ]

  const options = {
    useExtendedSearch: true,
    ignoreDiacritics: true,
    threshold: 0,
    keys: ['text']
  }
  const fuse = new Fuse(list, options)

  test('Search: query with diactrictics, list with diactrictics', () => {
    let result = fuse.search('déjà')
    expect(result).toHaveLength(1)
    expect(result[0].refIndex).toBe(0)
  })

  test('Search: query without diactrictics, list with diactrictics', () => {
    let result = fuse.search('deja')
    expect(result).toHaveLength(1)
    expect(result[0].refIndex).toBe(0)
  })

  test('Search: query with diactrictics, list without diactrictics', () => {
    let result = fuse.search('café')
    expect(result).toHaveLength(1)
    expect(result[0].refIndex).toBe(1)
  })

  test('Search: query without diactrictics, list without diactrictics', () => {
    let result = fuse.search('cafe')
    expect(result).toHaveLength(1)
    expect(result[0].refIndex).toBe(1)
  })
})
