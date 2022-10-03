const path = require('path')
const resolve = (_path) => path.resolve(__dirname, '../', _path)
const dts = require('rollup-plugin-dts').default;
const pckg = require('../package.json')
const typescript = require('typescript')

const FILENAME = 'fuse'
const VERSION = process.env.VERSION || pckg.version

const banner = [
  `// Type definitions for Fuse.js v${VERSION}`,
  `// TypeScript v${typescript.version}`
].join('\n')

const configTypes = {
  input: resolve('src/index.d.ts'),
  output: {
    banner,
    file: resolve(`dist/${FILENAME}.d.ts`),
    format: 'es',
    name: 'Fuse'
  },
  plugins: [
    dts({
      tsconfig: resolve('src/tsconfig.json')
    })
  ],
  cache: false
}

module.exports = configTypes;
