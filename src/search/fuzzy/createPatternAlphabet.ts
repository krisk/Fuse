// Maps a char code to the bitmask of pattern positions holding that char.
// Patterns made of low code points (the overwhelmingly common case) get a
// typed array indexed directly by char code; reads past its end yield
// undefined, which the bitwise ops in search() treat as 0. Patterns with
// higher code points fall back to a plain object so a single CJK or emoji
// character can't force a large table.
export type PatternAlphabet = Int32Array | Record<number, number>

const MAX_TABLE_CODE = 0x400

export default function createPatternAlphabet(
  pattern: string
): PatternAlphabet {
  const len = pattern.length
  let maxCode = 0
  for (let i = 0; i < len; i += 1) {
    const code = pattern.charCodeAt(i)
    if (code > maxCode) maxCode = code
  }

  const mask: PatternAlphabet =
    maxCode < MAX_TABLE_CODE
      ? new Int32Array(maxCode < 256 ? 256 : maxCode + 1)
      : {}

  for (let i = 0; i < len; i += 1) {
    const code = pattern.charCodeAt(i)
    mask[code] = (mask[code] || 0) | (1 << (len - i - 1))
  }

  return mask
}
