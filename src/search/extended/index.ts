import parseQuery from './parseQuery'
import { MULTI_MATCH_TYPES, isInverse } from './matchers'
import Config from '../../core/config'
import { stripDiacritics } from '../../helpers/diacritics'
import { mergeIndices } from '../../helpers/mergeIndices'
import type { SearchResult, RangeTuple } from '../../types'
import type { Matcher } from './matchers'

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

// Resolve the subset of options ExtendedSearch cares about, applying Config
// defaults. Shared by the string-pattern constructor and the `fromMatchers`
// factory so both evaluate under identical option semantics.
function resolveOptions(options: any = {}): ExtendedSearchOptions {
  return {
    isCaseSensitive: options.isCaseSensitive ?? Config.isCaseSensitive,
    ignoreDiacritics: options.ignoreDiacritics ?? Config.ignoreDiacritics,
    includeMatches: options.includeMatches ?? Config.includeMatches,
    minMatchCharLength: options.minMatchCharLength ?? Config.minMatchCharLength,
    findAllMatches: options.findAllMatches ?? Config.findAllMatches,
    ignoreLocation: options.ignoreLocation ?? Config.ignoreLocation,
    location: options.location ?? Config.location,
    threshold: options.threshold ?? Config.threshold,
    distance: options.distance ?? Config.distance
  }
}

// Normalize a pattern/operator value exactly as the string-pattern constructor
// normalizes a whole query string (case-fold then strip diacritics). The object
// compiler applies this per operator value so object and string forms feed
// identically-normalized patterns to the matchers.
export function normalizeValue(value: string, options: any): string {
  value =
    (options.isCaseSensitive ?? Config.isCaseSensitive)
      ? value
      : value.toLowerCase()
  return (options.ignoreDiacritics ?? Config.ignoreDiacritics)
    ? stripDiacritics(value)
    : value
}

export default class ExtendedSearch {
  query: Matcher[][] | null
  options: ExtendedSearchOptions
  pattern: string

  constructor(pattern: string, options: any = {}) {
    this.options = resolveOptions(options)

    pattern = this.options.isCaseSensitive ? pattern : pattern.toLowerCase()
    pattern = this.options.ignoreDiacritics ? stripDiacritics(pattern) : pattern
    this.pattern = pattern
    this.query = parseQuery(this.pattern, this.options)
  }

  // Build an ExtendedSearch that evaluates a pre-compiled `Matcher[][]` (an
  // OR-of-ANDs) instead of parsing a pattern string. The object-query compiler
  // produces the matcher grid directly, then hands it here so scoring, index
  // merging, and `hasInverse` aggregation come from the same `searchIn` path as
  // string syntax — guaranteeing parity. The matcher values are already
  // normalized by the compiler; `searchIn` still normalizes the candidate text.
  static fromMatchers(query: Matcher[][], options: any = {}): ExtendedSearch {
    const search: ExtendedSearch = Object.create(ExtendedSearch.prototype)
    search.options = resolveOptions(options)
    search.pattern = '' // unused by searchIn; object leaves have no pattern string
    search.query = query
    return search
  }

  static condition(_: string, options: any): boolean {
    return options.useExtendedSearch
  }

  // Note: searchIn operates on a single text value and sets hasInverse on the
  // result when inverse patterns are involved. _searchObjectList uses this to
  // switch from "ANY key" to "ALL keys" aggregation. See #712.
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
    const allIndices: RangeTuple[] = []
    let totalScore = 0
    let hasInverse = false

    // ORs
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers = query[i]

      // Reset indices
      allIndices.length = 0
      numMatches = 0
      hasInverse = false

      // ANDs
      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
        const matcher = searchers[j]
        const { isMatch, indices, score } = matcher.search(text)

        if (isMatch) {
          numMatches += 1
          totalScore += score

          if (isInverse(matcher.type)) {
            hasInverse = true
          }

          if (includeMatches) {
            if (MULTI_MATCH_TYPES.has(matcher.type)) {
              allIndices.push(...(indices as unknown as RangeTuple[]))
            } else {
              allIndices.push(indices as unknown as RangeTuple)
            }
          }
        } else {
          totalScore = 0
          numMatches = 0
          allIndices.length = 0
          hasInverse = false
          break
        }
      }

      // OR condition, so if TRUE, return
      if (numMatches) {
        const result: SearchResult = {
          isMatch: true,
          score: totalScore / numMatches
        }

        if (hasInverse) {
          result.hasInverse = true
        }

        if (includeMatches) {
          result.indices = mergeIndices(allIndices)
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
