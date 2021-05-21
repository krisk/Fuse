import { MAX_BITS } from "./constants.js";
import computeScore from "./computeScore.js";
import convertMaskToIndices from "./convertMaskToIndices.js";

import Config from "../../core/config.js";
import { PatternLengthTooLargeException } from "../../core/error.js";

function search(
  text,
  pattern,
  patternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation,
    minMatchCharLength = Config.minMatchCharLength,
  } = {}
) {
  if (pattern.length > MAX_BITS)
    throw new PatternLengthTooLargeException(MAX_BITS);

  const textLen = text.length;
  const patternLen = pattern.length;
  const expectedLocation = Math.max(0, Math.min(location, textLen));

  let bestLocation = expectedLocation;
  let currentThreshold = threshold;

  const computeMatches = minMatchCharLength > 1 || includeMatches;
  const matchMask = computeMatches ? Array(textLen) : [];

  let index;

  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore(pattern, {
      distance,
      ignoreLocation,
      expectedLocation,
      currentLocation: index,
    });

    bestLocation = index + patternLen;
    currentThreshold = Math.min(score, currentThreshold);

    if (computeMatches)
      for (let i = 0; i < patternLen; i++) matchMask[index + i] = 1;
  }

  bestLocation = -1;

  let binMax = patternLen + textLen;
  let finalScore = 1;
  let lastBitArr = [];

  const mask = 1 << (patternLen - 1);

  for (let i = 0; i < patternLen; i++) {
    let binMin = 0;
    let binMid = binMax;

    while (binMin < binMid) {
      const score = computeScore(pattern, {
        errors: i,
        distance,
        ignoreLocation,
        expectedLocation,
        currentLocation: expectedLocation + binMid,
      });

      if (score <= currentThreshold) binMin = binMid;
      else binMax = binMid;

      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    binMax = binMid;

    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen;

    let bitArr = Array(finish + 2);

    bitArr[finish + 1] = (1 << i) - 1;

    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (computeMatches) matchMask[currentLocation] = +!!charMatch;

      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

      if (i)
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];

      if (!(bitArr[j] & mask)) continue;

      finalScore = computeScore(pattern, {
        errors: i,
        distance,
        ignoreLocation,
        currentLocation,
        expectedLocation,
      });

      if (finalScore > currentThreshold) continue;

      bestLocation = currentLocation;
      currentThreshold = finalScore;

      if (bestLocation <= expectedLocation) break;

      start = Math.max(1, 2 * expectedLocation - bestLocation);
    }

    const score = computeScore(pattern, {
      errors: i + 1,
      distance,
      ignoreLocation,
      expectedLocation,
      currentLocation: expectedLocation,
    });

    if (score > currentThreshold) break;

    lastBitArr = bitArr;
  }

  const result = {
    isMatch: bestLocation >= 0,
    score: Math.max(0.001, finalScore),
  };

  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);

    if (!indices.length) result.isMatch = false;
    else if (includeMatches) result.indices = indices;
  }

  return result;
}

export default search;
