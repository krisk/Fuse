// Type definitions for Fuse.js 2.6.1

declare module 'fuse.js' {
    namespace fuse.js {
        export class Fuse {
            constructor(list: any[], options?: fuse.js.FuseOptions)
            search<T>(pattern: string): T[];
            search(pattern: string): any[];
        }
        export interface FuseOptions {
            id?: string;
            caseSensitive?: boolean;
            include?: string[];
            shouldSort?: boolean;
            searchFn?: any;
            sortFn?: (a: { score: number }, b: { score: number }) => number;
            getFn?: (obj: any, path: string) => any;
            keys?: string[] | { name: string; weight: number }[];
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
    declare const Fuse = fuse.js.Fuse;
    export = Fuse;
}

declare const Fuse: fuse.js.Fuse;
