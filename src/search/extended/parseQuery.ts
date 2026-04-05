import matchers from './matchers'
import type { Matcher } from './matchers'

const matchersLen = matchers.length

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

function getMatch(pattern: string, exp: RegExp): string | null {
  const matches = pattern.match(exp)
  return matches ? matches[1] : null
}

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
export default function parseQuery(pattern: string, options: any = {}): Matcher[][] {
  // Replace escaped \| with placeholder before splitting on |
  const escaped = pattern.replace(/\\\|/g, ESCAPED_PIPE)

  return escaped.split(OR_TOKEN).map((item) => {
    // Restore escaped pipes in each OR group
    const restored = item.replace(/\u0000/g, '|')
    const query = tokenize(restored.trim()).filter((item) => item && !!item.trim())

    const results: Matcher[] = []
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i]

      // 1. Handle multiple query match (i.e, ones that are quoted, like `"hello world"`)
      let found = false
      let idx = -1
      while (!found && ++idx < matchersLen) {
        const def = matchers[idx]
        const token = getMatch(queryItem, def.multiRegex)
        if (token) {
          results.push(def.create(token, options))
          found = true
        }
      }

      if (found) {
        continue
      }

      // 2. Handle single query matches (i.e, ones that are *not* quoted)
      idx = -1
      while (++idx < matchersLen) {
        const def = matchers[idx]
        const token = getMatch(queryItem, def.singleRegex)
        if (token) {
          results.push(def.create(token, options))
          break
        }
      }
    }

    return results
  })
}
