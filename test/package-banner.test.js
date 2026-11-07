import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'

test.each([
  'fuse.cjs',
  'fuse.mjs',
  'fuse.min.cjs',
  'fuse.min.mjs',
  'fuse.basic.cjs',
  'fuse.basic.mjs',
  'fuse.basic.min.cjs',
  'fuse.basic.min.mjs',
  'fuse-worker.cjs',
  'fuse-worker.mjs',
  'fuse.worker.mjs',
  'fuse.worker.min.mjs'
])('%s keeps the project and license notice in its banner', (file) => {
  const bundle = readFileSync(
    new URL('../dist/' + file, import.meta.url),
    'utf8'
  )
  const banner = bundle.match(/^\/\*\*[\s\S]*?\*\//)?.[0] ?? ''

  expect(banner).toContain('(http://fusejs.io)')
  expect(banner).toMatch(/^ \* Copyright \(c\) \d{4} Kiro Risk$/m)
  expect(banner).toContain('All Rights Reserved. Apache Software License 2.0')
  expect(banner).toContain('http://www.apache.org/licenses/LICENSE-2.0')
})
