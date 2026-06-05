// The FuseWorker auto-resolves its worker script URL via
// `new URL('./fuse.worker.mjs', import.meta.url)`. `import.meta.url` is ESM-only
// syntax, so each output format/environment resolves it differently. This gates
// all four target environments so a bundler/format change can't silently break
// worker-URL resolution (the migration's highest-risk behavior). Runs against
// the BUILT dist — rebuild if you changed source.
import { describe, test, expect, beforeAll } from 'vitest'
import { build } from 'vite'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import {
  existsSync,
  readFileSync,
  mkdtempSync,
  writeFileSync,
  rmSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const WORKER_CJS = join(repoRoot, 'dist/fuse-worker.cjs')
const WORKER_MJS = join(repoRoot, 'dist/fuse-worker.mjs')

describe('worker-URL auto-resolution', () => {
  beforeAll(() => {
    for (const f of [
      WORKER_CJS,
      WORKER_MJS,
      join(repoRoot, 'dist/fuse.worker.mjs')
    ]) {
      if (!existsSync(f)) {
        throw new Error(`${f} missing - run \`npm run build\` before this test`)
      }
    }
  })

  test('node-CJS: resolves via __filename (require path)', () => {
    const { FuseWorker } = require(WORKER_CJS)
    const w = new FuseWorker([], { keys: ['t'] })
    const url = String(w._workerUrl)
    expect(url.startsWith('file:')).toBe(true)
    expect(url.endsWith('/dist/fuse.worker.mjs')).toBe(true)
  })

  test('node-ESM: resolves via native import.meta.url', async () => {
    const { FuseWorker } = await import(pathToFileURL(WORKER_MJS).href)
    const w = new FuseWorker([], { keys: ['t'] })
    const url = String(w._workerUrl)
    expect(url.startsWith('file:')).toBe(true)
    expect(url.endsWith('/dist/fuse.worker.mjs')).toBe(true)
  })

  test('browser-CJS: resolves via document base captured at module-eval (not page), currentScript cleared before construct', () => {
    const code = readFileSync(WORKER_CJS, 'utf8')
    const scriptSrc = 'https://cdn.example.com/libs/fuse-worker.cjs'
    const doc = {
      currentScript: { src: scriptSrc },
      baseURI: 'https://cdn.example.com/page/index.html'
    }
    // Browser-CJS: `document` exists, but `require`/`__filename` do not, so the
    // CJS rewrite of import.meta.url throws and the document fallback is taken.
    // CommonJS: `exports` and `module.exports` must be the same object.
    const moduleObj = { exports: {} }
    const sandbox = {
      module: moduleObj,
      exports: moduleObj.exports,
      URL,
      document: doc,
      console
    }
    sandbox.globalThis = sandbox
    vm.createContext(sandbox)
    // Module evaluation: browserWorkerBase is captured from currentScript here.
    vm.runInContext(code, sandbox)
    // The browser clears currentScript after the script finishes evaluating;
    // if resolution read it lazily (in the constructor) it would miss it.
    doc.currentScript = null

    const { FuseWorker } = sandbox.module.exports
    const w = new FuseWorker([], { keys: ['t'] })
    // Resolved relative to the captured *script* URL, not the page baseURI.
    expect(String(w._workerUrl)).toBe(
      'https://cdn.example.com/libs/fuse.worker.mjs'
    )
  })

  test('browser-CJS with Node polyfills (require/__filename present): document base still wins', () => {
    const code = readFileSync(WORKER_CJS, 'utf8')
    const scriptSrc = 'https://cdn.example.com/libs/fuse-worker.cjs'
    const doc = {
      currentScript: { src: scriptSrc },
      baseURI: 'https://cdn.example.com/page/index.html'
    }
    // A browser bundler (webpack/browserify) may polyfill `require('url')` and
    // `__filename` to a virtual path. The CJS build must NOT prefer that over the
    // real script location — `__WORKER_IS_CJS__` routes browser-CJS to `document`.
    const moduleObj = { exports: {} }
    const sandbox = {
      module: moduleObj,
      exports: moduleObj.exports,
      URL,
      document: doc,
      __filename: '/virtual/bundle/fuse-worker.cjs',
      require(id) {
        if (id === 'url') {
          return { pathToFileURL: (p) => ({ href: 'file://' + p }) }
        }
        throw new Error('unexpected require ' + id)
      },
      console
    }
    sandbox.globalThis = sandbox
    vm.createContext(sandbox)
    vm.runInContext(code, sandbox)
    doc.currentScript = null
    const { FuseWorker } = sandbox.module.exports
    const w = new FuseWorker([], { keys: ['t'] })
    expect(String(w._workerUrl)).toBe(
      'https://cdn.example.com/libs/fuse.worker.mjs'
    )
  })

  test('browser-ESM: Vite statically detects + rewrites the worker asset', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'fusejs-vite-'))
    try {
      const entry = join(tmp, 'app.mjs')
      writeFileSync(
        entry,
        `import { FuseWorker } from ${JSON.stringify(WORKER_MJS)}\n` +
          `new FuseWorker([], { keys: ['t'] })\n`
      )
      const result = await build({
        root: tmp,
        logLevel: 'silent',
        build: {
          write: false,
          minify: false,
          target: 'esnext',
          rollupOptions: { input: entry, output: { format: 'es' } }
        }
      })
      const outputs = (Array.isArray(result) ? result : [result]).flatMap(
        (r) => r.output ?? []
      )
      // Vite resolved `./fuse.worker.mjs` (sibling of the imported proxy) and
      // emitted it as a worker asset.
      const workerAsset = outputs.find((o) => /fuse\.worker/.test(o.fileName))
      expect(workerAsset, 'Vite should emit a fuse.worker asset').toBeTruthy()
      // The literal `new URL('./fuse.worker.mjs', import.meta.url)` was rewritten
      // to point at that emitted asset (not left verbatim, which would resolve
      // against the app bundle's own location at runtime).
      const entryChunk = outputs.find((o) => o.type === 'chunk' && o.isEntry)
      expect(entryChunk.code).toMatch(/fuse\.worker/)
      expect(entryChunk.code).not.toMatch(
        /new URL\(\s*["']\.\/fuse\.worker\.mjs["']\s*,\s*import\.meta\.url\s*\)/
      )
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  })
})
