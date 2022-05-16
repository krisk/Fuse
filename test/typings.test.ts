import Fuse from '../dist/fuse'
import { BattlePokedex } from './fixtures/pokedex'
import { PokedexType } from './fixtures/types'

const idx = (result) => result.map((obj) => obj.refIndex)

const defaultOptions: Fuse.IFuseOptions<PokedexType> = {
  keys: ['alias', 'species', 'name', 'num'],
  threshold: 0.2
}

describe('Search with typings', () => {
  test('When searching by number', () => {
    let pokeFuse = new Fuse(BattlePokedex, defaultOptions)

    const pokemon = '2'
    const firstSearch = pokeFuse.search(pokemon)

    const poke: PokedexType = firstSearch[0].item

    // let x = Fuse.createIndex<PokedexType>(
    //   ['alias', 'species', 'name', 'num'],
    //   BattlePokedex,
    // )

    const expected = {
      num: 2,
      species: 'Ivysaur',
      types: ['Grass', 'Poison'],
      genderRatio: { M: 0.875, F: 0.125 },
      baseStats: { hp: 60, atk: 62, def: 63, spa: 80, spd: 80, spe: 60 },
      abilities: { 0: 'Overgrow', H: 'Chlorophyll' },
      heightm: 1,
      weightkg: 13,
      color: 'Green',
      prevo: 'bulbasaur',
      evos: ['venusaur'],
      evoLevel: 16,
      eggGroups: ['Monster', 'Grass']
    }

    expect(poke.species).toBe('Ivysaur')
    expect(poke).toMatchObject(expected)
  })
})

describe('Search results with indices', () => {
  test('When searching by number', () => {
    interface Board {
      readonly name: string
    }
    const list: Array<Board> = [
      {
        name: 'Arduino Duemilanove or Diecimila'
      }
    ]
    const options: Fuse.IFuseOptions<Board> = {
      includeMatches: true,
      minMatchCharLength: 1,
      keys: ['name']
    }

    const fuse = new Fuse(list, options)
    const results = fuse.search(`ar due di`)

    expect(results.length).toBe(1)

    const matches = results[0].matches

    expect(matches.length).toBe(1)
    expect(matches[0].indices.length).toBe(9)
    expect(matches[0].indices[0]).toMatchObject([0, 4])
  })
})

describe('Logical search results', () => {
  interface Author {
    readonly name: string
    readonly title: string
  }

  const list: Array<Author> = [
    {
      title: 'The Code of the Wooster',
      name: 'Woodhouse'
    }
  ]

  const options: Fuse.IFuseOptions<Author> = {
    useExtendedSearch: true,
    includeMatches: true,
    includeScore: true,
    keys: ['name', 'title']
  }

  const fuse = new Fuse(list, options)

  test('Search: AND with multiple entries + exact match', () => {
    let result = fuse.search({
      $and: [{ name: 'Woodhose' }, { title: "'The" }]
    })
    expect(result.length).toBe(1)
    expect(idx(result)).toMatchObject([0])
  })
})

describe('FuseSortFunctionMatch', () => {
  type Foo = { foo: string }
  const list: Array<Foo> = [
    {
      foo: 'foo'
    },
    {
      foo: 'bar'
    },
    {
      foo: 'baz'
    }
  ]

  test('without includeMatches', () => {
    let sortFnCalled = false
    const options: Fuse.IFuseOptions<Foo> = {
      keys: ['foo'],
      sortFn: (a, b) => {
        sortFnCalled = true
        ;[a, b].forEach((c) => {
          expect(c.idx).toBeDefined()
          expect(c.item).toBeDefined()
          expect(c.matches).toBeDefined()
          expect(c.score).toBeDefined()
          c.matches.forEach((m) => {
            expect(m.indices).toBeUndefined()
            expect(m.key).toBeDefined()
            expect(m.norm).toBeDefined()
            expect(m.value).toBeDefined()
            expect(m.score).toBeDefined()
          })
        })
        return 1
      }
    }
    const fuse = new Fuse(list, options)
    fuse.search('ba')
    expect(sortFnCalled).toEqual(true)
  })

  test('with includeMatches', () => {
    let sortFnCalled = false
    const options: Fuse.IFuseOptions<Foo> = {
      keys: ['foo'],
      includeMatches: true,
      sortFn: (a, b) => {
        sortFnCalled = true
        ;[a, b].forEach((c) => {
          expect(c.idx).toBeDefined()
          expect(c.item).toBeDefined()
          expect(c.matches).toBeDefined()
          expect(c.score).toBeDefined()
          c.matches.forEach((m) => {
            expect(m.indices).toBeDefined()
            expect(m.key).toBeDefined()
            expect(m.norm).toBeDefined()
            expect(m.value).toBeDefined()
            expect(m.score).toBeDefined()
          })
        })
        return 1
      }
    }
    const fuse = new Fuse(list, options)
    fuse.search('ba')
    expect(sortFnCalled).toEqual(true)
  })
})
