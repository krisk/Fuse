import { defineConfig } from 'vitest/config'
import { createRequire } from 'node:module'

// Tests that import `../src/entry` directly (e.g. fuse-worker, cache-invalidation)
// execute the source, where `Fuse.version = __VERSION__` is a build-time global.
// The production build injects it via tsdown `define`; mirror that here so the
// identifier isn't a `ReferenceError` under Vitest's esbuild transform.
const pkg = createRequire(import.meta.url)('./package.json')

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
    // Source-importing tests run ESM-like under vitest; never the CJS path.
    __WORKER_IS_CJS__: 'false'
  },
  test: {
    globals: true
  },
  esbuild: {
    target: 'es2015'
  }
})
