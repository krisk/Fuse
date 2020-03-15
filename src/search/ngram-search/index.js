const ngram = require('./ngram')
const { jaccardDistance } = require('./distance')

class NGramSearch {
  constructor(pattern) {
    // Create the ngram, and sort it
    this.patternNgram = ngram(pattern, { sort: true })
  }
  searchIn(value) {
    let textNgram = value.ng
    if (!textNgram) {
      textNgram = ngram(value.$, { sort: true })
      value.ng = textNgram
    }

    let jacardResult = jaccardDistance(this.patternNgram, textNgram)

    return {
      score: jacardResult,
      isMatch: jacardResult < 1
    }
  }
}

module.exports = NGramSearch