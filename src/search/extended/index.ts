import parseQuery from './parseQuery'
import FuzzyMatch from './FuzzyMatch'
import IncludeMatch from './IncludeMatch'
import Config from '../../core/config'
import { stripDiacritics } from '../../helpers/diacritics'
import type { SearchResult } from '../../types'
import type BaseMatch from './BaseMatch'

// These extended matchers can return an array of matches, as opposed
// to a singl match
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type])

interface ExtendedSearchOptions {
  isCaseSensitive: boolean
  ignoreDiacritics: boolean
  includeMatches: boolean
  minMatchCharLength: number
  findAllMatches: boolean
  ignoreLocation: boolean
  location: number
  threshold: number
  distance: number
}

export default class ExtendedSearch {
  query: BaseMatch[][] | null
  options: ExtendedSearchOptions
  pattern: string

  constructor(
    pattern: string,
    {
      isCaseSensitive = Config.isCaseSensitive,
      ignoreDiacritics = Config.ignoreDiacritics,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}
  ) {
    this.query = null
    this.options = {
      isCaseSensitive,
      ignoreDiacritics,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    }

    pattern = isCaseSensitive ? pattern : pattern.toLowerCase()
    pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern
    this.pattern = pattern
    this.query = parseQuery(this.pattern, this.options)
  }

  static condition(_: string, options: any): boolean {
    return options.useExtendedSearch
  }

  // Note: searchIn operates on a single text value. When Fuse searches across
  // multiple keys, _searchObjectList calls searchIn per-key and aggregates.
  // This causes inverse patterns (e.g. !Syrup) to behave incorrectly across
  // keys — see the comment in core/index.ts _searchObjectList and #712.
  searchIn(text: string): SearchResult {
    const query = this.query

    if (!query) {
      return {
        isMatch: false,
        score: 1
      }
    }

    const { includeMatches, isCaseSensitive, ignoreDiacritics } = this.options

    text = isCaseSensitive ? text : text.toLowerCase()
    text = ignoreDiacritics ? stripDiacritics(text) : text

    let numMatches = 0
    const allIndices: any[] = []
    let totalScore = 0

    // ORs
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers = query[i]

      // Reset indices
      allIndices.length = 0
      numMatches = 0

      // ANDs
      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
        const searcher = searchers[j]
        const { isMatch, indices, score } = searcher.search(text)

        if (isMatch) {
          numMatches += 1
          totalScore += score
          if (includeMatches) {
            const type = (searcher.constructor as any).type
            if (MultiMatchSet.has(type)) {
              allIndices.push(...(indices as any))
            } else {
              allIndices.push(indices)
            }
          }
        } else {
          totalScore = 0
          numMatches = 0
          allIndices.length = 0
          break
        }
      }

      // OR condition, so if TRUE, return
      if (numMatches) {
        const result: SearchResult = {
          isMatch: true,
          score: totalScore / numMatches
        }

        if (includeMatches) {
          result.indices = allIndices
        }

        return result
      }
    }

    // Nothing was matched
    return {
      isMatch: false,
      score: 1
    }
  }
}
