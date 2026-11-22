import search, { type BitapChunk } from './search'
import canMatch from './canMatch'
import createPatternAlphabet from './createPatternAlphabet'
import { MAX_BITS } from './constants'
import { mergeIndices } from '../../helpers/mergeIndices'
import Config from '../../core/config'
import { stripDiacritics } from '../../helpers/diacritics'
import type { SearchResult, RangeTuple } from '../../types'

interface BitapOptions {
  location: number
  threshold: number
  distance: number
  includeMatches: boolean
  findAllMatches: boolean
  minMatchCharLength: number
  isCaseSensitive: boolean
  ignoreDiacritics: boolean
  ignoreLocation: boolean
}

export default class BitapSearch {
  options: BitapOptions
  pattern: string
  chunks: BitapChunk[]

  constructor(
    pattern: string,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreDiacritics = Config.ignoreDiacritics,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreDiacritics,
      ignoreLocation
    }

    pattern = isCaseSensitive ? pattern : pattern.toLowerCase()
    pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern
    this.pattern = pattern

    this.chunks = []

    if (!this.pattern.length) {
      return
    }

    const addChunk = (chunkPattern: string, startIndex: number): void => {
      const alphabet = createPatternAlphabet(chunkPattern)
      const table = new Int32Array(256)
      for (let c = 0; c < 256; c += 1) {
        table[c] = alphabet[c] | 0
      }
      this.chunks.push({
        pattern: chunkPattern,
        alphabet,
        table,
        startIndex
      })
    }

    const len = this.pattern.length

    if (len > MAX_BITS) {
      let i = 0
      const remainder = len % MAX_BITS
      const end = len - remainder

      while (i < end) {
        addChunk(this.pattern.substr(i, MAX_BITS), i)
        i += MAX_BITS
      }

      if (remainder) {
        const startIndex = len - MAX_BITS
        addChunk(this.pattern.substr(startIndex), startIndex)
      }
    } else {
      addChunk(this.pattern, 0)
    }
  }

  searchIn(text: string): SearchResult {
    const {
      isCaseSensitive,
      ignoreDiacritics,
      includeMatches,
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options

    text = isCaseSensitive ? text : text.toLowerCase()
    text = ignoreDiacritics ? stripDiacritics(text) : text

    // Exact match
    if (this.pattern === text) {
      // The whole string is the match, so enforce minMatchCharLength here too,
      // mirroring convertMaskToIndices on the fuzzy path.
      if (text.length < minMatchCharLength) {
        return { isMatch: false, score: 1 }
      }

      const result: SearchResult = {
        isMatch: true,
        score: 0
      }

      if (includeMatches) {
        result.indices = [[0, text.length - 1]]
      }

      return result
    }

    // One Myers pass per chunk (./canMatch.ts). If no chunk can match, skip the
    // multi-level Bitap kernel. When ignoreLocation is set and match indices
    // are not needed, Myers' minimum edit count directly gives each chunk's
    // exact score without entering the kernel.
    const direct =
      ignoreLocation && !includeMatches && !(minMatchCharLength > 1)
    let hasMatches = false
    let totalScore = 0
    for (let i = 0, len = this.chunks.length; i < len; i += 1) {
      const chunk = this.chunks[i]
      const r = canMatch(text, chunk, this.options, !direct)
      if (r) {
        hasMatches = true
        if (!direct) break
      }
      totalScore += r ? Math.max(0.001, ~r / chunk.pattern.length) : 1
    }

    const allIndices: RangeTuple[] = []

    if (hasMatches && !direct) {
      hasMatches = false
      totalScore = 0
      for (let i = 0, len = this.chunks.length; i < len; i += 1) {
        const { pattern, alphabet, table, startIndex } = this.chunks[i]
        const { isMatch, score, indices } = search(
          text,
          pattern,
          alphabet,
          {
            location: location + startIndex,
            distance,
            threshold,
            findAllMatches,
            minMatchCharLength,
            includeMatches,
            ignoreLocation
          },
          table
        )

        if (isMatch) {
          hasMatches = true
        }

        totalScore += score

        if (isMatch && indices) {
          allIndices.push(...indices)
        }
      }
    }

    const result: SearchResult = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    }

    if (hasMatches && includeMatches) {
      result.indices = mergeIndices(allIndices)
    }

    return result
  }
}
