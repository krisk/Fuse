if (process.env.MODE === 'dev') {
  module.exports = require('../src')
} else {
  module.exports = require('../dist/fuse')
}