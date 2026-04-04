import Fuse from './core'
import Config from './core/config'
import { createIndex, parseIndex } from './tools/FuseIndex'
import { parse } from './core/queryParser'
import { ExtendedSearch } from './search'
import TokenSearch from './search/token'
import register, { createSearcher } from './core/register'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.parseIndex = parseIndex
Fuse.config = Config

Fuse.match = function (pattern: string, text: string, options?: any) {
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
