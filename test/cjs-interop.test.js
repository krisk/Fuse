// Runtime guard for the CommonJS export contract that the build must preserve:
// `require('fuse.js')` returns the Fuse *constructor* directly (not `{ default }`),
// and the worker proxy exposes a *named* `FuseWorker` export. The rest of the
// suite imports the ESM dist; nothing else exercises the .cjs builds at runtime,
// so a `{ default }` regression (the classic esbuild-interop trap) would ship
// uncaught without this. Runs against the BUILT dist — rebuild if you changed source.
import { describe, test, expect, beforeAll } from 'vitest'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const require = createRequire(import.meta.url)
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = require('../package.json')

const LIB_CJS = [
  'dist/fuse.cjs',
  'dist/fuse.min.cjs',
  'dist/fuse.basic.cjs',
  'dist/fuse.basic.min.cjs'
]

describe('CommonJS export contract', () => {
  beforeAll(() => {
    for (const f of [...LIB_CJS, 'dist/fuse-worker.cjs']) {
      if (!existsSync(join(repoRoot, f))) {
        throw new Error(`${f} missing - run \`npm run build\` before this test`)
      }
    }
  })

  for (const rel of LIB_CJS) {
    test(`require('${rel}') is the constructor, not { default }`, () => {
      const Fuse = require(join(repoRoot, rel))
      expect(typeof Fuse).toBe('function')
      // Not an interop object with a `.default` key.
      expect(Fuse).not.toHaveProperty('default')
      // Usable as a constructor.
      const f = new Fuse([{ t: 'hello' }], { keys: ['t'] })
      expect(f.search('hello').length).toBeGreaterThan(0)
      // Build-time `__VERSION__` was injected, not left as the literal token.
      expect(Fuse.version).toBe(pkg.version)
    })
  }

  test("require('dist/fuse-worker.cjs') exposes a named FuseWorker export", () => {
    const mod = require(join(repoRoot, 'dist/fuse-worker.cjs'))
    expect(typeof mod.FuseWorker).toBe('function')
    // Named, not default: the worker proxy intentionally differs from the lib.
    expect(mod).not.toHaveProperty('default')
  })
})
