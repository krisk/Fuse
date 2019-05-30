const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const pckg = require('../package.json')
const CopyPlugin = require('copy-webpack-plugin')

const LIBRARY_NAME = 'fuse'
const VERSION = pckg.version
const AUTHOR = pckg.author
const HOMEPAGE = pckg.homepage

const copyright = fs.readFileSync(path.resolve(__dirname, '../COPYRIGHT.txt'), 'UTF8')
const banner = copyright
  .replace('{VERSION}', `v${VERSION}`)
  .replace('{AUTHOR_URL}', `${AUTHOR.url}`)
  .replace('{HOMEPAGE}', `${HOMEPAGE}`)

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
    new CopyPlugin([{
      from: path.resolve(__dirname, '../src/typings.d.ts'),
      to: path.resolve(__dirname, '../dist/fuse.d.ts'),
      transform (content, path) {
        return `// Type definitions for Fuse.js v${VERSION}\n${content}`
      }
    }]),
    new webpack.BannerPlugin({
      banner,
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
