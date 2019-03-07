const Fuse = require('../dist/fuse')
const books = require('./fixtures/books.json')
const deepValue = require('../src/helpers/deep_value')

const verbose = false

const defaultList = ['Apple', 'Orange', 'Banana']
const defaultOptions = {
  location: 0,
  distance: 100,
  threshold: 0.6,
  maxPatternLength: 32,
  isCaseSensitive: false,
  tokenSeparator: / +/g,
  findAllMatches: false,
  minMatchCharLength: 1,
  id: null,
  keys: [],
  shouldSort: true,
  getFn: deepValue,
  sortFn: (a, b) => (a.score - b.score),
  tokenize: false,
  matchAllTokens: false,
  includeMatches: false,
  includeScore: false,
  verbose
}

const setup = (itemList, overwriteOptions) => {
  const list = itemList || defaultList
  const options = {...defaultOptions, ...overwriteOptions}

  return new Fuse(list, options)
}

describe('Flat list of strings: ["Apple", "Orange", "Banana"]', () => {
  let fuse
  beforeEach(() => fuse = setup())

  it('should have the correct configuration', () => {
    const expected = {list: defaultList, options: defaultOptions}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Apple"', () => {
    let result
    beforeEach(() => result = fuse.search('Apple'))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the index 0, representing ["Apple"]', () => {
      expect(result[0]).toBe(0)
    })
  })

  describe('When performing a fuzzy search for the term "ran"', () => {
    let result
    beforeEach(() => result = fuse.search('ran'))

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["Orange", "Banana"]', () => {
      expect(result[0]).toBe(1)
      expect(result[1]).toBe(2)
    })
  })

  describe('When performing a fuzzy search for the term "nan"', () => {
    let result
    beforeEach(() => result = fuse.search('nan'))

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["Banana", "Orange"]', () => {
      expect(result[0]).toBe(2)
      expect(result[1]).toBe(1)
    })
  })

  describe('When performing a fuzzy search for the term "nan" with a limit of 1 result', () => {
    let result
    beforeEach(() => result = fuse.search('nan', {limit: 1}))

    test('we get a list of containing 1 item: [2]', () => {
      expect(result).toHaveLength(1)
    })

    test('whose values represent the indices of ["Banana", "Orange"]', () => {
      expect(result[0]).toBe(2)
    })
  })
})

describe('List of books - searching "title" and "author"', () => {
  let fuse
  beforeEach(() => fuse = setup(books, {keys: ['title', 'author'], tokenize: true}))

  it('should have the correct configuration', () => {
    const expected = {list: books, options: {...defaultOptions, keys: ['title', 'author'], tokenize: true}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "HTML5"', () => {
    let result
    beforeEach(() => result = fuse.search('HTML5'))

    test('we get a list of containing 3 items', () => {
      expect(result).toHaveLength(3)
    })

    test('and the first item has the matching key/value pairs', () => {
      expect(result[0]).toMatchObject({title: 'HTML5', author: 'Remy Sharp'})
    })
  })

  describe('When searching with pattern length over 32', () => {
    let result
    beforeEach(() => result = fuse.search(Array(16).fill('HTML5').join(' ')))

    test('we get a list of containing 3 items', () => {
      expect(result).toHaveLength(3)
    })

    test('and the first item has the matching key/value pairs', () => {
      expect(result[0]).toMatchObject({title: 'HTML5', author: 'Remy Sharp'})
    })
  })

  describe('When searching for the term "Jeeves Woodhouse"', () => {
    let result
    beforeEach(() => result = fuse.search('Jeeves Woodhouse'))

    test('we get a list of containing 6 items', () => {
      expect(result).toHaveLength(6)
    })

    test('which are all the books written by "P.D. Woodhouse"', () => {
      const expectedResult = [
        {title: 'Right Ho Jeeves', author: 'P.D. Woodhouse'},
        {title: 'Thank You Jeeves', author: 'P.D. Woodhouse'},
        {title: 'The Code of the Wooster', author: 'P.D. Woodhouse'},
        {title: 'The Lock Artist', author: 'Steve Hamilton'},
        {title: 'the wooster code', author: 'aa'},
        {title: 'The code of the wooster', author: 'aa'}
      ]
      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('When searching for the term "brwn"', () => {
    let result
    beforeEach(() => result = fuse.search('brwn'))

    test('we get a list containing at least 3 items', () => {
      expect(result.length).toBeGreaterThanOrEqual(3)
    })

    test('and the first 3 items should be all the books written by Dan Brown"', () => {
      expect(result[0]).toMatchObject({
        'title': 'The DaVinci Code',
        'author': 'Dan Brown'
      })

      expect(result[1]).toMatchObject({
        'title': 'Angels & Demons',
        'author': 'Dan Brown'
      })

      expect(result[2]).toMatchObject({
        'title': 'The Lost Symbol',
        'author': 'Dan Brown'
      })
    })
  })
})

describe('Deep key search, with ["title", "author.firstName"]', () => {
  const customBookList = [{
    title: "Old Man's War",
    author: {firstName: 'John', lastName: 'Scalzi'}
  }, {
    title: 'The Lock Artist',
    author: {firstName: 'Steve', lastName: 'Hamilton'}
  }, {title: 'HTML5'}, {title: 'A History of England', author: {firstName: 1066, lastName: 'Hastings'}}]
  let fuse
  beforeEach(() => fuse = setup(customBookList, {keys: ['title', 'author.firstName']}))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, keys: ['title', 'author.firstName']}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list containing at least 1 item', () => {
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    test('and the first item has the matching key/value pairs', () => {
      expect(result[0]).toMatchObject({
        title: 'The Lock Artist',
        author: {firstName: 'Steve', lastName: 'Hamilton'}
      })
    })
  })

  describe('When searching for the term "106"', () => {
    let result
    beforeEach(() => result = fuse.search('106'))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value matches', () => {
      expect(result[0]).toMatchObject({
        title: 'A History of England',
        author: {firstName: 1066, lastName: 'Hastings'}
      })
    })
  })
})

