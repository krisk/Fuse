import type { Analyzer } from './analyzer'
import type { IndexRecord, SubRecord } from '../../types'
import type FuseIndex from '../../tools/FuseIndex'
import { STRING_RECORD, EMPTY_ARRAY } from '../../tools/FuseIndex'

// Stats-only inverted index for token search.
//
// The query path consumes only document frequency (via docFrequency()) and
// `fieldCount` (IDF weighting). The rest is a removal ledger: an exact record of what each document added, so
// `remove` / `removeAt` can subtract precisely that, even if the record's text
// or the tokenizer changed after ingestion.
//
// Ledger layout (compact, instead of a Map of Maps per document):
//
//   termInfo          term -> { id, df }: interns each distinct term to a small
//                     integer id and holds its document frequency in place
//   termsById[id]     the same TermInfo objects, by id, so removal needs no
//                     Map lookups
//   pool              one Uint32Array of packed entries for all documents;
//                     an entry is (termId << HITS_BITS) | hits, where hits is
//                     the number of the doc's fields containing the term. A
//                     hits value of HITS_ESCAPE means the real count follows
//                     in the next slot.
//   docStart[d]       offset of doc d's entries in `pool`
//   docLen[d]         number of pool slots doc d uses (0: no contribution)
//   docFields[d]      number of fields doc d contributed to `fieldCount`
//
// Per-doc arrays are indexed by source-array position, so they renumber with
// FuseIndex on removal. Removed documents leave dead slots in `pool`, which is
// compacted when dead slots outnumber live ones.
interface TermInfo {
  id: number
  term: string
  df: number
}

export interface InvertedIndexData {
  fieldCount: number
  termInfo: Map<string, TermInfo>
  termsById: TermInfo[]
  // Read-only snapshot of document frequencies (terms with df > 0), built on
  // access. For tests and debugging; the query path uses docFrequency().
  readonly df: Map<string, number>
  pool: Uint32Array
  poolLen: number
  deadSlots: number
  docStart: number[]
  docLen: number[]
  docFields: number[]
}

const HITS_BITS = 4
const HITS_ESCAPE = (1 << HITS_BITS) - 1
const MAX_TERM_ID = 2 ** (32 - HITS_BITS) - 1

function createIndex(): InvertedIndexData {
  return {
    fieldCount: 0,
    termInfo: new Map(),
    termsById: [],
    get df(): Map<string, number> {
      const snapshot = new Map<string, number>()
      for (const info of this.termsById) {
        if (info.df > 0) snapshot.set(info.term, info.df)
      }
      return snapshot
    },
    pool: new Uint32Array(1024),
    poolLen: 0,
    deadSlots: 0,
    docStart: [],
    docLen: [],
    docFields: []
  }
}

function internTerm(index: InvertedIndexData, term: string): TermInfo {
  let info = index.termInfo.get(term)
  if (info === undefined) {
    const id = index.termsById.length
    if (id > MAX_TERM_ID) {
      throw new Error('Token search vocabulary exceeds the supported size')
    }
    info = { id, term, df: 0 }
    index.termInfo.set(term, info)
    index.termsById.push(info)
  }
  return info
}

// Document frequency for IDF: the number of (doc, field) pairs containing term.
export function docFrequency(index: InvertedIndexData, term: string): number {
  const info = index.termInfo.get(term)
  return info === undefined ? 0 : info.df
}

function reservePool(index: InvertedIndexData, slots: number): void {
  const needed = index.poolLen + slots
  if (needed <= index.pool.length) return
  let capacity = index.pool.length
  while (capacity < needed) capacity *= 2
  const next = new Uint32Array(capacity)
  next.set(index.pool.subarray(0, index.poolLen))
  index.pool = next
}

function ensureDoc(index: InvertedIndexData, docIdx: number): void {
  for (let d = index.docLen.length; d <= docIdx; d += 1) {
    index.docStart.push(0)
    index.docLen.push(0)
    index.docFields.push(0)
  }
}

// Tokenize every field of a record and return its contribution: the number
// of non-empty fields, and per term the number of fields containing it.
// Tokenizes each text a record contributes (supplied by `forEachText`) and
// returns its contribution: the number of non-empty fields, and per term the
// number of fields containing it.
function collectTexts(
  forEachText: (fn: (text: string) => void) => void,
  analyzer: Analyzer
): { fields: number; hits: Map<string, number> } {
  const hits = new Map<string, number>()
  let fields = 0

  forEachText((text: string): void => {
    const tokens = analyzer.tokenize(text)
    if (!tokens.length) return
    fields += 1
    // Each (doc, term, field) counts once; repeats within a field don't.
    for (const term of new Set(tokens)) {
      hits.set(term, (hits.get(term) || 0) + 1)
    }
  })

  return { fields, hits }
}

