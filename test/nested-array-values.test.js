import Fuse from '../dist/fuse.mjs'

describe('terminal nested array values', () => {
  const options = {
    keys: ['tags'],
    threshold: 0,
    ignoreLocation: true,
    includeMatches: true
  }

  test('indexes individual strings rather than comma-joined arrays', () => {
    const item = { tags: [['alpha', 'beta'], ['gamma']] }
    const fuse = new Fuse([item], options)
    expect(fuse.search('alpha')[0].matches[0]).toMatchObject({
      value: 'alpha',
      refIndex: 0,
      indices: [[0, 4]]
    })
    expect(fuse.search('beta')[0].matches[0]).toMatchObject({
      value: 'beta',
      refIndex: 1,
      indices: [[0, 3]]
    })
    expect(fuse.search('alpha,beta')).toEqual([])
  })

  test('keeps innermost indices across holes, empty arrays and multiple depths', () => {
    const tags = [[], [null, , [' ', undefined, 'delta']], ['epsilon']]
    const fuse = new Fuse([{ tags }], options)
    expect(fuse.search('delta')[0].matches[0]).toMatchObject({
      value: 'delta',
      refIndex: 2
    })
    expect(fuse.search('epsilon')[0].matches[0]).toMatchObject({
      value: 'epsilon',
      refIndex: 0
    })
    expect(fuse.search('null')).toEqual([])
    expect(fuse.search('undefined')).toEqual([])
  })

  test('retains scalar conversion within nested arrays', () => {
    const fuse = new Fuse([{ tags: [[1234, false, 5678n]] }], options)
    for (const [query, refIndex] of [
      ['1234', 0],
      ['false', 1],
      ['5678', 2]
    ]) {
      expect(fuse.search(query)[0].matches[0]).toMatchObject({
        value: query,
        refIndex
      })
    }
  })

  test('supports nested paths, mutations and serialized indexes', () => {
    const docs = [{ groups: [{ tags: [['alpha', 'beta']] }] }]
    const opts = { ...options, keys: ['groups.tags'] }
    const index = Fuse.createIndex(opts.keys, docs)
    const fuse = new Fuse(
      docs,
      opts,
      Fuse.parseIndex(JSON.parse(JSON.stringify(index)))
    )
    expect(fuse.search('beta')[0].matches[0]).toMatchObject({
      value: 'beta',
      refIndex: 1
    })
    fuse.add({ groups: [{ tags: [['gamma', 'delta']] }] })
    expect(fuse.search('delta')[0]).toMatchObject({
      refIndex: 1,
      matches: [{ value: 'delta', refIndex: 1 }]
    })
    fuse.removeAt(0)
    expect(fuse.search('delta')[0].refIndex).toBe(0)
  })

  test('preserves flat arrays and ordinary nested object paths', () => {
    const fuse = new Fuse([{ tags: ['alpha', null, 'beta'] }], options)
    expect(fuse.search('beta')[0].matches[0]).toMatchObject({
      value: 'beta',
      refIndex: 2
    })
    const objects = new Fuse(
      [{ groups: [{ name: 'alpha' }, {}, { name: 'beta' }] }],
      { ...options, keys: ['groups.name'] }
    )
    expect(objects.search('beta')[0].matches[0]).toMatchObject({
      value: 'beta',
      refIndex: 2
    })
  })
})