describe('Custom search function, with ["title", "author.firstName"]', () => {
  const customBookList = [{
    title: "Old Man's War",
    author: {
      firstName: 'John',
      lastName: 'Scalzi'
    }
  }, {
    title: 'The Lock Artist',
    author: {
      firstName: 'Steve',
      lastName: 'Hamilton'
    }
  }]
  const customOptions = {
    keys: ['title', 'author.firstName'],
    getFn: (obj) => {
      if (!obj) return null
      obj = obj.author.lastName
      return obj
    }
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Hmlt"', () => {
    let result
    beforeEach(() => result = fuse.search('Hmlt'))

    test('we get a list containing at least 1 item', () => {
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    test('and the first item has the matching key/value pairs', () => {
      expect(result[0]).toMatchObject({
        title: 'The Lock Artist',
        author: {firstName: 'Steve', lastName: 'Hamilton'}
      })
    })
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list of exactly 0 items', () => {
      expect(result).toHaveLength(0)
    })
  })
})

describe('Include score in result list: ["Apple", "Orange", "Banana"]', () => {
  let fuse
  beforeEach(() => fuse = setup(defaultList, {includeScore: true}))

  it('should have the correct configuration', () => {
    const expected = {list: defaultList, options: {...defaultOptions, includeScore: true}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Apple"', () => {
    let result
    beforeEach(() => result = fuse.search('Apple'))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the index 0, representing ["Apple"]', () => {
      expect(result[0].item).toBe(0)
      expect(result[0].score).toBe(0)
    })
  })

  describe('When performing a fuzzy search for the term "ran"', () => {
    let result
    beforeEach(() => result = fuse.search('ran'))

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices, and have non-zero scores', () => {
      expect(result[0].item).toBe(1)
      expect(result[0].score).not.toBe(0)
      expect(result[1].item).toBe(2)
      expect(result[1].score).not.toBe(0)
    })
  })
})

describe('Only include ID in result list, with "ISBN"', () => {
  const customBookList = [{
    ISBN: '0765348276',
    title: "Old Man's War",
    author: 'John Scalzi'
  }, {
    ISBN: '0312696957',
    title: 'The Lock Artist',
    author: 'Steve Hamilton'
  }]
  const customOptions = {
    keys: ['title', 'author'],
    id: 'ISBN'
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0]).toBe('0312696957')
    })
  })
})

describe('Include both ID and score in results list', () => {
  const customBookList = [{
    ISBN: '0765348276',
    title: "Old Man's War",
    author: 'John Scalzi'
  }, {
    ISBN: '0312696957',
    title: 'The Lock Artist',
    author: 'Steve Hamilton'
  }]
  const customOptions = {
    keys: ['title', 'author'],
    id: 'ISBN',
    includeScore: true
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item).toBe('0312696957')
    })

    test('and has a score that is not zero', () => {
      expect(result[0].score).not.toBe(0)
    })
  })
})

