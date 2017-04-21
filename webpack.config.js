const webpack = require('webpack')
const path = require('path')

const LIBRARY_NAME = 'fuse'
const VERSION = require('./package.json').version

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const env = process.env.WEBPACK_ENV

let outputFile
let plugins = []

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  outputFile = `${LIBRARY_NAME}.min.js`
} else {
  outputFile = `${LIBRARY_NAME}.js`
}

const config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  entry: './src',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: LIBRARY_NAME,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /(\.js)$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/
    }]
  },
  plugins: plugins
}

module.exports = config