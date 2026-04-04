// Type definitions for Fuse.js v7.3.0
// TypeScript v6.0.2
type RangeTuple = [number, number];
interface SearchResult {
    isMatch: boolean;
    score: number;
    indices?: ReadonlyArray<RangeTuple>;
    hasInverse?: boolean;
}
interface Searcher {
    searchIn(text: string): SearchResult;
}
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
type GetFunction = (obj: any, path: string | string[]) => any;
interface NormInterface {
    get(value: string): number;
    clear(): void;
}
interface RecordEntryObject {
    /** The text value */
    v: string;
    /** The field-length norm */
    n: number;
}
type RecordEntryArrayItem = ReadonlyArray<RecordEntryObject & {
    i: number;
}>;
type RecordEntry = {
    [key: string]: RecordEntryObject | RecordEntryArrayItem;
};
interface FuseIndexObjectRecord {
    /** The index of the record in the source list */
    i: number;
    $: RecordEntry;
}
interface FuseIndexStringRecord {
    /** The index of the record in the source list */
    i: number;
    /** The text value */
    v: string;
    /** The field-length norm */
    n: number;
}
type FuseIndexRecords = ReadonlyArray<FuseIndexObjectRecord> | ReadonlyArray<FuseIndexStringRecord>;
interface IndexRecord {
    i: number;
    v?: string;
    n?: number;
    $?: Record<number, SubRecord | SubRecord[]>;
}
interface SubRecord {
    v: string;
    i?: number;
    n: number;
}
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
interface MatchScore {
    score: number;
    key?: KeyObject | null;
    value: string;
    idx?: number;
    hasInverse?: boolean;
    norm: number;
    indices?: ReadonlyArray<RangeTuple>;
}
interface InternalResult {
    idx: number;
    item: any;
    score?: number;
    matches: MatchScore[];
}
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
}
interface FuseIndexOptions<T> {
    getFn?: FuseGetFunction<T>;
    fieldNormWeight?: number;
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
type Expression = string | {
    [key: string]: string;
} | {
    $path: ReadonlyArray<string>;
    $val: string;
} | {
    $and?: Expression[];
} | {
    $or?: Expression[];
};

declare class FuseIndex<T = any> {
    norm: NormInterface;
    getFn: GetFunction;
    isCreated: boolean;
    docs: ReadonlyArray<T>;
    records: IndexRecord[];
    keys: KeyObject[];
    _keysMap: Record<string, number>;
    constructor({ getFn, fieldNormWeight }?: FuseIndexOptions<T>);
    setSources(docs?: ReadonlyArray<T>): void;
    setIndexRecords(records?: IndexRecord[]): void;
    setKeys(keys?: KeyObject[]): void;
    create(): void;
    add(doc: T): void;
    removeAt(idx: number): void;
    removeAll(indices: number[]): void;
    getValueForItemAtKeyId(item: any, keyId: string): any;
    size(): number;
    _addString(doc: string, docIndex: number): void;
    _addObject(doc: any, docIndex: number): void;
    toJSON(): {
        keys: ReadonlyArray<Omit<KeyObject, 'getFn'>>;
        records: IndexRecord[];
    };
}
declare function createIndex<T>(keys: FuseOptionKey<T>[], docs: ReadonlyArray<T>, { getFn, fieldNormWeight }?: FuseIndexOptions<T>): FuseIndex<T>;
declare function parseIndex<T>(data: {
    keys: ReadonlyArray<KeyObject>;
    records: IndexRecord[];
}, { getFn, fieldNormWeight }?: FuseIndexOptions<T>): FuseIndex<T>;

declare class KeyStore {
    _keys: KeyObject[];
    _keyMap: Record<string, KeyObject>;
    constructor(keys: FuseOptionKey<any>[]);
    get(keyId: string): KeyObject;
    keys(): KeyObject[];
    toJSON(): string;
}

interface ParsedLeaf {
    keyId: string | null;
    pattern: string;
    searcher?: Searcher;
}
interface ParsedOperator {
    children: ParsedNode[];
    operator: string;
}
type ParsedNode = ParsedLeaf | ParsedOperator;
declare function parse(query: Expression, options: any, { auto }?: {
    auto?: boolean | undefined;
}): ParsedNode;

declare const Config: Required<IFuseOptions<any>>;

declare class MaxHeap {
    limit: number;
    heap: InternalResult[];
    constructor(limit: number);
    get size(): number;
    shouldInsert(score: number): boolean;
    insert(item: InternalResult): void;
    extractSorted(sortFn: (a: InternalResult, b: InternalResult) => number): InternalResult[];
    _bubbleUp(i: number): void;
    _sinkDown(i: number): void;
}

interface Posting {
    docIdx: number;
    keyIdx: number;
    subIdx: number;
    tf: number;
}
interface InvertedIndexData {
    terms: Map<string, Posting[]>;
    fieldCount: number;
    df: Map<string, number>;
}

interface HeapSearchOptions {
    heap?: MaxHeap;
    ignoreFieldNorm?: boolean;
}
declare class Fuse<T> {
    options: Required<IFuseOptions<T>>;
    _keyStore: KeyStore;
    _docs: T[];
    _myIndex: FuseIndex<T>;
    _invertedIndex: InvertedIndexData | null;
    _lastQuery: string | null;
    _lastSearcher: Searcher | null;
    static version: string;
    static createIndex: typeof createIndex;
    static parseIndex: typeof parseIndex;
    static config: typeof Config;
    static parseQuery: typeof parse;
    static use: (...plugins: any[]) => void;
    static match: (pattern: string, text: string, options?: IFuseOptions<any>) => SearchResult;
    constructor(docs: ReadonlyArray<T>, options?: IFuseOptions<T>, index?: FuseIndex<T>);
    _getSearcher(query: string): Searcher;
    setCollection(docs: ReadonlyArray<T>, index?: FuseIndex<T>): void;
    add(doc: T): void;
    remove(predicate?: (doc: T, idx: number) => boolean): T[];
    removeAt(idx: number): T;
    getIndex(): FuseIndex<T>;
    search(query: string | Expression, options?: FuseSearchOptions): FuseResult<T>[];
    _searchStringList(query: string, { heap, ignoreFieldNorm }?: HeapSearchOptions): InternalResult[] | null;
    _searchLogical(query: Expression): InternalResult[];
    _searchObjectList(query: string, { heap, ignoreFieldNorm }?: HeapSearchOptions): InternalResult[] | null;
    _findMatches({ key, value, searcher }: {
        key: KeyObject | null;
        value: SubRecord | SubRecord[] | undefined;
        searcher: Searcher;
    }): MatchScore[];
}

export { FuseIndex, Fuse as default };
export type { Expression, FuseGetFunction, FuseIndexObjectRecord, FuseIndexOptions, FuseIndexRecords, FuseIndexStringRecord, FuseOptionKey, FuseOptionKeyObject, FuseResult, FuseResultMatch, FuseSearchOptions, FuseSortFunction, FuseSortFunctionArg, FuseSortFunctionItem, FuseSortFunctionMatch, FuseSortFunctionMatchList, IFuseOptions, RangeTuple, RecordEntry, RecordEntryArrayItem, RecordEntryObject, SearchResult };
