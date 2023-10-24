// Type definitions for Fuse.js v7.0.0
// TypeScript v4.9.5
declare class Fuse<T> {
  public constructor(
    list: ReadonlyArray<T>,
    options?: IFuseOptions<T>,
    index?: FuseIndex<T>
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
  public search<R = T>(
    pattern: string | Expression,
    options?: FuseSearchOptions
  ): FuseResult<R>[]

  public setCollection(docs: ReadonlyArray<T>, index?: FuseIndex<T>): void

  /**
   * Adds a doc to the end the list.
   */
  public add(doc: T): void

  /**
   * Removes all documents from the list which the predicate returns truthy for,
   * and returns an array of the removed docs.
   * The predicate is invoked with two arguments: (doc, index).
   */
  public remove(predicate: (doc: T, idx: number) => boolean): T[]

  /**
   * Removes the doc at the specified index.
   */
  public removeAt(idx: number): void

  /**
   * Returns the generated Fuse index
   */
  public getIndex(): FuseIndex<T>

  /**
   * Return the current version.
   */
  public static version: string

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
  public static createIndex<U>(
    keys: Array<FuseOptionKey<U>>,
    list: ReadonlyArray<U>,
    options?: FuseIndexOptions<U>
  ): FuseIndex<U>

  public static parseIndex<U>(
    index: any,
    options?: FuseIndexOptions<U>
  ): FuseIndex<U>

  public static config: Required<IFuseOptions<any>>
}

declare class FuseIndex<T> {
  public constructor(options?: FuseIndexOptions<T>)
  public setSources(docs: ReadonlyArray<T>): void
  public setKeys(keys: ReadonlyArray<string>): void
  public setIndexRecords(records: FuseIndexRecords): void
  public create(): void
  public add(doc: T): void
  public toJSON(): {
    keys: ReadonlyArray<string>
    records: FuseIndexRecords
  }
}

type FuseGetFunction<T> = (
  obj: T,
  path: string | string[]
) => ReadonlyArray<string> | string

type FuseIndexOptions<T> = {
  getFn: FuseGetFunction<T>
}

/**
 * @example
 * ```ts
 * {
 *   title: { '$': "Old Man's War" },
 *   'author.firstName': { '$': 'Codenar' }
 * }
 * ```
 * @example
 * ```ts
 * {
 *   tags: [
 *     { $: 'nonfiction', idx: 0 },
 *     { $: 'web development', idx: 1 },
 *   ]
 * }
 * ```
 */
type FuseSortFunctionItem = {
  [key: string]: { $: string } | { $: string; idx: number }[]
}

/**
 * @example
 * ```ts
 * {
 *   score: 0.001,
 *   key: 'author.firstName',
 *   value: 'Codenar',
 *   indices: [ [ 0, 3 ] ]
 * }
 * ```
 */
type FuseSortFunctionMatch = {
  score: number
  key: string
  value: string
  indices: ReadonlyArray<number>[]
}

/**
 * @example
 * ```ts
 * {
 *   score: 0,
 *   key: 'tags',
 *   value: 'nonfiction',
 *   idx: 1,
 *   indices: [ [ 0, 9 ] ]
 * }
 * ```
 */
type FuseSortFunctionMatchList = FuseSortFunctionMatch & {
  idx: number
}

type FuseSortFunctionArg = {
  idx: number
  item: FuseSortFunctionItem
  score: number
  matches?: (FuseSortFunctionMatch | FuseSortFunctionMatchList)[]
}

type FuseSortFunction = (
  a: FuseSortFunctionArg,
  b: FuseSortFunctionArg
) => number

/**
 * @example
 * ```ts
 * title: {
 *   '$': "Old Man's War",
 *   'n': 0.5773502691896258
 * }
 * ```
 */
type RecordEntryObject = {
  /** The text value */
  v: string
  /** The field-length norm */
  n: number
}

/**
 * @example
 * ```ts
 * 'author.tags.name': [{
 *   'v': 'pizza lover',
 *   'i': 2,
 *   'n: 0.7071067811865475
 * }
 * ```
 */
type RecordEntryArrayItem = ReadonlyArray<
  RecordEntryObject & { i: number }
>

// TODO: this makes it difficult to infer the type. Need to think more about this
type RecordEntry = {
  [key: string]: RecordEntryObject | RecordEntryArrayItem
}

/**
 * @example
 * ```ts
 * {
 *   i: 0,
 *   '$': {
 *     '0': { v: "Old Man's War", n: 0.5773502691896258 },
 *     '1': { v: 'Codenar', n: 1 },
 *     '2': [
 *       { v: 'pizza lover', i: 2, n: 0.7071067811865475 },
 *       { v: 'helo wold', i: 1, n: 0.7071067811865475 },
 *       { v: 'hello world', i: 0, n: 0.7071067811865475 }
 *     ]
 *   }
 * }
 * ```
 */
type FuseIndexObjectRecord = {
  /** The index of the record in the source list */
  i: number
  $: RecordEntry
}

/**
 * @example
 * ```ts
 * {
 *   keys: null,
 *   list: [
 *     { v: 'one', i: 0, n: 1 },
 *     { v: 'two', i: 1, n: 1 },
 *     { v: 'three', i: 2, n: 1 }
 *   ]
 * }
 * ```
 */
type FuseIndexStringRecord = {
  /** The index of the record in the source list */
  i: number
  /** The text value */
  v: string
  /** The field-length norm */
  n: number
}

type FuseIndexRecords =
  | ReadonlyArray<FuseIndexObjectRecord>
  | ReadonlyArray<FuseIndexStringRecord>

/**
 * @example
 * ```ts
 * {
 *   name: 'title',
 *   weight: 0.7
 * }
 * ```
 */
type FuseOptionKeyObject<T> = {
  name: string | string[]
  weight?: number
  getFn?: (obj: T) => ReadonlyArray<string> | string
}

type FuseOptionKey<T> = FuseOptionKeyObject<T> | string | string[]

interface IFuseOptions<T> {
  /** Indicates whether comparisons should be case sensitive. */
  isCaseSensitive?: boolean
  /** Determines how close the match must be to the fuzzy location (specified by `location`). An exact letter match which is `distance` characters away from the fuzzy location would score as a complete mismatch. A `distance` of `0` requires the match be at the exact `location` specified. A distance of `1000` would require a perfect match to be within `800` characters of the `location` to be found using a `threshold` of `0.8`. */
  distance?: number
  /** When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string. */
  findAllMatches?: boolean
  /** The function to use to retrieve an object's value at the provided path. The default will also search nested paths. */
  getFn?: FuseGetFunction<T>
  /** When `true`, search will ignore `location` and `distance`, so it won't matter where in the string the pattern appears. */
  ignoreLocation?: boolean
  /** When `true`, the calculation for the relevance score (used for sorting) will ignore the `field-length norm`. */
  ignoreFieldNorm?: boolean
  /** Determines how much the `field-length norm` affects scoring. A value of `0` is equivalent to ignoring the field-length norm. A value of `0.5` will greatly reduce the effect of field-length norm, while a value of `2.0` will greatly increase it. */
  fieldNormWeight?: number
  /** Whether the matches should be included in the result set. When `true`, each record in the result set will include the indices of the matched characters. These can consequently be used for highlighting purposes. */
  includeMatches?: boolean
  /** Whether the score should be included in the result set. A score of `0`indicates a perfect match, while a score of `1` indicates a complete mismatch. */
  includeScore?: boolean
  /** List of keys that will be searched. This supports nested paths, weighted search, searching in arrays of `strings` and `objects`. */
  keys?: Array<FuseOptionKey<T>>
  /** Determines approximately where in the text is the pattern expected to be found. */
  location?: number
  /** Only the matches whose length exceeds this value will be returned. (For instance, if you want to ignore single character matches in the result, set it to `2`). */
  minMatchCharLength?: number
  /** Whether to sort the result list, by score. */
  shouldSort?: boolean
  /** The function to use to sort all the results. The default will sort by ascending relevance score, ascending index. */
  sortFn?: FuseSortFunction
  /** At what point does the match algorithm give up. A threshold of `0.0` requires a perfect match (of both letters and location), a threshold of `1.0` would match anything. */
  threshold?: number
  /** When `true`, it enables the use of unix-like search commands. See [example](/examples.html#extended-search). */
  useExtendedSearch?: boolean
}

/**
 * Denotes the start/end indices of a match
 *
 * @example
 *
 * ```ts
 * const startIndex = 0;
 * const endIndex = 5;
 *
 * const range: RangeTuple = [startIndex, endIndex];
 * ```
 */
type RangeTuple = [number, number]

type FuseResultMatch = {
  indices: ReadonlyArray<RangeTuple>
  key?: string
  refIndex?: number
  value?: string
}

type FuseSearchOptions = {
  limit: number
}

type FuseResult<T> = {
  item: T
  refIndex: number
  score?: number
  matches?: ReadonlyArray<FuseResultMatch>
}

type Expression =
  | { [key: string]: string }
  | {
      $path: ReadonlyArray<string>
      $val: string
    }
  | { $and?: Expression[] }
  | { $or?: Expression[] }

export { Expression, FuseGetFunction, FuseIndex, FuseIndexObjectRecord, FuseIndexOptions, FuseIndexRecords, FuseIndexStringRecord, FuseOptionKey, FuseOptionKeyObject, FuseResult, FuseResultMatch, FuseSearchOptions, FuseSortFunction, FuseSortFunctionArg, FuseSortFunctionItem, FuseSortFunctionMatch, FuseSortFunctionMatchList, IFuseOptions, RangeTuple, RecordEntry, RecordEntryArrayItem, RecordEntryObject, Fuse as default };
