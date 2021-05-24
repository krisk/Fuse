import search from './search.js'
import { MAX_BITS } from './constants.js'
import createPatternAlphabet from './createPatternAlphabet.js'

import Config from '../../core/config.js'

class BitapSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      distance = Config.distance,
      threshold = Config.threshold,
      ignoreLocation = Config.ignoreLocation,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      isCaseSensitive = Config.isCaseSensitive,
      minMatchCharLength = Config.minMatchCharLength
    } = {}
  ) {
    this.options = {
      location,
      distance,
      threshold,
      ignoreLocation,
      includeMatches,
      findAllMatches,
      isCaseSensitive,
      minMatchCharLength
    }
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase()
    this.chunks = []

    if (!this.pattern.length) return

    const addChunk = (pattern, startIndex) => {
      this.chunks.push({
        pattern,
        startIndex,
        alphabet: createPatternAlphabet(pattern)
      })
    }
    const len = this.pattern.length

    if (len <= MAX_BITS) {
      addChunk(this.pattern, 0)
      return
    }

    let i = 0
    const remainder = len % MAX_BITS
    const end = len - remainder

    while (i < end) {
      addChunk(this.pattern.substr(i, MAX_BITS), i)
      i += MAX_BITS
    }

    if (remainder) return

    const startIndex = len - MAX_BITS

    addChunk(this.pattern.substr(startIndex), startIndex)
  }

  searchIn(text) {
    const { isCaseSensitive, includeMatches } = this.options

    if (!isCaseSensitive) text = text.toLowerCase()

    if (this.pattern === text) {
      let result = { score: 0, isMatch: true }

      if (includeMatches) result.indices = [[0, text.length - 1]]

      return result
    }

    const { location } = this.options
    const { distance } = this.options
    const { threshold } = this.options
    const { findAllMatches } = this.options
    const { ignoreLocation } = this.options
    const { minMatchCharLength } = this.options

    let totalScore = 0
    let allIndices = []
    let hasMatches = false

    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        includeMatches,
        ignoreLocation,
        minMatchCharLength
      })

      if (isMatch) hasMatches = true

      totalScore += score

      if (isMatch && indices) allIndices = [...allIndices, ...indices]
    })

    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    }

    if (hasMatches && includeMatches) result.indices = allIndices

    return result
  }
}

export default BitapSearch
