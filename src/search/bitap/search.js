import computeScore from './computeScore'
import convertMaskToIndices from './convertMaskToIndices'
import Config from '../../core/config'
import { MAX_BITS } from './constants'
import * as ErrorMsg from '../../core/errorMessages'

export default function search(
  text,
  pattern,
  patternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
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

  // Performance: only computer matches when the minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches
  // A mask of the matches, used for building the indices
  const matchMask = computeMatches ? Array(textLen) : []

  let index

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    })

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

  let lastBitArr = []
  let finalScore = 1
  let binMax = patternLen + textLen

  const mask = 1 << (patternLen - 1)

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0
    let binMid = binMax

    while (binMin < binMid) {
      const score = computeScore(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      })

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
    let finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen

    // Initialize the bit array
    let bitArr = Array(finish + 2)

    bitArr[finish + 1] = (1 << i) - 1

    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1
      let charMatch = patternAlphabet[text.charAt(currentLocation)]

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
        finalScore = computeScore(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        })

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
    const score = computeScore(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    })

    if (score > currentThreshold) {
      break
    }

    lastBitArr = bitArr
  }

  const result = {
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
