import { ExtendedSearch } from './search'
import Config from './core/config'
import Fuse, { register } from './core'
import { createIndex } from './tools'

register(ExtendedSearch)

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.config = Config

export default Fuse
