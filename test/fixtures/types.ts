type PokeAliasType = {
  alias: string
}

type PokeStatType = {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number

  [propName: string]: string | number | undefined
}

type PokeAbilityType = {
  0: string
  1?: string
  H?: string

  [propName: string]: string | number | undefined
}

type PokeGenderRatioType = {
  M: number
  F: number
}

export type PokedexType = {
  num: number
  species: string
  types: string[]
  genderRatio?: PokeGenderRatioType
  baseStats: PokeStatType
  abilities: PokeAbilityType
  heightm: number
  weightkg: number
  color: string
  name?: string
  baseForme?: string
  baseSpecies?: string
  forme?: string
  formeLetter?: string
  gender?: string
  prevo?: string
  evos?: string[]
  evoLevel?: number | string
  eggGroups?: string[]
  otherFormes?: string[]
}

// export interface IPokeDexAliases extends PokeAliasType, PokedexType {
//   name: string
// }
