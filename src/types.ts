// ── Range / indices ────────────────────────────────────────────────

export type RangeTuple = [number, number]

// ── Search internals ───────────────────────────────────────────────

export interface SearchResult {
  isMatch: boolean
  score: number
  indices?: ReadonlyArray<RangeTuple>
  /** @internal Aggregation flag for extended-search inverse terms. */
  hasInverse?: boolean
  /**
   * @internal Token-search `tokenMatch: 'all'` coverage for this text.
   * `matchedMask` bit `i` ⇒ query term `i` matched here (≤31-term fast path);
   * `matchedTerms` is the equivalent set for the ≥32-term fallback.
   */
  matchedMask?: number
  /** @internal */
  matchedTerms?: Set<number>
  /** @internal Query token count; descriptor for the record-level AND gate. */
  termCount?: number
}

export interface Searcher {
  searchIn(text: string): SearchResult
}

export interface SearcherConstructor {
  new (pattern: string, options?: IFuseOptions<any>): Searcher
  condition?(pattern: string, options: IFuseOptions<any>): boolean
}

// ── Key types ──────────────────────────────────────────────────────

export interface FuseOptionKeyObject<T> {
  name: string | string[]
  weight?: number
  getFn?: (obj: T) => ReadonlyArray<string> | string | null | undefined
}

export type FuseOptionKey<T> = FuseOptionKeyObject<T> | string | string[]

export interface KeyObject {
  path: string[]
  id: string
  weight: number
  src: string | string[]
  getFn?:
    | ((obj: any) => ReadonlyArray<string> | string | null | undefined)
    | null
}

// ── Get function ───────────────────────────────────────────────────

export type FuseGetFunction<T> = (
  obj: T,
  path: string | string[]
) => ReadonlyArray<string> | string

export type GetFunction = (obj: any, path: string | string[]) => any

// ── Tokenize function (token search) ───────────────────────────────

/**
 * Custom tokenizer for `useTokenSearch`. Receives the field/query text after
 * case-folding and diacritic-stripping (per `isCaseSensitive` /
 * `ignoreDiacritics`) and must return the term list. Functions must be
 * deterministic — non-deterministic output silently breaks `df` accounting.
 */
export type FuseTokenizeFunction = (text: string) => string[]

// ── Norm ───────────────────────────────────────────────────────────

export interface NormInterface {
  get(value: string): number
  clear(): void
}

// ── Index records ──────────────────────────────────────────────────

export interface RecordEntryObject {
  /** The text value */
  v: string
  /** The field-length norm */
  n: number
}

export type RecordEntryArrayItem = ReadonlyArray<
  RecordEntryObject & { i: number }
>

export type RecordEntry = {
  [key: string]: RecordEntryObject | RecordEntryArrayItem
}

export interface FuseIndexObjectRecord {
  /** The index of the record in the source list */
  i: number
  $: RecordEntry
}

export interface FuseIndexStringRecord {
  /** The index of the record in the source list */
  i: number
  /** The text value */
  v: string
  /** The field-length norm */
  n: number
}

export type FuseIndexRecords =
  | ReadonlyArray<FuseIndexObjectRecord>
  | ReadonlyArray<FuseIndexStringRecord>

export interface IndexRecord {
  i: number
  v?: string
  n?: number
  $?: Record<number, SubRecord | SubRecord[]>
}

export interface SubRecord {
  v: string
  i?: number
  n: number
}

// ── Sort function types ────────────────────────────────────────────

export type FuseSortFunctionItem = {
  [key: string]: { $: string } | { $: string; idx: number }[]
}

export type FuseSortFunctionMatch = {
  score: number
  key: KeyObject
  value: string
  indices: ReadonlyArray<number>[]
}

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

// ── Match score (internal) ─────────────────────────────────────────

