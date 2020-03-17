const prod = require('./webpack.prod.js')
const dev = require('./webpack.dev.js')
const raw = require('./webpack.raw.js')

module.exports = [
  raw, dev, prod
]
