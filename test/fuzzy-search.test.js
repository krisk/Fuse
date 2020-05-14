const Fuse = require('../dist/fuse')
import * as ErrorMsg from '../src/core/errorMessages'

const defaultList = ['Apple', 'Orange', 'Banana']
const defaultOptions = {}

const setup = (itemList, overwriteOptions) => {
  const list = itemList || defaultList
  const options = { ...defaultOptions, ...overwriteOptions }

  return new Fuse(list, options)
}

describe('Flat list of strings: ["Apple", "Orange", "Banana"]', () => {
  let fuse
  beforeEach(() => (fuse = setup()))

  describe('When searching for the term "Apple"', () => {
    let result
    beforeEach(() => (result = fuse.search('Apple')))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the index 0, representing ["Apple"]', () => {
      expect(result[0].refIndex).toBe(0)
    })
  })

  describe('When performing a fuzzy search for the term "ran"', () => {
    let result
    beforeEach(() => (result = fuse.search('ran')))

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["Orange", "Banana"]', () => {
      expect(result[0].refIndex).toBe(1)
      expect(result[1].refIndex).toBe(2)
    })
  })

  describe('When performing a fuzzy search for the term "nan"', () => {
    let result
    beforeEach(() => (result = fuse.search('nan')))

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices of ["Banana", "Orange"]', () => {
      expect(result[0].refIndex).toBe(2)
      expect(result[1].refIndex).toBe(1)
    })
  })

  describe('When performing a fuzzy search for the term "nan" with a limit of 1 result', () => {
    let result
    beforeEach(() => (result = fuse.search('nan', { limit: 1 })))

    test('we get a list of containing 1 item: [2]', () => {
      expect(result).toHaveLength(1)
    })

    test('whose values represent the indices of ["Banana", "Orange"]', () => {
      expect(result[0].refIndex).toBe(2)
    })
  })
})

describe('Deep key search, with ["title", "author.firstName"]', () => {
  const customBookList = [
    {
      title: "Old Man's War",
      author: { firstName: 'John', lastName: 'Scalzi' }
    },
    {
      title: 'The Lock Artist',
      author: { firstName: 'Steve', lastName: 'Hamilton' }
    },
    { title: 'HTML5' },
    {
      title: 'A History of England',
      author: { firstName: 1066, lastName: 'Hastings' }
    }
  ]
  let fuse
  beforeEach(
    () =>
      (fuse = setup(customBookList, { keys: ['title', 'author.firstName'] }))
  )

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => (result = fuse.search('Stve')))

    test('we get a list containing at least 1 item', () => {
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    test('and the first item has the matching key/value pairs', () => {
      expect(result[0].item).toMatchObject({
        title: 'The Lock Artist',
        author: { firstName: 'Steve', lastName: 'Hamilton' }
      })
    })
  })

  describe('When searching for the term "106"', () => {
    let result
    beforeEach(() => (result = fuse.search('106')))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value matches', () => {
      expect(result[0].item).toMatchObject({
        title: 'A History of England',
        author: { firstName: 1066, lastName: 'Hastings' }
      })
    })
  })
})

describe('Custom search function, with ["title", "author.firstName"]', () => {
  const customBookList = [
    {
      title: "Old Man's War",
      author: {
        firstName: 'John',
        lastName: 'Scalzi'
      }
    },
    {
      title: 'The Lock Artist',
      author: {
        firstName: 'Steve',
        lastName: 'Hamilton'
      }
    }
  ]
  const customOptions = {
    keys: ['title', 'author.firstName'],
    getFn: (obj) => {
      if (!obj) return null
      obj = obj.author.lastName
      return obj
    }
  }
  let fuse
  beforeEach(() => (fuse = setup(customBookList, customOptions)))

  describe('When searching for the term "Hmlt"', () => {
    let result
    beforeEach(() => (result = fuse.search('Hmlt')))

    test('we get a list containing at least 1 item', () => {
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    test('and the first item has the matching key/value pairs', () => {
      expect(result[0].item).toMatchObject({
        title: 'The Lock Artist',
        author: { firstName: 'Steve', lastName: 'Hamilton' }
      })
    })
  })

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => (result = fuse.search('Stve')))

    test('we get a list of exactly 0 items', () => {
      expect(result).toHaveLength(0)
    })
  })
})

