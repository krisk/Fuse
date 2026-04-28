/**
 * Benchmark: token-search inverted-index shape (Plan 008)
 *
 * Compares two shapes of `InvertedIndexData`:
 *
 *   Current (full):   terms (Map<string, Posting[]>), df, fieldCount, docTerms
 *                     where Posting = { docIdx, keyIdx, subIdx, tf }
 *
 *   Stats-only (B):   df, fieldCount, docFieldCount, docTermFieldHits
 *                     (no postings, no per-(doc,term,field) records)
 *
 * The query path today only consumes df + fieldCount, so Direction B's query
 * wall-clock is identical to baseline by construction. What this bench measures
 * is the *build cost* and *retained memory* delta, which is what informs the
 * A vs. B decision for everything else being equal.
 *
 * Run with:
 *   node --expose-gc bench/inverted-index-shape.mjs
 *
 * --expose-gc enables the heap-delta column (the most direct memory signal).
 * Without it, the column reports "n/a" and the structural counts are still
 * meaningful proxies.
 */

import Fuse from '../dist/fuse.mjs'

// ── Analyzer (mirrors src/search/token/analyzer.ts) ───────────────────

const WORD = /\b\w+\b/g
function tokenize(text) {
  return text.toLowerCase().match(WORD) || []
}

// ── Index builders ────────────────────────────────────────────────────

// Replicates src/search/token/InvertedIndex.ts → buildInvertedIndex
function buildFullIndex(records, keyCount) {
  const terms = new Map()
  const df = new Map()
  const docTerms = new Map()
  let fieldCount = 0

  function addField(text, docIdx, keyIdx, subIdx) {
    const tokens = tokenize(text)
    if (!tokens.length) return
    fieldCount++

    const termFreqs = new Map()
    for (const token of tokens) {
      termFreqs.set(token, (termFreqs.get(token) || 0) + 1)
    }

    let docTermSet = docTerms.get(docIdx)
    if (!docTermSet) {
      docTermSet = new Set()
      docTerms.set(docIdx, docTermSet)
    }

    for (const [term, tf] of termFreqs) {
      const posting = { docIdx, keyIdx, subIdx, tf }
      let postings = terms.get(term)
      if (!postings) {
        postings = []
        terms.set(term, postings)
      }
      postings.push(posting)
      docTermSet.add(term)
      df.set(term, (df.get(term) || 0) + 1)
    }
  }

  for (const record of records) {
    const { i: docIdx, v, $: fields } = record
    if (v !== undefined) {
      addField(v, docIdx, -1, -1)
      continue
    }
    if (fields) {
      for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
        const value = fields[keyIdx]
        if (!value) continue
        if (Array.isArray(value)) {
          for (const sub of value) addField(sub.v, docIdx, keyIdx, sub.i ?? -1)
        } else {
          addField(value.v, docIdx, keyIdx, -1)
        }
      }
    }
  }
  return { terms, df, fieldCount, docTerms }
}

// Direction B replacement shape — proposed in Plan 008.
// Removes the postings array entirely. Bookkeeping for correct add/remove:
//   docFieldCount[doc]      = # distinct fields the doc contributed
//   docTermFieldHits[doc][term] = # fields in which `term` appears for `doc`
// On remove(doc): subtract docFieldCount[doc] from fieldCount; for each
// (term, hits) in docTermFieldHits[doc], decrement df[term] by hits.
function buildStatsOnlyIndex(records, keyCount) {
  const df = new Map()
  const docFieldCount = new Map()
  const docTermFieldHits = new Map()
  let fieldCount = 0

  function addField(text, docIdx) {
    const tokens = tokenize(text)
    if (!tokens.length) return
    fieldCount++
    docFieldCount.set(docIdx, (docFieldCount.get(docIdx) || 0) + 1)

    // Distinct terms in this field — we only care about presence per (doc,term,field).
    const seen = new Set()
    for (const token of tokens) seen.add(token)

    let perDoc = docTermFieldHits.get(docIdx)
    if (!perDoc) {
      perDoc = new Map()
      docTermFieldHits.set(docIdx, perDoc)
    }

    for (const term of seen) {
      perDoc.set(term, (perDoc.get(term) || 0) + 1)
      df.set(term, (df.get(term) || 0) + 1)
    }
  }

  for (const record of records) {
    const { i: docIdx, v, $: fields } = record
    if (v !== undefined) {
      addField(v, docIdx)
      continue
    }
    if (fields) {
      for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
        const value = fields[keyIdx]
        if (!value) continue
        if (Array.isArray(value)) {
          for (const sub of value) addField(sub.v, docIdx)
        } else {
          addField(value.v, docIdx)
        }
      }
    }
  }
  return { df, fieldCount, docFieldCount, docTermFieldHits }
}

