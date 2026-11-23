import convertMaskToIndices from './convertMaskToIndices'
import Config from '../../core/config'
import { MAX_BITS } from './constants'
import type { PatternAlphabet } from './createPatternAlphabet'
import * as ErrorMsg from '../../core/errorMessages'
import type { SearchResult } from '../../types'

// Single-pass alternative to ./search.ts.
//
// Bitap answers "does the pattern match starting at s with at most i errors?"
// by rescanning the text once per error level i. Myers' bit-vector algorithm
// (Myers 1999, in Hyyrö's formulation) instead tracks the edit-distance column
// as vertical deltas in two machine words, which yields the exact minimum
// number of errors for every position in one scan.
//
// Bitap anchors a match at its start, so the scan here runs right to left over
// the text against the reversed pattern: after consuming text[s], `errors` is
// the minimum edit distance between the pattern and any substring that starts
// at s. That is the quantity each Bitap level tests against its error budget,
// and the pattern alphabet (bit m-1 for pattern[0]) is already laid out for
// it, so the two matchers share ./createPatternAlphabet.ts.
//
// Scoring is folded into the scan and follows Bitap's selection rules: lowest
// score wins; among equal scores the higher error count wins (Bitap visits it
// last); among equal error counts the scan order of a single Bitap level
// decides. Unlike Bitap the reported score is always that of the selected
// match, and the text is never truncated at a per-level window edge.

const MAX_SHARED_MASK_LENGTH = 1 << 16

let sharedMatchMask = new Uint8Array(256)

