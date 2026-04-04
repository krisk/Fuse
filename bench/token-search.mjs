/**
 * Benchmark: Token search vs default Bitap search
 *
 * Measures:
 * 1. Index creation time (with and without inverted index)
 * 2. Single-term query (both modes — ensures no regression)
 * 3. Multi-term query (token search vs Bitap on full string)
 * 4. Scaling: 100, 1000, 5000 documents
 */

import Fuse from '../dist/fuse.mjs'

// --- Helpers ---

function time(fn, iterations = 100) {
  // Warmup
  for (let i = 0; i < 5; i++) fn()

  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  const elapsed = performance.now() - start
  return elapsed / iterations
}

function generateDocs(n) {
  const words = [
    'javascript', 'python', 'rust', 'golang', 'typescript',
    'programming', 'algorithms', 'patterns', 'design', 'systems',
    'database', 'network', 'security', 'performance', 'testing',
    'framework', 'library', 'compiler', 'runtime', 'deployment',
    'functional', 'reactive', 'concurrent', 'distributed', 'embedded',
    'machine', 'learning', 'neural', 'optimization', 'architecture'
  ]

  const docs = []
  for (let i = 0; i < n; i++) {
    const titleLen = 2 + Math.floor(Math.random() * 3)
    const bodyLen = 8 + Math.floor(Math.random() * 15)
    const pick = (len) => Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]).join(' ')
    docs.push({ title: pick(titleLen), body: pick(bodyLen) })
  }
  return docs
}

function fmt(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`
  return `${ms.toFixed(2)}ms`
}

// --- Benchmarks ---

const sizes = [100, 1000, 5000]
const keys = ['title', 'body']

console.log('Token Search Benchmark')
console.log('='.repeat(60))

for (const n of sizes) {
  const docs = generateDocs(n)

  console.log(`\n--- ${n} documents ---\n`)

  // Index creation
  const defaultCreateTime = time(() => new Fuse(docs, { keys }), 20)
  const tokenCreateTime = time(() => new Fuse(docs, { keys, useTokenSearch: true }), 20)
  console.log(`Index creation (default):      ${fmt(defaultCreateTime)}`)
  console.log(`Index creation (tokenSearch):   ${fmt(tokenCreateTime)}`)
  console.log(`  overhead: ${((tokenCreateTime / defaultCreateTime - 1) * 100).toFixed(0)}%`)

  // Create instances once for search benchmarks
  const fuseDefault = new Fuse(docs, { keys })
  const fuseToken = new Fuse(docs, { keys, useTokenSearch: true })

  // Single-term query
  const singleTerm = 'javascript'
  const defaultSingleTime = time(() => fuseDefault.search(singleTerm), 200)
  const tokenSingleTime = time(() => fuseToken.search(singleTerm), 200)
  console.log(`\nSingle-term search (default):   ${fmt(defaultSingleTime)}`)
  console.log(`Single-term search (token):     ${fmt(tokenSingleTime)}`)
  console.log(`  overhead: ${((tokenSingleTime / defaultSingleTime - 1) * 100).toFixed(0)}%`)

  // Multi-term query
  const multiTerm = 'javascript design patterns'
  const defaultMultiTime = time(() => fuseDefault.search(multiTerm), 200)
  const tokenMultiTime = time(() => fuseToken.search(multiTerm), 200)
  console.log(`\nMulti-term search (default):    ${fmt(defaultMultiTime)}`)
  console.log(`Multi-term search (token):      ${fmt(tokenMultiTime)}`)
  console.log(`  ratio: ${(tokenMultiTime / defaultMultiTime).toFixed(2)}x`)

  // Multi-term with typos
  const typoTerm = 'javascrpt desgn paterns'
  const defaultTypoTime = time(() => fuseDefault.search(typoTerm), 200)
  const tokenTypoTime = time(() => fuseToken.search(typoTerm), 200)
  console.log(`\nTypo query search (default):    ${fmt(defaultTypoTime)}`)
  console.log(`Typo query search (token):      ${fmt(tokenTypoTime)}`)
  console.log(`  ratio: ${(tokenTypoTime / defaultTypoTime).toFixed(2)}x`)

  // Result quality comparison
  const fuseDefaultQ = new Fuse(docs, { keys, includeScore: true })
  const fuseTokenQ = new Fuse(docs, { keys, useTokenSearch: true, includeScore: true })
  const qResults = fuseDefaultQ.search(typoTerm)
  const tResults = fuseTokenQ.search(typoTerm)
  console.log(`\nResult count (default):         ${qResults.length}`)
  console.log(`Result count (token):           ${tResults.length}`)
}

console.log('\n' + '='.repeat(60))
console.log('Done.')
