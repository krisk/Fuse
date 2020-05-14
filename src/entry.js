import Fuse from './core'
import Config from './core/config'
import { createIndex, parseIndex } from './tools/FuseIndex'
import { parse } from './core/queryParser'
import { ExtendedSearch } from './search'
import register from './core/register'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.parseIndex = parseIndex
Fuse.config = Config

if (process.env.NODE_ENV === 'development') {
  Fuse.parseQuery = parse
}

if (process.env.EXTENDED_SEARCH_ENABLED) {
  register(ExtendedSearch)
}

export default Fuse
