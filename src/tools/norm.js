/** Field-length norm: the shorter the field, the higher the weight. Set to 3 decimals to reduce index size. */
function norm(mantissa = 3) {
  const m = Math.pow(10, mantissa);
  const cache = new Map();
  const SPACE = /[^ ]+/g;

  return {
    get(value) {
      const numTokens = value.match(SPACE).length;

      if (cache.has(numTokens)) return cache.get(numTokens);

      const norm = 1 / Math.sqrt(numTokens);
      const n = parseFloat(Math.round(norm * m) / m);

      cache.set(numTokens, n);

      return n;
    },

    clear() {
      cache.clear();
    },
  };
}

export default norm;
