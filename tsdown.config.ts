import { defineConfig } from 'tsdown'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'

// Build matrix (12 runtime files + 3 declaration files), grouped by
// feature-set x NODE_ENV x minify so each group can carry its own `define`.
// Replaces the old Rollup/Babel/Terser orchestrator (scripts/configs.cjs +
// config-types.cjs + build.main.cjs). See .plans/active/017-tsup-build-migration.md.

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const VERSION = process.env.VERSION || pkg.version

const banner = `/**
 * Fuse.js v${VERSION} - ${pkg.description} (${pkg.homepage})
 *
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name} (${pkg.author.url})
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */`

const FULL = { LOGICAL: 'true', EXTENDED: 'true', TOKEN: 'true' }
const BASIC = { LOGICAL: 'false', EXTENDED: 'false', TOKEN: 'false' }

function define(flags: typeof FULL, env: 'development' | 'production') {
  return {
    __VERSION__: JSON.stringify(VERSION),
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.LOGICAL_SEARCH_ENABLED': flags.LOGICAL,
    'process.env.EXTENDED_SEARCH_ENABLED': flags.EXTENDED,
    'process.env.TOKEN_SEARCH_ENABLED': flags.TOKEN
  }
}

const shared = {
  // Match the tsconfig baseline; avoids tsdown deriving target: node10 from
  // package.json engines (which would downlevel modern syntax).
  target: 'es2020',
  platform: 'neutral',
  treeshake: true,
  sourcemap: false,
  outDir: 'dist',
  // The npm `build` script does `rm -rf dist` once; per-config clean would
  // race-wipe sibling outputs.
  clean: false,
  dts: false,
  // rolldown defaults ESM to `.js`; the package exports map uses `.mjs`/`.cjs`.
  // Force a single `.d.ts` (not per-format `.d.cts`/`.d.mts`) — the types are
  // format-agnostic and all exports map conditions point at one `.d.ts`.
  outExtensions: ({ format }: { format: string }) => ({
    js: format === 'cjs' ? '.cjs' : '.mjs',
    dts: '.d.ts'
  }),
  banner: { js: banner }
} as const

// The `fuse.js/worker-script` entry is a side-effect Worker module with no
// exports; bundlers resolve the import to the script's asset URL (a string).
// rolldown-dts can't synthesize a string default from a no-export module, so
// emit this declaration literally (mirrors the old config-types.cjs hack).
function writeWorkerScriptDts() {
  const tsVersion = require('typescript').version
  const code =
    `// Type definitions for Fuse.js v${VERSION}\n` +
    `// TypeScript v${tsVersion}\n` +
    '// `fuse.js/worker-script` resolves to the worker script URL, surfaced\n' +
    '// by your bundler as a string.\n' +
    'declare const workerScriptUrl: string\n' +
    'export default workerScriptUrl\n'
  writeFileSync(resolve('dist/fuse.worker.d.ts'), code)
}

export default defineConfig([
  // full build (dev, non-min) — default package export; owns fuse.d.ts
  {
    ...shared,
    entry: { fuse: 'src/entry.ts' },
    format: ['cjs', 'esm'],
    minify: false,
    define: define(FULL, 'development'),
    dts: true
  },
  // full build (prod, min) — ./min
  {
    ...shared,
    entry: { 'fuse.min': 'src/entry.ts' },
    format: ['cjs', 'esm'],
    minify: true,
    define: define(FULL, 'production')
  },
  // basic build (dev, non-min) — ./basic
  {
    ...shared,
    entry: { 'fuse.basic': 'src/entry.ts' },
    format: ['cjs', 'esm'],
    minify: false,
    define: define(BASIC, 'development')
  },
  // basic build (prod, min) — ./min-basic
  {
    ...shared,
    entry: { 'fuse.basic.min': 'src/entry.ts' },
    format: ['cjs', 'esm'],
    minify: true,
    define: define(BASIC, 'production')
  },
  // worker proxy (FuseWorker class; named CJS export) — ./worker.
  // CJS and ESM are split so `__WORKER_IS_CJS__` can be defined per format: the
  // CJS output prefers the document-captured base in browsers (import.meta.url's
  // CJS rewrite may be polyfilled), while ESM keeps the static import.meta.url
  // literal for bundler worker-asset detection. ESM owns the `.d.ts`.
  {
    ...shared,
    entry: { 'fuse-worker': 'src/workers/index.ts' },
    format: ['cjs'],
    minify: false,
    define: { ...define(FULL, 'production'), __WORKER_IS_CJS__: 'true' }
  },
  {
    ...shared,
    entry: { 'fuse-worker': 'src/workers/index.ts' },
    format: ['esm'],
    minify: false,
    define: { ...define(FULL, 'production'), __WORKER_IS_CJS__: 'false' },
    dts: true
  },
  // self-contained worker script (ESM, side-effect) — ./worker-script; writes literal dts
  {
    ...shared,
    entry: { 'fuse.worker': 'src/workers/worker.ts' },
    format: ['esm'],
    minify: false,
    define: define(FULL, 'production'),
    onSuccess: writeWorkerScriptDts
  },
  // self-contained worker script (ESM, min)
  {
    ...shared,
    entry: { 'fuse.worker.min': 'src/workers/worker.ts' },
    format: ['esm'],
    minify: true,
    define: define(FULL, 'production')
  }
])
