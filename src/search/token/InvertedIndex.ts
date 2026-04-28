import type { Analyzer } from './analyzer'
import type { IndexRecord, SubRecord } from '../../types'

// Stats-only inverted index for token search (per Plan 008 Direction B).
//
// The query path consumes only `df` and `fieldCount` (IDF weighting). The
// per-doc maps exist solely to keep `df` and `fieldCount` correct under
// `add` / `remove` / `removeAt`:
//
//   docFieldCount[doc]    = # distinct fields the doc contributed; subtracted
//                           from `fieldCount` on remove.
//   docTermFieldHits[doc] = Map<term, # fields in which `term` appears for
//                           that doc>; each entry decrements `df[term]` by
//                           that count on remove.
//
// `df` is incremented once per (doc, term, field) at index time. Removing a
// doc decrements `df` by the same count, mirroring the increment exactly.
export interface InvertedIndexData {
  fieldCount: number
  df: Map<string, number>
  docFieldCount: Map<number, number>
  docTermFieldHits: Map<number, Map<string, number>>
}

function addField(
  index: InvertedIndexData,
  text: string,
  docIdx: number,
  analyzer: Analyzer
): void {
  const tokens = analyzer.tokenize(text)
  if (!tokens.length) return

  index.fieldCount++
  index.docFieldCount.set(docIdx, (index.docFieldCount.get(docIdx) || 0) + 1)

  // We count each (doc, term, field) once — repeated occurrences within the
  // same field don't multiply df.
  const distinctTerms = new Set(tokens)

  let perDocTerms = index.docTermFieldHits.get(docIdx)
  if (!perDocTerms) {
    perDocTerms = new Map()
    index.docTermFieldHits.set(docIdx, perDocTerms)
  }

  for (const term of distinctTerms) {
    perDocTerms.set(term, (perDocTerms.get(term) || 0) + 1)
    index.df.set(term, (index.df.get(term) || 0) + 1)
  }
}

function ingestRecord(
  index: InvertedIndexData,
  record: IndexRecord,
  keyCount: number,
  analyzer: Analyzer
): void {
  const { i: docIdx, v, $: fields } = record

  if (v !== undefined) {
    addField(index, v, docIdx, analyzer)
    return
  }

  if (!fields) return

  for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
    const value = fields[keyIdx] as SubRecord | SubRecord[] | undefined
    if (!value) continue

    if (Array.isArray(value)) {
      for (const sub of value) addField(index, sub.v, docIdx, analyzer)
    } else {
      addField(index, value.v, docIdx, analyzer)
    }
  }
}

export function buildInvertedIndex(
  records: IndexRecord[],
  keyCount: number,
  analyzer: Analyzer
): InvertedIndexData {
  const index: InvertedIndexData = {
    fieldCount: 0,
    df: new Map(),
    docFieldCount: new Map(),
    docTermFieldHits: new Map()
  }

  for (const record of records) {
    ingestRecord(index, record, keyCount, analyzer)
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

export function removeFromInvertedIndex(
  index: InvertedIndexData,
  docIdx: number
): void {
  const fieldCount = index.docFieldCount.get(docIdx)
  if (fieldCount === undefined) return

  index.fieldCount -= fieldCount
  index.docFieldCount.delete(docIdx)

  const perDocTerms = index.docTermFieldHits.get(docIdx)
  if (!perDocTerms) return

  for (const [term, hits] of perDocTerms) {
    const next = (index.df.get(term) || 0) - hits
    if (next <= 0) {
      index.df.delete(term)
    } else {
      index.df.set(term, next)
    }
  }
  index.docTermFieldHits.delete(docIdx)
}

// Removes the given docIdx entries and renumbers the remaining per-doc maps
// so they stay in sync with FuseIndex's contiguous renumbering on remove.
export function removeAndShiftInvertedIndex(
  index: InvertedIndexData,
  removedIndices: number[]
): void {
  if (removedIndices.length === 0) return

  // De-dup and sort so the shift computation is O(log k) per lookup.
  const sorted = Array.from(new Set(removedIndices)).sort((a, b) => a - b)

  for (const idx of sorted) {
    removeFromInvertedIndex(index, idx)
  }

  // For any surviving oldIdx, its new idx is oldIdx minus the number of
  // removed indices strictly less than oldIdx.
  const shift = (oldIdx: number): number => {
    let lo = 0
    let hi = sorted.length
    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if (sorted[mid] < oldIdx) lo = mid + 1
      else hi = mid
    }
    return oldIdx - lo
  }

  const firstRemoved = sorted[0]

  const shiftedDocFieldCount = new Map<number, number>()
  for (const [oldKey, count] of index.docFieldCount) {
    shiftedDocFieldCount.set(
      oldKey > firstRemoved ? shift(oldKey) : oldKey,
      count
    )
  }
  index.docFieldCount = shiftedDocFieldCount

  const shiftedDocTermFieldHits = new Map<number, Map<string, number>>()
  for (const [oldKey, terms] of index.docTermFieldHits) {
    shiftedDocTermFieldHits.set(
      oldKey > firstRemoved ? shift(oldKey) : oldKey,
      terms
    )
  }
  index.docTermFieldHits = shiftedDocTermFieldHits
}
