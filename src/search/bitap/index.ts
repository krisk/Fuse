import search from './search'
import myersSearch from './myers'
import createPatternAlphabet, {
  type PatternAlphabet
} from './createPatternAlphabet'
import { MAX_BITS } from './constants'
import { mergeIndices } from '../../helpers/mergeIndices'
import Config from '../../core/config'
import { stripDiacritics } from '../../helpers/diacritics'
import type { SearchResult, RangeTuple, FuseMatchAlgorithm } from '../../types'

interface BitapChunk {
  pattern: string
  alphabet: PatternAlphabet
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
  matchAlgorithm: FuseMatchAlgorithm
}

export default class BitapSearch {
  options: BitapOptions
  pattern: string
  chunks: BitapChunk[]
  // The per-chunk scan, chosen once at construction from matchAlgorithm.
  private _scan: typeof search

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
      ignoreLocation = Config.ignoreLocation,
      matchAlgorithm = Config.matchAlgorithm
    }: Partial<BitapOptions> = {}
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
      ignoreLocation,
      matchAlgorithm
    }

    // Myers finds every match Bitap's levels test in a single pass. A negative
    // distance rewards matches for being far away, which breaks the bounds the
    // single pass prunes with, so that (invalid) setting stays on Bitap.
    this._scan =
      matchAlgorithm === 'myers' && (ignoreLocation || !(distance < 0))
        ? myersSearch
        : search

    pattern = isCaseSensitive ? pattern : pattern.toLowerCase()
    pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern
    this.pattern = pattern

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
      // The whole string is the match, so enforce minMatchCharLength here too,
      // mirroring convertMaskToIndices on the fuzzy path.
      if (text.length < this.options.minMatchCharLength) {
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

    // Otherwise, run the fuzzy scan (Myers or Bitap) per chunk
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options

    const allIndices: RangeTuple[] = []
    let totalScore = 0
    let hasMatches = false

    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = this._scan(text, pattern, alphabet, {
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
