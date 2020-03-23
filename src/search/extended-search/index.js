import exactMatch from './exact-match'
import inverseExactMatch from './inverse-exact-match'
import prefixExactMatch from './prefix-exact-match'
import inversePrefixExactMatch from './inverse-prefix-exact-match'
import suffixExactMatch from './suffix-exact-match'
import inverseSuffixExactMatch from './inverse-suffix-exact-match'
import BitapSearch from '../bitap-search'

import { isString } from '../../helpers/type-checkers'

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
const queryfy = (pattern) => pattern.split('|').map(item => item.trim().split(/ +/g))

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

    for (let i = 0, qLen = query.length; i < qLen; i += 1) {

      const parts = query[i]
      let result = null
      matchFound = true

      for (let j = 0, pLen = parts.length; j < pLen; j += 1) {
        let token = parts[j]
        result = this._search(token, text)
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

  _search(pattern, text) {
    if (exactMatch.isForPattern(pattern)) {
      return exactMatch.match(pattern, text)
    } else if (prefixExactMatch.isForPattern(pattern)) {
      return prefixExactMatch.match(pattern, text)
    } else if (inversePrefixExactMatch.isForPattern(pattern)) {
      return inversePrefixExactMatch.match(pattern, text)
    } else if (inverseSuffixExactMatch.isForPattern(pattern)) {
      return inverseSuffixExactMatch.match(pattern, text)
    } else if (suffixExactMatch.isForPattern(pattern)) {
      return suffixExactMatch.match(pattern, text)
    } else if (inverseExactMatch.isForPattern(pattern)) {
      return inverseExactMatch.match(pattern, text)
    } else {
      let searcher = this._fuzzyCache[pattern]
      if (!searcher) {
        searcher = new BitapSearch(pattern, this.options)
        this._fuzzyCache[pattern] = searcher
      }
      return searcher.searchInString(text)
    }
  }
}