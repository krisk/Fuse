const SPACE = /[^ ]+/g

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(weight = 1, mantissa = 3) {
  const cache = new Map()
  const m = Math.pow(10, mantissa)

  return {
    get(value) {
      const numTokens = value.match(SPACE).length

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      // Default function is 1/sqrt(x), weight makes that variable
      const norm = 1 / Math.pow(numTokens, 0.5 * weight)

      // In place of `toFixed(mantissa)`, for faster computation
      const n = parseFloat(Math.round(norm * m) / m)

      cache.set(numTokens, n)

      return n
    },
    clear() {
      cache.clear()
    }
  }
}
