import exactMatch from './exact-match'
import inverseExactMatch from './inverse-exact-match'
import prefixExactMatch from './prefix-exact-match'
import inversePrefixExactMatch from './inverse-prefix-exact-match'
import suffixExactMatch from './suffix-exact-match'
import inverseSuffixExactMatch from './inverse-suffix-exact-match'
import BitapSearch from '../bitap-search'

import { isString } from '../../helpers/type-checkers'

const FuzzyMatch = 'fuzzy'

const searchers = [
  exactMatch,
  prefixExactMatch,
  inversePrefixExactMatch,
  inverseSuffixExactMatch,
  suffixExactMatch,
  inverseExactMatch,
  { literal: /^"(.*)"$/, re: /^(.*)$/, name: 'fuzzy', search: () => {} }
]

const re = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
const queryfy = (pattern) => {
  return pattern.split('|').map((item) => {
    let str = item.trim()
    let parts = str.split(re).filter((item) => {
      return item && !!item.trim()
    })

    let results = []
    for (let i = 0, len = parts.length; i < len; i += 1) {
      const part = parts[i]

      let found = false
      for (let i = 0, len = searchers.length; i < len; i += 1) {
        const searcher = searchers[i]
        let matches = part.match(searcher.literal)
        if (matches) {
          results.push({
            search: searcher.search,
            token: matches[1],
            name: searcher.name
          })
          found = true
          break
        }
      }

      if (found) {
        continue
      }

      for (let j = 0, len = searchers.length; j < len; j += 1) {
        const searcher = searchers[j]
        let matches = part.match(searcher.re)
        if (matches) {
          results.push({
            search: searcher.search,
            token: matches[1],
            name: searcher.name
          })
          break
        }
      }
    }

    return results
  })
}

/**
 * Command-like searching
 * ======================
 *
 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
 * search in a given text.
 *
 * Search syntax:
 *
 * | Token       | Match type                 | Description                            |
 * | ----------- | -------------------------- | -------------------------------------- |
 * | `jscript`   | fuzzy-match                | Items that match `jscript`             |
 * | `'python`   | exact-match                | Items that include `python`            |
 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
 *
 * A single pipe character acts as an OR operator. For example, the following
 * query matches entries that start with `core` and end with either`go`, `rb`,
 * or`py`.
 *
 * ```
 * ^core go$ | rb$ | py$
 * ```
 */
export default class ExtendedSearch {
  constructor(pattern, options) {
    const { isCaseSensitive } = options
    this.query = null
    this.options = options
    // A <pattern>:<BitapSearch> key-value pair for optimizing searching
    this._fuzzyCache = {}

    if (isString(pattern) && pattern.trim().length > 0) {
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase()
      this.query = queryfy(this.pattern)
    }
  }

  searchIn(value) {
    const query = this.query

    if (!this.query) {
      return {
        isMatch: false,
        score: 1
      }
    }

    let text = value.$

    text = this.options.isCaseSensitive ? text : text.toLowerCase()

    let matchFound = false

    // if (process.env.NODE_ENV === 'development') {
    //   console.log(query)
    // }

    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const parts = query[i]
      let result = null
      matchFound = true

      for (let j = 0, pLen = parts.length; j < pLen; j += 1) {
        const part = parts[j]

        let token = part.token
        const search = part.search

        if (search) {
          result = search(token, text)
        } else {
          let searcher = this._fuzzyCache[pattern]
          if (!searcher) {
            searcher = new BitapSearch(pattern, this.options)
            this._fuzzyCache[pattern] = searcher
          }
          result = searcher.searchInString(text)
        }

        // result = this._search(token, text)
        if (!result.isMatch) {
          // AND condition, short-circuit and move on to next part
          matchFound = false
          break
        }
      }

      // OR condition, so if TRUE, return
      if (matchFound) {
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
