import ExactMatch from './ExactMatch'
import InverseExactMatch from './InverseExactMatch'
import PrefixExactMatch from './PrefixExactMatch'
import InversePrefixExactMatch from './InversePrefixExactMatch'
import SuffixExactMatch from './SuffixExactMatch'
import InverseSuffixExactMatch from './InverseSuffixExactMatch'
import FuzzyMatch from './FuzzyMatch'
import IncludeMatch from './IncludeMatch'
import type BaseMatch from './BaseMatch'

// ❗Order is important. DO NOT CHANGE.
const searchers: Array<typeof BaseMatch> = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
]

const searchersLen = searchers.length

const ESCAPED_PIPE = '\u0000'  // placeholder for escaped \|
const OR_TOKEN = '|'

// Tokenize a query string into individual search terms.
// Respects multi-match quoted tokens like ="said "test"" or ^"hello world"$
// where inner spaces and quotes are part of the token.
function tokenize(pattern: string): string[] {
  const tokens: string[] = []
  const len = pattern.length
  let i = 0

  while (i < len) {
    // Skip spaces
    while (i < len && pattern[i] === ' ') i++
    if (i >= len) break

    // Scan past prefix characters (=, !, ^, ') to see if a quote follows
    let j = i
    while (j < len && pattern[j] !== ' ' && pattern[j] !== '"') j++

    if (j < len && pattern[j] === '"') {
      // Multi-match token: prefix + "content" (possibly with inner quotes)
      // Find the closing " that ends this token:
      // it must be followed by optional $, then space or end-of-string
      j++ // skip opening quote
      while (j < len) {
        if (pattern[j] === '"') {
          // Check if this is the closing quote
          const next = j + 1
          if (next >= len || pattern[next] === ' ') {
            j++ // include closing quote
            break
          }
          if (pattern[next] === '$' && (next + 1 >= len || pattern[next + 1] === ' ')) {
            j += 2 // include "$
            break
          }
        }
        j++
      }
      tokens.push(pattern.substring(i, j))
      i = j
    } else {
      // Regular (unquoted) token: read until space or end
      while (j < len && pattern[j] !== ' ') j++
      tokens.push(pattern.substring(i, j))
      i = j
    }
  }

  return tokens
}

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
export default function parseQuery(pattern: string, options: any = {}): BaseMatch[][] {
  // Replace escaped \| with placeholder before splitting on |
  const escaped = pattern.replace(/\\\|/g, ESCAPED_PIPE)

  return escaped.split(OR_TOKEN).map((item) => {
    // Restore escaped pipes in each OR group
    const restored = item.replace(/\u0000/g, '|')
    const query = tokenize(restored.trim()).filter((item) => item && !!item.trim())

    const results: BaseMatch[] = []
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i]

      // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
      let found = false
      let idx = -1
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx]
        const token = searcher.isMultiMatch(queryItem)
        if (token) {
          results.push(new (searcher as any)(token, options))
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
        const token = searcher.isSingleMatch(queryItem)
        if (token) {
          results.push(new (searcher as any)(token, options))
          break
        }
      }
    }

    return results
  })
}
