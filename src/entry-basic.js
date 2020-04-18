import Fuse from './core'
import Config from './core/config'
import { createIndex } from './tools'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.config = Config

export default Fuse
