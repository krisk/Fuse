import Fuse from './core/index'
import { createIndex } from './tools/index'

Fuse.version = '__VERSION__'
Fuse.createIndex = createIndex

export default Fuse