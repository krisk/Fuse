export default function createPatternAlphabet(pattern) {
  let mask = {}

  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i)
    mask[char] = (mask[char] || 0) | (1 << (len - i - 1))
  }

  return mask
}
