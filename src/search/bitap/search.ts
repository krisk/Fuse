import convertMaskToIndices from './convertMaskToIndices'
import Config from '../../core/config'
import { MAX_BITS } from './constants'
import type { PatternAlphabet } from './createPatternAlphabet'
import * as ErrorMsg from '../../core/errorMessages'
import type { SearchResult } from '../../types'

export interface BitapChunk {
  pattern: string
  alphabet: PatternAlphabet
  table: Int32Array
  startIndex: number
}

// Shared rows and per-position character mask buffer, reused across calls so
// the hot path doesn't allocate per error level. They only grow up to
// MAX_SHARED_ROW_LENGTH: longer windows get one-off buffers instead, so a
// single huge document can't pin memory for the life of the process
// (3 buffers × 64k × 4 bytes = 768 KB max retained).
const MAX_SHARED_ROW_LENGTH = 1 << 16

let bitArr = new Int32Array(256)
let lastBitArr = new Int32Array(256)
let charBuf = new Int32Array(256)

function getBuffers(size: number): [Int32Array, Int32Array, Int32Array] {
  if (size > MAX_SHARED_ROW_LENGTH) {
    return [new Int32Array(size), new Int32Array(size), new Int32Array(size)]
  }
  if (bitArr.length < size) {
    let capacity = bitArr.length
    while (capacity < size) capacity *= 2
    bitArr = new Int32Array(capacity)
    lastBitArr = new Int32Array(capacity)
    charBuf = new Int32Array(capacity)
  }
  return [bitArr, lastBitArr, charBuf]
}

// Score of a match with `errors` errors at `currentLocation` (see
// ./computeScore.ts). Top-level so hot calls don't allocate a closure.
export const calcScore = (
  errors: number,
  currentLocation: number,
  patternLen: number,
  expectedLocation: number,
  distance: number,
  ignoreLocation: boolean
): number => {
  const accuracy = errors / patternLen
  if (ignoreLocation) return accuracy
  const proximity = Math.abs(expectedLocation - currentLocation)
  if (!distance) return proximity ? 1.0 : accuracy
  return accuracy + proximity / distance
}

export default function search(
  text: string,
  pattern: string,
  patternAlphabet: PatternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {},
  table?: Int32Array
): SearchResult {
  if (pattern.length > MAX_BITS) {
    throw new Error(ErrorMsg.PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
  }

  const patternLen = pattern.length
  const textLen = text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen))
  let currentThreshold = threshold
  let bestLocation = expectedLocation

  // Performance: only compute matches when minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches
  const matchMask: number[] = computeMatches ? Array(textLen) : []

  let index: number

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    const score = calcScore(
      0,
      index,
      patternLen,
      expectedLocation,
      distance,
      ignoreLocation
    )

    currentThreshold = Math.min(score, currentThreshold)
    bestLocation = index + patternLen

    if (computeMatches) {
      for (let k = index; k < bestLocation; k += 1) {
        matchMask[k] = 1
      }
    }
  }

  // Reset the best location
  bestLocation = -1

  const [r0, r1, cm] = getBuffers(textLen + patternLen + 2)
  let row = r0
  let lastRow = r1
  let low = 1
  let finalScore = 1
  let bestErrors = 0
  let binMax = patternLen + textLen

  const mask = 1 << (patternLen - 1)

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0
    let binMid = binMax

    while (binMin < binMid) {
      const score = calcScore(
        i,
        expectedLocation + binMid,
        patternLen,
        expectedLocation,
        distance,
        ignoreLocation
      )

      if (score <= currentThreshold) {
        binMin = binMid
      } else {
        binMax = binMid
      }

      binMid = Math.floor((binMax - binMin) / 2 + binMin)
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid

    let start = Math.max(1, expectedLocation - binMid + 1)
    const finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen

    if (!i) {
      // Level 0 has the widest window. `start` may later drop to
      // 2 * expectedLocation - bestLocation with bestLocation < finish, so no
      // level scans below `low`. Resolve the alphabet mask of every position
      // in [low, finish] once instead of re-probing patternAlphabet per level.
      low = Math.max(1, Math.min(start, 2 * expectedLocation - finish + 1)) | 0
      if (table) {
        for (let k = low; k <= finish; k += 1) {
          if (k > textLen) {
            cm[k] = 0
          } else {
            const code = text.charCodeAt(k - 1)
            cm[k] = table[code] ?? patternAlphabet[code] | 0
          }
        }
      } else {
        for (let k = low; k <= finish; k += 1) {
          cm[k] = k > textLen ? 0 : patternAlphabet[text.charCodeAt(k - 1)] | 0
        }
      }
    }

    row[finish + 1] = (1 << i) - 1

    let j = finish
    for (; j >= start; j -= 1) {
      // First pass: exact match
      let bits = ((row[j + 1] << 1) | 1) & cm[j]

      // Subsequent passes: fuzzy match
      if (i) {
        bits |= ((lastRow[j + 1] | lastRow[j]) << 1) | 1 | lastRow[j + 1]
      }

      row[j] = bits

      if (bits & mask) {
        finalScore = calcScore(
          i,
          j - 1,
          patternLen,
          expectedLocation,
          distance,
          ignoreLocation
        )

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          currentThreshold = finalScore
          bestLocation = j - 1
          bestErrors = i

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            j -= 1
            break
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation)
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    if ((i + 1) / patternLen > currentThreshold) {
      break
    }

    // [low, j] was not written at this level and must read as 0 at the next.
    row.fill(0, low, j + 1)

    const swap = lastRow
    lastRow = row
    row = swap
  }

  // Fill matchMask across the matched window only.
  if (computeMatches && bestLocation >= 0) {
    const matchEnd = Math.min(
      textLen - 1,
      bestLocation + patternLen - 1 + bestErrors
    )
    for (let k = bestLocation; k <= matchEnd; k += 1) {
      if (patternAlphabet[text.charCodeAt(k)]) {
        matchMask[k] = 1
      }
    }
  }

  const result: SearchResult = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(0.001, finalScore)
  }

  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength)
    if (!indices.length) {
      result.isMatch = false
    } else if (includeMatches) {
      result.indices = indices
    }
  }

  return result
}
