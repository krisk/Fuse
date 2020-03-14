
const ngram = require('./ngram')
const { jaccardDistance } = require('./distance')

const NGRAM_LEN = 3

const sortedNgrams = (text, n = NGRAM_LEN, pad = true) => ngram(text, n, pad).sort((a, b) => a == b ? 0 : a < b ? -1 : 1)

class NGramSearch {
  constructor(pattern) {
    // Create the ngram, and sort it
    console.log(pattern)
    this.patternNgram = sortedNgrams(pattern)
  }
  searchIn(text) {
    let textNgram = sortedNgrams(text)
    // let tverskyRsult = tverskyIndex(this.patternNgram, textNgram, { alpha: 0.5 })
    let jacardResult = jaccardDistance(this.patternNgram, textNgram)

    return {
      score: jacardResult,
      isMatch: jacardResult < 1
    }
  }
}

module.exports = NGramSearch