export interface MatchScore {
  score: number
  key?: KeyObject | null
  value: string
  idx?: number
  hasInverse?: boolean
  norm: number
  indices?: ReadonlyArray<RangeTuple>
  /** @internal Token-search `tokenMatch: 'all'` coverage carried up for record-level gating. */
  matchedMask?: number
  /** @internal */
  matchedTerms?: Set<number>
  /** @internal */
  termCount?: number
}

export interface InternalResult {
  idx: number
  item: any
  score?: number
  matches: MatchScore[]
}

// ── Options ────────────────────────────────────────────────────────

export interface IFuseOptions<T> {
  /** Indicates whether comparisons should be case sensitive. */
  isCaseSensitive?: boolean
  /** Indicates whether comparisons should ignore diacritics (accents). */
  ignoreDiacritics?: boolean
  /** Determines how close the match must be to the fuzzy location. */
  distance?: number
  /** When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string. */
  findAllMatches?: boolean
  /** The function to use to retrieve an object's value at the provided path. */
  getFn?: FuseGetFunction<T>
  /** When `true`, search will ignore `location` and `distance`. */
  ignoreLocation?: boolean
  /** When `true`, the calculation for the relevance score will ignore the field-length norm. */
  ignoreFieldNorm?: boolean
  /** Determines how much the field-length norm affects scoring. */
  fieldNormWeight?: number
  /** Whether the matches should be included in the result set. */
  includeMatches?: boolean
  /** Whether the score should be included in the result set. */
  includeScore?: boolean
  /** List of keys that will be searched. */
  keys?: Array<FuseOptionKey<T>>
  /** Determines approximately where in the text is the pattern expected to be found. */
  location?: number
  /** Only the matches whose length exceeds this value will be returned. */
  minMatchCharLength?: number
  /** Whether to sort the result list, by score. */
  shouldSort?: boolean
  /** The function to use to sort all the results. */
  sortFn?: FuseSortFunction
  /** At what point does the match algorithm give up. */
  threshold?: number
  /** When `true`, it enables the use of unix-like search commands. */
  useExtendedSearch?: boolean
  /** When `true`, enables token search with TF-IDF scoring. */
  useTokenSearch?: boolean
  /**
   * Tokenizer used by `useTokenSearch`, applied identically at index-build
   * and query time. Accepts either a global `RegExp` or a function returning
   * `string[]`. Defaults to `/[\p{L}\p{M}\p{N}_]+/gu`, which handles CJK,
   * Cyrillic, Greek, Arabic, Hebrew, Devanagari, etc. out of the box. Use a
   * function form (e.g. wrapping `Intl.Segmenter`) for word-segmentation in
   * scripts without whitespace boundaries.
   */
  tokenize?: RegExp | FuseTokenizeFunction
  /**
   * How the words of a multi-word query combine, for `useTokenSearch` only.
   * `'any'` (default) returns a record if it matches any query word (OR);
   * `'all'` returns it only when every query word matches somewhere in the
   * record — any field or array element (AND). Use `'all'` for filtering,
   * where adding a word should narrow the results. Has no effect unless
   * `useTokenSearch` is `true`.
   */
  tokenMatch?: 'all' | 'any'
}

export interface FuseIndexOptions<T> {
  getFn?: FuseGetFunction<T>
  fieldNormWeight?: number
}

// ── Search options ─────────────────────────────────────────────────

export interface FuseSearchOptions {
  limit?: number
}

// ── Result types ───────────────────────────────────────────────────

export interface FuseResultMatch {
  indices: ReadonlyArray<RangeTuple>
  key?: string
  refIndex?: number
  value?: string
}

export interface FuseResult<T> {
  item: T
  refIndex: number
  score?: number
  matches?: ReadonlyArray<FuseResultMatch>
}

// ── Expression (logical search) ────────────────────────────────────

export type Expression =
  | string
  | { [key: string]: string }
  | {
      $path: ReadonlyArray<string>
      $val: string
    }
  | { $and?: Expression[] }
  | { $or?: Expression[] }
