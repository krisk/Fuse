const ngram = require('./ngram')
const { jaccardDistance } = require('./distance')

class NGramSearch {
  constructor(pattern, options = { threshold: 0.6 }) {
    // Create the ngram, and sort it
    this.options = options
    this.patternNgram = ngram(pattern, { sort: true })
  }
  searchIn(value) {
    let textNgram = value.ng
    if (!textNgram) {
      textNgram = ngram(value.$, { sort: true })
      value.ng = textNgram
    }

    let jacardResult = jaccardDistance(this.patternNgram, textNgram)

    const isMatch = jacardResult < this.options.threshold

    return {
      score: isMatch ? jacardResult : 1,
      isMatch
    }
  }
}

module.exports = NGramSearch