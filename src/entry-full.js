import { ExtendedSearch } from './search'
import Config from './core/config'
import Fuse from './core'
import register from './core/register'
import { createIndex, parseIndex } from './tools/FuseIndex'

register(ExtendedSearch)

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.parseIndex = parseIndex
Fuse.config = Config

export default Fuse
