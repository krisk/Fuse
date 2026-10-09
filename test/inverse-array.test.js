import Fuse from '../dist/fuse.mjs'

describe('Inverse extended search across array elements', () => {
  const docs = [
    { tags: ['Maple Syrup', 'Pancakes'] },
    { tags: ['Pancakes', 'Maple Syrup'] },
    { tags: ['Honey', 'Pancakes'] },
    { tags: ['Maple Syrup'] }
  ]

  test.each(['!Syrup', '!^Maple', '!Syrup$'])(
    '%s excludes the record regardless of element order',
    (query) => {
      const fuse = new Fuse(docs, {
        keys: ['tags'],
        useExtendedSearch: true
      })
      expect(fuse.search(query).map((r) => r.refIndex)).toEqual([2])
    }
  )

  test('keyed logical inverse queries require all array elements', () => {
    const fuse = new Fuse(docs, { keys: ['tags'], useExtendedSearch: true })
    expect(fuse.search({ tags: '!Syrup' }).map((r) => r.refIndex)).toEqual([2])
  })

  test.each(['$contains', '$startsWith', '$endsWith'])(
    'object $not %s uses the same array exclusion semantics',
    (op) => {
      const value = op === '$startsWith' ? 'Maple' : 'Syrup'
      const fuse = new Fuse(docs, { keys: ['tags'] })
      expect(
        fuse.search({ tags: { $not: { [op]: value } } }).map((r) => r.refIndex)
      ).toEqual([2])
    }
  )

  test('positive array matching retains any-element semantics and indices', () => {
    const fuse = new Fuse(docs, {
      keys: ['tags'],
      useExtendedSearch: true,
      includeMatches: true
    })
    const result = fuse.search("'Pancakes")
    expect(result.map((r) => r.refIndex)).toEqual([0, 1, 2])
    expect(result[0].matches[0]).toEqual({
      indices: [[0, 7]],
      value: 'Pancakes',
      key: 'tags',
      refIndex: 1
    })
  })

  test('inverse successes preserve match metadata', () => {
    const fuse = new Fuse(docs, {
      keys: ['tags'],
      useExtendedSearch: true,
      includeMatches: true,
      includeScore: true
    })
    const [result] = fuse.search('!Syrup')
    expect(result.refIndex).toBe(2)
    expect(result.matches.map((m) => m.refIndex)).toEqual([0, 1])
    expect(result.score).toBeCloseTo(0, 12)
  })

  test('mixed positive/inverse clauses follow conservative all-element gating', () => {
    const fuse = new Fuse(
      [{ tags: ['hello Syrup', 'hello Honey'] }, { tags: ['hello Honey'] }],
      { keys: ['tags'], useExtendedSearch: true }
    )
    expect(fuse.search('^hello !Syrup').map((r) => r.refIndex)).toEqual([1])
  })

  test('empty and absent arrays keep their existing no-match behavior', () => {
    const fuse = new Fuse([{ tags: [] }, {}, { tags: ['Honey'] }], {
      keys: ['tags'],
      useExtendedSearch: true
    })
    expect(fuse.search('!Syrup').map((r) => r.refIndex)).toEqual([2])
  })

  test('a scalar sibling key cannot hide an excluded array element', () => {
    const fuse = new Fuse(
      [
        { title: 'Honey', tags: ['Syrup', 'Pancakes'] },
        { title: 'Honey', tags: ['Pancakes'] }
      ],
      { keys: ['title', 'tags'], useExtendedSearch: true }
    )
    expect(fuse.search('!Syrup').map((r) => r.refIndex)).toEqual([1])
  })

  test('logical OR retains an independent successful keyed branch', () => {
    const fuse = new Fuse([{ title: 'Honey', tags: ['Syrup', 'Pancakes'] }], {
      keys: ['title', 'tags'],
      useExtendedSearch: true
    })
    expect(
      fuse.search({ $or: [{ tags: '!Syrup' }, { title: '=Honey' }] })
    ).toHaveLength(1)
  })

  test('array exclusions remain correct after collection mutations', () => {
    const fuse = new Fuse(docs.slice(), {
      keys: ['tags'],
      useExtendedSearch: true
    })
    fuse.add({ tags: ['Syrup', 'Honey'] })
    expect(fuse.search('!Syrup').map((r) => r.refIndex)).toEqual([2])
    fuse.removeAt(0)
    expect(fuse.search('!Syrup').map((r) => r.refIndex)).toEqual([1])
    fuse.setCollection([{ tags: ['Honey'] }, { tags: ['Honey', 'Syrup'] }])
    expect(fuse.search('!Syrup').map((r) => r.refIndex)).toEqual([0])
  })

  test.each(["'Syrup | !Honey", "!Honey | 'Syrup"])(
    'mixed OR %s permits different successful branches per element',
    (query) => {
      const fuse = new Fuse([{ tags: ['Syrup', 'Pancakes'] }], {
        keys: ['tags'],
        useExtendedSearch: true
      })
      expect(fuse.search(query)).toHaveLength(1)
    }
  )

  test.each(["'Syrup | !Honey", "!Honey | 'Syrup"])(
    'mixed OR %s rejects a failed element when another uses inverse',
    (query) => {
      const fuse = new Fuse([{ tags: ['Honey', 'Pancakes'] }], {
        keys: ['tags'],
        useExtendedSearch: true
      })
      expect(fuse.search(query)).toHaveLength(0)
    }
  )

  test('a positive-only successful OR branch keeps ANY-element behavior', () => {
    const fuse = new Fuse([{ tags: ['Syrup', 'Honey'] }], {
      keys: ['tags'],
      useExtendedSearch: true
    })
    expect(fuse.search("'Syrup | !Honey")).toHaveLength(1)
  })

  test('mixed AND conservatively rejects positive failures too', () => {
    const fuse = new Fuse([{ tags: ['hello Honey', 'goodbye Honey'] }], {
      keys: ['tags'],
      useExtendedSearch: true
    })
    expect(fuse.search('^hello !Syrup')).toHaveLength(0)
  })

  test.each(['!Syrup', '!^Syrup', '!Syrup$'])(
    'scalar cross-key %s retains ALL-key exclusion',
    (query) => {
      const fuse = new Fuse(
        [
          { title: 'Syrup', author: 'Honey' },
          { title: 'Honey', author: 'Syrup' },
          { title: 'Honey', author: 'Pancakes' }
        ],
        { keys: ['title', 'author'], useExtendedSearch: true }
      )
      expect(fuse.search(query).map((r) => r.refIndex)).toEqual([2])
    }
  )

  test('scalar mixed AND keeps the owner conservative contract', () => {
    const fuse = new Fuse([{ title: 'hello Honey', author: 'goodbye Honey' }], {
      keys: ['title', 'author'],
      useExtendedSearch: true
    })
    expect(fuse.search('^hello !Syrup')).toHaveLength(0)
  })

  test('scalar mixed OR retains branch-sensitive ANY versus ALL aggregation', () => {
    const fuse = new Fuse(
      [
        { title: 'Syrup', author: 'Honey' },
        { title: 'Pancakes', author: 'Honey' },
        { title: 'Pancakes', author: 'Syrup' }
      ],
      { keys: ['title', 'author'], useExtendedSearch: true }
    )
    expect(fuse.search("'Syrup | !Honey").map((r) => r.refIndex)).toEqual([
      2, 0
    ])
  })

  test('positive OR branches can independently satisfy every element', () => {
    const fuse = new Fuse(docs, { keys: ['tags'], useExtendedSearch: true })
    expect(fuse.search("'Syrup | 'Pancakes").map((r) => r.refIndex)).toContain(
      0
    )
  })
})
