import { ExtendedSearch, NGramSearch } from './search'
import Config from './core/config'
import Fuse, { register } from './core'
import { createIndex } from './tools'

// ❗Order is important. DO NOT CHANGE.
register(ExtendedSearch, NGramSearch)

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.config = Config

export default Fuse