describe('Include score in result list: ["Apple", "Orange", "Banana"]', () => {
  let fuse
  beforeEach(() => (fuse = setup(defaultList, { includeScore: true })))

  describe('When searching for the term "Apple"', () => {
    let result
    beforeEach(() => (result = fuse.search('Apple')))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the index 0, representing ["Apple"]', () => {
      expect(result[0].refIndex).toBe(0)
      expect(result[0].score).toBe(0)
    })
  })

  describe('When performing a fuzzy search for the term "ran"', () => {
    let result
    beforeEach(() => (result = fuse.search('ran')))

    test('we get a list of containing 2 items', () => {
      expect(result).toHaveLength(2)
    })

    test('whose values represent the indices, and have non-zero scores', () => {
      expect(result[0].refIndex).toBe(1)
      expect(result[0].score).not.toBe(0)
      expect(result[1].refIndex).toBe(2)
      expect(result[1].score).not.toBe(0)
    })
  })
})

describe('Include both ID and score in results list', () => {
  const customBookList = [
    {
      ISBN: '0765348276',
      title: "Old Man's War",
      author: 'John Scalzi'
    },
    {
      ISBN: '0312696957',
      title: 'The Lock Artist',
      author: 'Steve Hamilton'
    }
  ]
  const customOptions = {
    keys: ['title', 'author'],
    includeScore: true
  }
  let fuse
  beforeEach(() => (fuse = setup(customBookList, customOptions)))

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => (result = fuse.search('Stve')))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item.ISBN).toBe('0312696957')
    })

    test('and has a score that is not zero', () => {
      expect(result[0].score).not.toBe(0)
    })
  })
})

describe('Search when IDs are numbers', () => {
  const customBookList = [
    {
      ISBN: 1111,
      title: "Old Man's War",
      author: 'John Scalzi'
    },
    {
      ISBN: 2222,
      title: 'The Lock Artist',
      author: 'Steve Hamilton'
    }
  ]
  const customOptions = {
    keys: ['title', 'author'],
    id: 'ISBN',
    includeScore: true
  }
  let fuse
  beforeEach(() => (fuse = setup(customBookList, customOptions)))

  describe('When searching for the term "Stve"', () => {
    let result
    beforeEach(() => (result = fuse.search('Stve')))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item.ISBN).toBe(2222)
    })

    test('and has a score that is not zero', () => {
      expect(result[0].score).not.toBe(0)
    })
  })
})

describe('Recurse into arrays', () => {
  const customBookList = [
    {
      ISBN: '0765348276',
      title: "Old Man's War",
      author: 'John Scalzi',
      tags: ['fiction']
    },
    {
      ISBN: '0312696957',
      title: 'The Lock Artist',
      author: 'Steve Hamilton',
      tags: ['fiction']
    },
    {
      ISBN: '0321784421',
      title: 'HTML5',
      author: 'Remy Sharp',
      tags: ['web development', 'nonfiction']
    }
  ]
  const customOptions = {
    keys: ['tags'],
    threshold: 0,
    includeMatches: true
  }
  let fuse
  beforeEach(() => (fuse = setup(customBookList, customOptions)))

  describe('When searching for the tag "nonfiction"', () => {
    let result
    beforeEach(() => (result = fuse.search('nonfiction')))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item.ISBN).toBe('0321784421')
    })

    test('with matched tag provided', () => {
      const { matches } = result[0]
      expect(matches[0]).toMatchObject({
        indices: [[0, 9]],
        value: 'nonfiction',
        key: 'tags',
        refIndex: 1
      })
    })
  })
})

