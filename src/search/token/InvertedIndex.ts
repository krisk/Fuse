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
}

export function buildInvertedIndex(
  records: IndexRecord[],
  keyCount: number,
  analyzer: Analyzer
): InvertedIndexData {
  const terms = new Map<string, Posting[]>()
  const df = new Map<string, number>()
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

    // Track which terms we've already counted for df in this field
    for (const [term, tf] of termFreqs) {
      const posting: Posting = { docIdx, keyIdx, subIdx, tf }

      let postings = terms.get(term)
      if (!postings) {
        postings = []
        terms.set(term, postings)
      }
      postings.push(posting)

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

  return { terms, fieldCount, df }
}

export function addToInvertedIndex(
  index: InvertedIndexData,
  record: IndexRecord,
  keyCount: number,
  analyzer: Analyzer
): void {
  const { i: docIdx, v, $: fields } = record

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
  for (const [term, postings] of index.terms) {
    const filtered = postings.filter((p) => p.docIdx !== docIdx)
    const removed = postings.length - filtered.length

    if (removed > 0) {
      index.fieldCount -= removed
      index.df.set(term, (index.df.get(term) || 0) - removed)

      if (filtered.length === 0) {
        index.terms.delete(term)
        index.df.delete(term)
      } else {
        index.terms.set(term, filtered)
      }
    }
  }
}
