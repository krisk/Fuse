import BitapSearch from '../bitap'
import { createAnalyzer } from './analyzer'
import { mergeIndices } from '../../helpers/mergeIndices'
import type { Analyzer } from './analyzer'
import type { InvertedIndexData } from './InvertedIndex'
import type { SearchResult, RangeTuple } from '../../types'

// `tokenMatch: 'all'` packs per-term coverage into a bitmask. JS bitwise ops
// are 32-bit *signed*, so bit 31 is the sign bit — only bits 0..30 are safe.
// Queries with more than this many terms fall back to a Set (no bit limit).
export const MAX_MASK_TERMS = 31

export default class TokenSearch {
  private termSearchers: BitapSearch[]
  private idfWeights: number[]
  private options: any
  private analyzer: Analyzer
  // `tokenMatch: 'all'` (AND) coverage. When true, searchIn reports which
  // query terms matched each text so the core loop can require record-level
  // coverage of every term. Bitmask is the ≤31-term fast path; Set is the
  // ≥32-term fallback (JS bitwise ops are 32-bit signed).
  private combineAll: boolean
  private numTerms: number
  private useMask: boolean

  static condition(_: string, options: any): boolean {
    return options.useTokenSearch
  }

  constructor(pattern: string, options: any) {
    this.options = options
    this.analyzer = createAnalyzer({
      isCaseSensitive: options.isCaseSensitive,
      ignoreDiacritics: options.ignoreDiacritics,
      tokenize: options.tokenize
    })

    const queryTerms = this.analyzer.tokenize(pattern)
    const invertedIndex: InvertedIndexData = options._invertedIndex
    const { df, fieldCount } = invertedIndex

    this.termSearchers = []
    this.idfWeights = []

    for (const term of queryTerms) {
      this.termSearchers.push(
        new BitapSearch(term, {
          location: options.location,
          threshold: options.threshold,
          distance: options.distance,
          includeMatches: options.includeMatches,
          findAllMatches: options.findAllMatches,
          minMatchCharLength: options.minMatchCharLength,
          isCaseSensitive: options.isCaseSensitive,
          ignoreDiacritics: options.ignoreDiacritics,
          ignoreLocation: true
        })
      )

      const docFreq = df.get(term) || 0
      const idf = Math.log(1 + (fieldCount - docFreq + 0.5) / (docFreq + 0.5))
      this.idfWeights.push(idf)
    }

    this.combineAll = options.tokenMatch === 'all'
    this.numTerms = this.termSearchers.length
    this.useMask = this.numTerms <= MAX_MASK_TERMS
  }

  searchIn(text: string): SearchResult {
    if (!this.termSearchers.length) {
      return { isMatch: false, score: 1 }
    }

    const allIndices: RangeTuple[] = []
    let weightedScore = 0
    let maxPossibleScore = 0
    let matchedCount = 0

    // `tokenMatch: 'all'` coverage for this text (untouched in the default
    // 'any' path, so it allocates nothing there).
    let matchedMask = 0
    const matchedTerms: Set<number> | null =
      this.combineAll && !this.useMask ? new Set() : null

    for (let i = 0; i < this.termSearchers.length; i++) {
      const result = this.termSearchers[i].searchIn(text)
      const idf = this.idfWeights[i]

      maxPossibleScore += idf

      if (result.isMatch) {
        matchedCount++
        weightedScore += idf * (1 - result.score)

        if (result.indices) {
          allIndices.push(...(result.indices as RangeTuple[]))
        }

        if (this.combineAll) {
          if (this.useMask) {
            matchedMask |= 1 << i
          } else {
            matchedTerms!.add(i)
          }
        }
      }
    }

    if (matchedCount === 0) {
      return { isMatch: false, score: 1 }
    }

    const normalized =
      maxPossibleScore > 0 ? 1 - weightedScore / maxPossibleScore : 0

    const searchResult: SearchResult = {
      isMatch: true,
      score: Math.max(0.001, normalized)
    }

    if (this.options.includeMatches && allIndices.length) {
      searchResult.indices = mergeIndices(allIndices)
    }

    // Report term coverage so the core loop can enforce record-level AND.
    if (this.combineAll) {
      if (this.useMask) {
        searchResult.matchedMask = matchedMask
      } else {
        searchResult.matchedTerms = matchedTerms!
      }
      searchResult.termCount = this.numTerms
    }

    return searchResult
  }
}
