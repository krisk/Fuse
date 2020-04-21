// Type definitions for Fuse.js v5.2.3
// TypeScript v3.8.3

export default Fuse
export as namespace Fuse

declare class Fuse<T, O extends Fuse.IFuseOptions<T>> {
  constructor(
    list: ReadonlyArray<T>,
    options?: O,
    index?: ReadonlyArray<Fuse.FuseIndexRecord>
  )
  /**
   * Search function for the Fuse instance.
   *
   * ```typescript
   * const list: MyType[] = [myType1, myType2, etc...]

   * const options: Fuse.IFuseOptions<MyType> = {
   *  keys: ['key1', 'key2']
   * }
   *
   * const myFuse = new Fuse(list, options)
   * let result = myFuse.search('pattern')
   * ```
   *
   * @param pattern The pattern to search
   * @param options `Fuse.FuseSearchOptions`
   * @returns An array of search results
   */
  search<R = T>(
    pattern: string,
    options?: Fuse.FuseSearchOptions
  ): Fuse.FuseResult<R>[]

  setCollection(
    list: ReadonlyArray<T>,
    index?: ReadonlyArray<Fuse.FuseIndexRecord>
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
   * const list: MyType[] = [myType1, myType2, etc...]
   *
   * const index = Fuse.createIndex<MyType>(
   *  keys: ['key1', 'key2']
   *  list: list
   * )
   *
   * const options: Fuse.IFuseOptions<MyType> = {
   *  keys: ['key1', 'key2']
   * }
   *
   * const myFuse = new Fuse(list, options, index)
   * ```
   * @param keys    The keys to index
   * @param list    The list from which to create an index
   * @param options?
   * @returns An indexed list
   */
  static createIndex<U>(
    keys: Fuse.FuseOptionKeyObject[] | string[],
    list: ReadonlyArray<U>,
    options?: Fuse.FuseIndexOptions<U>
  ): ReadonlyArray<Fuse.FuseIndexRecord>
}

declare namespace Fuse {
  type FuseGetFunction<T> = (
    obj: T,
    path: string
  ) => ReadonlyArray<string> | string

  export type FuseIndexOptions<T> = {
    getFn: FuseGetFunction<T>
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
    b: FuseSortFunctionArg
  ) => number

  // title: {
  //   '$': "Old Man's War",
  //   't': 3
  // }
  type RecordEntryObject = {
    $: string // The original text entry
    t: number // The number of tokens in the text
  }

  // 'author.tags.name': [{
  //   '$': 'pizza lover',
  //   idx: 2,
  //   't': 2
  // }
  type RecordEntryArrayItem = ReadonlyArray<RecordEntryObject & { idx: number }>

  // TODO: this makes it difficult to infer the type. Need to think more about this
  type RecordEntry = { [key: string]: RecordEntryObject | RecordEntryArrayItem }

  type FuseIndexRecord = {
    idx: number
    $: RecordEntry
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
    isCaseSensitive?: boolean
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

  // Denotes the start/end indices of a match
  //                 start    end
  //                   ↓       ↓
  type RangeTuple = [number, number]

  export type FuseResultMatch = {
    indices: ReadonlyArray<RangeTuple>
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
