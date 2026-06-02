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

// One rollup-dts bundle per public entry point. The worker API ships from a
// separate entry (fuse.js/worker), so it needs its own declaration file.
const rollupConfigs = [
  genTypeConfig('src/entry.ts', `dist/${FILENAME}.d.ts`),
  genTypeConfig('src/workers/index.ts', `dist/${FILENAME}-worker.d.ts`)
]

// The ./worker-script entry (dist/fuse.worker.mjs) is a side-effect Worker
// module with no exports; loading it on the main thread throws. Bundlers
// resolve the import to the script's asset URL (a string), which is the only
// honest public type. rollup-plugin-dts can't synthesize a string default
// from a no-export module, so emit this declaration literally.
const literalTypes = [
  {
    file: resolve(`dist/${FILENAME}.worker.d.ts`),
    code:
      banner +
      '\n// `fuse.js/worker-script` resolves to the worker script URL,' +
      ' surfaced\n// by your bundler as a string.\n' +
      'declare const workerScriptUrl: string\n' +
      'export default workerScriptUrl\n'
  }
]

module.exports = { rollupConfigs, literalTypes };
