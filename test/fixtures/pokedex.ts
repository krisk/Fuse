import { PokedexType } from './types'

export const BattlePokedex: PokedexType[] = [
  {
    num: 1,
    species: 'Bulbasaur',
    types: ['Grass', 'Poison'],
    genderRatio: { M: 0.875, F: 0.125 },
    baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    abilities: { 0: 'Overgrow', H: 'Chlorophyll' },
    heightm: 0.7,
    weightkg: 6.9,
    color: 'Green',
    evos: ['ivysaur'],
    eggGroups: ['Monster', 'Grass']
  },
  {
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
  },
  {
    num: 3,
    species: 'Venusaur',
    types: ['Grass', 'Poison'],
    genderRatio: { M: 0.875, F: 0.125 },
    baseStats: { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
    abilities: { 0: 'Overgrow', H: 'Chlorophyll' },
    heightm: 2,
    weightkg: 100,
    color: 'Green',
    prevo: 'ivysaur',
    evoLevel: 32,
    eggGroups: ['Monster', 'Grass'],
    otherFormes: ['venusaurmega']
  },
  {
    num: 3,
    species: 'Venusaur-Mega',
    baseSpecies: 'Venusaur',
    forme: 'Mega',
    formeLetter: 'M',
    types: ['Grass', 'Poison'],
    genderRatio: { M: 0.875, F: 0.125 },
    baseStats: { hp: 80, atk: 100, def: 123, spa: 122, spd: 120, spe: 80 },
    abilities: { 0: 'Thick Fat' },
    heightm: 2.4,
    weightkg: 155.5,
    color: 'Green',
    eggGroups: ['Monster', 'Grass']
  }
]

// export const PokeAliases: IPokeDexAliases[] = [
//   { alias: 'megavenu', name: 'Venusaur-Mega' },
//   { alias: 'megasaur', name: 'Venusaur-Mega' },
//   { alias: 'venu', name: 'Venusaur' },
//   { alias: 'bulbapedia', name: 'Bulbasaur' },
// ]
