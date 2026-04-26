import Fuse from './core'
import Config from './core/config'
import { createIndex, parseIndex } from './tools/FuseIndex'
import { parse } from './core/queryParser'
import { ExtendedSearch } from './search'
import TokenSearch from './search/token'
import register, { createSearcher } from './core/register'
import * as ErrorMsg from './core/errorMessages'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.parseIndex = parseIndex
Fuse.config = Config

Fuse.match = function (pattern: string, text: string, options?: any) {
  // Token search needs corpus statistics (df, fieldCount) that a one-off
  // string comparison can't provide. Reject it here so the contract is the
  // same in the full and basic builds — without this guard, the full build
  // crashes with an opaque TypeError and the basic build silently falls back
  // to fuzzy matching.
  if (options && options.useTokenSearch) {
    throw new Error(ErrorMsg.FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED)
  }
  const searcher = createSearcher(pattern, { ...Config, ...options })
  return searcher.searchIn(text)
}

if (process.env.NODE_ENV === 'development') {
  Fuse.parseQuery = parse
}

if (process.env.EXTENDED_SEARCH_ENABLED) {
  register(ExtendedSearch)
}

if (process.env.TOKEN_SEARCH_ENABLED) {
  register(TokenSearch)
}

Fuse.use = function (...plugins: any[]) {
  plugins.forEach((plugin: any) => register(plugin))
}

export default Fuse

// Re-export public types
export type {
  IFuseOptions,
  FuseGetFunction,
  FuseOptionKey,
  FuseOptionKeyObject,
  FuseResult,
  FuseResultMatch,
  FuseSearchOptions,
  FuseSortFunction,
  FuseSortFunctionArg,
  FuseSortFunctionItem,
  FuseSortFunctionMatch,
  FuseSortFunctionMatchList,
  FuseIndexOptions,
  FuseIndexRecords,
  FuseIndexObjectRecord,
  FuseIndexStringRecord,
  RecordEntry,
  RecordEntryObject,
  RecordEntryArrayItem,
  RangeTuple,
  Expression,
  SearchResult
} from './types'

export type { default as FuseIndex } from './tools/FuseIndex'
