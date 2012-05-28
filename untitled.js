function Searcher(pattern, options) {
    options = options || {};

    // Aproximately where in the text is the pattern expected to be found?
    var MATCH_LOCATION = options.location || 0,

    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    MATCH_DISTANCE = options.distance || 100,

    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    MATCH_THRESHOLD = options.threshold || 0.6,

    // Set starting location at beginning text
    loc = MATCH_LOCATION,
    patternLen = pattern.length;

  function initPatternBitmask() {
    var pattern_mask = {},
        patternLen = pattern.length;

    for (var i = 0; i < patternLen; i++) {
        pattern_mask[pattern.charAt(i)] = 0;
    }

    for (var i = 0; i < patternLen; i++) {
        pattern_mask[pattern.charAt(i)] |= 1 << (patternLen - i - 1);
    }

    return pattern_mask;
  }

  // Compute and return the score for a match with e errors and x location.
  // Accesses loc and pattern through being a closure.
  function match_bitapScore_(e, x) {
    var accuracy = e / patternLen,
        proximity = Math.abs(loc - x);

    if (!MATCH_DISTANCE) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / MATCH_DISTANCE);
  }

  // Initialise the alphabet.
  var pattern_mask = initPatternBitmask(),
      matchmask = 1 << (patternLen - 1);

  this.search = function(text) {
    if (pattern === text) {
      // Exact match
      return {
        isMatch: true,
        score: 0,
      }
    }

    if (pattern.length > 32) {
      // This algorithm cannot be used
      return {
        isMatch: false,
        score: 1,
      }
    }

    // Set starting location at beginning text and initialise the alphabet.
    var textLen = text.length,
        score_threshold = MATCH_THRESHOLD, // Highest score beyond which we give up.
        best_loc = text.indexOf(pattern, loc); // Is there a nearby exact match? (speedup)

    if (best_loc != -1) {
        score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
        // What about in the other direction? (speedup)
        best_loc = text.lastIndexOf(pattern, loc + patternLen);

        if (best_loc != -1) {
            score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
        }
    }

    var d, j,
        bin_min, bin_mid,
        bin_max = patternLen + textLen,
        last_rd,
        start,
        finish,
        rd,
        charMatch,
        score;

    best_loc = -1;

    for (d = 0; d < patternLen; d++) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from 'loc' we can stray at this
      // error level.
      bin_min = 0;
      bin_mid = bin_max;
      while (bin_min < bin_mid) {
          if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
              bin_min = bin_mid;
          } else {
              bin_max = bin_mid;
          }
          bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
      }

      // Use the result from this iteration as the maximum for the next.
      bin_max = bin_mid;
      start = Math.max(1, loc - bin_mid + 1);
      finish = Math.min(loc + bin_mid, textLen) + patternLen;

      rd = Array(finish + 2);

      rd[finish + 1] = (1 << d) - 1;

      for (j = finish; j >= start; j--) {
          // The alphabet (s) is a sparse hash, so the following line generates warnings.
          charMatch = bitmaskPattern[text.charAt(j - 1)];
          if (d === 0) {    // First pass: exact match.
              rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
          } else {    // Subsequent passes: fuzzy match.
              rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                              (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                              last_rd[j + 1];
          }
          if (rd[j] & matchmask) {
              score = match_bitapScore_(d, j - 1);
              // This match will almost certainly be better than any existing match.
              // But check anyway.
              if (score <= score_threshold) {
                  // Told you so.
                  score_threshold = score;
                  best_loc = j - 1;
                  if (best_loc > loc) {
                      // When passing loc, don't exceed our current distance from loc.
                      start = Math.max(1, 2 * loc - best_loc);
                  } else {
                      // Already passed loc, downhill from here on in.
                      break;
                  }
              }
          }
      }
      // No hope for a (better) match at greater error levels.
      if (match_bitapScore_(d + 1, loc) > score_threshold) {
          break;
      }
      last_rd = rd;
    }

    return {
      isMatch: best_loc >= 0,
      score: score,
    }
  }

}
