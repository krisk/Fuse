import type { Analyzer } from './analyzer'
import type { IndexRecord, SubRecord } from '../../types'

export interface Posting {
  docIdx: number
  keyIdx: number
  subIdx: number
  tf: number
}

export interface InvertedIndexData {
  terms: Map<string, Posting[]>
  fieldCount: number
  df: Map<string, number>
  docTerms: Map<number, Set<string>>
}

export function buildInvertedIndex(
  records: IndexRecord[],
  keyCount: number,
  analyzer: Analyzer
): InvertedIndexData {
  const terms = new Map<string, Posting[]>()
  const df = new Map<string, number>()
  const docTerms = new Map<number, Set<string>>()
  let fieldCount = 0

  function addField(text: string, docIdx: number, keyIdx: number, subIdx: number): void {
    const tokens = analyzer.tokenize(text)
    if (!tokens.length) return

    fieldCount++

    // Count term frequencies in this field
    const termFreqs = new Map<string, number>()
    for (const token of tokens) {
      termFreqs.set(token, (termFreqs.get(token) || 0) + 1)
    }

    // Track which terms belong to this doc for fast removal
    let docTermSet = docTerms.get(docIdx)
    if (!docTermSet) {
      docTermSet = new Set()
      docTerms.set(docIdx, docTermSet)
    }

    // Track which terms we've already counted for df in this field
    for (const [term, tf] of termFreqs) {
      const posting: Posting = { docIdx, keyIdx, subIdx, tf }

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

    // String list
    if (v !== undefined) {
      addField(v, docIdx, -1, -1)
      continue
    }

    // Object list
    if (fields) {
      for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
        const value = fields[keyIdx] as SubRecord | SubRecord[] | undefined
        if (!value) continue

        if (Array.isArray(value)) {
          for (const sub of value) {
            addField(sub.v, docIdx, keyIdx, sub.i ?? -1)
          }
        } else {
          addField(value.v, docIdx, keyIdx, -1)
        }
      }
    }
  }

  return { terms, fieldCount, df, docTerms }
}

export function addToInvertedIndex(
  index: InvertedIndexData,
  record: IndexRecord,
  keyCount: number,
  analyzer: Analyzer
): void {
  const { i: docIdx, v, $: fields } = record

  let docTermSet = index.docTerms.get(docIdx)
  if (!docTermSet) {
    docTermSet = new Set()
    index.docTerms.set(docIdx, docTermSet)
  }

  function addField(text: string, keyIdx: number, subIdx: number): void {
    const tokens = analyzer.tokenize(text)
    if (!tokens.length) return

    index.fieldCount++

    const termFreqs = new Map<string, number>()
    for (const token of tokens) {
      termFreqs.set(token, (termFreqs.get(token) || 0) + 1)
    }

    for (const [term, tf] of termFreqs) {
      const posting: Posting = { docIdx, keyIdx, subIdx, tf }

      let postings = index.terms.get(term)
      if (!postings) {
        postings = []
        index.terms.set(term, postings)
      }
      postings.push(posting)

      docTermSet!.add(term)
      index.df.set(term, (index.df.get(term) || 0) + 1)
    }
  }

  if (v !== undefined) {
    addField(v, -1, -1)
    return
  }

  if (fields) {
    for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
      const value = fields[keyIdx] as SubRecord | SubRecord[] | undefined
      if (!value) continue

      if (Array.isArray(value)) {
        for (const sub of value) {
          addField(sub.v, keyIdx, sub.i ?? -1)
        }
      } else {
        addField(value.v, keyIdx, -1)
      }
    }
  }
}

export function removeFromInvertedIndex(
  index: InvertedIndexData,
  docIdx: number
): void {
  const docTermSet = index.docTerms.get(docIdx)
  if (!docTermSet) return

  // Count distinct fields this doc contributed (for fieldCount adjustment)
  const docFields = new Set<string>()

  for (const term of docTermSet) {
    const postings = index.terms.get(term)
    if (!postings) continue

    const filtered = postings.filter((p) => {
      if (p.docIdx !== docIdx) return true
      docFields.add(`${p.keyIdx}:${p.subIdx}`)
      return false
    })
    const removed = postings.length - filtered.length

    if (removed > 0) {
      index.df.set(term, (index.df.get(term) || 0) - removed)

      if (filtered.length === 0) {
        index.terms.delete(term)
        index.df.delete(term)
      } else {
        index.terms.set(term, filtered)
      }
    }
  }

  index.fieldCount -= docFields.size
  index.docTerms.delete(docIdx)
}

// Removes the given docIdx entries and renumbers remaining postings/docTerms
// so that they stay in sync with FuseIndex's contiguous renumbering on remove.
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

  for (const postings of index.terms.values()) {
    for (const p of postings) {
      if (p.docIdx > firstRemoved) {
        p.docIdx = shift(p.docIdx)
      }
    }
  }

  const shiftedDocTerms = new Map<number, Set<string>>()
  for (const [oldKey, terms] of index.docTerms) {
    shiftedDocTerms.set(oldKey > firstRemoved ? shift(oldKey) : oldKey, terms)
  }
  index.docTerms = shiftedDocTerms
}
