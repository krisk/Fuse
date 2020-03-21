// TypeScript Version: 3.1

import {
  FuseOptions,
  // FuseResultMatch,
  FuseResultWithScore,
  FuseResultWithMatches,
  FuseSearchOptions,
} from './options'

// TODO: Needs more work to actually make sense in TypeScript
interface FuseIndexRecord {
  idx: number
  $: any
}

declare class Fuse<T, O extends FuseOptions<T>> {
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
    opts?: FuseSearchOptions,
  ): S extends true
    ? M extends true
      ? (FuseResultWithMatches<R> & FuseResultWithScore<R>)[]
      : FuseResultWithScore<R>[]
    : M extends true
    ? FuseResultWithMatches<R>[]
    : R[]

  setCollection(
    list: ReadonlyArray<T>,
    index?: ReadonlyArray<FuseIndexRecord>,
  ): void

  setIndex(index: ReadonlyArray<FuseIndexRecord>): void
}

export = Fuse
