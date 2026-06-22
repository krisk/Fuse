import type { NormInterface } from '../types'

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
      // Count words by tallying word-starts (transitions from space/start to
      // non-space). This avoids allocating a regex match array and correctly
      // handles leading and trailing spaces, which the old transition-counter
      // (starting at 1 and incrementing on every space boundary) would
      // over-count by 1 for each stray boundary.
      let numTokens = 0
      let inWord = false
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) !== 32) {
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
