import get from '../helpers/get'
import type { IFuseOptions } from '../types'

export const MatchOptions = {
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1
}

export const BasicOptions = {
  isCaseSensitive: false,
  ignoreDiacritics: false,
  includeScore: false,
  keys: [] as any[],
  shouldSort: true,
  sortFn: (a: { score: number; idx: number }, b: { score: number; idx: number }): number =>
    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
}

export const FuzzyOptions = {
  location: 0,
  threshold: 0.6,
  distance: 100
}

export const AdvancedOptions = {
  useExtendedSearch: false,
  getFn: get as any,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  fieldNormWeight: 1
}

const Config: Required<IFuseOptions<any>> = Object.freeze({
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
}) as Required<IFuseOptions<any>>

export default Config