// ── Realistic synthetic corpus ────────────────────────────────────────

// Zipfian-ish vocabulary — common words appear far more often than rare ones,
// like real prose. Generated once, shared across builds for determinism.
function makeVocabulary() {
  const common = [
    'the', 'a', 'and', 'of', 'to', 'in', 'for', 'with', 'on', 'is', 'as',
    'by', 'this', 'from', 'or', 'an', 'be', 'are', 'at', 'it', 'has',
    'have', 'will', 'can', 'use', 'using', 'used'
  ]
  const technical = [
    'javascript', 'typescript', 'python', 'rust', 'golang', 'java', 'kotlin',
    'swift', 'objectivec', 'ruby', 'php', 'csharp', 'cpp', 'react', 'vue',
    'angular', 'svelte', 'nextjs', 'nuxt', 'express', 'fastify', 'koa',
    'database', 'postgres', 'mysql', 'sqlite', 'mongodb', 'redis', 'elastic',
    'algorithm', 'datastructure', 'graph', 'tree', 'hashmap', 'binary',
    'search', 'index', 'token', 'fuzzy', 'pattern', 'matching', 'scoring',
    'performance', 'memory', 'allocation', 'garbage', 'collection', 'cache',
    'security', 'auth', 'oauth', 'jwt', 'session', 'cookie', 'csrf', 'xss',
    'network', 'tcp', 'http', 'websocket', 'grpc', 'protobuf', 'json',
    'compiler', 'interpreter', 'runtime', 'bytecode', 'optimization',
    'distributed', 'consensus', 'raft', 'paxos', 'replication', 'sharding',
    'machine', 'learning', 'neural', 'transformer', 'embedding', 'inference',
    'functional', 'reactive', 'concurrent', 'parallel', 'async', 'await',
    'framework', 'library', 'package', 'module', 'bundler', 'webpack', 'vite',
    'testing', 'unittest', 'integration', 'mock', 'stub', 'fixture'
  ]
  // Long-tail rare terms — appear once or twice across the whole corpus.
  const rare = []
  for (let i = 0; i < 800; i++) rare.push(`rare_term_${i}`)

  return { common, technical, rare }
}

function pickWeighted(rng, vocab) {
  const r = rng()
  if (r < 0.6) return vocab.common[Math.floor(rng() * vocab.common.length)]
  if (r < 0.95) return vocab.technical[Math.floor(rng() * vocab.technical.length)]
  return vocab.rare[Math.floor(rng() * vocab.rare.length)]
}

// Seedable PRNG (Mulberry32) for deterministic corpora.
function mulberry32(seed) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCorpus(n, seed = 0xC0FFEE) {
  const rng = mulberry32(seed)
  const vocab = makeVocabulary()
  const docs = new Array(n)

  for (let i = 0; i < n; i++) {
    const titleLen = 3 + Math.floor(rng() * 5)
    const bodyLen = 30 + Math.floor(rng() * 120)
    const tagCount = 2 + Math.floor(rng() * 4)

    const title = Array.from({ length: titleLen }, () => pickWeighted(rng, vocab)).join(' ')
    const body = Array.from({ length: bodyLen }, () => pickWeighted(rng, vocab)).join(' ')
    const tags = Array.from({ length: tagCount }, () => pickWeighted(rng, vocab))

    docs[i] = { title, body, tags }
  }
  return docs
}

