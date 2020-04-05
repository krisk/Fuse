import ngram from './ngram'
import { jaccardDistance } from './distance'
import Config from '../../core/config'

export default class NGramSearch {
  constructor(pattern, options = ({ threshold = Config.threshold } = {})) {
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
