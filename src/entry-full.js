import { ExtendedSearch } from './search'
import Config from './core/config'
import Fuse, { register } from './core'
import { createIndex } from './tools'
// import parseQuery from './core/parser'

register(ExtendedSearch)

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.config = Config

// if (process.env.NODE_ENV === 'development') {
//   Fuse.parseQuery = parseQuery
// }

export default Fuse
