import parseQuery from './parseQuery'
import FuzzyMatch from './FuzzyMatch'
import Config from '../../core/config'

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
  constructor(
    pattern,
    options = ({
      /*eslint-disable no-undef*/
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches
      /*eslint-enable no-undef*/
    } = {})
  ) {
    this.query = null
    this.options = options

    this.pattern = options.isCaseSensitive ? pattern : pattern.toLowerCase()
    this.query = parseQuery(this.pattern, options)
  }

  static condition(_, options) {
    return options.useExtendedSearch
  }

  searchIn(value) {
    const query = this.query

    if (!query) {
      return {
        isMatch: false,
        score: 1
      }
    }

    let text = value.$

    const { includeMatches, isCaseSensitive } = this.options

    text = isCaseSensitive ? text : text.toLowerCase()

    let numMatches = 0
    let indices = []

    // ORs
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers = query[i]

      // Reset indices
      indices.length = 0
      numMatches = 0

      // ANDs
      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
        const searcher = searchers[j]
        const { isMatch, matchedIndices } = searcher.search(text)

        if (isMatch) {
          numMatches += 1
          if (includeMatches) {
            if (searcher.constructor.type === FuzzyMatch.type) {
              // FuzzyMatch returns is a 2D array
              indices = [...indices, ...matchedIndices]
            } else {
              indices.push(matchedIndices)
            }
          }
        } else {
          numMatches = 0
          indices.length = 0
          break
        }
      }

      // OR condition, so if TRUE, return
      if (numMatches) {
        let result = {
          isMatch: true,
          score: 0
        }

        if (includeMatches) {
          result.matchedIndices = indices
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
