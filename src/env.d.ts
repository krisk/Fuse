declare let process: {
  env: {
    NODE_ENV?: string
    EXTENDED_SEARCH_ENABLED?: string | boolean
    LOGICAL_SEARCH_ENABLED?: string | boolean
    TOKEN_SEARCH_ENABLED?: string | boolean
  }
}

// Injected at build time by tsdown `define` (and vitest `define` for the tests
// that import `src/entry` directly). Replaced with the package.json version.
declare const __VERSION__: string

// Injected per-format by tsdown in the worker-proxy build: `true` in the CJS
// output, `false` in ESM. Lets FuseWorker prefer the document-captured base in
// browser-CJS bundles, where import.meta.url's CJS rewrite (require('url')/
// __filename) may be polyfilled to a virtual path. (vitest defines it `false`.)
declare const __WORKER_IS_CJS__: boolean