describe('Recurse into objects in arrays', () => {
  const customBookList = [
    {
      ISBN: '0765348276',
      title: "Old Man's War",
      author: {
        name: 'John Scalzi',
        tags: [
          {
            value: 'American'
          }
        ]
      }
    },
    {
      ISBN: '0312696957',
      title: 'The Lock Artist',
      author: {
        name: 'Steve Hamilton',
        tags: [
          {
            value: 'American'
          }
        ]
      }
    },
    {
      ISBN: '0321784421',
      title: 'HTML5',
      author: {
        name: 'Remy Sharp',
        tags: [
          {
            value: 'British'
          }
        ]
      }
    }
  ]
  const customOptions = {
    keys: ['author.tags.value'],
    threshold: 0
  }
  let fuse
  beforeEach(() => (fuse = setup(customBookList, customOptions)))

  describe('When searching for the author tag "British"', () => {
    let result
    beforeEach(() => (result = fuse.search('British')))

    test('we get a list containing exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the ISBN of the book', () => {
      expect(result[0].item.ISBN).toBe('0321784421')
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

  describe('When searching for the term "Lettuce"', () => {
    let result
    beforeEach(() => (result = fuse.search('Lettuce')))

    test('we get a list of exactly 1 item', () => {
      expect(result).toHaveLength(1)
    })

    test('whose value is the index 0, representing ["Apple"]', () => {
      expect(result[0].refIndex).toBe(1)
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

  test('Invalid key entries throw errors', () => {
    expect(() => {
      setup(customBookList, {
        keys: [
          { name: 'title', weight: -10 },
          { name: 'author', weight: 0.7 }
        ]
      })
    }).toThrowError(ErrorMsg.INVALID_KEY_WEIGHT_VALUE('title'))

    expect(() => {
      setup(customBookList, {
        keys: [{ weight: 10 }, { name: 'author', weight: 0.7 }]
      })
    }).toThrowError(ErrorMsg.MISSING_KEY_PROPERTY('name'))
  })

  describe('When searching for the term "John Smith" with author weighted higher', () => {
    const customOptions = {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'author', weight: 0.7 }
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return (result = fuse.search('John Smith'))
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({
        item: {
          title: 'The life of Jane',
          author: 'John Smith',
          tags: ['john', 'smith']
        },
        refIndex: 2
      })
    })
  })

  describe('When searching for the term "John Smith" with author weighted higher, with mixed key types', () => {
    const customOptions = {
      keys: ['title', { name: 'author', weight: 2 }]
    }

    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return (result = fuse.search('John Smith'))
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({
        item: {
          title: 'The life of Jane',
          author: 'John Smith',
          tags: ['john', 'smith']
        },
        refIndex: 2
      })
    })

    test('Throws when key does not have a name property', () => {
      expect(() => {
        new Fuse(customBookList, {
          keys: ['title', { weight: 2 }]
        })
      }).toThrow()
    })
  })

  describe('When searching for the term "John Smith" with title weighted higher', () => {
    const customOptions = {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'author', weight: 0.3 }
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return (result = fuse.search('John Smith'))
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({
        item: {
          title: 'John Smith',
          author: 'Steve Pearson',
          tags: ['steve', 'pearson']
        },
        refIndex: 3
      })
    })
  })

  describe('When searching for the term "Man", where the author is weighted higher than title', () => {
    const customOptions = {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'author', weight: 0.7 }
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return (result = fuse.search('Man'))
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({
        item: {
          title: 'Right Ho Jeeves',
          author: 'P.D. Mans',
          tags: ['fiction', 'war']
        },
        refIndex: 1
      })
    })
  })

  describe('When searching for the term "Man", where the title is weighted higher than author', () => {
    const customOptions = {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'author', weight: 0.3 }
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return (result = fuse.search('Man'))
    })

    test('We get the the exactly matching object', () => {
      expect(result[0]).toMatchObject({
        item: {
          title: "Old Man's War fiction",
          author: 'John X',
          tags: ['war']
        },
        refIndex: 0
      })
    })
  })

  describe('When searching for the term "War", where tags are weighted higher than all other keys', () => {
    const customOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'author', weight: 0.1 },
        { name: 'tags', weight: 0.5 }
      ]
    }
    let fuse
    let result
    beforeEach(() => {
      fuse = setup(customBookList, customOptions)
      return (result = fuse.search('War'))
    })

    test('We get the exactly matching object', () => {
      expect(result[0]).toMatchObject({
        item: {
          title: "Old Man's War fiction",
          author: 'John X',
          tags: ['war']
        },
        refIndex: 0
      })
    })
  })
})

