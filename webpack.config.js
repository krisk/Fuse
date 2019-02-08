const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const pckg = require('./package.json')
const MinifyPlugin = require('babel-minify-webpack-plugin')

const LIBRARY_NAME = 'fuse'
const VERSION = pckg.version
const AUTHOR = pckg.author
const HOMEPAGE = pckg.homepage

let copyright = fs.readFileSync('COPYRIGHT.txt', 'UTF8')

module.exports = (env, argv) => {
  const isMin = !!argv.minify

  let plugins = []
  if (isMin) {
    plugins.push(new MinifyPlugin())
  }
  plugins = [
    ...plugins,
    new webpack.BannerPlugin({
      banner: copyright
        .replace('{VERSION}', `v${VERSION}`)
        .replace('{AUTHOR_URL}', `${AUTHOR.url}`)
        .replace('{HOMEPAGE}', `${HOMEPAGE}`),
      entryOnly: true
    })
  ]

  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${LIBRARY_NAME}${isMin ? '.min' : ''}.js`,
      library: 'Fuse',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'this'
    },
    devtool: false,
    module: {
      rules: [{
        test: /(\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }]
    },
    plugins
  }
}
