const Fuse = require('../dist/fuse')
const Books = require('./fixtures/books.json')

const idx = (result) => result.map((obj) => obj.refIndex)

describe('Logical parser', () => {
  const options = {
    useExtendedSearch: true,
    includeMatches: true,
    includeScore: true,
    keys: ['title', 'author.firstName', 'author.lastName']
  }

  test('Tree structure', () => {
    const query = {
      $and: [
        { title: 'old war' },
        {
          $or: [{ title: '!arts' }, { title: '^lock' }]
        }
      ]
    }
    let root = Fuse.parseQuery(query, options, { auto: false })

    expect(root).toMatchSnapshot()
  })

  test('Implicit operations', () => {
    const query = {
      $and: [
        { title: 'old war' },
        {
          $or: [{ title: '!arts', tags: 'kiro' }, { title: '^lock' }]
        }
      ]
    }
    let root = Fuse.parseQuery(query, options, { auto: false })

    expect(root).toMatchSnapshot()
  })
})

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

describe('Multiple nested conditions', () => {
  const list1 = [
    {
      title: "Old Man's War",
      author: {
        firstName: 'John',
        lastName: 'Scalzi',
        age: '61'
      }
    }
  ]

  const list2 = [
    ...list1,
    {
      title: "Old Man's War",
      author: {
        firstName: 'John',
        lastName: 'Scalzi',
        age: '62'
      }
    }
  ]

  const options = {
    includeScore: true,
    useExtendedSearch: true,
    keys: ['title', 'author.firstName', 'author.lastName', 'author.age']
  }

  const fuse1 = new Fuse(list1, options)
  const fuse2 = new Fuse(list2, options)

  test('Search: nested AND + OR', () => {
    const result = fuse1.search({
      $and: [
        { title: 'old' },
        {
          $or: [{ 'author.firstName': 'j' }, { 'author.lastName': 'Sa' }]
        },
        {
          $or: [{ 'author.age': "'62" }]
        }
      ]
    })

    expect(result.length).toBe(0)
  })

  test('Search: deep nested AND + OR', () => {
    const result = fuse1.search({
      $and: [
        { title: 'old' },
        {
          $or: [{ 'author.firstName': 'jon' }, { 'author.lastName': 'Sazi' }]
        },
        {
          $or: [
            { 'author.age': "'62" },
            { $and: [{ title: 'old' }, { 'author.age': "'61" }] }
          ]
        }
      ]
    })

    expect(result.length).toBe(1)
    expect(result[0]).toHaveProperty('score')
    expect(result[0].score).toBeGreaterThan(0)
  })

  test('Search: deep nested AND + OR', () => {
    const result = fuse2.search({
      $and: [
        { title: 'old' },
        {
          $and: [{ 'author.firstName': 'jon' }, { 'author.lastName': 'Sazi' }]
        },
        {
          $or: [
            { 'author.age': "'62" },
            { $and: [{ title: 'old' }, { 'author.age': "'62" }] }
          ]
        }
      ]
    })

    expect(result.length).toBe(1)
    expect(result[0]).toHaveProperty('score')
    expect(result[0].score).toBeGreaterThan(0)
  })
})

describe('Logical search with dotted keys', () => {
  const list = [
    {
      title: "Old Man's War",
      author: {
        'first.name': 'John',
        'last.name': 'Scalzi',
        age: '61'
      }
    }
  ]

  const options = {
    useExtendedSearch: true,
    includeScore: true,
    keys: [
      'title',
      ['author', 'first.name'],
      ['author', 'last.name'],
      'author.age'
    ]
  }
  const fuse = new Fuse(list, options)

  test('Search: deep nested AND + OR', () => {
    const query = {
      $and: [
        {
          $path: ['author', 'first.name'],
          $val: 'jon'
        },
        {
          $path: ['author', 'last.name'],
          $val: 'scazi'
        }
      ]
    }

    const result = fuse.search(query)

    expect(result.length).toBe(1)
  })
})

describe('Searching using logical OR with same query across fields', () => {
  const options = { keys: ['title', 'author.lastName'] }
  const fuse = new Fuse(Books, options)
  let result
  beforeEach(() => {
    const query = {
      $or: [
        { title: 'wood' },
        { 'author.lastName': 'wood' }
      ]
    }

    result = fuse.search(query)
  })

  describe('When searching for the term "wood"', () => {
    test('we get the top three results all with an exact match from their author.lastName', () => {
      expect(idx(result.slice(0,3)).sort()).toMatchObject([3,4,5])
    })
  })
})