// The texts of a record in the record format, for keys below keyCount.
function recordTexts(
  record: IndexRecord,
  keyCount: number
): (fn: (text: string) => void) => void {
  return (fn) => {
    const { v, $: values } = record
    if (v !== undefined) {
      fn(v)
    } else if (values) {
      for (let keyIdx = 0; keyIdx < keyCount; keyIdx += 1) {
        const value = values[keyIdx] as SubRecord | SubRecord[] | undefined
        if (!value) continue
        if (Array.isArray(value)) {
          for (const sub of value) fn(sub.v)
        } else {
          fn(value.v)
        }
      }
    }
  }
}

function ingestRecord(
  index: InvertedIndexData,
  record: IndexRecord,
  keyCount: number,
  analyzer: Analyzer
): void {
  ingest(index, record.i, recordTexts(record, keyCount), analyzer)
}

function ingest(
  index: InvertedIndexData,
  docIdx: number,
  forEachText: (fn: (text: string) => void) => void,
  analyzer: Analyzer
): void {
  const { fields, hits } = collectTexts(forEachText, analyzer)
  if (fields) record(index, docIdx, fields, hits)
}

// Stores one document's contribution (fields and per-term hit counts) in the
// ledger and adds it to the statistics.
function record(
  index: InvertedIndexData,
  docIdx: number,
  fields: number,
  hits: Map<string, number>
): void {
  ensureDoc(index, docIdx)
  index.fieldCount += fields

  // Worst case two slots per term (entry + escaped count).
  reservePool(index, hits.size * 2)
  const start = index.poolLen
  const pool = index.pool
  let p = start

  for (const [term, count] of hits) {
    const info = internTerm(index, term)
    info.df += count
    const id = info.id
    if (count < HITS_ESCAPE) {
      pool[p++] = (id << HITS_BITS) | count
    } else {
      pool[p++] = (id << HITS_BITS) | HITS_ESCAPE
      pool[p++] = count
    }
  }

  index.poolLen = p
  index.docStart[docIdx] = start
  index.docLen[docIdx] = p - start
  index.docFields[docIdx] = fields
}

// Calls fn(termId, hits) for each ledger entry of a document.
function forEachEntry(
  index: InvertedIndexData,
  docIdx: number,
  fn: (termId: number, hits: number) => void
): void {
  const { pool } = index
  const end = index.docStart[docIdx] + index.docLen[docIdx]
  let p = index.docStart[docIdx]
  while (p < end) {
    const entry = pool[p++]
    const id = entry >>> HITS_BITS
    let count = entry & HITS_ESCAPE
    if (count === HITS_ESCAPE) count = pool[p++]
    fn(id, count)
  }
}

function subtractDoc(index: InvertedIndexData, docIdx: number): void {
  if (docIdx >= index.docLen.length || !index.docFields[docIdx]) return

  index.fieldCount -= index.docFields[docIdx]
  forEachEntry(index, docIdx, (id, count) => {
    const info = index.termsById[id]
    info.df = Math.max(0, info.df - count)
  })
  index.deadSlots += index.docLen[docIdx]
}

// Rewrites the pool with only live documents' entries, in doc order, and
// reclaims terms no live document uses (df 0): they are dropped from termInfo
// and the surviving terms are renumbered densely, so a long-lived index with
// churn doesn't accumulate every term it has ever seen.
function compactPool(index: InvertedIndexData): void {
  const remap = new Int32Array(index.termsById.length).fill(-1)
  const liveTerms: TermInfo[] = []
  for (const info of index.termsById) {
    if (info.df > 0) {
      remap[info.id] = liveTerms.length
      info.id = liveTerms.length
      liveTerms.push(info)
    } else {
      index.termInfo.delete(info.term)
    }
  }
  index.termsById = liveTerms

  const live = index.poolLen - index.deadSlots
  const next = new Uint32Array(Math.max(1024, live * 2))
  const { pool } = index
  let p = 0
  for (let d = 0; d < index.docLen.length; d += 1) {
    const len = index.docLen[d]
    if (!len) continue
    const end = index.docStart[d] + len
    let q = index.docStart[d]
    index.docStart[d] = p
    while (q < end) {
      const entry = pool[q++]
      const hits = entry & HITS_ESCAPE
      next[p++] = (remap[entry >>> HITS_BITS] << HITS_BITS) | hits
      if (hits === HITS_ESCAPE) next[p++] = pool[q++]
    }
  }
  index.pool = next
  index.poolLen = p
  index.deadSlots = 0
}

