import ngram from './ngram'
import { jaccardDistance } from './distance'
import Config from '../../core/config'
import { MAX_BITS } from '../bitap/constants'

export default class NGramSearch {
  constructor(
    pattern,
    options = ({
      /*eslint-disable no-undef*/
      threshold = Config.threshold
      /*eslint-enable no-undef*/
    } = {})
  ) {
    // Create the ngram, and sort it
    this.options = options
    this.patternNgram = ngram(pattern, { sort: true })
  }
  static condition(pattern) {
    return pattern.length > MAX_BITS
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
