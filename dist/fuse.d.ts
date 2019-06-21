// Type definitions for Fuse.js v3.4.5
// TypeScript Version: 3.1

export = Fuse;
export as namespace Fuse;

interface SearchOpts {
  limit?: number
}

declare class Fuse<T, O extends Fuse.FuseOptions<any> = Fuse.FuseOptions<any>> {
  constructor(list: ReadonlyArray<T>, options?: O)
  search(pattern: string, opts?: SearchOpts): O extends { id: keyof T } ?
    O extends ({ includeMatches: true; } | { includeScore: true; }) ? Fuse.FuseResult<string>[] : string[] :
    O extends ({ includeMatches: true; } | { includeScore: true; }) ? Fuse.FuseResult<T>[] : T[];

  setCollection(list: ReadonlyArray<T>): ReadonlyArray<T>;
}

declare namespace Fuse {
  export interface FuseResult<T> {
    item: T,
    matches?: any;
    score?: number;
  }
  type SearchValue = string | number
  export type FuseKey<T> =
    | keyof T
    | { name: keyof T; weight: number }
    | { name: string, weight?: number, getFn: (obj: T) => SearchValue }
  export interface FuseOptions<T> {
    id?: keyof T;
    caseSensitive?: boolean;
    includeMatches?: boolean;
    includeScore?: boolean;
    shouldSort?: boolean;
    sortFn?: (a: { score: number }, b: { score: number }) => number;
    getFn?: (obj: T, path: keyof T) => SearchValue;
    keys?: FuseKey<T>[];
    verbose?: boolean;
    tokenize?: boolean;
    tokenSeparator?: RegExp;
    matchAllTokens?: boolean;
    location?: number;
    distance?: number;
    threshold?: number;
    maxPatternLength?: number;
    minMatchCharLength?: number;
    findAllMatches?: boolean;
  }
}
