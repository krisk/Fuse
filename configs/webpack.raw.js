const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'none',
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: 'sourcemaps/[file].map'
    })
  ]
})
