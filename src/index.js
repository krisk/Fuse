import Fuse, { Config } from './core'
import { createIndex } from './tools'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.config = Config

export default Fuse
