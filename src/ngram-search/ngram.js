const create = (text, n = 3, pad = true) => {
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

  return nGrams
}

module.exports = create