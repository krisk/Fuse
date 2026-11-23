import type { NormInterface } from '../types'

// Number of words in value (at least 1). Separate from the norm so the index
// can cache norm ids by word count.
export function countWords(value: string): number {
  // Count words by tallying word-starts (transitions from separator/start
  // to non-separator). This avoids allocating a regex match array and
  // correctly handles leading and trailing separators, which the old
  // transition-counter (starting at 1 and incrementing on every boundary)
  // would over-count by 1 for each stray boundary.
  // Checking charCode 32 alone once missed tabs and newlines, so a tab- or
  // newline-joined field was scored as a single word.
  let numTokens = 0
  let inWord = false
  for (let i = 0, len = value.length; i < len; i++) {
    const code = value.charCodeAt(i)
    // Word separators: the common ASCII whitespace (tab 9, LF 10, VT 11,
    // FF 12, CR 13, space 32) plus NBSP (160), deliberately narrower than
    // \s (the field-norm heuristic is too coarse to benefit from the rarer
    // Unicode spaces). Tested inline, letters first, since this runs once
    // per character and may be inlined into large build functions, where
    // V8 can stop inlining a helper call.
    if (code > 32 ? code !== 160 : code !== 32 && (code < 9 || code > 13)) {
      if (!inWord) {
        numTokens++
        inWord = true
      }
    } else {
      inWord = false
    }
  }
  // Empty strings and all-whitespace strings have no real words; treat
  // them as a single token so the formula never divides by zero.
  if (numTokens === 0) numTokens = 1

  return numTokens
}

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(
  weight: number = 1,
  mantissa: number = 3
): NormInterface {
  // Norms by word count (a dense array: one read instead of Map has + get).
  let cache: number[] = []
  const m = Math.pow(10, mantissa)

  const fromCount = (numTokens: number): number => {
    const cached = cache[numTokens]
    if (cached !== undefined) {
      return cached
    }

    // Default function is 1/sqrt(x), weight makes that variable
    const n = Math.round(m / Math.pow(numTokens, 0.5 * weight)) / m

    cache[numTokens] = n

    return n
  }

  return {
    get(value: string): number {
      return fromCount(countWords(value))
    },
    fromCount,
    clear() {
      cache = []
    }
  }
}
