import Fuse from '../dist/fuse.mjs'

const docs = [
  { title: 'Syrup', author: 'Honey' },
  { title: 'Honey', author: 'Syrup' },
  { title: 'Honey', author: 'Pancakes' },
  { title: 'Syrup', author: 'Syrup' }
]
const options = {
  keys: ['title', 'author'],
  useExtendedSearch: true,
  includeMatches: true,
  includeScore: true
}
const indices = (results) => results.map(({ refIndex }) => refIndex)

describe('Inverse keyless leaves in logical queries', () => {
  test.each([
    ['!Syrup', '$and'],
    ['!Syrup', '$or'],
    ['!^Syrup', '$and'],
    ['!^Syrup', '$or'],
    ['!Syrup$', '$and'],
    ['!Syrup$', '$or']
  ])('%s inside %s preserves global exclusions', (query, operator) => {
    for (const keys of [options.keys, options.keys.slice().reverse()]) {
      const fuse = new Fuse(docs, { ...options, keys })
      const expected = fuse.search(query)
      expect(indices(expected)).toEqual([2])
      expect(fuse.search({ [operator]: [query] })).toEqual(expected)
    }
  })

  test('an inverse keyless leaf filters a nested AND branch', () => {
    const fuse = new Fuse(docs, options)
    expect(
      indices(fuse.search({ $and: [{ author: '=Honey' }, '!Syrup'] }))
    ).toEqual([])
  })

  test('an independent OR branch can still include an excluded record', () => {
    const fuse = new Fuse(docs, options)
    const result = fuse.search({
      $or: [{ $and: ['!Syrup'] }, { title: '=Syrup', author: '=Honey' }]
    })
    expect(indices(result).sort()).toEqual([0, 2])
  })

  test.each(["'Syrup", '^Syrup', 'Syrup$'])(
    'positive keyless %s still matches any key',
    (query) => {
      const fuse = new Fuse(docs, options)
      expect(fuse.search({ $and: [query] })).toEqual(fuse.search(query))
      expect(indices(fuse.search(query)).sort()).toEqual([0, 1, 3])
    }
  )

  test('keyed inverse leaves only exclude their selected field', () => {
    const fuse = new Fuse(docs, options)
    expect(indices(fuse.search({ author: '!Syrup' })).sort()).toEqual([0, 2])
  })

  test.each(['!Syrup', '^Honey !Syrup', "'Syrup | !Honey"])(
    'mixed and missing-field %s behavior matches global search',
    (query) => {
      const fuse = new Fuse([...docs, { title: 'Honey' }, {}], options)
      expect(fuse.search({ $and: [query] })).toEqual(fuse.search(query))
    }
  )

  test('exclusions stay consistent after collection changes', () => {
    const fuse = new Fuse(docs.slice(), options)
    const check = () => {
      expect(fuse.search({ $and: ['!Syrup'] })).toEqual(fuse.search('!Syrup'))
    }
    fuse.add({ title: 'Pancakes', author: 'Syrup' })
    check()
    fuse.removeAt(0)
    check()
    fuse.setCollection([{ title: 'Syrup', author: 'Honey' }, docs[2]])
    check()
  })
})
