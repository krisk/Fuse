
//#region src/types.d.ts
type RangeTuple = [number, number];
interface FuseOptionKeyObject<T> {
  name: string | string[];
  weight?: number;
  getFn?: (obj: T) => ReadonlyArray<string> | string | null | undefined;
}
type FuseOptionKey<T> = FuseOptionKeyObject<T> | string | string[];
interface KeyObject {
  path: string[];
  id: string;
  weight: number;
  src: string | string[];
  getFn?: ((obj: any) => ReadonlyArray<string> | string | null | undefined) | null;
}
type FuseGetFunction<T> = (obj: T, path: string | string[]) => ReadonlyArray<string> | string;
/**
 * Custom tokenizer for `useTokenSearch`. Receives the field/query text after
 * case-folding and diacritic-stripping (per `isCaseSensitive` /
 * `ignoreDiacritics`) and must return the term list. Functions must be
 * deterministic — non-deterministic output silently breaks `df` accounting.
 */
type FuseTokenizeFunction = (text: string) => string[];
type FuseSortFunctionItem = {
  [key: string]: {
    $: string;
  } | {
    $: string;
    idx: number;
  }[];
};
type FuseSortFunctionMatch = {
  score: number;
  key: KeyObject;
  value: string;
  indices: ReadonlyArray<number>[];
};
type FuseSortFunctionMatchList = FuseSortFunctionMatch & {
  idx: number;
};
type FuseSortFunctionArg = {
  idx: number;
  item: FuseSortFunctionItem;
  score: number;
  matches?: (FuseSortFunctionMatch | FuseSortFunctionMatchList)[];
};
type FuseSortFunction = (a: FuseSortFunctionArg, b: FuseSortFunctionArg) => number;
interface IFuseOptions<T> {
  /** Indicates whether comparisons should be case sensitive. */
  isCaseSensitive?: boolean;
  /** Indicates whether comparisons should ignore diacritics (accents). */
  ignoreDiacritics?: boolean;
  /** Determines how close the match must be to the fuzzy location. */
  distance?: number;
  /** When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string. */
  findAllMatches?: boolean;
  /** The function to use to retrieve an object's value at the provided path. */
  getFn?: FuseGetFunction<T>;
  /** When `true`, search will ignore `location` and `distance`. */
  ignoreLocation?: boolean;
  /** When `true`, the calculation for the relevance score will ignore the field-length norm. */
  ignoreFieldNorm?: boolean;
  /** Determines how much the field-length norm affects scoring. */
  fieldNormWeight?: number;
  /** Whether the matches should be included in the result set. */
  includeMatches?: boolean;
  /** Whether the score should be included in the result set. */
  includeScore?: boolean;
  /** List of keys that will be searched. */
  keys?: Array<FuseOptionKey<T>>;
  /** Determines approximately where in the text is the pattern expected to be found. */
  location?: number;
  /** Only the matches whose length exceeds this value will be returned. */
  minMatchCharLength?: number;
  /** Whether to sort the result list, by score. */
  shouldSort?: boolean;
  /** The function to use to sort all the results. */
  sortFn?: FuseSortFunction;
  /** At what point does the match algorithm give up. */
  threshold?: number;
  /** When `true`, it enables the use of unix-like search commands. */
  useExtendedSearch?: boolean;
  /** When `true`, enables token search with TF-IDF scoring. */
  useTokenSearch?: boolean;
  /**
   * Tokenizer used by `useTokenSearch`, applied identically at index-build
   * and query time. Accepts either a global `RegExp` or a function returning
   * `string[]`. Defaults to `/[\p{L}\p{M}\p{N}_]+/gu`, which handles CJK,
   * Cyrillic, Greek, Arabic, Hebrew, Devanagari, etc. out of the box. Use a
   * function form (e.g. wrapping `Intl.Segmenter`) for word-segmentation in
   * scripts without whitespace boundaries.
   */
  tokenize?: RegExp | FuseTokenizeFunction;
  /**
   * How the words of a multi-word query combine, for `useTokenSearch` only.
   * `'any'` (default) returns a record if it matches any query word (OR);
   * `'all'` returns it only when every query word matches somewhere in the
   * record — any field or array element (AND). Use `'all'` for filtering,
   * where adding a word should narrow the results. Has no effect unless
   * `useTokenSearch` is `true`.
   */
  tokenMatch?: 'all' | 'any';
}
interface FuseSearchOptions {
  limit?: number;
}
interface FuseResultMatch {
  indices: ReadonlyArray<RangeTuple>;
  key?: string;
  refIndex?: number;
  value?: string;
}
interface FuseResult<T> {
  item: T;
  refIndex: number;
  score?: number;
  matches?: ReadonlyArray<FuseResultMatch>;
}
type Primitive = string;
type NotForbidden = {
  $fuzzy?: never;
  $eq?: never;
  $not?: never;
  $and?: never;
  $or?: never;
};
/**
 * The operand of `$not`: exactly ONE negatable operator. Multiple would be
 * ambiguous (Mongo reads the inner object as a conjunction, so `NOT(A AND B)`
 * is `NOT A OR NOT B`, an OR this grammar cannot express inside an AND group).
 */
