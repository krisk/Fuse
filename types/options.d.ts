export interface FuseOptions<T> {
  caseSensitive?: boolean
  distance?: number
  findAllMatches?: boolean
  getFn?: (obj: any, path: string) => any
  includeMatches?: boolean
  includeScore?: boolean
  keys?: (keyof T | string)[] | { name: keyof T | string; weight: number }[]
  location?: number
  minMatchCharLength?: number
  shouldSort?: boolean
  sortFn?: (a: { score: number }, b: { score: number }) => number
  threshold?: number
  useExtendedSearch?: boolean
}

export interface FuseResultMatch {
  indices: ReadonlyArray<number>[]
  key?: string
  refIndex?: number
  value?: string
}

export interface FuseResultWithScore<T> {
  item: T
  refIndex: number
  score: number
}

export interface FuseResultWithMatches<T> {
  item: T
  refIndex: number
  matches: ReadonlyArray<FuseResultMatch>
}

export interface FuseSearchOptions {
  limit?: number
}
