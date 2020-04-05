import { ExtendedSearch, NGramSearch } from './search'
import Fuse, { Config } from './core'
import { createIndex } from './tools'

Fuse.register(ExtendedSearch, NGramSearch)

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.config = Config

export default Fuse
