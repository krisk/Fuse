const NGRAM_LEN = 3

module.exports = (text, { n = NGRAM_LEN, pad = true, sort = false }) => {
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
    nGrams.sort((a, b) => a == b ? 0 : a < b ? -1 : 1)
  }

  return nGrams
}