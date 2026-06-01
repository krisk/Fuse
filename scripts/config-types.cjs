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

function genTypeConfig(input, dest) {
  return {
    input: resolve(input),
    output: {
      banner,
      file: resolve(dest),
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
}

// One bundle per public entry point. The worker API ships from a separate
// entry (fuse.js/worker), so it needs its own declaration file.
const configTypes = [
  genTypeConfig('src/entry.ts', `dist/${FILENAME}.d.ts`),
  genTypeConfig('src/workers/index.ts', `dist/${FILENAME}-worker.d.ts`)
]

module.exports = configTypes;