describe('Search location', () => {
  const customList = [{ name: 'Hello World' }]
  const customOptions = {
    keys: ['name'],
    includeScore: true,
    includeMatches: true
  }
  let fuse

  beforeEach(() => (fuse = setup(customList, customOptions)))

  describe('When searching for the term "wor"', () => {
    let result
    let matches
    beforeEach(() => {
      result = fuse.search('wor')
      return (matches = result[0].matches)
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

describe('Searching with default options', () => {
  const customList = ['t te tes test tes te t']
  let fuse

  beforeEach(() => (fuse = new Fuse(customList, { includeMatches: true })))

  describe('When searching for the term "test"', () => {
    let result
    beforeEach(() => (result = fuse.search('test')))

    test('We get a match containing 4 indices', () => {
      expect(result[0].matches[0].indices).toHaveLength(4)
    })

    test('and the first index is a single character', () => {
      expect(result[0].matches[0].indices[0][0]).toBe(0)
      expect(result[0].matches[0].indices[0][1]).toBe(0)
    })
  })
})

describe('Searching with findAllMatches', () => {
  const customList = ['t te tes test tes te t']
  let fuse

  beforeEach(
    () =>
      (fuse = new Fuse(customList, {
        includeMatches: true,
        findAllMatches: true
      }))
  )

  describe('When searching for the term "test"', () => {
    let result
    beforeEach(() => (result = fuse.search('test')))

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

  beforeEach(
    () =>
      (fuse = new Fuse(customList, {
        includeMatches: true,
        minMatchCharLength: 2
      }))
  )

  describe('When searching for the term "test"', () => {
    let result
    beforeEach(() => (result = fuse.search('test')))

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
    beforeEach(() => (result = fuse.search('t')))

    test('We get a result with no matches', () => {
      expect(result).toHaveLength(1)
      expect(result[0].matches).toHaveLength(0)
    })
  })
})

describe('Searching with minCharLength and pattern larger than machine word size', () => {
  const customList = [
    'Apple pie is a tasty treat that is always best made by mom! But we love store bought too.',
    'Banana splits are what you want from DQ on a hot day.  But a parfait is even better.',
    'Orange sorbet is just a strange yet satisfying snack.  Chocolate seems to be more of a favourite though.'
  ]

  let fuse

  beforeEach(
    () =>
      (fuse = new Fuse(customList, {
        includeMatches: true,
        findAllMatches: true,
        includeScore: true,
        minMatchCharLength: 20,
        threshold: 0.6,
        distance: 30
      }))
  )

  describe('When searching for the term "American as apple pie is odd treatment of something made by mom"', () => {
    let result

    beforeEach(() => {
      result = fuse.search(
        'American as apple pie is odd treatment of something made by mom'
      )
    })

    test('We get exactly 1 result', () => {
      expect(result).toHaveLength(1)
    })

    test('Which corresponds to the first item in the list, with no matches', () => {
      expect(result[0].refIndex).toBe(0)
      expect(result[0].matches).toHaveLength(1)
    })
  })
})

describe('Sorted search results', () => {
  const customList = [
    {
      title: 'Right Ho Jeeves',
      author: { firstName: 'P.D', lastName: 'Woodhouse' }
    },
    {
      title: 'The Code of the Wooster',
      author: { firstName: 'P.D', lastName: 'Woodhouse' }
    },
    {
      title: 'Thank You Jeeves',
      author: { firstName: 'P.D', lastName: 'Woodhouse' }
    }
  ]
  const customOptions = {
    keys: ['title', 'author.firstName', 'author.lastName']
  }
  let fuse

  beforeEach(() => (fuse = new Fuse(customList, customOptions)))

  describe('When searching for the term "wood"', () => {
    let result
    beforeEach(() => (result = fuse.search('wood')))

    test('We get the properly ordered results', () => {
      expect(result[0].item.title).toBe('The Code of the Wooster')
      expect(result[1].item.title).toBe('Right Ho Jeeves')
      expect(result[2].item.title).toBe('Thank You Jeeves')
    })
  })
})

describe('Searching using string large strings', () => {
  const list = [
    {
      text: 'pizza'
    },
    {
      text: 'feast'
    },
    {
      text: 'where in the world is carmen san diego'
    }
  ]

  const options = {
    shouldSort: true,
    // includeScore: true,
    threshold: 0.6,
    keys: ['text']
  }
  const fuse = new Fuse(list, options)

  test('finds no matches when string is larger than 32 characters', () => {
    let pattern = 'where exctly is carmen in the world san diego'
    let result = fuse.search(pattern)
    expect(result.length).toBe(1)
    expect(result[0].item.text).toBe(list[2].text)
  })
})

describe('Searching taking into account field length', () => {
  const list = [
    {
      ISBN: '0312696957',
      title: 'The Lock war Artist nonficon',
      author: 'Steve Hamilton',
      tags: ['fiction war hello no way']
    },
    {
      ISBN: '0765348276',
      title: "Old Man's War",
      author: 'John Scalzi',
      tags: ['fiction no']
    }
  ]

  test('The entry with the shorter field length appears first', () => {
    const fuse = new Fuse(list, {
      keys: ['title']
    })
    let result = fuse.search('war')
    expect(result.length).toBe(2)
    expect(result[0].item.ISBN).toBe('0765348276')
    expect(result[1].item.ISBN).toBe('0312696957')
  })

  test('Weighted entries still are given high precedence', () => {
    const fuse = new Fuse(list, {
      keys: [
        { name: 'tags', weight: 0.8 },
        { name: 'title', weight: 0.2 }
      ]
    })
    let result = fuse.search('war')
    expect(result.length).toBe(2)
    expect(result[0].item.ISBN).toBe('0312696957')
    expect(result[1].item.ISBN).toBe('0765348276')
  })
})
