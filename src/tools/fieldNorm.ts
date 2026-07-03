import type { NormInterface } from '../types'

// charCodes we treat as word separators: the common ASCII whitespace
// (tab 9, LF 10, VT 11, FF 12, CR 13, space 32) plus NBSP (160). This is
// deliberately narrower than the full Unicode whitespace set (\s); it skips
// rarer separators like the ideographic space and en/em spaces, which the
// field-norm heuristic is too coarse to benefit from distinguishing.
function isWordSeparator(code: number): boolean {
  return (code >= 9 && code <= 13) || code === 32 || code === 160
}

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(
  weight: number = 1,
  mantissa: number = 3
): NormInterface {
  const cache = new Map<number, number>()
  const m = Math.pow(10, mantissa)

  return {
    get(value: string): number {
      // Count words by tallying word-starts (transitions from separator/start
      // to non-separator). This avoids allocating a regex match array and
      // correctly handles leading and trailing separators, which the old
      // transition-counter (starting at 1 and incrementing on every boundary)
      // would over-count by 1 for each stray boundary.
      //
      // A separator here is common ASCII whitespace (space, tab, newline, CR,
      // vertical tab, form feed) plus NBSP, not the full Unicode set. Checking
      // charCode 32 alone missed tabs and newlines, so a tab- or newline-joined
      // field was scored as a single word.
      let numTokens = 0
      let inWord = false
      for (let i = 0; i < value.length; i++) {
        if (!isWordSeparator(value.charCodeAt(i))) {
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

      if (cache.has(numTokens)) {
        return cache.get(numTokens)!
      }

      // Default function is 1/sqrt(x), weight makes that variable
      const n = Math.round(m / Math.pow(numTokens, 0.5 * weight)) / m

      cache.set(numTokens, n)

      return n
    },
    clear() {
      cache.clear()
    }
  }
}