type NotClause = ({
  $contains: Primitive;
  $startsWith?: never;
  $endsWith?: never;
} & NotForbidden) | ({
  $startsWith: Primitive;
  $contains?: never;
  $endsWith?: never;
} & NotForbidden) | ({
  $endsWith: Primitive;
  $contains?: never;
  $startsWith?: never;
} & NotForbidden);
/** The object-query operators, all optional. */
interface QueryOperators {
  /** Typo-tolerant (edit-distance) fuzzy match. */
  $fuzzy?: Primitive;
  /** Whole candidate string equals the value. */
  $eq?: Primitive;
  /** Candidate contains the value (substring). */
  $contains?: Primitive;
  /** Candidate starts with the value. */
  $startsWith?: Primitive;
  /** Candidate ends with the value. */
  $endsWith?: Primitive;
  /**
   * Negates exactly one of `$contains` / `$startsWith` / `$endsWith`,
   * e.g. `{ $not: { $contains: 'draft' } }`.
   */
  $not?: NotClause;
}
type NoOperators = { [K in keyof QueryOperators]?: never };
/** Operator-only clause: one or more operators, no `$and`/`$or` siblings. */
type OperatorClause = QueryOperators & {
  $and?: never;
  $or?: never;
};
/** Field-local AND: operator-only clauses, no nested `$and`/`$or`, no operator siblings. */
type FieldAnd = {
  $and: OperatorClause[];
  $or?: never;
} & NoOperators;
/** Field-local OR of ANDs (2-level max): no nested `$or`, no operator siblings. */
type FieldOr = {
  $or: Array<OperatorClause | FieldAnd>;
  $and?: never;
} & NoOperators;
/** A single field's object query. */
type FieldQuery = OperatorClause | FieldAnd | FieldOr;
type KeyedLeaf = {
  [key: string]: string | FieldQuery;
};
type PathLeafString = {
  $path: ReadonlyArray<string>;
  $val: string;
};
type PathLeafQuery = {
  $path: ReadonlyArray<string>;
  $val: string | FieldQuery;
};
/** An expression nested inside `$and`/`$or` (object `$val` on `$path` allowed here). */
type ChildExpression = string | KeyedLeaf | PathLeafQuery | {
  $and?: ChildExpression[];
} | {
  $or?: ChildExpression[];
};
type Expression = string | KeyedLeaf | PathLeafString | {
  $and?: ChildExpression[];
} | {
  $or?: ChildExpression[];
};
//#endregion
//#region src/workers/FuseWorker.d.ts
interface FuseWorkerOptions {
  /** Number of parallel workers. Defaults to navigator.hardwareConcurrency (max 8). */
  numWorkers?: number;
  /** Custom URL to the worker script. If not provided, resolves automatically via import.meta.url. */
  workerUrl?: string | URL;
}
declare class FuseWorker<T> {
  private _options;
  private _workerOptions;
  private _docs;
  private _shards;
  private _addCursor;
  private _initPromise;
  private _pending;
  private _nextId;
  private _workerUrl;
  constructor(docs: ReadonlyArray<T>, options?: IFuseOptions<T>, workerOptions?: FuseWorkerOptions);
  private static _assertNoFunctionOptions;
  private _getNumWorkers;
  private _ensureInit;
  private _spawnWorker;
  private _workerInitOptions;
  private _init;
  private _call;
  search(query: string | Expression, options?: FuseSearchOptions): Promise<FuseResult<T>[]>;
  add(doc: T): Promise<void>;
  setCollection(docs: ReadonlyArray<T>): Promise<void>;
  terminate(): void;
}
//#endregion
export { FuseWorker, type FuseWorkerOptions };