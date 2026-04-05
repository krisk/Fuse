import convertMaskToIndices from './convertMaskToIndices'
import Config from '../../core/config'
import { MAX_BITS } from './constants'
import * as ErrorMsg from '../../core/errorMessages'
import type { SearchResult } from '../../types'

export default function search(
  text: string,
  pattern: string,
  patternAlphabet: Record<string, number>,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}
): SearchResult {
  if (pattern.length > MAX_BITS) {
    throw new Error(ErrorMsg.PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
  }

  const patternLen = pattern.length
  // Set starting location at beginning text and initialize the alphabet.
  const textLen = text.length
  // Handle the case when location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen))
  // Highest score beyond which we give up.
  let currentThreshold = threshold
  // Is there a nearby exact match? (speedup)
  let bestLocation = expectedLocation

  // Inlined score computation — avoids object allocation per call in hot loops.
  // See ./computeScore.ts for the documented version of this formula.
  const calcScore = (errors: number, currentLocation: number): number => {
    const accuracy = errors / patternLen
    if (ignoreLocation) return accuracy
    const proximity = Math.abs(expectedLocation - currentLocation)
    if (!distance) return proximity ? 1.0 : accuracy
    return accuracy + proximity / distance
  }

  // Performance: only computer matches when the minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches
  // A mask of the matches, used for building the indices
  const matchMask: number[] = computeMatches ? Array(textLen) : []

  let index: number

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    const score = calcScore(0, index)

    currentThreshold = Math.min(score, currentThreshold)
    bestLocation = index + patternLen

    if (computeMatches) {
      let i = 0
      while (i < patternLen) {
        matchMask[index + i] = 1
        i += 1
      }
    }
  }

  // Reset the best location
  bestLocation = -1

  let finalScore = 1
  let binMax = patternLen + textLen

  const mask = 1 << (patternLen - 1)

  // Pre-allocate bit arrays at max possible size and swap between iterations
  const maxFinish = (findAllMatches ? textLen : textLen + patternLen) + 2
  let bitArr: number[] = new Array(maxFinish)
  let lastBitArr: number[] = new Array(maxFinish)

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0
    let binMid = binMax

    while (binMin < binMid) {
      const score = calcScore(i, expectedLocation + binMid)

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

    // Initialize the sentinel value for this error level
    bitArr[finish + 1] = (1 << i) - 1

    for (let j = finish; j >= start; j -= 1) {
      const currentLocation = j - 1
      const charMatch = patternAlphabet[text[currentLocation]]

      if (computeMatches) {
        // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
        matchMask[currentLocation] = +!!charMatch
      }

      // First pass: exact match
      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch

      // Subsequent passes: fuzzy match
      if (i) {
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1]
      }

      if (bitArr[j] & mask) {
        finalScore = calcScore(i, currentLocation)

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore
          bestLocation = currentLocation

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation)
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    const score = calcScore(i + 1, expectedLocation)

    if (score > currentThreshold) {
      break
    }

    // Swap buffers: current becomes last, last gets reused as next current
    const tmp = lastBitArr
    lastBitArr = bitArr
    bitArr = tmp
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