describe('Search when IDs are numbers', () => {
  const customBookList = [{
    ISBN: 1111,
    title: "Old Man's War",
    author: 'John Scalzi'
  }, {
    ISBN: 2222,
    title: 'The Lock Artist',
    author: 'Steve Hamilton'
  }]
  const customOptions = {
    keys: ['title', 'author'],
    id: 'ISBN',
    includeScore: true
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item).toBe('2222')
    })

    test('and has a score that is not zero', () => {
      expect(result[0].score).not.toBe(0)
    })
  })
})

describe('Recurse into arrays', () => {
  const customBookList = [{
    'ISBN': '0765348276',
    'title': "Old Man's War",
    'author': 'John Scalzi',
    'tags': ['fiction']
  }, {
    'ISBN': '0312696957',
    'title': 'The Lock Artist',
    'author': 'Steve Hamilton',
    'tags': ['fiction']
  }, {
    'ISBN': '0321784421',
    'title': 'HTML5',
    'author': 'Remy Sharp',
    'tags': ['web development', 'nonfiction']
  }]
  const customOptions = {
    keys: ['tags'],
    id: 'ISBN',
    threshold: 0,
    includeMatches: true
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the tag "nonfiction"', () => {
    let result
    beforeEach(() => result = fuse.search('nonfiction'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item).toBe('0321784421')
    })

    test('with matched tag provided', () => {
      const {matches} = result[0]
      expect(matches[0]).toMatchObject({
        key: 'tags',
        arrayIndex: 1,
        value: 'nonfiction',
        indices: [[0, 9]]
      })
    })
  })
})

describe('Recurse into objects in arrays', () => {
  const customBookList = [{
    'ISBN': '0765348276',
    'title': "Old Man's War",
    'author': {
      'name': 'John Scalzi',
      'tags': [{
        value: 'American'
      }]
    }
  }, {
    'ISBN': '0312696957',
    'title': 'The Lock Artist',
    'author': {
      'name': 'Steve Hamilton',
      'tags': [{
        value: 'American'
      }]
    }
  }, {
    'ISBN': '0321784421',
    'title': 'HTML5',
    'author': {
      'name': 'Remy Sharp',
      'tags': [{
        value: 'British'
      }]
    }
  }]
  const customOptions = {
    keys: ['author.tags.value'],
    id: 'ISBN',
    threshold: 0
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the author tag "British"', () => {
    let result
    beforeEach(() => result = fuse.search('British'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0]).toBe('0321784421')
    })
  })
})

describe('Searching by ID', () => {
  const customBookList = [{
    'ISBN': 'A',
    'title': "Old Man's War",
    'author': 'John Scalzi'
  }, {
    'ISBN': 'B',
    'title': 'The Lock Artist',
    'author': 'Steve Hamilton'
  }]
  const customOptions = {
    keys: ['title', 'author'],
    id: 'ISBN'
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(typeof result[0]).toBe('string')
      expect(result[0]).toBe('B')
    })
  })
})

describe('Searching by nested ID', () => {
  const customBookList = [{
    'ISBN': {'name': 'A'},
    'title': "Old Man's War",
    'author': 'John Scalzi'
  }, {
    'ISBN': {'name': 'B'},
    'title': 'The Lock Artist',
    'author': 'Steve Hamilton'
  }]
  const customOptions = {
    keys: ['title', 'author'],
    id: 'ISBN.name'
  }
  let fuse
  beforeEach(() => fuse = setup(customBookList, customOptions))

  it('should have the correct configuration', () => {
    const expected = {list: customBookList, options: {...defaultOptions, ...customOptions}}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => result = fuse.search('Stve'))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(typeof result[0]).toBe('string')
      expect(result[0]).toBe('B')
    })
  })
})

describe('Set new list on Fuse', () => {
  const vegetables = ['Onion', 'Lettuce', 'Broccoli']
  let fuse
  beforeEach(() => {
    fuse = setup()
    fuse.setCollection(vegetables)
    return fuse
  })

  it('should have the correct configuration', () => {
    const expected = {list: vegetables, options: defaultOptions}
    expect(fuse).toMatchObject(expected)
  })

  describe('When searching for the term "Lettuce"', () => {
    let result
    beforeEach(() => result = fuse.search('Lettuce'))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the index 0, representing ["Apple"]', () => {
      expect(result[0]).toBe(1)
    })
  })
})

