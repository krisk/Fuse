function createPatternAlphabet(pattern) {
  let mask = {}

  for (let i = 0, patn_len = pattern.length; i < patn_len; i++) {
    const char = pattern.charAt(i)
    mask[char] = (mask[char] || 0) | (1 << (patn_len - i - 1))
  }

  return mask
}

export default createPatternAlphabet
