import Fuse from './core'
import Config from './core/config'
import { createIndex, parseIndex } from './tools/FuseIndex'
import { parse } from './core/queryParser'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.parseIndex = parseIndex
Fuse.config = Config

if (process.env.NODE_ENV === 'development') {
  Fuse.parseQuery = parse
}

export default Fuse
