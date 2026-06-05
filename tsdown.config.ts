import { defineConfig } from 'tsdown'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'

// Build matrix (12 runtime files + 5 declaration files: 3 `.d.ts` + 2 `.d.cts`),
// grouped by
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

// Derive a CommonJS declaration (`.d.cts`) from a just-emitted `.d.ts`.
// CJS consumers under moduleResolution node16/nodenext reach types through the
// `require` exports condition; without a `.d.cts` they resolve the `.d.ts`,
// which TS reads as ESM (the package is `"type": "module"`) — so a `require`
// import masquerades as ESM and errors with TS1479. See #780 / Plan 018.
//
// rolldown-dts always ends a declaration with one barrel `export { … }`. The
// declarations above it are format-agnostic and copied verbatim; only the
// barrel is rewritten:
//   - default-exporting entry (lib builds; runtime `module.exports = Fuse`):
//     the runtime-accurate CJS type is `export =`, so re-export the named types
//     through a merged namespace and `export = <default>`.
//   - named-only entry (worker; runtime `exports.FuseWorker = …`): CJS and ESM
//     declarations are identical, so copy the file verbatim.
// The published-types test (`test/package-types.test.ts`, cjs mode) is the
// regression guard if rolldown-dts's barrel format ever drifts.
function emitCjsDts(dtsRelPath: string) {
  const src = readFileSync(resolve(dtsRelPath), 'utf8')
  const ctsPath = dtsRelPath.replace(/\.d\.ts$/, '.d.cts')
  const barrel = src.match(/export\s*\{([^{}]*)\}\s*;?\s*$/)
  if (!barrel) {
    throw new Error(
      `emitCjsDts: expected a trailing \`export { … }\` barrel in ${dtsRelPath}`
    )
  }
  const specifiers = barrel[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const defaultSpec = specifiers.find((s) => /\bas\s+default$/.test(s))
  if (!defaultSpec) {
    // Named-only: identical in CJS and ESM.
    writeFileSync(resolve(ctsPath), src)
    return
  }
  const defaultName = defaultSpec.replace(/\s+as\s+default$/, '').trim()
  // Keep each specifier's `type` modifier verbatim. The named exports are
  // type-only; stripping `type` would re-export them as value members of the
  // namespace, so `Fuse.FuseIndex` would type-check as a runtime value that
  // doesn't exist (`module.exports = Fuse` only carries the static methods).
  const named = specifiers.filter((s) => s !== defaultSpec)
  const head = src.slice(0, barrel.index)
  const namespace = named.length
    ? `declare namespace ${defaultName} {\n  export { ${named.join(', ')} };\n}\n`
    : ''
  writeFileSync(
    resolve(ctsPath),
    `${head}${namespace}export = ${defaultName};\n`
  )
}

export default defineConfig([
  // full build (dev, non-min) — default package export; owns fuse.d.ts
  // (and derives fuse.d.cts for the `require` condition — shared by all four
  // full/basic subpaths, same as fuse.d.ts is today).
  {
    ...shared,
    entry: { fuse: 'src/entry.ts' },
    format: ['cjs', 'esm'],
    minify: false,
    define: define(FULL, 'development'),
    dts: true,
    onSuccess: () => emitCjsDts('dist/fuse.d.ts')
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
    dts: true,
    onSuccess: () => emitCjsDts('dist/fuse-worker.d.ts')
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
