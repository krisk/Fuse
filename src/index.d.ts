export = Fuse
export as namespace Fuse

declare class Fuse<T, O extends Fuse.IFuseOptions<T>> {
  constructor(
    list: ReadonlyArray<T>,
    options?: O,
    index?: ReadonlyArray<Fuse.FuseIndexRecord>,
  )
  /**
   * Search function for the Fuse instance.
   *
   * ```typescript
   * const myTypeList = [myType1, myType2, etc...]

   * const options: Fuse.IFuseOptions<MyType> = {
   *  keys: ['key1', 'key2']
   * }
   *
   * const myFuse = new Fuse(myTypeList, options)
   * let result = myFuse.search('pattern')
   * ```
   *
   * @param pattern The pattern to search
   * @param options `Fuse.FuseSearchOptions`
   * @returns An array of search results
   */
  search<R = T>(
    pattern: string,
    options?: Fuse.FuseSearchOptions,
  ): Fuse.FuseResult<R>[]

  setCollection(
    list: ReadonlyArray<T>,
    index?: ReadonlyArray<Fuse.FuseIndexRecord>,
  ): void

  setIndex(index: ReadonlyArray<Fuse.FuseIndexRecord>): void

  /**
   * Return the current version
   */
  static version: string

  /**
   * Use this method to pre-generate the index from the list, and pass it
   * directly into the Fuse instance.
   *
   * _Note that Fuse will automatically index the table if one isn't provided
   * during instantiation._
   *
   * ```typescript
   * // List of `MyType` objects
   * const myTypeList = [myType1, myType2, etc...]
   *
   * // Create an index
   * const myTypeIndex = Fuse.createIndex<MyType>(
   *  keys: ['key1', 'key2']
   *  list: myTypeList
   * )
   *
   * // Now use it
   * const options: Fuse.IFuseOptions<MyType> = {
   *  keys: ['key1', 'key2']
   * }
   *
   * const myFuse = new Fuse(myTypeList, options, myTypeIndex)
   * ```
   * @param keys    The keys to index
   * @param list    The list from which to create an index
   * @param options?
   * @returns An indexed list
   */
  static createIndex<U>(
    keys: Fuse.FuseOptionKeyObject[] | string[],
    list: ReadonlyArray<U>,
    options?: Fuse.FuseIndexOptions<U>,
  ): ReadonlyArray<Fuse.FuseIndexRecord>
}

declare namespace Fuse {
  type FuseGetFunction<T> = (
    obj: T,
    path: string,
  ) => ReadonlyArray<string> | string

  export type FuseIndexOptions<T> = {
    getFn: FuseGetFunction<T>
    ngrams: boolean
  }

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
  export type FuseSortFunctionItem = {
    [key: string]: { $: string } | { $: string; idx: number }[]
  }

  // {
  //   score: 0.001,
  //   key: 'author.firstName',
  //   value: 'Codenar',
  //   indices: [ [ 0, 3 ] ]
  // }
  export type FuseSortFunctionMatch = {
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
  export type FuseSortFunctionMatchList = FuseSortFunctionMatch & {
    idx: number
  }

  export type FuseSortFunctionArg = {
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

  // {
  //   name: 'title',
  //   weight: 0.7
  // }
  export type FuseOptionKeyObject = {
    name: string
    weight: number
  }

  export interface IFuseOptions<T> {
    caseSensitive?: boolean
    distance?: number
    findAllMatches?: boolean
    getFn?: FuseGetFunction<T>
    includeMatches?: boolean
    includeScore?: boolean
    keys?: FuseOptionKeyObject[] | string[]
    location?: number
    minMatchCharLength?: number
    shouldSort?: boolean
    sortFn?: FuseSortFunction
    threshold?: number
    useExtendedSearch?: boolean
  }

  // Here just to make it more understandable
  type Start = number
  type End = number

  export type FuseResultMatch = {
    // indices: [ [ 0, 9 ] ]
    indices: ReadonlyArray<[Start, End]>[]
    key?: string
    refIndex?: number
    value?: string
  }

  export type FuseSearchOptions = {
    limit: number
  }

  export type FuseResult<T> = {
    item: T
    refIndex: number
    score?: number
    matches?: ReadonlyArray<FuseResultMatch>
  }
}