describe('Weighted search', () => {
  const customBookList = [
    {
      title: "Old Man's War fiction",
      author: 'John X',
      tags: ['war']
    },
    {
      title: 'Right Ho Jeeves',
      author: 'P.D. Mans',
      tags: ['fiction', 'war']
    },
    {
      title: 'The life of Jane',
      author: 'John Smith',
      tags: ['john', 'smith']
    },
    {
      title: 'John Smith',
      author: 'Steve Pearson',
      tags: ['steve', 'pearson']
    }
  ]

  describe('When searching for the term "John Smith" with author weighted higher', () => {
    const customOptions = {
      keys: [
        {name: 'title', weight: 0.3},
        {name: 'author', weight: 0.7}
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return result = fuse.search('John Smith')
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({title: 'The life of Jane', author: 'John Smith', tags: ['john', 'smith']})
    })
  })

  describe('When searching for the term "John Smith" with title weighted higher', () => {
    const customOptions = {
      keys: [
        {name: 'title', weight: 0.7},
        {name: 'author', weight: 0.3}
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return result = fuse.search('John Smith')
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({title: 'John Smith', author: 'Steve Pearson', tags: ['steve', 'pearson']})
    })
  })

  describe('When searching for the term "Man", where the author is weighted higher than title', () => {
    const customOptions = {
      keys: [
        {name: 'title', weight: 0.3},
        {name: 'author', weight: 0.7}
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return result = fuse.search('Man')
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({title: 'Right Ho Jeeves', author: 'P.D. Mans', tags: ['fiction', 'war']})
    })
  })

  describe('When searching for the term "Man", where the title is weighted higher than author', () => {
    const customOptions = {
      keys: [
        {name: 'title', weight: 0.7},
        {name: 'author', weight: 0.3}
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return result = fuse.search('Man')
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({title: "Old Man's War fiction", author: 'John X', tags: ['war']})
    })
  })

  describe('When searching for the term "War", where tags are weighted higher than all other keys', () => {
    const customOptions = {
      keys: [
        {name: 'title', weight: 0.8},
        {name: 'author', weight: 0.3},
        {name: 'tags', weight: 0.9}
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return result = fuse.search('War')
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({title: "Old Man's War fiction", author: 'John X', tags: ['war']})
    })
  })
})

describe('Search location', () => {
  const customList = [{name: 'Hello World'}]
  const customOptions = {
    keys: ['name'],
    includeScore: true,
    includeMatches: true
  }
  let fuse

  beforeEach(() => fuse = setup(customList, customOptions))

  describe('When searching for the term "wor"', () => {
    let result
    let matches
    beforeEach(() => {
      result = fuse.search('wor')
      return matches = result[0].matches
    })

    test('We get a list whose indices are found', () => {
      expect(matches[0].indices[0]).toEqual([4, 4])
      expect(matches[0].indices[1]).toEqual([6, 8])
    })

    test('with original text values', () => {
      expect(matches[0].value).toBe('Hello World')
    })
  })
})

describe('Search with match all tokens', () => {
  const customList = [
    'AustralianSuper - Corporate Division',
    'Aon Master Trust - Corporate Super',
    'Promina Corporate Superannuation Fund',
    'Workforce Superannuation Corporate',
    'IGT (Australia) Pty Ltd Superannuation Fund'
  ]
  let fuse

  beforeEach(() => fuse = setup(customList, {tokenize: true}))

  describe('When searching for the term "Australia"', () => {
    let result
    beforeEach(() => result = fuse.search('Australia'))

    test('We get a list containing exactly 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose items represent the indices of "AustralianSuper - Corporate Division" and "IGT (Australia) Pty Ltd Superannuation Fund"', () => {
      expect(result).toContain(0)
      expect(result).toContain(4)
    })
  })

  describe('When searching for the term "corporate"', () => {
    let result
    beforeEach(() => result = fuse.search('corporate'))

    test('We get a list containing exactly 4 items', () => {
      expect(result).toHaveLength(4)
    })

    test('whose items represent the indices of "AustralianSuper - Corporate Division", "Aon Master Trust - Corporate Super", "Promina Corporate Superannuation Fund" and "Workforce Superannuation Corporate"', () => {
      expect(result).toContain(0)
      expect(result).toContain(1)
      expect(result).toContain(2)
      expect(result).toContain(3)
    })
  })
})

