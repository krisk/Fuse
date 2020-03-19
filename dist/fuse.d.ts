// Type definitions for Fuse.js v5.0.7-beta
// TypeScript Version: 3.1

export = Fuse
export as namespace Fuse

interface SearchOpt {
  limit?: number
}

// TODO: Needs more work to actually make sense in TypeScript
interface FuseIndexRecord {
  idx: number
  $: any
}

declare class Fuse<T, O extends Fuse.FuseOptions<T>> {
  constructor(
    list: ReadonlyArray<T>,
    options?: O,
    index?: ReadonlyArray<FuseIndexRecord>,
  )
  search<
    /** Type of item of return */
    R = T,
    /** include score (boolean) */
    S = O['includeScore'],
    /** include matches (boolean) */
    M = O['includeMatches']
  >(
    pattern: string,
    opts?: SearchOpt,
  ): S extends true
    ? M extends true
      ? (Fuse.FuseResultWithMatches<R> & Fuse.FuseResultWithScore<R>)[]
      : Fuse.FuseResultWithScore<R>[]
    : M extends true
    ? Fuse.FuseResultWithMatches<R>[]
    : R[]

  setCollection(
    list: ReadonlyArray<T>,
    index?: ReadonlyArray<FuseIndexRecord>,
  ): void

  setIndex(index: ReadonlyArray<FuseIndexRecord>): void
}

declare namespace Fuse {
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
}
