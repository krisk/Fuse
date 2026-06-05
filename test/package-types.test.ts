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
// the surfaced type is usable. `modes` restricts a case to a subset of MODES
// (default: all) — e.g. CJS-only `require`/`export =` cases, or ESM-only cases
// that can't compile as CommonJS (`import.meta`, or the import-only
// worker-script subpath).
type TypeCase = { spec: string; code: string; modes?: readonly string[] }
const ESM_ONLY = ['nodenext', 'bundler'] as const
const CJS_ONLY = ['cjs'] as const
const CASES: TypeCase[] = [
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
    // ESM-only: the `import.meta.url` here can't compile into CommonJS output.
    spec: 'fuse.js/worker',
    modes: ESM_ONLY,
    code:
      `import { FuseWorker } from 'fuse.js/worker'\n` +
      `const w = new FuseWorker<{ t: string }>([], { keys: ['t'] }, ` +
      `{ numWorkers: 2, workerUrl: new URL('./fuse.worker.mjs', import.meta.url) })\n` +
      `void w.search('x')\n`
  },
  {
    // ESM-only subpath: `./worker-script` has only an `import` condition (no
    // `require`), so it isn't a CJS target.
    spec: 'fuse.js/worker-script',
    modes: ESM_ONLY,
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
  },
  // --- CJS-only cases (#780) ---------------------------------------------
  // These run under the `cjs` mode (`.cts` / module: NodeNext), reaching the
  // `require` exports condition -> `fuse.d.cts` / `fuse-worker.d.cts`. They
  // assert the runtime-accurate CJS shapes the `.d.cts` files encode: the lib
  // entry is `export = Fuse` (a bare constructor, `module.exports = Fuse`), the
  // worker is a named `FuseWorker`. The public-type-surface case above already
  // runs here too, exercising the full named-type set through the `export =`
  // namespace merge — the riskiest part of the transform.
  {
    // `export =` is constructable and its named types are reachable as
    // namespace members (`Fuse.IFuseOptions`), matching `module.exports = Fuse`.
    spec: 'fuse.js (cjs require + namespace types)',
    modes: CJS_ONLY,
    code:
      `import Fuse = require('fuse.js')\n` +
      `const f = new Fuse<{ t: string }>([], { keys: ['t'] })\n` +
      `void f.search('x')\n` +
      `const o: Fuse.IFuseOptions<{ t: string }> = { keys: ['t'] }\n` +
      `const r: Fuse.RangeTuple = [0, 1]\n` +
      `void o\nvoid r\n`
  },
  {
    // The common ergonomic form: default + named in one statement (relies on
    // esModuleInterop, which module: NodeNext implies).
    spec: 'fuse.js (cjs default + named import)',
    modes: CJS_ONLY,
    code:
      `import Fuse, { type IFuseOptions, type RangeTuple } from 'fuse.js'\n` +
      `const o: IFuseOptions<{ t: string }> = { keys: ['t'] }\n` +
      `const f = new Fuse<{ t: string }>([], o)\n` +
      `const r: RangeTuple = [0, 1]\n` +
      `void f.search('x')\nvoid r\n`
  },
  {
    // The worker's named export resolves as a *value* through `require`.
    spec: 'fuse.js/worker (cjs require, named)',
    modes: CJS_ONLY,
    code:
      `import worker = require('fuse.js/worker')\n` +
      `const W = worker.FuseWorker\n` +
      `void W\n`
  },
  {
    // The namespace-merge must re-export named types with their `type` modifier,
    // so they stay type-only. Stripping it would make `Fuse.RangeTuple` a value
    // member that doesn't exist at runtime (`module.exports = Fuse` only carries
    // the static methods). `@ts-expect-error` flips to a TS2578 failure if value
    // access ever stops erroring (the regression).
    spec: 'fuse.js (cjs type-only members are not values)',
    modes: CJS_ONLY,
    code:
      `import Fuse = require('fuse.js')\n` +
      `type _Rt = Fuse.RangeTuple\n` +
      `const _ok: _Rt = [0, 1]\n` +
      `// @ts-expect-error RangeTuple is type-only; no runtime value member\n` +
      `const _v = Fuse.RangeTuple\n` +
      `void _ok\nvoid _v\n`
  }
]

// The supported resolution modes. node16 shares NodeNext's behavior here. The
// `cjs` mode resolves the `require` exports condition: a `.cts` file under
// module: NodeNext is CommonJS, so it reaches `*.d.cts` and would surface a
// "masquerading as ESM" regression (TS1479) if those were missing or wrong
// (#780). `module: NodeNext` implies esModuleInterop, so default imports work.
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
  },
  {
    name: 'cjs',
    ext: 'cts',
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    module: ts.ModuleKind.NodeNext
  }
]

// A case runs in a mode when it declares no `modes` filter or lists that mode.
const casesFor = (modeName: string) =>
  CASES.filter((c) => !c.modes || c.modes.includes(modeName))

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
    for (const f of [
      'fuse.d.ts',
      'fuse.d.cts',
      'fuse-worker.d.ts',
      'fuse-worker.d.cts',
      'fuse.worker.d.ts'
    ]) {
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
      for (const { spec, code } of casesFor(mode.name)) {
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
    for (const { spec } of casesFor(mode.name)) {
      test(`${spec} (${mode.name})`, () => {
        expect(errorsBySpec.get(keyFor(mode.name, spec))).toEqual([])
      })
    }
  }

  test('no stray errors in dist declarations', () => {
    expect(otherErrors).toEqual([])
  })
})
