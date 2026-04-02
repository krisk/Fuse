import search from './search'
import createPatternAlphabet from './createPatternAlphabet'
import { MAX_BITS } from './constants'
import Config from '../../core/config'
import { stripDiacritics } from '../../helpers/diacritics'
import type { SearchResult, RangeTuple } from '../../types'

interface BitapChunk {
  pattern: string
  alphabet: Record<string, number>
  startIndex: number
}

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

function mergeIndices(indices: RangeTuple[]): RangeTuple[] {
  if (indices.length <= 1) return indices

  indices.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  const merged: RangeTuple[] = [indices[0]]

  for (let i = 1, len = indices.length; i < len; i += 1) {
    const last = merged[merged.length - 1]
    const curr = indices[i]
    if (curr[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], curr[1])
    } else {
      merged.push(curr)
    }
  }

  return merged
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
    pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
    this.pattern = pattern;

    this.chunks = []

    if (!this.pattern.length) {
      return
    }

    const addChunk = (pattern: string, startIndex: number): void => {
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern),
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
    const { isCaseSensitive, ignoreDiacritics, includeMatches } = this.options

    text = isCaseSensitive ? text : text.toLowerCase()
    text = ignoreDiacritics ? stripDiacritics(text) : text

    // Exact match
    if (this.pattern === text) {
      let result: SearchResult = {
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
      minMatchCharLength,
      ignoreLocation
    } = this.options

    let allIndices: RangeTuple[] = []
    let totalScore = 0
    let hasMatches = false

    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      })

      if (isMatch) {
        hasMatches = true
      }

      totalScore += score

      if (isMatch && indices) {
        allIndices.push(...indices)
      }
    })

    let result: SearchResult = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    }

    if (hasMatches && includeMatches) {
      result.indices = mergeIndices(allIndices)
    }

    return result
  }
}
