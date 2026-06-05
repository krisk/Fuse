// Guards the packaging boundary that #828 broke: every public `exports`
// subpath must resolve to a type declaration and type-check for a real
// consumer. The existing typings test imports from `../` under the project
// tsconfig, so it only exercises *source* types, not the published
// `package.json` exports + `dist/*.d.ts`. This test resolves each subpath the
// way an installed consumer would (a node_modules symlink to the repo) and
// type-checks a one-line import under both nodenext and bundler resolution.
//
// Runs against the BUILT dist. CI builds before testing; locally the
// committed dist is used, so rebuild if you changed source.
import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import ts from 'typescript'
import {
  mkdtempSync,
  mkdirSync,
  symlinkSync,
  writeFileSync,
  rmSync,
  existsSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

// One representative consumer import per public subpath. The point is that the
// specifier resolves to declarations (no TS2307/TS7016 under strict), and that
// the surfaced type is usable.
const CASES = [
  {
    spec: 'fuse.js',
    code: `import Fuse from 'fuse.js'\nconst f = new Fuse<{ t: string }>([], { keys: ['t'] })\nvoid f.search('x')\n`
  },
  {
    spec: 'fuse.js/min',
    code: `import Fuse from 'fuse.js/min'\nvoid new Fuse([])\n`
  },
  {
    spec: 'fuse.js/basic',
    code: `import Fuse from 'fuse.js/basic'\nvoid new Fuse([])\n`
  },
  {
    spec: 'fuse.js/min-basic',
    code: `import Fuse from 'fuse.js/min-basic'\nvoid new Fuse([])\n`
  },
  {
    // Exercise FuseWorkerOptions too (numWorkers + the `string | URL`
    // workerUrl branch), so a regression in those option types is caught.
    spec: 'fuse.js/worker',
    code:
      `import { FuseWorker } from 'fuse.js/worker'\n` +
      `const w = new FuseWorker<{ t: string }>([], { keys: ['t'] }, ` +
      `{ numWorkers: 2, workerUrl: new URL('./fuse.worker.mjs', import.meta.url) })\n` +
      `void w.search('x')\n`
  },
  {
    spec: 'fuse.js/worker-script',
    code:
      `import workerUrl from 'fuse.js/worker-script'\n` +
      // Guard that the default export is exactly `string`, not a silent `any`
      // (which would pass `const s: string = workerUrl` since any -> string).
      `type IsAny<T> = 0 extends (1 & T) ? true : false\n` +
      `const notAny: IsAny<typeof workerUrl> extends true ? never : true = true\n` +
      `const s: string = workerUrl\n` +
      `void s\nvoid notAny\n`
  },
  {
    // Swapping the dts generator (rollup-plugin-dts -> tsdown's) could silently
    // drop or rename a re-exported type. The cases above only exercise the
    // default `Fuse`/`FuseWorker` values, so a missing *type* export would slip
    // through. Import every public type from `fuse.js`; a dropped/renamed one
    // surfaces as TS2305 on this consumer file.
    spec: 'fuse.js (public type surface)',
    code:
      `import type {\n` +
      `  IFuseOptions, FuseGetFunction, FuseOptionKey, FuseOptionKeyObject,\n` +
      `  FuseResult, FuseResultMatch, FuseSearchOptions, FuseSortFunction,\n` +
      `  FuseSortFunctionArg, FuseSortFunctionItem, FuseSortFunctionMatch,\n` +
      `  FuseSortFunctionMatchList, FuseTokenizeFunction, FuseIndexOptions,\n` +
      `  FuseIndexRecords, FuseIndexObjectRecord, FuseIndexStringRecord,\n` +
      `  RecordEntry, RecordEntryObject, RecordEntryArrayItem, RangeTuple,\n` +
      `  Expression, SearchResult, FuseIndex\n` +
      `} from 'fuse.js'\n` +
      `export {}\n`
  },
  {
    spec: 'fuse.js/worker (type surface)',
    code:
      `import type { FuseWorker, FuseWorkerOptions } from 'fuse.js/worker'\n` +
      `export type { FuseWorker, FuseWorkerOptions }\n`
  }
]

// The supported resolution modes for these ESM/browser entry points. node16
// shares NodeNext's behavior here; CJS resolution is intentionally not a
// target (the worker subpaths are import-only).
const MODES = [
  {
    name: 'nodenext',
    ext: 'mts',
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    module: ts.ModuleKind.NodeNext
  },
  {
    name: 'bundler',
    ext: 'ts',
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext
  }
]

const SHARED: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  // DOM provides `URL`/`Worker`, which the worker declaration references.
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  strict: true,
  noEmit: true,
  types: [],
  skipLibCheck: false
}

const keyFor = (modeName: string, spec: string) => `${modeName}::${spec}`

// One TS program per mode (not per case), so the lib files are parsed and
// checked once instead of once per export (~0.5s vs ~3s). Diagnostics still
// carry their source file, so we attribute per-subpath: a missing or broken
// declaration surfaces as TS2307/TS7016 on that subpath's consumer file.
// Anything not tied to a consumer file (e.g. an error inside a dist `.d.ts`)
// lands in `otherErrors` and fails the catch-all below.
const errorsBySpec = new Map<string, string[]>()
const otherErrors: string[] = []
let tmp: string

describe('published type declarations resolve for every export', () => {
  beforeAll(() => {
    for (const f of ['fuse.d.ts', 'fuse-worker.d.ts', 'fuse.worker.d.ts']) {
      if (!existsSync(join(repoRoot, 'dist', f))) {
        throw new Error(
          `dist/${f} missing - run \`npm run build\` before this test`
        )
      }
    }
    tmp = mkdtempSync(join(tmpdir(), 'fusejs-types-'))
    mkdirSync(join(tmp, 'node_modules'))
    // Resolve `fuse.js` the way an install does, exercising package.json exports.
    symlinkSync(repoRoot, join(tmp, 'node_modules', 'fuse.js'), 'dir')

    for (const mode of MODES) {
      const fileToKey = new Map<string, string>()
      const rootNames: string[] = []
      for (const { spec, code } of CASES) {
        const safe = spec.replace(/[^a-z0-9]/gi, '_')
        const file = join(tmp, `${safe}_${mode.name}.${mode.ext}`)
        writeFileSync(file, code)
        const key = keyFor(mode.name, spec)
        errorsBySpec.set(key, [])
        fileToKey.set(file, key)
        rootNames.push(file)
      }

      const program = ts.createProgram(rootNames, {
        ...SHARED,
        moduleResolution: mode.moduleResolution,
        module: mode.module
      })

      for (const d of ts.getPreEmitDiagnostics(program)) {
        const fileName = d.file && d.file.fileName
        if (fileName && fileName.includes('/node_modules/typescript/lib/'))
          continue
        const msg = ts.flattenDiagnosticMessageText(d.messageText, ' ')
        const key = fileName && fileToKey.get(fileName)
        if (key) errorsBySpec.get(key)!.push(msg)
        else
          otherErrors.push(`[${mode.name}] ${fileName ?? '(no file)'}: ${msg}`)
      }
    }
  })

  afterAll(() => {
    if (tmp) rmSync(tmp, { recursive: true, force: true })
  })

  for (const mode of MODES) {
    for (const { spec } of CASES) {
      test(`${spec} (${mode.name})`, () => {
        expect(errorsBySpec.get(keyFor(mode.name, spec))).toEqual([])
      })
    }
  }

  test('no stray errors in dist declarations', () => {
    expect(otherErrors).toEqual([])
  })
})
