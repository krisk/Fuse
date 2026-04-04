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

describe('Inverse patterns across multiple keys', () => {
  const list = [
    { title: 'Maple Syrup Pancakes', author: 'Chef Bob' },
    { title: 'Grilled Chicken', author: 'Chef Syrup' },
    { title: 'Apple Pie', author: 'Baker Joe' },
    { title: 'Syrup Waffles', author: 'Chef Ann' }
  ]

  const options = {
    useExtendedSearch: true,
    keys: ['title', 'author']
  }
  const fuse = new Fuse(list, options)

  test('Search: !Syrup excludes items containing Syrup in any key', () => {
    const result = fuse.search('!Syrup')
    expect(result).toHaveLength(1)
    expect(result[0].item.title).toBe('Apple Pie')
  })

  test('Search: !^Chef excludes items starting with Chef in any key', () => {
    const result = fuse.search('!^Chef')
    expect(result).toHaveLength(1)
    expect(result[0].item.author).toBe('Baker Joe')
  })

  test('Search: !Pancakes$ excludes items ending with Pancakes in any key', () => {
    const result = fuse.search('!Pancakes$')
    expect(result).toHaveLength(3)
    result.forEach((r) => {
      expect(r.item.title).not.toBe('Maple Syrup Pancakes')
    })
  })

  test('Search: positive patterns still use ANY-key aggregation', () => {
    const list2 = [
      { title: 'hello world', author: 'Bob' },
      { title: 'goodbye', author: 'hello person' },
      { title: 'nothing', author: 'nobody' }
    ]
    const fuse2 = new Fuse(list2, {
      useExtendedSearch: true,
      keys: ['title', 'author']
    })
    const result = fuse2.search("'hello")
    expect(result).toHaveLength(2)
  })
})

describe('Escaped pipe character in extended search', () => {
  const list = [
    { text: 'foo | bar' },
    { text: 'foo or bar' },
    { text: 'baz | qux' }
  ]

  const options = {
    useExtendedSearch: true,
    keys: ['text']
  }
  const fuse = new Fuse(list, options)

  test('Search: escaped pipe in include-match', () => {
    const result = fuse.search("'foo \\| bar")
    expect(result).toHaveLength(1)
    expect(result[0].item.text).toBe('foo | bar')
  })

  test('Search: escaped pipe in exact-match', () => {
    const result = fuse.search('="foo \\| bar"')
    expect(result).toHaveLength(1)
    expect(result[0].item.text).toBe('foo | bar')
  })

  test('Search: unescaped pipe still works as OR', () => {
    const result = fuse.search("'foo | 'qux")
    expect(result).toHaveLength(3)
  })
})

describe('Searching with quoted tokens containing spaces and inner quotes', () => {
  const list = [
    { text: 'said "test' },
    { text: 'said' },
    { text: 'test' },
    { text: 'hello world' },
    { text: 'hello "world"' }
  ]

  const options = {
    useExtendedSearch: true,
    keys: ['text']
  }
  const fuse = new Fuse(list, options)

  test('Search: exact-match with inner quote', () => {
    const result = fuse.search('="said "test"')
    expect(result).toHaveLength(1)
    expect(result[0].item.text).toBe('said "test')
  })

  test('Search: include-match with space (\'\"hello world\")', () => {
    const result = fuse.search('\'"hello world"')
    expect(result).toHaveLength(1)
    expect(result[0].item.text).toBe('hello world')
  })

  test('Search: prefix-match with space (^"hello w")', () => {
    const result = fuse.search('^"hello w"')
    expect(result).toHaveLength(1)
    expect(result[0].item.text).toBe('hello world')
  })

  test('Search: suffix-match with space ("lo world"$)', () => {
    const result = fuse.search('"lo world"$')
    expect(result).toHaveLength(1)
    expect(result[0].item.text).toBe('hello world')
  })

  test('Search: inverse-exact with space (!"hello world")', () => {
    const result = fuse.search('!"hello world"')
    expect(result).toHaveLength(4)
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

describe('Extended search match indices are merged', () => {
  const list = [
    { title: 'The Grand Design' },
    { title: 'Old Man\'s War' },
    { title: 'The Design of Everyday Things' }
  ]

  const options = {
    useExtendedSearch: true,
    includeMatches: true,
    includeScore: true,
    keys: ['title']
  }
  const fuse = new Fuse(list, options)

  test('multi-term fuzzy query produces non-overlapping indices', () => {
    const result = fuse.search('the grand design')
    expect(result.length).toBeGreaterThan(0)

    const firstMatch = result[0]
    expect(firstMatch.item.title).toBe('The Grand Design')

    const indices = firstMatch.matches[0].indices
    // Indices must be sorted and non-overlapping after merge
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i][0]).toBeGreaterThan(indices[i - 1][1])
    }
  })

  test('indices cover the full matched text without duplication', () => {
    const result = fuse.search('the grand design')
    const indices = result[0].matches[0].indices
    const text = result[0].item.title

    // Reconstruct highlighted text — each character should appear at most once
    const highlighted = new Set()
    for (const [start, end] of indices) {
      for (let i = start; i <= end; i++) {
        expect(highlighted.has(i)).toBe(false)
        highlighted.add(i)
      }
    }

    // All non-space characters should be highlighted
    const nonSpaceCount = text.replace(/ /g, '').length
    expect(highlighted.size).toBe(nonSpaceCount)
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
