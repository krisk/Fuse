export default function createPatternAlphabet(pattern: string): Record<string, number> {
  let mask: Record<string, number> = {}

  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i)
    mask[char] = (mask[char] || 0) | (1 << (len - i - 1))
  }

  return mask
}
