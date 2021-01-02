const SPACE = /[^ ]+/g

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(mantissa = 3) {
  const cache = new Map()
  const m = Math.pow(10, mantissa)

  return {
    get(value) {
      const numTokens = value.match(SPACE).length

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      const norm = 1 / Math.sqrt(numTokens)

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
