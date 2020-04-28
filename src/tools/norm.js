const SPACE = /[^ ]+/g

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
export default function norm(mantissa = 3) {
  const cache = new Map()

  return {
    get(value) {
      const numTokens = value.match(SPACE).length

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      const n = parseFloat((1 / Math.sqrt(numTokens)).toFixed(mantissa))

      cache.set(numTokens, n)

      return n
    },
    clear() {
      cache.clear()
    }
  }
}
