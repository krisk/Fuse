import Fuse, { defaultOptions } from './core'
import { createIndex } from './tools'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex
Fuse.defaultOptions = defaultOptions

export default Fuse
