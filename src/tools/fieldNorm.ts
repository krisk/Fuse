import type { NormInterface } from '../types'

const SPACE = /[^ ]+/g

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(weight: number = 1, mantissa: number = 3): NormInterface {
  const cache = new Map<number, number>()
  const m = Math.pow(10, mantissa)

  return {
    get(value: string): number {
      const numTokens = value.match(SPACE)?.length || 1

      if (cache.has(numTokens)) {
        return cache.get(numTokens)!
      }

      // Default function is 1/sqrt(x), weight makes that variable
      const norm = 1 / Math.pow(numTokens, 0.5 * weight)

      // In place of `toFixed(mantissa)`, for faster computation
      const n = parseFloat((Math.round(norm * m) / m) as unknown as string)

      cache.set(numTokens, n)

      return n
    },
    clear() {
      cache.clear()
    }
  }
}
