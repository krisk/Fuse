export const NGRAMS = 3

export default function createNGram(
  text,
  { n = NGRAMS, pad = true, sort = false }
) {
  let nGrams = []

  if (text === null || text === undefined) {
    return nGrams
  }

  text = text.toLowerCase()
  if (pad) {
    text = ` ${text} `
  }

  let index = text.length - n + 1
  if (index < 1) {
    return nGrams
  }

  while (index--) {
    nGrams[index] = text.substr(index, n)
  }

  if (sort) {
    nGrams.sort((a, b) => (a == b ? 0 : a < b ? -1 : 1))
  }

  return nGrams
}
