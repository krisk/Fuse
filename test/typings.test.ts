import Fuse from '../dist/fuse'
import { BattlePokedex } from './fixtures/pokedex'
import { PokedexType } from './fixtures/types'

const defaultOptions: Fuse.IFuseOptions<PokedexType> = {
  keys: ['alias', 'species', 'name', 'num'],
  threshold: 0.2,
}

describe('Search with typings', () => {
  test('When searching by number', () => {
    let pokeFuse = new Fuse(BattlePokedex, defaultOptions)

    const pokemon = '2'
    const firstSearch = pokeFuse.search(pokemon)

    const poke: PokedexType = firstSearch[0].item

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
      eggGroups: ['Monster', 'Grass'],
    }

    expect(poke.species).toBe('Ivysaur')
    expect(poke).toMatchObject(expected)
  })
})
