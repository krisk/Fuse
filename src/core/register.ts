import { BitapSearch } from '../search'
import type { Searcher } from '../types'

const registeredSearchers: any[] = []

export default function register(...args: any[]): void {
  registeredSearchers.push(...args)
}

// ── Object-query compiler seam ────────────────────────────────────
//
// The object ("MongoDB-style") query compiler lives in the extended-search
// layer, which core must not statically import (it would defeat basic-build
// tree-shaking — `Fuse.parseQuery` keeps queryParser live in the basic dev
// bundle). Instead the compiler is registered here under EXTENDED_SEARCH_ENABLED
// (entry.ts / worker.ts) and queryParser resolves it dynamically.

type ObjectCompiler = (
  fieldValue: any,
  keyPath: string,
  options: any
) => Searcher

let objectCompiler: ObjectCompiler | null = null

export function registerObjectCompiler(fn: ObjectCompiler): void {
  objectCompiler = fn
}

export function getObjectCompiler(): ObjectCompiler | null {
  return objectCompiler
}

export function createSearcher(pattern: string, options: any): Searcher {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    const searcherClass = registeredSearchers[i]
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}
