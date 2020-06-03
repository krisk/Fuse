import search from './search'
import createPatternAlphabet from './createPatternAlphabet'
import { MAX_BITS } from './constants'
import Config from '../../core/config'

export default class BitapSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive
    } = {}
  ) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive
    }

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase()

    this.chunks = []

    let i = 0
    const len = this.pattern.length
    const remainder = len % MAX_BITS
    const end = len - remainder

    while (i < end) {
      const pattern = this.pattern.substr(i, MAX_BITS)
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern)
      })
      i += MAX_BITS
    }

    if (remainder) {
      const pattern = this.pattern.substr(len - MAX_BITS)
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern)
      })
    }
  }

  searchIn(text) {
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
        result.indices = [[0, text.length - 1]]
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

    let allIndices = []
    let totalScore = 0
    let hasMatches = false

    this.chunks.forEach(({ pattern, alphabet }, i) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + MAX_BITS * i,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches
      })

      if (isMatch) {
        hasMatches = true
      }

      totalScore += score

      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices]
      }
    })

    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    }

    if (hasMatches && includeMatches) {
      result.indices = allIndices
    }

    return result
  }
}
