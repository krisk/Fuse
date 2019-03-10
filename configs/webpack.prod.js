const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new CopyPlugin([{
      from: path.resolve(__dirname, '../src/typings.d.ts'),
      to: path.resolve(__dirname, '../dist/fuse.d.ts')
    }])
  ],
  optimization: {
    minimizer: [new TerserPlugin()]
  }
})