// ── Measurement helpers ───────────────────────────────────────────────

function gc() {
  if (typeof global.gc === 'function') {
    global.gc()
    global.gc() // run twice — second pass clears anything freed during first
  }
}

function heapNow() {
  if (typeof global.gc !== 'function') return null
  gc()
  return process.memoryUsage().heapUsed
}

function timeIt(label, fn, runs = 5) {
  // Warmup
  fn()
  const times = []
  for (let r = 0; r < runs; r++) {
    const start = performance.now()
    fn()
    times.push(performance.now() - start)
  }
  times.sort((a, b) => a - b)
  return {
    label,
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1]
  }
}

function measureBuild(label, builder, records, keyCount) {
  const before = heapNow()
  let result
  const t = timeIt(label, () => { result = builder(records, keyCount) })
  // Keep `result` alive across the heap measurement.
  const after = heapNow()
  const heapDelta = before !== null && after !== null ? after - before : null
  return { ...t, heapDelta, structure: result }
}

function fmtMs(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`
  return `${ms.toFixed(2)}ms`
}

function fmtBytes(b) {
  if (b === null) return 'n/a (no --expose-gc)'
  if (Math.abs(b) < 1024) return `${b}B`
  if (Math.abs(b) < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`
  return `${(b / (1024 * 1024)).toFixed(2)}MB`
}

function describeFull(idx) {
  let postingCount = 0
  for (const arr of idx.terms.values()) postingCount += arr.length
  return {
    terms: idx.terms.size,
    postings: postingCount,
    docs: idx.docTerms.size,
    fieldCount: idx.fieldCount
  }
}

function describeStatsOnly(idx) {
  let perDocTermEntries = 0
  for (const m of idx.docTermFieldHits.values()) perDocTermEntries += m.size
  return {
    terms: idx.df.size,
    perDocTermEntries,
    docs: idx.docFieldCount.size,
    fieldCount: idx.fieldCount
  }
}

// ── Run ───────────────────────────────────────────────────────────────

const SIZES = [1_000, 10_000, 50_000]
const KEYS = ['title', 'body', 'tags']

console.log('Inverted-index shape benchmark — Plan 008')
console.log('='.repeat(72))
if (typeof global.gc !== 'function') {
  console.log('NOTE: heap-delta column disabled. Re-run with `node --expose-gc` for it.')
}

for (const n of SIZES) {
  console.log(`\n--- ${n.toLocaleString()} docs (keys: ${KEYS.join(', ')}) ---\n`)

  const docs = makeCorpus(n)
  const fuseIndex = Fuse.createIndex(KEYS, docs)
  const records = fuseIndex.records
  const keyCount = KEYS.length

  const full = measureBuild('full (current)', buildFullIndex, records, keyCount)
  const stats = measureBuild('stats-only (B) ', buildStatsOnlyIndex, records, keyCount)

  console.log(`  ${full.label}   build: ${fmtMs(full.median).padStart(8)}  heap: ${fmtBytes(full.heapDelta).padStart(14)}  ${JSON.stringify(describeFull(full.structure))}`)
  console.log(`  ${stats.label}   build: ${fmtMs(stats.median).padStart(8)}  heap: ${fmtBytes(stats.heapDelta).padStart(14)}  ${JSON.stringify(describeStatsOnly(stats.structure))}`)

  const buildSpeedup = full.median / stats.median
  const heapSavings = full.heapDelta !== null && stats.heapDelta !== null
    ? full.heapDelta - stats.heapDelta
    : null
  console.log(`  → stats-only build: ${buildSpeedup.toFixed(2)}x faster, heap saved: ${fmtBytes(heapSavings)}`)
}

console.log('\n' + '='.repeat(72))
console.log('Done.')
