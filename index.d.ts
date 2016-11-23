// Type definitions for Fuse.js 2.5.0

declare module 'fuse.js' {
  export class Fuse {
    constructor(list: any[], options?: IFuseOptions)

    public search(pattern: string): any[];
  }

  interface IFuseOptions extends ISearchOptions {
    caseSensitive?: boolean;
    include?: string[];
    shouldSort?: boolean;
    searchFn?: any;
    sortFn?: (a: { score: number }, b: { score: number }) => number;
    getFn?: (obj: any, path: string) => any;
    keys?: string[] | { name: string; weight: number }[];
    verbose?: boolean;
  }

  interface ISearchOptions {
    tokenize?: boolean;
    tokenSeparator?: RegExp;
    matchAllTokens?: boolean;
    location?: number;
    distance?: number;
    threshold?: number;
    maxPatternLength?: number;
  }
}

declare const Fuse;
