export type PatternAlphabet = Record<number, number>

export default function createPatternAlphabet(
  pattern: string
): PatternAlphabet {
  const mask: PatternAlphabet = {}

  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const code = pattern.charCodeAt(i)
    mask[code] = (mask[code] || 0) | (1 << (len - i - 1))
  }

  return mask
}