describe('Searching with default options', () => {
  const customList = ['t te tes test tes te t']
  let fuse

  beforeEach(() => fuse = new Fuse(customList, {includeMatches: true}))

  describe('When searching for the term "test"', () => {
    let result
    beforeEach(() => result = fuse.search('test'))

    test('We get a match containing 4 indices', () => {
      expect(result[0].matches[0].indices).toHaveLength(4)
    })

    test('and the first index is a single character', () => {
      expect(result[0].matches[0].indices[0][0]).toBe(0)
      expect(result[0].matches[0].indices[0][1]).toBe(0)
    })
  })

  test('When the seach pattern is longer than maxPatternLength and contains RegExp special characters', () => {
    const resultThunk = jest.fn(() => fuse.search('searching with a sufficiently long string sprinkled with ([ )] *+^$ etc.'))
    resultThunk()
    expect(resultThunk).toHaveBeenCalledTimes(1)
    expect(resultThunk).not.toThrow()
  })
})

describe('Searching with findAllMatches', () => {
  const customList = ['t te tes test tes te t']
  let fuse

  beforeEach(() => fuse = new Fuse(customList, {includeMatches: true, findAllMatches: true}))

  describe('When searching for the term "test"', () => {
    let result
    beforeEach(() => result = fuse.search('test'))

    test('We get a match containing 7 indices', () => {
      expect(result[0].matches[0].indices).toHaveLength(7)
    })

    test('and the first index is a single character', () => {
      expect(result[0].matches[0].indices[0][0]).toBe(0)
      expect(result[0].matches[0].indices[0][1]).toBe(0)
    })
  })
})

describe('Searching with minCharLength', () => {
  const customList = ['t te tes test tes te t']
  let fuse

  beforeEach(() => fuse = new Fuse(customList, {includeMatches: true, minMatchCharLength: 2}))

  describe('When searching for the term "test"', () => {
    let result
    beforeEach(() => result = fuse.search('test'))

    test('We get a match containing 3 indices', () => {
      expect(result[0].matches[0].indices).toHaveLength(3)
    })

    test('and the first index is a single character', () => {
      expect(result[0].matches[0].indices[0][0]).toBe(2)
      expect(result[0].matches[0].indices[0][1]).toBe(3)
    })
  })

  describe('When searching for a string shorter than minMatchCharLength', () => {
    let result
    beforeEach(() => result = fuse.search('t'))

    test('We get a result with no matches', () => {
      expect(result).toHaveLength(1)
      expect(result[0].matches).toHaveLength(0)
    })
  })
})

describe('Sorted search results', () => {
  const customList = [
    {
      title: 'Right Ho Jeeves',
      author: {firstName: 'P.D', lastName: 'Woodhouse'}
    },
    {
      title: 'The Code of the Wooster',
      author: {firstName: 'P.D', lastName: 'Woodhouse'}
    },
    {
      title: 'Thank You Jeeves',
      author: {firstName: 'P.D', lastName: 'Woodhouse'}
    }
  ]
  const customOptions = {
    keys: ['title', 'author.firstName', 'author.lastName']
  }
  let fuse

  beforeEach(() => fuse = new Fuse(customList, customOptions))

  describe('When searching for the term "wood"', () => {
    let result
    beforeEach(() => result = fuse.search('wood'))

    test('We get the properly ordered results', () => {
      expect(result[0].title).toBe('The Code of the Wooster')
      expect(result[1].title).toBe('Right Ho Jeeves')
      expect(result[2].title).toBe('Thank You Jeeves')
    })
  })
})

describe('Searching through a deeply nested object', () => {
  const customList = {}
  const customOptions = {
    includeMatches: true,
    minMatchCharLength: 2
  }
  let fuse

  customList.o = customList

  beforeEach(() => fuse = new Fuse(customList, customOptions))

  describe('When working with a deeply nested JSON data structure', () => {
    let resultThunk
    beforeEach(() => {
      resultThunk = jest.fn(() => fuse._format(fuse))
      resultThunk()
    })

    test('we should get no JSON circular', () => {
      expect(resultThunk).toHaveBeenCalledTimes(1)
      expect(resultThunk).not.toThrow()
    })
  })
})
