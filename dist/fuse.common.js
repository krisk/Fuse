if (process.env.NODE_ENV === 'production') {
  module.exports = require('./fuse.common.prod.js')
} else {
  module.exports = require('./fuse.common.dev.js')
}