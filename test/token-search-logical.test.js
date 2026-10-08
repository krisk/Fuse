import Fuse from '../dist/fuse.mjs'

// Logical leaves must use the same corpus statistics as ordinary token queries.
describe('Token search in logical queries', () => {
  const docs = [
    { title: 'red shirt', category: 'clothing' },
    { title: 'blue shirt', category: 'clothing' },
    { title: 'red shoes', category: 'footwear' }
  ]
  const options = {
    keys: ['title'],
    useTokenSearch: true,
    threshold: 0,
    includeScore: true,
    includeMatches: true
  }

  test('a keyed leaf agrees with the equivalent string search', () => {
    const fuse = new Fuse(docs.slice(), options)
    expect(fuse.search({ title: 'red shirt' })).toEqual(
      fuse.search('red shirt')
    )
  })

  test('keyless leaves work inside logical AND', () => {
    const fuse = new Fuse(docs.slice(), options)
    expect(
      fuse.search({ $and: ['red', 'shirt'] }).map((r) => r.refIndex)
    ).toEqual([0])
  })

  test('logical OR retains both branches', () => {
    const fuse = new Fuse(docs.slice(), options)
    expect(
      fuse
        .search({ $or: [{ title: 'blue' }, { title: 'shoes' }] })
        .map((r) => r.refIndex)
        .sort()
    ).toEqual([1, 2])
  })

  test('mixed string and explicit operator leaves compose', () => {
    const fuse = new Fuse(docs.slice(), {
      ...options,
      keys: ['title', 'category']
    })
    expect(
      fuse
        .search({ title: 'red', category: { $eq: 'clothing' } })
        .map((r) => r.refIndex)
    ).toEqual([0])
  })

  test.each(['any', 'all'])(
    'multi-word keyed and keyless leaves honor tokenMatch %s',
    (tokenMatch) => {
      const collection = [
        { title: 'red shirt', category: 'clothing' },
        { title: 'red', category: 'shirt' },
        { title: 'red', category: 'clothing' },
        { title: ['red', 'shirt'], category: 'clothing' }
      ]
      const fuse = new Fuse(collection, {
        ...options,
        keys: ['title', 'category'],
        tokenMatch
      })
      const indices = (query) =>
        fuse
          .search(query)
          .map((r) => r.refIndex)
          .sort()
      expect(indices({ title: 'red shirt' })).toEqual(
        tokenMatch === 'all' ? [0, 3] : [0, 1, 2, 3]
      )
      expect(fuse.search({ $and: ['red shirt'] })).toEqual(
        fuse.search('red shirt')
      )
      expect(indices({ $and: ['red shirt'] })).toEqual(
        tokenMatch === 'all' ? [0, 1, 3] : [0, 1, 2, 3]
      )
    }
  )

  test('all coverage belongs to each leaf, not the combined AND or OR', () => {
    const fuse = new Fuse(
      [
        { title: 'red shirt', category: 'cotton clothing' },
        { title: 'red', category: 'cotton' },
        { title: 'red shirt', category: 'cotton' },
        { title: 'red', category: 'cotton clothing' }
      ],
      { ...options, keys: ['title', 'category'], tokenMatch: 'all' }
    )
    const a = { title: 'red shirt' }
    const b = { category: 'cotton clothing' }
    const indices = (query) =>
      fuse
        .search(query)
        .map((r) => r.refIndex)
        .sort()
    expect(indices({ $and: [a, b] })).toEqual([0])
    expect(indices({ $or: [a, b] })).toEqual([0, 2, 3])
    expect(indices({ $and: [a, { category: { $eq: 'cotton' } }] })).toEqual([2])
    expect(indices({ category: { $eq: 'cotton' } })).toEqual([1, 2])
  })

  test('all coverage supports more than 31 terms across array elements', () => {
    const words = Array.from({ length: 32 }, (_, i) => `word${i}`)
    const fuse = new Fuse([{ title: words }, { title: words.slice(0, -1) }], {
      ...options,
      tokenMatch: 'all'
    })
    expect(
      fuse.search({ title: words.join(' ') }).map((r) => r.refIndex)
    ).toEqual([0])
  })

  test('tokenMatch does not alter non-token logical or operator queries', () => {
    const query = {
      $or: [{ title: 'red shirt' }, { title: { $eq: 'blue shirt' } }]
    }
    const plain = new Fuse(docs, { ...options, useTokenSearch: false })
    const all = new Fuse(docs, {
      ...options,
      useTokenSearch: false,
      tokenMatch: 'all'
    })
    expect(all.search(query)).toEqual(plain.search(query))
    expect(all.search(query).map((r) => r.refIndex)).toEqual([0, 1])
  })

  test.each(['any', 'all'])(
    'collection mutations supply updated corpus statistics (%s)',
    (tokenMatch) => {
      const fuse = new Fuse(docs.slice(), { ...options, tokenMatch })
      const query = { title: 'red shirt' }
      const compare = () => {
        expect(fuse.search(query)).toEqual(fuse.search('red shirt'))
      }
      compare()
      fuse.add({ title: 'red hat', category: 'clothing' })
      compare()
      fuse.removeAt(0)
      compare()
      fuse.setCollection([{ title: 'red shirt', category: 'clothing' }])
      compare()
    }
  )
})