function bitCount(v: number): number {
  v = v - ((v >>> 1) & 0x55555555)
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333)
  return Math.imul((v + (v >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24
}

export default function myersSearch(
  text: string,
  pattern: string,
  patternAlphabet: PatternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  }: {
    location?: number
    distance?: number
    threshold?: number
    // Bitap's findAllMatches only widens its scan to the end of the text. This
    // scan always covers every start position that can still score, so the
    // flag has nothing to change; it is accepted for a shared call contract.
    findAllMatches?: boolean
    minMatchCharLength?: number
    includeMatches?: boolean
    ignoreLocation?: boolean
  } = {}
): SearchResult {
  const patternLen = pattern.length

  if (patternLen > MAX_BITS) {
    throw new Error(ErrorMsg.PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
  }

  const textLen = text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen))
  const lastLevel = patternLen - 1

  // Highest score a match may have; drops as better matches are found.
  let currentThreshold = threshold
  let bestLocation = -1
  let bestErrors = 0

  const computeMatches = minMatchCharLength > 1 || includeMatches

  let matchMask = sharedMatchMask
  let maskLo = textLen
  let maskHi = -1
  if (computeMatches) {
    if (textLen > MAX_SHARED_MASK_LENGTH) {
      matchMask = new Uint8Array(textLen)
    } else if (matchMask.length < textLen) {
      let capacity = matchMask.length
      while (capacity < textLen) capacity *= 2
      matchMask = sharedMatchMask = new Uint8Array(capacity)
    }
  }

  // Exact occurrences at or after the expected location. The first one caps
  // the threshold; all of them are highlighted when indices are requested.
  const firstExact = text.indexOf(pattern, expectedLocation)
  if (firstExact > -1) {
    // Usually firstExact >= expectedLocation; a fractional location can put
    // it just before.
    const proximity = Math.abs(firstExact - expectedLocation)
    let score: number
    if (ignoreLocation) score = 0
    else if (!distance) score = proximity ? 1.0 : 0
    else score = 0 / patternLen + proximity / distance
    if (score < currentThreshold) currentThreshold = score

    if (computeMatches) {
      let index = firstExact
      maskLo = index
      do {
        matchMask.fill(1, index, index + patternLen)
        maskHi = index + patternLen - 1
      } while ((index = text.indexOf(pattern, maskHi + 1)) > -1)
    }
  }

  // The most errors a match can carry: Bitap runs level i only while
  // i / patternLen is within the threshold, and never reaches patternLen.
  let maxErrors = Math.floor(currentThreshold * patternLen)
  if (maxErrors > lastLevel) maxErrors = lastLevel
  while (
    maxErrors < lastLevel &&
    (maxErrors + 1) / patternLen <= currentThreshold
  ) {
    maxErrors += 1
  }
  while (maxErrors >= 0 && maxErrors / patternLen > currentThreshold) {
    maxErrors -= 1
  }
  const initialMaxErrors = maxErrors

  // A score that grows with the distance from the expected location bounds
  // the start positions worth visiting.
  const bounded = !ignoreLocation && distance > 0 && distance < Infinity

  if (maxErrors === 0) {
    // Only exact occurrences can match, so native string search settles it:
    // the candidates are the nearest occurrence at or after the expected
    // location (firstExact) and the nearest one before it.
    if (firstExact > -1) {
      const proximity = Math.abs(firstExact - expectedLocation)
      const score = ignoreLocation
        ? 0
        : !distance
          ? proximity
            ? 1.0
            : 0
          : proximity / distance
      if (score <= currentThreshold) {
        bestLocation = firstExact
        currentThreshold = score
      }
    }
    if (expectedLocation > 0 && bestLocation !== expectedLocation) {
      const left = text.lastIndexOf(pattern, expectedLocation - 1)
      if (
        left > -1 &&
        (bestLocation < 0 || left >= 2 * expectedLocation - bestLocation - 1)
      ) {
        const proximity = expectedLocation - left
        const score = ignoreLocation
          ? 0
          : !distance
            ? 1.0
            : proximity / distance
        if (score <= currentThreshold) {
          bestLocation = left
          currentThreshold = score
        }
      }
    }
  } else if (maxErrors > 0) {
    let lowest = 0
    let highest = textLen - 1
    // Positions stay integers even when `location` is not one; only the
    // score uses the fractional distance to it.
    if (bounded) {
      const reach = Math.floor(currentThreshold * distance) + 1
      if (expectedLocation - reach > 0) {
        lowest = Math.ceil(expectedLocation - reach)
      }
      if (expectedLocation + reach < highest) {
        highest = Math.floor(expectedLocation + reach)
      }
    } else if (!ignoreLocation && distance === 0 && currentThreshold < 1) {
      lowest = Math.ceil(expectedLocation)
      if (expectedLocation < highest) highest = Math.floor(expectedLocation)
    }

    // A match with at most maxErrors errors spans at most patternLen +
    // maxErrors characters, so text beyond that reach of the last start
    // position cannot affect any start position that is examined.
    let s = Math.min(textLen, highest + patternLen + maxErrors) - 1

    // Vertical deltas of the edit-distance column, for an empty text suffix.
    let pv = -1
    let mv = 0

    for (; s > highest; s -= 1) {
      const eq = patternAlphabet[text.charCodeAt(s)] | 0
      const xv = eq | mv
      const xh = (((eq & pv) + pv) ^ pv) | eq
      const ph = (mv | ~(xh | pv)) << 1
      pv = ((pv & xh) << 1) | ~(xv | ph)
      mv = ph & xv
    }

    // The column's last cell is the sum of its deltas.
    const low = patternLen === MAX_BITS ? -1 : (1 << patternLen) - 1
    let errors = bitCount(pv & low) - bitCount(mv & low)

    for (; s >= lowest; s -= 1) {
      const eq = patternAlphabet[text.charCodeAt(s)] | 0
      const xv = eq | mv
      const xh = (((eq & pv) + pv) ^ pv) | eq
      let ph = mv | ~(xh | pv)
      const mh = pv & xh
      errors += ((ph >>> lastLevel) & 1) - ((mh >>> lastLevel) & 1)
      ph <<= 1
      pv = (mh << 1) | ~(xv | ph)
      mv = ph & xv

      if (errors <= maxErrors) {
        let level = errors
        let score: number
        if (ignoreLocation) {
          score = level / patternLen
        } else if (!distance) {
          if (s === expectedLocation) {
            score = level / patternLen
          } else {
            // The score ignores the error count here, so Bitap keeps
            // re-accepting the position up to its last level.
            score = 1.0
            level = initialMaxErrors
          }
        } else {
          score = level / patternLen + Math.abs(expectedLocation - s) / distance
        }

        if (
          score <= currentThreshold &&
          (score < currentThreshold ||
            bestLocation < 0 ||
            level > bestErrors ||
            (level === bestErrors &&
              bestLocation > expectedLocation &&
              s >= 2 * expectedLocation - bestLocation - 1))
        ) {
          currentThreshold = score
          bestLocation = s
          bestErrors = level

          maxErrors = Math.floor(score * patternLen)
          if (maxErrors > lastLevel) maxErrors = lastLevel
          while (
            maxErrors < lastLevel &&
            (maxErrors + 1) / patternLen <= score
          ) {
            maxErrors += 1
          }
          while (maxErrors > 0 && maxErrors / patternLen > score) {
            maxErrors -= 1
          }

          if (bounded) {
            const reach = Math.floor(score * distance) + 1
            if (expectedLocation - reach > lowest) {
              lowest = Math.ceil(expectedLocation - reach)
            }
          }
        }
      }
    }
  }

  // Same highlight rule as Bitap: the matched window, limited to characters
  // that occur in the pattern.
  if (computeMatches && bestLocation >= 0) {
    const matchEnd = Math.min(
      textLen - 1,
      bestLocation + patternLen - 1 + bestErrors
    )
    for (let k = bestLocation; k <= matchEnd; k += 1) {
      if (patternAlphabet[text.charCodeAt(k)]) {
        matchMask[k] = 1
        if (k < maskLo) maskLo = k
        if (k > maskHi) maskHi = k
      }
    }
  }

  const result: SearchResult = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: bestLocation >= 0 ? Math.max(0.001, currentThreshold) : 1
  }

  if (computeMatches) {
    const indices = convertMaskToIndices(
      matchMask,
      minMatchCharLength,
      maskLo,
      maskHi + 1
    )
    if (maskHi >= 0) {
      matchMask.fill(0, maskLo, maskHi + 1)
    }
    if (!indices.length) {
      result.isMatch = false
    } else if (includeMatches) {
      result.indices = indices
    }
  }

  return result
}
