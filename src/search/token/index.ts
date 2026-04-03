import BitapSearch from '../bitap'
import { createAnalyzer } from './analyzer'
import { mergeIndices } from '../../helpers/mergeIndices'
import type { Analyzer } from './analyzer'
import type { InvertedIndexData } from './InvertedIndex'
import type { SearchResult, RangeTuple } from '../../types'

export default class TokenSearch {
  private termSearchers: BitapSearch[]
  private idfWeights: number[]
  private options: any
  private analyzer: Analyzer

  static condition(_: string, options: any): boolean {
    return options.useTokenSearch
  }

  constructor(pattern: string, options: any) {
    this.options = options
    this.analyzer = createAnalyzer({
      isCaseSensitive: options.isCaseSensitive,
      ignoreDiacritics: options.ignoreDiacritics
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
  }

  searchIn(text: string): SearchResult {
    if (!this.termSearchers.length) {
      return { isMatch: false, score: 1 }
    }

    const allIndices: RangeTuple[] = []
    let weightedScore = 0
    let maxPossibleScore = 0
    let matchedCount = 0

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

    return searchResult
  }
}
