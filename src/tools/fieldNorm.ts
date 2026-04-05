import type { NormInterface } from '../types'

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(weight: number = 1, mantissa: number = 3): NormInterface {
  const cache = new Map<number, number>()
  const m = Math.pow(10, mantissa)

  return {
    get(value: string): number {
      // Count words by counting space transitions — avoids allocating a regex match array
      let numTokens = 1
      let inSpace = false
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) === 32) {
          if (!inSpace) {
            numTokens++
            inSpace = true
          }
        } else {
          inSpace = false
        }
      }

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
