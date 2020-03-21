export = Fuse
export as namespace Fuse

declare class Fuse<T, O extends Fuse.IFuseOptions<T>> {
  constructor(
    list: ReadonlyArray<T>,
    options?: O,
    index?: ReadonlyArray<Fuse.FuseIndexRecord>,
  )
  search<R = T>(
    pattern: string,
    options?: Fuse.FuseSearchOptions,
  ): Fuse.FuseResult<R>[]

  setCollection(
    list: ReadonlyArray<T>,
    index?: ReadonlyArray<Fuse.FuseIndexRecord>,
  ): void

  setIndex(index: ReadonlyArray<Fuse.FuseIndexRecord>): void
}

declare namespace Fuse {
  // {
  //   title: { '$': "Old Man's War" },
  //   'author.firstName': { '$': 'Codenar' }
  // }
  //
  // OR
  //
  // {
  //   tags: [
  //     { $: 'nonfiction', idx: 1 },
  //     { $: 'web development', idx: 0 },
  //   ]
  // }
  type FuseSortFunctionItem = {
    [key: string]: { $: string } | { $: string; idx: number }[]
  }

  // {
  //   score: 0.001,
  //   key: 'author.firstName',
  //   value: 'Codenar',
  //   indices: [ [ 0, 3 ] ]
  // }
  type FuseSortFunctionMatch = {
    score: number
    key: string
    value: string
    indices: ReadonlyArray<number>[]
  }

  // {
  //   score: 0,
  //   key: 'tags',
  //   value: 'nonfiction',
  //   idx: 1,
  //   indices: [ [ 0, 9 ] ]
  // }
  type FuseSortFunctionMatchList = FuseSortFunctionMatch & { idx: number }

  type FuseSortFunctionArg = {
    idx: number
    item: FuseSortFunctionItem
    score: number
    matches?: (FuseSortFunctionMatch | FuseSortFunctionMatchList)[]
  }

  export type FuseSortFunction = (
    a: FuseSortFunctionArg,
    b: FuseSortFunctionArg,
  ) => number

  // TODO: Needs more work to actually make sense in TypeScript
  export type FuseIndexRecord = {
    idx: number
    $: any
  }

  export type FuseOptionKey<T> = keyof T | string

  export type FuseOptionComplexKey<T> = {
    name: FuseOptionKey<T>
    weight: number
  }

  export interface IFuseOptions<T> {
    caseSensitive?: boolean
    distance?: number
    findAllMatches?: boolean
    getFn?: (obj: any, path: string) => any
    includeMatches?: boolean
    includeScore?: boolean
    keys?: FuseOptionComplexKey<T>[] | FuseOptionKey<T>[]
    location?: number
    minMatchCharLength?: number
    shouldSort?: boolean
    sortFn?: FuseSortFunction
    threshold?: number
    useExtendedSearch?: boolean
  }

  export type FuseResultMatch = {
    indices: ReadonlyArray<number>[]
    key?: string
    refIndex?: number
    value?: string
  }

  export type FuseSearchOptions = {
    limit?: number
  }

  export type FuseResult<T> = {
    item: T
    refIndex: number
    score?: number
    matches?: ReadonlyArray<FuseResultMatch>
  }
}
