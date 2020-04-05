import bitapSearch from './bitap-search'
import patternAlphabet from './bitap-pattern-alphabet'
import { MAX_BITS } from './constants'
import Config from '../../core/config'

export default class BitapSearch {
  constructor(
    pattern,
    // Deconstructed in this fashion purely for speed-up, since a new instance
    // of this class is created every time a pattern is created. Otherwise, a spread
    // operation would be performed directly withing the contructor, which may slow
    // done searches.
    options = ({
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive
    } = {})
  ) {
    this.options = options

    if (pattern.length > MAX_BITS) {
      throw new Error(`Pattern length exceeds max of ${MAX_BITS}.`)
    }

    this.pattern = this.options.isCaseSensitive
      ? pattern
      : pattern.toLowerCase()
    this.patternAlphabet = patternAlphabet(this.pattern)
  }

  searchIn(value) {
    let text = value.$
    return this.searchInString(text)
  }

  searchInString(text) {
    const { isCaseSensitive, includeMatches } = this.options

    if (!isCaseSensitive) {
      text = text.toLowerCase()
    }

    // Exact match
    if (this.pattern === text) {
      let result = {
        isMatch: true,
        score: 0
      }

      if (includeMatches) {
        result.matchedIndices = [[0, text.length - 1]]
      }

      return result
    }

    // Otherwise, use Bitap algorithm
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength
    } = this.options
    return bitapSearch(text, this.pattern, this.patternAlphabet, {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      includeMatches
    })
  }
}
