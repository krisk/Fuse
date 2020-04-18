import ExactMatch from './ExactMatch'
import InverseExactMatch from './InverseExactMatch'
import PrefixExactMatch from './PrefixExactMatch'
import InversePrefixExactMatch from './InversePrefixExactMatch'
import SuffixExactMatch from './SuffixExactMatch'
import InverseSuffixExactMatch from './InverseSuffixExactMatch'
import FuzzyMatch from './FuzzyMatch'

// ❗Order is important. DO NOT CHANGE.
const searchers = [
  ExactMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
]

const searchersLen = searchers.length

// Regex to split by spaces, but keep anything in quotes together
const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/
const OR_TOKEN = '|'

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
export default function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item
      .trim()
      .split(SPACE_RE)
      .filter((item) => item && !!item.trim())

    let results = []
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i]

      // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
      let found = false
      let idx = -1
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx]
        let token = searcher.isMultiMatch(queryItem)
        if (token) {
          results.push(new searcher(token, options))
          found = true
        }
      }

      if (found) {
        continue
      }

      // 2. Handle single query matches (i.e, once that are *not* quoted)
      idx = -1
      while (++idx < searchersLen) {
        const searcher = searchers[idx]
        let token = searcher.isSingleMatch(queryItem)
        if (token) {
          results.push(new searcher(token, options))
          break
        }
      }
    }

    return results
  })
}
