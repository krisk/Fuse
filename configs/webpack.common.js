const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const pckg = require('../package.json')

const LIBRARY_NAME = 'fuse'
const VERSION = pckg.version
const AUTHOR = pckg.author
const HOMEPAGE = pckg.homepage

const copyright = fs.readFileSync(path.resolve(__dirname, '../COPYRIGHT.txt'), 'UTF8')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  module: {
    rules: [{
      test: /\.?(j|t)s$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript']
        }
      }
    }]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: copyright
        .replace('{VERSION}', `v${VERSION}`)
        .replace('{AUTHOR_URL}', `${AUTHOR.url}`)
        .replace('{HOMEPAGE}', `${HOMEPAGE}`),
      entryOnly: true
    })
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `${LIBRARY_NAME}.js`,
    library: 'Fuse',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  }
}