// Builds the index straight from a columnar FuseIndex, without going
// through the record format or allocating per-record closures. Skips the
// empty-array sentinel (it carries no text and must never reach the
// tokenizer, which may legally return tokens for '') and, as for records,
// fields of keys at or beyond keyCount.
export function buildInvertedIndexFromColumns(
  source: FuseIndex,
  keyCount: number,
  analyzer: Analyzer
): InvertedIndexData {
  const index = createIndex()
  const hits = new Map<string, number>()
  for (let r = 0, n = source.size(); r < n; r += 1) {
    hits.clear()
    let fields = 0
    const start = source._recStart[r]
    const end = start + source._recLen[r]
    const isString = source._recKind[r] === STRING_RECORD
    for (let e = start; e < end; e += 1) {
      if (source._entIdx[e] === EMPTY_ARRAY) continue
      if (!isString && source._entKey[e] >= keyCount) continue
      const tokens = analyzer.tokenize(source._entValue[e])
      if (!tokens.length) continue
      fields += 1
      // Each (doc, term, field) counts once; repeats within a field don't.
      for (const term of new Set(tokens)) {
        hits.set(term, (hits.get(term) || 0) + 1)
      }
    }
    if (fields) record(index, source._recDoc[r], fields, hits)
  }
  if (index.pool.length > index.poolLen + 1024) {
    index.pool = index.pool.slice(0, index.poolLen + 1024)
  }
  return index
}

export function buildInvertedIndex(
  records: IndexRecord[],
  keyCount: number,
  analyzer: Analyzer
): InvertedIndexData {
  const index = createIndex()
  for (const record of records) {
    ingestRecord(index, record, keyCount, analyzer)
  }
  // The pool grows by doubling, so it can end up to half empty. Trim it to
  // fit after the initial build; later adds grow it again as needed.
  if (index.pool.length > index.poolLen + 1024) {
    index.pool = index.pool.slice(0, index.poolLen + 1024)
  }
  return index
}

export function addToInvertedIndex(
  index: InvertedIndexData,
  record: IndexRecord,
  keyCount: number,
  analyzer: Analyzer
): void {
  ingestRecord(index, record, keyCount, analyzer)
}

// Subtracts one document's contribution without renumbering the others
// (removeAndShiftInvertedIndex does both).
export function removeFromInvertedIndex(
  index: InvertedIndexData,
  docIdx: number
): void {
  subtractDoc(index, docIdx)
  if (docIdx < index.docLen.length) {
    index.docLen[docIdx] = 0
    index.docFields[docIdx] = 0
  }
}

// Removes the given source positions and renumbers the survivors so they stay
// in sync with FuseIndex's contiguous renumbering on remove.
export function removeAndShiftInvertedIndex(
  index: InvertedIndexData,
  removedIndices: number[]
): void {
  if (removedIndices.length === 0) return

  const removed = new Set(removedIndices)
  for (const idx of removed) subtractDoc(index, idx)

  // Drop removed positions from the per-doc arrays in one pass.
  let w = 0
  for (let r = 0; r < index.docLen.length; r += 1) {
    if (removed.has(r)) continue
    index.docStart[w] = index.docStart[r]
    index.docLen[w] = index.docLen[r]
    index.docFields[w] = index.docFields[r]
    w += 1
  }
  index.docStart.length = w
  index.docLen.length = w
  index.docFields.length = w

  if (index.deadSlots > index.poolLen - index.deadSlots) {
    compactPool(index)
  }
}

// Read helpers for tests and debugging: the per-doc contribution in the
// shape the previous Map-based index exposed.
export function docFieldCount(
  index: InvertedIndexData,
  docIdx: number
): number {
  return docIdx < index.docFields.length ? index.docFields[docIdx] : 0
}

export function docTermHits(
  index: InvertedIndexData,
  docIdx: number
): Map<string, number> | undefined {
  if (!docFieldCount(index, docIdx)) return undefined
  const hits = new Map<string, number>()
  forEachEntry(index, docIdx, (id, count) =>
    hits.set(index.termsById[id].term, count)
  )
  return hits
}
