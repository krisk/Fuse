import Fuse from './core'
import Config from './core/config'
import { createIndex, parseIndex } from './tools/FuseIndex'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.parseIndex = parseIndex
Fuse.config = Config

export default Fuse
