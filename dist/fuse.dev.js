/* Fuse.js v5.0.7-beta - Lightweight fuzzy-search (http://fusejs.io)

Copyright (c) 2012-2020 Kirollos Risk (http://kiro.me)
All Rights Reserved. Apache Software License 2.0

http://www.apache.org/licenses/LICENSE-2.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Fuse = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var bitapScore = function bitapScore(pattern, _ref) {
    var _ref$errors = _ref.errors,
        errors = _ref$errors === void 0 ? 0 : _ref$errors,
        _ref$currentLocation = _ref.currentLocation,
        currentLocation = _ref$currentLocation === void 0 ? 0 : _ref$currentLocation,
        _ref$expectedLocation = _ref.expectedLocation,
        expectedLocation = _ref$expectedLocation === void 0 ? 0 : _ref$expectedLocation,
        _ref$distance = _ref.distance,
        distance = _ref$distance === void 0 ? 100 : _ref$distance;
    var accuracy = errors / pattern.length;
    var proximity = Math.abs(expectedLocation - currentLocation);

    if (!distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }

    return accuracy + proximity / distance;
  };

  var bitapMatchedIndices = function bitapMatchedIndices() {
    var matchmask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var minMatchCharLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var matchedIndices = [];
    var start = -1;
    var end = -1;
    var i = 0;

    for (var len = matchmask.length; i < len; i += 1) {
      var match = matchmask[i];

      if (match && start === -1) {
        start = i;
      } else if (!match && start !== -1) {
        end = i - 1;

        if (end - start + 1 >= minMatchCharLength) {
          matchedIndices.push([start, end]);
        }

        start = -1;
      }
    } // (i-1 - start) + 1 => i - start


    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      matchedIndices.push([start, i - 1]);
    }

    return matchedIndices;
  };

  var bitapSearch = function bitapSearch(text, pattern, patternAlphabet, _ref) {
    var _ref$location = _ref.location,
        location = _ref$location === void 0 ? 0 : _ref$location,
        _ref$distance = _ref.distance,
        distance = _ref$distance === void 0 ? 100 : _ref$distance,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === void 0 ? 0.6 : _ref$threshold,
        _ref$findAllMatches = _ref.findAllMatches,
        findAllMatches = _ref$findAllMatches === void 0 ? false : _ref$findAllMatches,
        _ref$minMatchCharLeng = _ref.minMatchCharLength,
        minMatchCharLength = _ref$minMatchCharLeng === void 0 ? 1 : _ref$minMatchCharLeng,
        _ref$includeMatches = _ref.includeMatches,
        includeMatches = _ref$includeMatches === void 0 ? false : _ref$includeMatches;
    var patternLen = pattern.length; // Set starting location at beginning text and initialize the alphabet.

    var textLen = text.length; // Handle the case when location > text.length

    var expectedLocation = Math.max(0, Math.min(location, textLen)); // Highest score beyond which we give up.

    var currentThreshold = threshold; // Is there a nearby exact match? (speedup)

    var bestLocation = text.indexOf(pattern, expectedLocation); // a mask of the matches

    var matchMask = [];

    for (var i = 0; i < textLen; i += 1) {
      matchMask[i] = 0;
    }

    if (bestLocation !== -1) {
      var score = bitapScore(pattern, {
        errors: 0,
        currentLocation: bestLocation,
        expectedLocation: expectedLocation,
        distance: distance
      });
      currentThreshold = Math.min(score, currentThreshold); // What about in the other direction? (speed up)

      bestLocation = text.lastIndexOf(pattern, expectedLocation + patternLen);

      if (bestLocation !== -1) {
        var _score = bitapScore(pattern, {
          errors: 0,
          currentLocation: bestLocation,
          expectedLocation: expectedLocation,
          distance: distance
        });

        currentThreshold = Math.min(_score, currentThreshold);
      }
    } // Reset the best location


    bestLocation = -1;
    var lastBitArr = [];
    var finalScore = 1;
    var binMax = patternLen + textLen;
    var mask = 1 << (patternLen <= 31 ? patternLen - 1 : 30);

    for (var _i = 0; _i < patternLen; _i += 1) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      var binMin = 0;
      var binMid = binMax;

      while (binMin < binMid) {
        var _score3 = bitapScore(pattern, {
          errors: _i,
          currentLocation: expectedLocation + binMid,
          expectedLocation: expectedLocation,
          distance: distance
        });

        if (_score3 <= currentThreshold) {
          binMin = binMid;
        } else {
          binMax = binMid;
        }

        binMid = Math.floor((binMax - binMin) / 2 + binMin);
      } // Use the result from this iteration as the maximum for the next.


      binMax = binMid;
      var start = Math.max(1, expectedLocation - binMid + 1);
      var finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen; // Initialize the bit array

      var bitArr = Array(finish + 2);
      bitArr[finish + 1] = (1 << _i) - 1;

      for (var j = finish; j >= start; j -= 1) {
        var currentLocation = j - 1;
        var charMatch = patternAlphabet[text.charAt(currentLocation)];

        if (charMatch) {
          matchMask[currentLocation] = 1;
        } // First pass: exact match


        bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch; // Subsequent passes: fuzzy match

        if (_i !== 0) {
          bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
        }

        if (bitArr[j] & mask) {
          finalScore = bitapScore(pattern, {
            errors: _i,
            currentLocation: currentLocation,
            expectedLocation: expectedLocation,
            distance: distance
          }); // This match will almost certainly be better than any existing match.
          // But check anyway.

          if (finalScore <= currentThreshold) {
            // Indeed it is
            currentThreshold = finalScore;
            bestLocation = currentLocation; // Already passed `loc`, downhill from here on in.

            if (bestLocation <= expectedLocation) {
              break;
            } // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.


            start = Math.max(1, 2 * expectedLocation - bestLocation);
          }
        }
      } // No hope for a (better) match at greater error levels.


      var _score2 = bitapScore(pattern, {
        errors: _i + 1,
        currentLocation: expectedLocation,
        expectedLocation: expectedLocation,
        distance: distance
      });

      if (_score2 > currentThreshold) {
        break;
      }

      lastBitArr = bitArr;
    }

    var result = {
      isMatch: bestLocation >= 0,
      // Count exact matches (those with a score of 0) to be "almost" exact
      score: !finalScore ? 0.001 : finalScore
    };

    if (includeMatches) {
      result.matchedIndices = bitapMatchedIndices(matchMask, minMatchCharLength);
    }

    return result;
  };

  var bitapPatternAlphabet = function bitapPatternAlphabet(pattern) {
    var mask = {};
    var len = pattern.length;

    for (var i = 0; i < len; i += 1) {
      mask[pattern.charAt(i)] = 0;
    }

    for (var _i = 0; _i < len; _i += 1) {
      mask[pattern.charAt(_i)] |= 1 << len - _i - 1;
    }

    return mask;
  };

  // Machine word size
  var MAX_BITS = 32;
  var constants = {
    MAX_BITS: MAX_BITS
  };

  var MAX_BITS$1 = constants.MAX_BITS;

  var BitapSearch = /*#__PURE__*/function () {
    function BitapSearch(pattern, _ref) {
      var _ref$location = _ref.location,
          location = _ref$location === void 0 ? 0 : _ref$location,
          _ref$distance = _ref.distance,
          distance = _ref$distance === void 0 ? 100 : _ref$distance,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? 0.6 : _ref$threshold,
          _ref$isCaseSensitive = _ref.isCaseSensitive,
          isCaseSensitive = _ref$isCaseSensitive === void 0 ? false : _ref$isCaseSensitive,
          _ref$findAllMatches = _ref.findAllMatches,
          findAllMatches = _ref$findAllMatches === void 0 ? false : _ref$findAllMatches,
          _ref$minMatchCharLeng = _ref.minMatchCharLength,
          minMatchCharLength = _ref$minMatchCharLeng === void 0 ? 1 : _ref$minMatchCharLeng,
          _ref$includeMatches = _ref.includeMatches,
          includeMatches = _ref$includeMatches === void 0 ? false : _ref$includeMatches;

      _classCallCheck(this, BitapSearch);

      this.options = {
        location: location,
        distance: distance,
        threshold: threshold,
        isCaseSensitive: isCaseSensitive,
        findAllMatches: findAllMatches,
        includeMatches: includeMatches,
        minMatchCharLength: minMatchCharLength
      };

      if (pattern.length > MAX_BITS$1) {
        throw new Error("Pattern length exceeds max of ".concat(MAX_BITS$1, "."));
      }

      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.patternAlphabet = bitapPatternAlphabet(this.pattern);
    }

    _createClass(BitapSearch, [{
      key: "searchIn",
      value: function searchIn(value) {
        var text = value.$;
        return this.searchInString(text);
      }
    }, {
      key: "searchInString",
      value: function searchInString(text) {
        var _this$options = this.options,
            isCaseSensitive = _this$options.isCaseSensitive,
            includeMatches = _this$options.includeMatches;

        if (!isCaseSensitive) {
          text = text.toLowerCase();
        } // Exact match


        if (this.pattern === text) {
          var result = {
            isMatch: true,
            score: 0
          };

          if (includeMatches) {
            result.matchedIndices = [[0, text.length - 1]];
          }

          return result;
        } // Otherwise, use Bitap algorithm


        var _this$options2 = this.options,
            location = _this$options2.location,
            distance = _this$options2.distance,
            threshold = _this$options2.threshold,
            findAllMatches = _this$options2.findAllMatches,
            minMatchCharLength = _this$options2.minMatchCharLength;
        return bitapSearch(text, this.pattern, this.patternAlphabet, {
          location: location,
          distance: distance,
          threshold: threshold,
          findAllMatches: findAllMatches,
          minMatchCharLength: minMatchCharLength,
          includeMatches: includeMatches
        });
      }
    }]);

    return BitapSearch;
  }();

  var bitapSearch_1 = BitapSearch;

  // Token: 'file
  // Match type: exact-match
  // Description: Items that include `file`
  var isForPattern = function isForPattern(pattern) {
    return pattern.charAt(0) == "'";
  };

  var sanitize = function sanitize(pattern) {
    return pattern.substr(1);
  };

  var match = function match(pattern, text) {
    var sanitizedPattern = sanitize(pattern);
    var index = text.indexOf(sanitizedPattern);
    var isMatch = index > -1;
    return {
      isMatch: isMatch,
      score: 0
    };
  };

  var exactMatch = {
    isForPattern: isForPattern,
    sanitize: sanitize,
    match: match
  };

  // Token: !fire
  // Match type: inverse-exact-match
  // Description: Items that do not include `fire`
  var isForPattern$1 = function isForPattern(pattern) {
    return pattern.charAt(0) == '!';
  };

  var sanitize$1 = function sanitize(pattern) {
    return pattern.substr(1);
  };

  var match$1 = function match(pattern, text) {
    var sanitizedPattern = sanitize$1(pattern);
    var isMatch = text.indexOf(sanitizedPattern) === -1;
    return {
      isMatch: isMatch,
      score: 0
    };
  };

  var inverseExactMatch = {
    isForPattern: isForPattern$1,
    sanitize: sanitize$1,
    match: match$1
  };

  // Token: ^file
  // Match type: prefix-exact-match
  // Description: Items that start with `file`
  var isForPattern$2 = function isForPattern(pattern) {
    return pattern.charAt(0) == '^';
  };

  var sanitize$2 = function sanitize(pattern) {
    return pattern.substr(1);
  };

  var match$2 = function match(pattern, text) {
    var sanitizedPattern = sanitize$2(pattern);
    var isMatch = text.startsWith(sanitizedPattern);
    return {
      isMatch: isMatch,
      score: 0
    };
  };

  var prefixExactMatch = {
    isForPattern: isForPattern$2,
    sanitize: sanitize$2,
    match: match$2
  };

  // Token: !^fire
  // Match type: inverse-prefix-exact-match
  // Description: Items that do not start with `fire`
  var isForPattern$3 = function isForPattern(pattern) {
    return pattern.charAt(0) == '!' && pattern.charAt(1) == '^';
  };

  var sanitize$3 = function sanitize(pattern) {
    return pattern.substr(2);
  };

  var match$3 = function match(pattern, text) {
    var sanitizedPattern = sanitize$3(pattern);
    var isMatch = !text.startsWith(sanitizedPattern);
    return {
      isMatch: isMatch,
      score: 0
    };
  };

  var inversePrefixExactMatch = {
    isForPattern: isForPattern$3,
    sanitize: sanitize$3,
    match: match$3
  };

  // Token: .file$
  // Match type: suffix-exact-match
  // Description: Items that end with `.file`
  var isForPattern$4 = function isForPattern(pattern) {
    return pattern.charAt(pattern.length - 1) == '$';
  };

  var sanitize$4 = function sanitize(pattern) {
    return pattern.substr(0, pattern.length - 1);
  };

  var match$4 = function match(pattern, text) {
    var sanitizedPattern = sanitize$4(pattern);
    var isMatch = text.endsWith(sanitizedPattern);
    return {
      isMatch: isMatch,
      score: 0
    };
  };

  var suffixExactMatch = {
    isForPattern: isForPattern$4,
    sanitize: sanitize$4,
    match: match$4
  };

  // Token: !.file$
  // Match type: inverse-suffix-exact-match
  // Description: Items that do not end with `.file`
  var isForPattern$5 = function isForPattern(pattern) {
    return pattern.charAt(0) == '!' && pattern.charAt(pattern.length - 1) == '$';
  };

  var sanitize$5 = function sanitize(pattern) {
    return pattern.substring(1, pattern.length - 1);
  };

  var match$5 = function match(pattern, text) {
    var sanitizedPattern = sanitize$5(pattern);
    var isMatch = !text.endsWith(sanitizedPattern);
    return {
      isMatch: isMatch,
      score: 0
    };
  };

  var inverseSuffixExactMatch = {
    isForPattern: isForPattern$5,
    sanitize: sanitize$5,
    match: match$5
  };

  var INFINITY = 1 / 0;

  var isArray = function isArray(value) {
    return !Array.isArray ? Object.prototype.toString.call(value) === '[object Array]' : Array.isArray(value);
  }; // Adapted from:
  // https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js


  var baseToString = function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  };

  var toString = function toString(value) {
    return value == null ? '' : baseToString(value);
  };

  var isString = function isString(value) {
    return typeof value === 'string';
  };

  var isNumber = function isNumber(value) {
    return typeof value === 'number';
  };

  var isObject = function isObject(value) {
    return _typeof(value) === 'object';
  };

  var isDefined = function isDefined(value) {
    return value !== undefined && value !== null;
  };

  var typeCheckers = {
    isDefined: isDefined,
    isArray: isArray,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    toString: toString
  };

  var isString$1 = typeCheckers.isString; // Return a 2D array representation of the query, for simpler parsing.
  // Example:
  // "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]

  var queryfy = function queryfy(pattern) {
    return pattern.split('|').map(function (item) {
      return item.trim().split(/ +/g);
    });
  };
  /**
   * Command-like searching
   * ======================
   *
   * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
   * search in a given text.
   *
   * Search syntax:
   *
   * | Token       | Match type                 | Description                            |
   * | ----------- | -------------------------- | -------------------------------------- |
   * | `jscript`   | fuzzy-match                | Items that match `jscript`             |
   * | `'python`   | exact-match                | Items that include `python`            |
   * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
   * | `^java`     | prefix-exact-match         | Items that start with `java`           |
   * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
   * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
   * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
   *
   * A single pipe character acts as an OR operator. For example, the following
   * query matches entries that start with `core` and end with either`go`, `rb`,
   * or`py`.
   *
   * ```
   * ^core go$ | rb$ | py$
   * ```
   */


  var ExtendedSearch = /*#__PURE__*/function () {
    function ExtendedSearch(pattern, options) {
      _classCallCheck(this, ExtendedSearch);

      var isCaseSensitive = options.isCaseSensitive;
      this.query = null;
      this.options = options; // A <pattern>:<BitapSearch> key-value pair for optimizing searching

      this._fuzzyCache = {};

      if (isString$1(pattern) && pattern.trim().length > 0) {
        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        this.query = queryfy(this.pattern);
      }
    }

    _createClass(ExtendedSearch, [{
      key: "searchIn",
      value: function searchIn(value) {
        var query = this.query;

        if (!this.query) {
          return {
            isMatch: false,
            score: 1
          };
        }

        var text = value.$;
        text = this.options.isCaseSensitive ? text : text.toLowerCase();
        var matchFound = false;

        for (var i = 0, qLen = query.length; i < qLen; i += 1) {
          var parts = query[i];
          var result = null;
          matchFound = true;

          for (var j = 0, pLen = parts.length; j < pLen; j += 1) {
            var token = parts[j];
            result = this._search(token, text);

            if (!result.isMatch) {
              // AND condition, short-circuit and move on to next part
              matchFound = false;
              break;
            }
          } // OR condition, so if TRUE, return


          if (matchFound) {
            return result;
          }
        } // Nothing was matched


        return {
          isMatch: false,
          score: 1
        };
      }
    }, {
      key: "_search",
      value: function _search(pattern, text) {
        if (exactMatch.isForPattern(pattern)) {
          return exactMatch.match(pattern, text);
        } else if (prefixExactMatch.isForPattern(pattern)) {
          return prefixExactMatch.match(pattern, text);
        } else if (inversePrefixExactMatch.isForPattern(pattern)) {
          return inversePrefixExactMatch.match(pattern, text);
        } else if (inverseSuffixExactMatch.isForPattern(pattern)) {
          return inverseSuffixExactMatch.match(pattern, text);
        } else if (suffixExactMatch.isForPattern(pattern)) {
          return suffixExactMatch.match(pattern, text);
        } else if (inverseExactMatch.isForPattern(pattern)) {
          return inverseExactMatch.match(pattern, text);
        } else {
          var searcher = this._fuzzyCache[pattern];

          if (!searcher) {
            searcher = new bitapSearch_1(pattern, this.options);
            this._fuzzyCache[pattern] = searcher;
          }

          return searcher.searchInString(text);
        }
      }
    }]);

    return ExtendedSearch;
  }();

  var extendedSearch = ExtendedSearch;

  var NGRAM_LEN = 3;

  var ngram = function ngram(text, _ref) {
    var _ref$n = _ref.n,
        n = _ref$n === void 0 ? NGRAM_LEN : _ref$n,
        _ref$pad = _ref.pad,
        pad = _ref$pad === void 0 ? true : _ref$pad,
        _ref$sort = _ref.sort,
        sort = _ref$sort === void 0 ? false : _ref$sort;
    var nGrams = [];

    if (text === null || text === undefined) {
      return nGrams;
    }

    text = text.toLowerCase();

    if (pad) {
      text = " ".concat(text, " ");
    }

    var index = text.length - n + 1;

    if (index < 1) {
      return nGrams;
    }

    while (index--) {
      nGrams[index] = text.substr(index, n);
    }

    if (sort) {
      nGrams.sort(function (a, b) {
        return a == b ? 0 : a < b ? -1 : 1;
      });
    }

    return nGrams;
  };

  // Assumes arrays are sorted
  var union = function union(arr1, arr2) {
    var result = [];
    var i = 0;
    var j = 0;

    while (i < arr1.length && j < arr2.length) {
      var item1 = arr1[i];
      var item2 = arr2[j];

      if (item1 < item2) {
        result.push(item1);
        i += 1;
      } else if (item2 < item1) {
        result.push(item2);
        j += 1;
      } else {
        result.push(item2);
        i += 1;
        j += 1;
      }
    }

    while (i < arr1.length) {
      result.push(arr1[i]);
      i += 1;
    }

    while (j < arr2.length) {
      result.push(arr2[j]);
      j += 1;
    }

    return result;
  };

  // Assumes arrays are sorted
  var intersection = function intersection(arr1, arr2) {
    var result = [];
    var i = 0;
    var j = 0;

    while (i < arr1.length && j < arr2.length) {
      var item1 = arr1[i];
      var item2 = arr2[j];

      if (item1 == item2) {
        result.push(item1);
        i += 1;
        j += 1;
      } else if (item1 < item2) {
        i += 1;
      } else if (item1 > item2) {
        j += 1;
      } else {
        i += 1;
        j += 1;
      }
    }

    return result;
  };

  var arrayUtils = {
    union: union,
    intersection: intersection
  };

  var union$1 = arrayUtils.union,
      intersection$1 = arrayUtils.intersection;

  var jaccardDistance = function jaccardDistance(nGram1, nGram2) {
    var nGramUnion = union$1(nGram1, nGram2);
    var nGramIntersection = intersection$1(nGram1, nGram2);
    return 1 - nGramIntersection.length / nGramUnion.length;
  };

  var distance = {
    jaccardDistance: jaccardDistance
  };

  var jaccardDistance$1 = distance.jaccardDistance;

  var NGramSearch = /*#__PURE__*/function () {
    function NGramSearch(pattern) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        threshold: 0.6
      };

      _classCallCheck(this, NGramSearch);

      // Create the ngram, and sort it
      this.options = options;
      this.patternNgram = ngram(pattern, {
        sort: true
      });
    }

    _createClass(NGramSearch, [{
      key: "searchIn",
      value: function searchIn(value) {
        var textNgram = value.ng;

        if (!textNgram) {
          textNgram = ngram(value.$, {
            sort: true
          });
          value.ng = textNgram;
        }

        var jacardResult = jaccardDistance$1(this.patternNgram, textNgram);
        var isMatch = jacardResult < this.options.threshold;
        return {
          score: isMatch ? jacardResult : 1,
          isMatch: isMatch
        };
      }
    }]);

    return NGramSearch;
  }();

  var ngramSearch = NGramSearch;

  var search = {
    BitapSearch: bitapSearch_1,
    ExtendedSearch: extendedSearch,
    NGramSearch: ngramSearch
  };

  var isDefined$1 = typeCheckers.isDefined,
      isString$2 = typeCheckers.isString,
      isNumber$1 = typeCheckers.isNumber,
      isArray$1 = typeCheckers.isArray,
      toString$1 = typeCheckers.toString;

  var get = function get(obj, path) {
    var list = [];
    var arr = false;

    var _get = function _get(obj, path) {
      if (!path) {
        // If there's no path left, we've gotten to the object we care about.
        list.push(obj);
      } else {
        var dotIndex = path.indexOf('.');
        var key = path;
        var remaining = null;

        if (dotIndex !== -1) {
          key = path.slice(0, dotIndex);
          remaining = path.slice(dotIndex + 1);
        }

        var value = obj[key];

        if (isDefined$1(value)) {
          if (!remaining && (isString$2(value) || isNumber$1(value))) {
            list.push(toString$1(value));
          } else if (isArray$1(value)) {
            arr = true; // Search each item in the array.

            for (var i = 0, len = value.length; i < len; i += 1) {
              _get(value[i], remaining);
            }
          } else if (remaining) {
            // An object. Recurse further.
            _get(value, remaining);
          }
        }
      }
    };

    _get(obj, path);

    if (arr) {
      return list;
    }

    return list[0];
  };

  var isArray$2 = typeCheckers.isArray,
      isDefined$2 = typeCheckers.isDefined,
      isString$3 = typeCheckers.isString;

  var createIndex = function createIndex(keys, list) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$getFn = _ref.getFn,
        getFn = _ref$getFn === void 0 ? get : _ref$getFn,
        _ref$ngrams = _ref.ngrams,
        ngrams = _ref$ngrams === void 0 ? false : _ref$ngrams;

    var indexedList = []; // List is Array<String>

    if (isString$3(list[0])) {
      // Iterate over every string in the list
      for (var i = 0, len = list.length; i < len; i += 1) {
        var value = list[i];

        if (isDefined$2(value)) {
          // if (!isCaseSensitive) {
          //   value = value.toLowerCase()
          // }
          var record = {
            $: value,
            idx: i
          };

          if (ngrams) {
            record.ng = ngram(value, {
              sort: true
            });
          }

          indexedList.push(record);
        }
      }
    } else {
      // List is Array<Object>
      var keysLen = keys.length;

      for (var _i = 0, _len = list.length; _i < _len; _i += 1) {
        var item = list[_i];
        var _record = {
          idx: _i,
          $: {}
        }; // Iterate over every key (i.e, path), and fetch the value at that key

        for (var j = 0; j < keysLen; j += 1) {
          var key = keys[j];

          var _value = getFn(item, key);

          if (!isDefined$2(_value)) {
            continue;
          }

          if (isArray$2(_value)) {
            var subRecords = [];
            var stack = [{
              arrayIndex: -1,
              value: _value
            }];

            while (stack.length) {
              var _stack$pop = stack.pop(),
                  arrayIndex = _stack$pop.arrayIndex,
                  _value2 = _stack$pop.value;

              if (!isDefined$2(_value2)) {
                continue;
              }

              if (isString$3(_value2)) {
                // if (!isCaseSensitive) {
                //   v = v.toLowerCase()
                // }
                var subRecord = {
                  $: _value2,
                  idx: arrayIndex
                };

                if (ngrams) {
                  subRecord.ng = ngram(_value2, {
                    sort: true
                  });
                }

                subRecords.push(subRecord);
              } else if (isArray$2(_value2)) {
                for (var k = 0, arrLen = _value2.length; k < arrLen; k += 1) {
                  stack.push({
                    arrayIndex: k,
                    value: _value2[k]
                  });
                }
              }
            }

            _record.$[key] = subRecords;
          } else {
            // if (!isCaseSensitive) {
            //   value = value.toLowerCase()
            // }
            var _subRecord = {
              $: _value
            };

            if (ngrams) {
              _subRecord.ng = ngram(_value, {
                sort: true
              });
            }

            _record.$[key] = _subRecord;
          }
        }

        indexedList.push(_record);
      }
    }

    return indexedList;
  };

  var isString$4 = typeCheckers.isString;

  var KeyStore = /*#__PURE__*/function () {
    function KeyStore(keys) {
      _classCallCheck(this, KeyStore);

      this._keys = {};
      this._keyNames = [];
      this._length = keys.length; // Iterate over every key

      if (keys.length && isString$4(keys[0])) {
        for (var i = 0; i < this._length; i += 1) {
          var key = keys[i];
          this._keys[key] = {
            weight: 1
          };

          this._keyNames.push(key);
        }
      } else {
        var totalWeight = 0;

        for (var _i = 0; _i < this._length; _i += 1) {
          var _key = keys[_i];

          if (!_key.hasOwnProperty('name')) {
            throw new Error('Missing "name" property in key object');
          }

          var keyName = _key.name;

          this._keyNames.push(keyName);

          if (!_key.hasOwnProperty('weight')) {
            throw new Error('Missing "weight" property in key object');
          }

          var weight = _key.weight;

          if (weight <= 0 || weight >= 1) {
            throw new Error('"weight" property in key must bein the range of (0, 1)');
          }

          this._keys[keyName] = {
            weight: weight
          };
          totalWeight += weight;
        } // Normalize weights so that their sum is equal to 1


        for (var _i2 = 0; _i2 < this._length; _i2 += 1) {
          var _keyName = this._keyNames[_i2];
          var keyWeight = this._keys[_keyName].weight;
          this._keys[_keyName].weight = keyWeight / totalWeight;
        }
      }
    }

    _createClass(KeyStore, [{
      key: "get",
      value: function get(key, name) {
        return this._keys[key] ? this._keys[key][name] : -1;
      }
    }, {
      key: "keys",
      value: function keys() {
        return this._keyNames;
      }
    }, {
      key: "count",
      value: function count() {
        return this._length;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return JSON.stringify(this._keys);
      }
    }]);

    return KeyStore;
  }();

  var keyStore = KeyStore;

  var tools = {
    createIndex: createIndex,
    KeyStore: keyStore
  };

  var isDefined$3 = typeCheckers.isDefined;

  var transformMatches = function transformMatches(result, data) {
    var matches = result.matches;
    data.matches = [];

    if (!isDefined$3(matches)) {
      return;
    }

    for (var i = 0, len = matches.length; i < len; i += 1) {
      var match = matches[i];

      if (!isDefined$3(match.indices) || match.indices.length === 0) {
        continue;
      }

      var obj = {
        indices: match.indices,
        value: match.value
      };

      if (match.key) {
        obj.key = match.key;
      }

      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }

      data.matches.push(obj);
    }
  };

  var transformScore = function transformScore(result, data) {
    data.score = result.score;
  };

  var transform = {
    transformMatches: transformMatches,
    transformScore: transformScore
  };

  var BitapSearch$1 = search.BitapSearch,
      ExtendedSearch$1 = search.ExtendedSearch,
      NGramSearch$1 = search.NGramSearch;
  var isArray$3 = typeCheckers.isArray,
      isDefined$4 = typeCheckers.isDefined,
      isString$5 = typeCheckers.isString,
      isNumber$2 = typeCheckers.isNumber;
  var createIndex$1 = tools.createIndex,
      KeyStore$1 = tools.KeyStore;
  var transformMatches$1 = transform.transformMatches,
      transformScore$1 = transform.transformScore;
  var MAX_BITS$2 = constants.MAX_BITS; // // Will print to the console. Useful for debugging.
  // function debug() {
  //   if (Fuse.verbose) {
  //     console.log(...arguments)
  //     // const util = require('util')
  //     // console.log(util.inspect(...arguments, false, null, true /* enable colors */))
  //   }
  // }
  // function debugTime(value) {
  //   if (Fuse.verboseTime) {
  //     console.time(value)
  //   }
  // }
  // function debugTimeEnd(value) {
  //   if (Fuse.verboseTime) {
  //     console.timeEnd(value)
  //   }
  // }

  var FuseOptions = {
    // When true, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    isCaseSensitive: false,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100,
    // Minimum number of characters that must be matched before a result is considered a match
    findAllMatches: false,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: get,
    includeMatches: false,
    includeScore: false,
    // List of properties that will be searched. This also supports nested properties.
    keys: [],
    // Approximately where in the text is the pattern expected to be found?
    location: 0,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1,
    // Whether to sort the result list, by score
    shouldSort: true,
    // Default sort function
    sortFn: function sortFn(a, b) {
      return a.score - b.score;
    },
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,
    // Enabled extended-searching
    useExtendedSearch: false
  };

  var Fuse = /*#__PURE__*/function () {
    function Fuse(list) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FuseOptions;
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      _classCallCheck(this, Fuse);

      this.options = _objectSpread2({}, FuseOptions, {}, options); // `caseSensitive` is deprecated, use `isCaseSensitive` instead

      this.options.isCaseSensitive = options.caseSensitive;
      delete this.options.caseSensitive; // debugTime('Constructing')

      this._processKeys(this.options.keys);

      this.setCollection(list, index); // debugTimeEnd('Constructing')
    }

    _createClass(Fuse, [{
      key: "setCollection",
      value: function setCollection(list) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        this.list = list;
        this.listIsStringArray = isString$5(list[0]);

        if (index) {
          this.setIndex(index);
        } else {
          // debugTime('Process index')
          this.setIndex(this._createIndex()); // debugTimeEnd('Process index')
        }
      }
    }, {
      key: "setIndex",
      value: function setIndex(listIndex) {
        this._indexedList = listIndex; // debug(listIndex)
      }
    }, {
      key: "_processKeys",
      value: function _processKeys(keys) {
        this._keyStore = new KeyStore$1(keys); // debug('Process Keys')
      }
    }, {
      key: "_createIndex",
      value: function _createIndex() {
        return createIndex$1(this._keyStore.keys(), this.list, {
          getFn: this.options.getFn
        });
      }
    }, {
      key: "search",
      value: function search(pattern) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          limit: false
        };
        // debug(`--------- Search pattern: "${pattern}"`)
        var _this$options = this.options,
            useExtendedSearch = _this$options.useExtendedSearch,
            shouldSort = _this$options.shouldSort;
        var searcher = null;

        if (useExtendedSearch) {
          searcher = new ExtendedSearch$1(pattern, this.options);
        } else if (pattern.length > MAX_BITS$2) {
          searcher = new NGramSearch$1(pattern, this.options);
        } else {
          searcher = new BitapSearch$1(pattern, this.options);
        } // debugTime('Search time');


        var results = this._searchUsing(searcher); // debugTimeEnd('Search time');
        // debugTime('Compute score time');


        this._computeScore(results); // debugTimeEnd('Compute score time');


        if (shouldSort) {
          this._sort(results);
        }

        if (opts.limit && isNumber$2(opts.limit)) {
          results = results.slice(0, opts.limit);
        }

        return this._format(results);
      }
    }, {
      key: "_searchUsing",
      value: function _searchUsing(searcher) {
        var list = this._indexedList;
        var results = [];
        var includeMatches = this.options.includeMatches; // List is Array<String>

        if (this.listIsStringArray) {
          // Iterate over every string in the list
          for (var i = 0, len = list.length; i < len; i += 1) {
            var value = list[i];
            var text = value.$,
                idx = value.idx;

            if (!isDefined$4(text)) {
              continue;
            }

            var searchResult = searcher.searchIn(value);
            var isMatch = searchResult.isMatch,
                score = searchResult.score;

            if (!isMatch) {
              continue;
            }

            var match = {
              score: score,
              value: text
            };

            if (includeMatches) {
              match.indices = searchResult.matchedIndices;
            }

            results.push({
              item: text,
              idx: idx,
              matches: [match]
            });
          }
        } else {
          // List is Array<Object>
          var keyNames = this._keyStore.keys();

          var keysLen = this._keyStore.count();

          for (var _i = 0, _len = list.length; _i < _len; _i += 1) {
            var _list$_i = list[_i],
                item = _list$_i.$,
                _idx = _list$_i.idx;

            if (!isDefined$4(item)) {
              continue;
            }

            var matches = []; // Iterate over every key (i.e, path), and fetch the value at that key

            for (var j = 0; j < keysLen; j += 1) {
              var key = keyNames[j];
              var _value = item[key]; // debug(` Key: ${key === '' ? '--' : key}`)

              if (!isDefined$4(_value)) {
                continue;
              }

              if (isArray$3(_value)) {
                for (var k = 0, _len2 = _value.length; k < _len2; k += 1) {
                  var arrItem = _value[k];
                  var _text = arrItem.$;
                  var _idx2 = arrItem.idx;

                  if (!isDefined$4(_text)) {
                    continue;
                  }

                  var _searchResult = searcher.searchIn(arrItem);

                  var _isMatch = _searchResult.isMatch,
                      _score = _searchResult.score; // debug(`Full text: "${text}", score: ${score}`)

                  if (!_isMatch) {
                    continue;
                  }

                  var _match = {
                    score: _score,
                    key: key,
                    value: _text,
                    idx: _idx2
                  };

                  if (includeMatches) {
                    _match.indices = _searchResult.matchedIndices;
                  }

                  matches.push(_match);
                }
              } else {
                var _text2 = _value.$;

                var _searchResult2 = searcher.searchIn(_value);

                var _isMatch2 = _searchResult2.isMatch,
                    _score2 = _searchResult2.score; // debug(`Full text: "${text}", score: ${score}`)

                if (!_isMatch2) {
                  continue;
                }

                var _match2 = {
                  score: _score2,
                  key: key,
                  value: _text2
                };

                if (includeMatches) {
                  _match2.indices = _searchResult2.matchedIndices;
                }

                matches.push(_match2);
              }
            }

            if (matches.length) {
              results.push({
                idx: _idx,
                item: item,
                matches: matches
              });
            }
          }
        } // debug("--------- RESULTS -----------")
        // debug(results)
        // debug("-----------------------------")


        return results;
      }
    }, {
      key: "_computeScore",
      value: function _computeScore(results) {
        // debug('Computing score: ')
        for (var i = 0, len = results.length; i < len; i += 1) {
          var result = results[i];
          var matches = result.matches;
          var scoreLen = matches.length;
          var totalWeightedScore = 1; // let bestScore = -1

          for (var j = 0; j < scoreLen; j += 1) {
            var item = matches[j];
            var key = item.key;

            var keyWeight = this._keyStore.get(key, 'weight');

            var weight = keyWeight > -1 ? keyWeight : 1;
            var score = item.score === 0 && keyWeight > -1 ? Number.EPSILON : item.score;
            totalWeightedScore *= Math.pow(score, weight); // Keep track of the best score.. just in case
            // Actually, we're not really using it.. but need to think of a way to incorporate this
            // bestScore = bestScore == -1 ? item.score : Math.min(bestScore, item.score)
          }

          result.score = totalWeightedScore; // result.$score = bestScore
          // debug(result)
        }
      }
    }, {
      key: "_sort",
      value: function _sort(results) {
        // debug('Sorting....')
        results.sort(this.options.sortFn);
      }
    }, {
      key: "_format",
      value: function _format(results) {
        var finalOutput = [];
        var _this$options2 = this.options,
            includeMatches = _this$options2.includeMatches,
            includeScore = _this$options2.includeScore; // if (Fuse.verbose) {
        //   let cache = []
        //   debug('Output:', JSON.stringify(results, (key, value) => {
        //     if (isObject(value) && isDefined(value)) {
        //       if (cache.indexOf(value) !== -1) {
        //         // Circular reference found, discard key
        //         return
        //       }
        //       // Store value in our collection
        //       cache.push(value)
        //     }
        //     return value
        //   }, 2))
        //   cache = null
        // }

        var transformers = [];
        if (includeMatches) transformers.push(transformMatches$1);
        if (includeScore) transformers.push(transformScore$1); // debug("===== RESULTS ======")
        // debug(results)
        // debug("====================")

        for (var i = 0, len = results.length; i < len; i += 1) {
          var result = results[i]; // debug('result', result)

          var idx = result.idx;
          var data = {
            item: this.list[idx],
            refIndex: idx
          };

          if (transformers.length) {
            for (var j = 0, _len3 = transformers.length; j < _len3; j += 1) {
              transformers[j](result, data);
            }
          }

          finalOutput.push(data);
        }

        return finalOutput;
      }
    }]);

    return Fuse;
  }();

  Fuse.createIndex = createIndex$1;
  var src = Fuse;

  return src;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVzZS5lczYubWluLmpzIiwic291cmNlcyI6WyIuLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1zY29yZS5qcyIsIi4uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2JpdGFwLW1hdGNoZWQtaW5kaWNlcy5qcyIsIi4uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2JpdGFwLXNlYXJjaC5qcyIsIi4uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2JpdGFwLXBhdHRlcm4tYWxwaGFiZXQuanMiLCIuLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMuanMiLCIuLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9pbmRleC5qcyIsIi4uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2V4YWN0LW1hdGNoLmpzIiwiLi4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW52ZXJzZS1leGFjdC1tYXRjaC5qcyIsIi4uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL3ByZWZpeC1leGFjdC1tYXRjaC5qcyIsIi4uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwiLi4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvc3VmZml4LWV4YWN0LW1hdGNoLmpzIiwiLi4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2guanMiLCIuLi9zcmMvaGVscGVycy90eXBlLWNoZWNrZXJzLmpzIiwiLi4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW5kZXguanMiLCIuLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9uZ3JhbS5qcyIsIi4uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL3VuaW9uLmpzIiwiLi4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvYXJyYXktdXRpbHMvaW50ZXJzZWN0aW9uLmpzIiwiLi4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvYXJyYXktdXRpbHMvaW5kZXguanMiLCIuLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9kaXN0YW5jZS9qYWNjYXJkLWRpc3RhbmNlLmpzIiwiLi4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvZGlzdGFuY2UvaW5kZXguanMiLCIuLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9pbmRleC5qcyIsIi4uL3NyYy9zZWFyY2gvaW5kZXguanMiLCIuLi9zcmMvaGVscGVycy9nZXQuanMiLCIuLi9zcmMvdG9vbHMvY3JlYXRlLWluZGV4LmpzIiwiLi4vc3JjL3Rvb2xzL2tleS1zdG9yZS5qcyIsIi4uL3NyYy90b29scy9pbmRleC5qcyIsIi4uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLW1hdGNoZXMuanMiLCIuLi9zcmMvdHJhbnNmb3JtL3RyYW5zZm9ybS1zY29yZS5qcyIsIi4uL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAocGF0dGVybiwgeyBlcnJvcnMgPSAwLCBjdXJyZW50TG9jYXRpb24gPSAwLCBleHBlY3RlZExvY2F0aW9uID0gMCwgZGlzdGFuY2UgPSAxMDAgfSkgPT4ge1xuICBjb25zdCBhY2N1cmFjeSA9IGVycm9ycyAvIHBhdHRlcm4ubGVuZ3RoXG4gIGNvbnN0IHByb3hpbWl0eSA9IE1hdGguYWJzKGV4cGVjdGVkTG9jYXRpb24gLSBjdXJyZW50TG9jYXRpb24pXG5cbiAgaWYgKCFkaXN0YW5jZSkge1xuICAgIC8vIERvZGdlIGRpdmlkZSBieSB6ZXJvIGVycm9yLlxuICAgIHJldHVybiBwcm94aW1pdHkgPyAxLjAgOiBhY2N1cmFjeVxuICB9XG5cbiAgcmV0dXJuIGFjY3VyYWN5ICsgKHByb3hpbWl0eSAvIGRpc3RhbmNlKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAobWF0Y2htYXNrID0gW10sIG1pbk1hdGNoQ2hhckxlbmd0aCA9IDEpID0+IHtcbiAgbGV0IG1hdGNoZWRJbmRpY2VzID0gW11cbiAgbGV0IHN0YXJ0ID0gLTFcbiAgbGV0IGVuZCA9IC0xXG4gIGxldCBpID0gMFxuXG4gIGZvciAobGV0IGxlbiA9IG1hdGNobWFzay5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIGxldCBtYXRjaCA9IG1hdGNobWFza1tpXVxuICAgIGlmIChtYXRjaCAmJiBzdGFydCA9PT0gLTEpIHtcbiAgICAgIHN0YXJ0ID0gaVxuICAgIH0gZWxzZSBpZiAoIW1hdGNoICYmIHN0YXJ0ICE9PSAtMSkge1xuICAgICAgZW5kID0gaSAtIDFcbiAgICAgIGlmICgoZW5kIC0gc3RhcnQpICsgMSA+PSBtaW5NYXRjaENoYXJMZW5ndGgpIHtcbiAgICAgICAgbWF0Y2hlZEluZGljZXMucHVzaChbc3RhcnQsIGVuZF0pXG4gICAgICB9XG4gICAgICBzdGFydCA9IC0xXG4gICAgfVxuICB9XG5cbiAgLy8gKGktMSAtIHN0YXJ0KSArIDEgPT4gaSAtIHN0YXJ0XG4gIGlmIChtYXRjaG1hc2tbaSAtIDFdICYmIChpIC0gc3RhcnQpID49IG1pbk1hdGNoQ2hhckxlbmd0aCkge1xuICAgIG1hdGNoZWRJbmRpY2VzLnB1c2goW3N0YXJ0LCBpIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZWRJbmRpY2VzXG59XG4iLCJjb25zdCBiaXRhcFNjb3JlID0gcmVxdWlyZSgnLi9iaXRhcC1zY29yZScpXG5jb25zdCBtYXRjaGVkSW5kaWNlcyA9IHJlcXVpcmUoJy4vYml0YXAtbWF0Y2hlZC1pbmRpY2VzJylcblxubW9kdWxlLmV4cG9ydHMgPSAodGV4dCwgcGF0dGVybiwgcGF0dGVybkFscGhhYmV0LCB7IGxvY2F0aW9uID0gMCwgZGlzdGFuY2UgPSAxMDAsIHRocmVzaG9sZCA9IDAuNiwgZmluZEFsbE1hdGNoZXMgPSBmYWxzZSwgbWluTWF0Y2hDaGFyTGVuZ3RoID0gMSwgaW5jbHVkZU1hdGNoZXMgPSBmYWxzZSB9KSA9PiB7XG4gIGNvbnN0IHBhdHRlcm5MZW4gPSBwYXR0ZXJuLmxlbmd0aFxuICAvLyBTZXQgc3RhcnRpbmcgbG9jYXRpb24gYXQgYmVnaW5uaW5nIHRleHQgYW5kIGluaXRpYWxpemUgdGhlIGFscGhhYmV0LlxuICBjb25zdCB0ZXh0TGVuID0gdGV4dC5sZW5ndGhcbiAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZW4gbG9jYXRpb24gPiB0ZXh0Lmxlbmd0aFxuICBjb25zdCBleHBlY3RlZExvY2F0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obG9jYXRpb24sIHRleHRMZW4pKVxuICAvLyBIaWdoZXN0IHNjb3JlIGJleW9uZCB3aGljaCB3ZSBnaXZlIHVwLlxuICBsZXQgY3VycmVudFRocmVzaG9sZCA9IHRocmVzaG9sZFxuICAvLyBJcyB0aGVyZSBhIG5lYXJieSBleGFjdCBtYXRjaD8gKHNwZWVkdXApXG4gIGxldCBiZXN0TG9jYXRpb24gPSB0ZXh0LmluZGV4T2YocGF0dGVybiwgZXhwZWN0ZWRMb2NhdGlvbilcblxuICAvLyBhIG1hc2sgb2YgdGhlIG1hdGNoZXNcbiAgY29uc3QgbWF0Y2hNYXNrID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0TGVuOyBpICs9IDEpIHtcbiAgICBtYXRjaE1hc2tbaV0gPSAwXG4gIH1cblxuICBpZiAoYmVzdExvY2F0aW9uICE9PSAtMSkge1xuICAgIGxldCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgZXJyb3JzOiAwLFxuICAgICAgY3VycmVudExvY2F0aW9uOiBiZXN0TG9jYXRpb24sXG4gICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZGlzdGFuY2VcbiAgICB9KVxuICAgIGN1cnJlbnRUaHJlc2hvbGQgPSBNYXRoLm1pbihzY29yZSwgY3VycmVudFRocmVzaG9sZClcblxuICAgIC8vIFdoYXQgYWJvdXQgaW4gdGhlIG90aGVyIGRpcmVjdGlvbj8gKHNwZWVkIHVwKVxuICAgIGJlc3RMb2NhdGlvbiA9IHRleHQubGFzdEluZGV4T2YocGF0dGVybiwgZXhwZWN0ZWRMb2NhdGlvbiArIHBhdHRlcm5MZW4pXG5cbiAgICBpZiAoYmVzdExvY2F0aW9uICE9PSAtMSkge1xuICAgICAgbGV0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICAgIGVycm9yczogMCxcbiAgICAgICAgY3VycmVudExvY2F0aW9uOiBiZXN0TG9jYXRpb24sXG4gICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgIGRpc3RhbmNlXG4gICAgICB9KVxuICAgICAgY3VycmVudFRocmVzaG9sZCA9IE1hdGgubWluKHNjb3JlLCBjdXJyZW50VGhyZXNob2xkKVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlc2V0IHRoZSBiZXN0IGxvY2F0aW9uXG4gIGJlc3RMb2NhdGlvbiA9IC0xXG5cbiAgbGV0IGxhc3RCaXRBcnIgPSBbXVxuICBsZXQgZmluYWxTY29yZSA9IDFcbiAgbGV0IGJpbk1heCA9IHBhdHRlcm5MZW4gKyB0ZXh0TGVuXG5cbiAgY29uc3QgbWFzayA9IDEgPDwgKHBhdHRlcm5MZW4gPD0gMzEgPyBwYXR0ZXJuTGVuIC0gMSA6IDMwKVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVybkxlbjsgaSArPSAxKSB7XG4gICAgLy8gU2NhbiBmb3IgdGhlIGJlc3QgbWF0Y2g7IGVhY2ggaXRlcmF0aW9uIGFsbG93cyBmb3Igb25lIG1vcmUgZXJyb3IuXG4gICAgLy8gUnVuIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgaG93IGZhciBmcm9tIHRoZSBtYXRjaCBsb2NhdGlvbiB3ZSBjYW4gc3RyYXlcbiAgICAvLyBhdCB0aGlzIGVycm9yIGxldmVsLlxuICAgIGxldCBiaW5NaW4gPSAwXG4gICAgbGV0IGJpbk1pZCA9IGJpbk1heFxuXG4gICAgd2hpbGUgKGJpbk1pbiA8IGJpbk1pZCkge1xuICAgICAgY29uc3Qgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgICAgZXJyb3JzOiBpLFxuICAgICAgICBjdXJyZW50TG9jYXRpb246IGV4cGVjdGVkTG9jYXRpb24gKyBiaW5NaWQsXG4gICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgIGRpc3RhbmNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoc2NvcmUgPD0gY3VycmVudFRocmVzaG9sZCkge1xuICAgICAgICBiaW5NaW4gPSBiaW5NaWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbk1heCA9IGJpbk1pZFxuICAgICAgfVxuXG4gICAgICBiaW5NaWQgPSBNYXRoLmZsb29yKChiaW5NYXggLSBiaW5NaW4pIC8gMiArIGJpbk1pbilcbiAgICB9XG5cbiAgICAvLyBVc2UgdGhlIHJlc3VsdCBmcm9tIHRoaXMgaXRlcmF0aW9uIGFzIHRoZSBtYXhpbXVtIGZvciB0aGUgbmV4dC5cbiAgICBiaW5NYXggPSBiaW5NaWRcblxuICAgIGxldCBzdGFydCA9IE1hdGgubWF4KDEsIGV4cGVjdGVkTG9jYXRpb24gLSBiaW5NaWQgKyAxKVxuICAgIGxldCBmaW5pc2ggPSBmaW5kQWxsTWF0Y2hlcyA/IHRleHRMZW4gOiBNYXRoLm1pbihleHBlY3RlZExvY2F0aW9uICsgYmluTWlkLCB0ZXh0TGVuKSArIHBhdHRlcm5MZW5cblxuICAgIC8vIEluaXRpYWxpemUgdGhlIGJpdCBhcnJheVxuICAgIGxldCBiaXRBcnIgPSBBcnJheShmaW5pc2ggKyAyKVxuXG4gICAgYml0QXJyW2ZpbmlzaCArIDFdID0gKDEgPDwgaSkgLSAxXG5cbiAgICBmb3IgKGxldCBqID0gZmluaXNoOyBqID49IHN0YXJ0OyBqIC09IDEpIHtcbiAgICAgIGxldCBjdXJyZW50TG9jYXRpb24gPSBqIC0gMVxuICAgICAgbGV0IGNoYXJNYXRjaCA9IHBhdHRlcm5BbHBoYWJldFt0ZXh0LmNoYXJBdChjdXJyZW50TG9jYXRpb24pXVxuXG4gICAgICBpZiAoY2hhck1hdGNoKSB7XG4gICAgICAgIG1hdGNoTWFza1tjdXJyZW50TG9jYXRpb25dID0gMVxuICAgICAgfVxuXG4gICAgICAvLyBGaXJzdCBwYXNzOiBleGFjdCBtYXRjaFxuICAgICAgYml0QXJyW2pdID0gKChiaXRBcnJbaiArIDFdIDw8IDEpIHwgMSkgJiBjaGFyTWF0Y2hcblxuICAgICAgLy8gU3Vic2VxdWVudCBwYXNzZXM6IGZ1enp5IG1hdGNoXG4gICAgICBpZiAoaSAhPT0gMCkge1xuICAgICAgICBiaXRBcnJbal0gfD0gKCgobGFzdEJpdEFycltqICsgMV0gfCBsYXN0Qml0QXJyW2pdKSA8PCAxKSB8IDEpIHwgbGFzdEJpdEFycltqICsgMV1cbiAgICAgIH1cblxuICAgICAgaWYgKGJpdEFycltqXSAmIG1hc2spIHtcbiAgICAgICAgZmluYWxTY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgICAgIGVycm9yczogaSxcbiAgICAgICAgICBjdXJyZW50TG9jYXRpb24sXG4gICAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgICBkaXN0YW5jZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRoaXMgbWF0Y2ggd2lsbCBhbG1vc3QgY2VydGFpbmx5IGJlIGJldHRlciB0aGFuIGFueSBleGlzdGluZyBtYXRjaC5cbiAgICAgICAgLy8gQnV0IGNoZWNrIGFueXdheS5cbiAgICAgICAgaWYgKGZpbmFsU2NvcmUgPD0gY3VycmVudFRocmVzaG9sZCkge1xuICAgICAgICAgIC8vIEluZGVlZCBpdCBpc1xuICAgICAgICAgIGN1cnJlbnRUaHJlc2hvbGQgPSBmaW5hbFNjb3JlXG4gICAgICAgICAgYmVzdExvY2F0aW9uID0gY3VycmVudExvY2F0aW9uXG5cbiAgICAgICAgICAvLyBBbHJlYWR5IHBhc3NlZCBgbG9jYCwgZG93bmhpbGwgZnJvbSBoZXJlIG9uIGluLlxuICAgICAgICAgIGlmIChiZXN0TG9jYXRpb24gPD0gZXhwZWN0ZWRMb2NhdGlvbikge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBXaGVuIHBhc3NpbmcgYGJlc3RMb2NhdGlvbmAsIGRvbid0IGV4Y2VlZCBvdXIgY3VycmVudCBkaXN0YW5jZSBmcm9tIGBleHBlY3RlZExvY2F0aW9uYC5cbiAgICAgICAgICBzdGFydCA9IE1hdGgubWF4KDEsIDIgKiBleHBlY3RlZExvY2F0aW9uIC0gYmVzdExvY2F0aW9uKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm8gaG9wZSBmb3IgYSAoYmV0dGVyKSBtYXRjaCBhdCBncmVhdGVyIGVycm9yIGxldmVscy5cbiAgICBjb25zdCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgZXJyb3JzOiBpICsgMSxcbiAgICAgIGN1cnJlbnRMb2NhdGlvbjogZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBkaXN0YW5jZVxuICAgIH0pXG5cbiAgICBpZiAoc2NvcmUgPiBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGxhc3RCaXRBcnIgPSBiaXRBcnJcbiAgfVxuXG4gIGxldCByZXN1bHQgPSB7XG4gICAgaXNNYXRjaDogYmVzdExvY2F0aW9uID49IDAsXG4gICAgLy8gQ291bnQgZXhhY3QgbWF0Y2hlcyAodGhvc2Ugd2l0aCBhIHNjb3JlIG9mIDApIHRvIGJlIFwiYWxtb3N0XCIgZXhhY3RcbiAgICBzY29yZTogIWZpbmFsU2NvcmUgPyAwLjAwMSA6IGZpbmFsU2NvcmUsXG4gIH1cblxuICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICByZXN1bHQubWF0Y2hlZEluZGljZXMgPSBtYXRjaGVkSW5kaWNlcyhtYXRjaE1hc2ssIG1pbk1hdGNoQ2hhckxlbmd0aClcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcGF0dGVybiA9PiB7XG4gIGxldCBtYXNrID0ge31cbiAgbGV0IGxlbiA9IHBhdHRlcm4ubGVuZ3RoXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIG1hc2tbcGF0dGVybi5jaGFyQXQoaSldID0gMFxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIG1hc2tbcGF0dGVybi5jaGFyQXQoaSldIHw9IDEgPDwgKGxlbiAtIGkgLSAxKVxuICB9XG5cbiAgcmV0dXJuIG1hc2tcbn0iLCIvLyBNYWNoaW5lIHdvcmQgc2l6ZVxubW9kdWxlLmV4cG9ydHMuTUFYX0JJVFMgPSAzMiIsImNvbnN0IGJpdGFwU2VhcmNoID0gcmVxdWlyZSgnLi9iaXRhcC1zZWFyY2gnKVxuY29uc3QgcGF0dGVybkFscGhhYmV0ID0gcmVxdWlyZSgnLi9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0JylcbmNvbnN0IHsgTUFYX0JJVFMgfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJylcblxuY2xhc3MgQml0YXBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuLCB7XG4gICAgLy8gQXBwcm94aW1hdGVseSB3aGVyZSBpbiB0aGUgdGV4dCBpcyB0aGUgcGF0dGVybiBleHBlY3RlZCB0byBiZSBmb3VuZD9cbiAgICBsb2NhdGlvbiA9IDAsXG4gICAgLy8gRGV0ZXJtaW5lcyBob3cgY2xvc2UgdGhlIG1hdGNoIG11c3QgYmUgdG8gdGhlIGZ1enp5IGxvY2F0aW9uIChzcGVjaWZpZWQgYWJvdmUpLlxuICAgIC8vIEFuIGV4YWN0IGxldHRlciBtYXRjaCB3aGljaCBpcyAnZGlzdGFuY2UnIGNoYXJhY3RlcnMgYXdheSBmcm9tIHRoZSBmdXp6eSBsb2NhdGlvblxuICAgIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAgIC8vIHRoZSBleGFjdCBsb2NhdGlvbiBzcGVjaWZpZWQsIGEgdGhyZXNob2xkIG9mICcxMDAwJyB3b3VsZCByZXF1aXJlIGEgcGVyZmVjdCBtYXRjaFxuICAgIC8vIHRvIGJlIHdpdGhpbiA4MDAgY2hhcmFjdGVycyBvZiB0aGUgZnV6enkgbG9jYXRpb24gdG8gYmUgZm91bmQgdXNpbmcgYSAwLjggdGhyZXNob2xkLlxuICAgIGRpc3RhbmNlID0gMTAwLFxuICAgIC8vIEF0IHdoYXQgcG9pbnQgZG9lcyB0aGUgbWF0Y2ggYWxnb3JpdGhtIGdpdmUgdXAuIEEgdGhyZXNob2xkIG9mICcwLjAnIHJlcXVpcmVzIGEgcGVyZmVjdCBtYXRjaFxuICAgIC8vIChvZiBib3RoIGxldHRlcnMgYW5kIGxvY2F0aW9uKSwgYSB0aHJlc2hvbGQgb2YgJzEuMCcgd291bGQgbWF0Y2ggYW55dGhpbmcuXG4gICAgdGhyZXNob2xkID0gMC42LFxuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIGNvbXBhcmlzb25zIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZS5cbiAgICBpc0Nhc2VTZW5zaXRpdmUgPSBmYWxzZSxcbiAgICAvLyBXaGVuIHRydWUsIHRoZSBhbGdvcml0aG0gY29udGludWVzIHNlYXJjaGluZyB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCBldmVuIGlmIGEgcGVyZmVjdFxuICAgIC8vIG1hdGNoIGlzIGZvdW5kIGJlZm9yZSB0aGUgZW5kIG9mIHRoZSBzYW1lIGlucHV0LlxuICAgIGZpbmRBbGxNYXRjaGVzID0gZmFsc2UsXG4gICAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gICAgbWluTWF0Y2hDaGFyTGVuZ3RoID0gMSxcblxuICAgIGluY2x1ZGVNYXRjaGVzID0gZmFsc2VcbiAgfSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgZGlzdGFuY2UsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIGluY2x1ZGVNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoXG4gICAgfVxuXG4gICAgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGF0dGVybiBsZW5ndGggZXhjZWVkcyBtYXggb2YgJHtNQVhfQklUU30uYCk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXR0ZXJuID0gaXNDYXNlU2Vuc2l0aXZlID8gcGF0dGVybiA6IHBhdHRlcm4udG9Mb3dlckNhc2UoKVxuICAgIHRoaXMucGF0dGVybkFscGhhYmV0ID0gcGF0dGVybkFscGhhYmV0KHRoaXMucGF0dGVybilcbiAgfVxuXG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgbGV0IHRleHQgPSB2YWx1ZS4kXG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoSW5TdHJpbmcodGV4dClcbiAgfVxuXG4gIHNlYXJjaEluU3RyaW5nKHRleHQpIHtcbiAgICBjb25zdCB7IGlzQ2FzZVNlbnNpdGl2ZSwgaW5jbHVkZU1hdGNoZXMgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnRvTG93ZXJDYXNlKClcbiAgICB9XG5cbiAgICAvLyBFeGFjdCBtYXRjaFxuICAgIGlmICh0aGlzLnBhdHRlcm4gPT09IHRleHQpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgIGlzTWF0Y2g6IHRydWUsXG4gICAgICAgIHNjb3JlOiAwXG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgICAgICByZXN1bHQubWF0Y2hlZEluZGljZXMgPSBbWzAsIHRleHQubGVuZ3RoIC0gMV1dXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHVzZSBCaXRhcCBhbGdvcml0aG1cbiAgICBjb25zdCB7IGxvY2F0aW9uLCBkaXN0YW5jZSwgdGhyZXNob2xkLCBmaW5kQWxsTWF0Y2hlcywgbWluTWF0Y2hDaGFyTGVuZ3RoIH0gPSB0aGlzLm9wdGlvbnNcbiAgICByZXR1cm4gYml0YXBTZWFyY2godGV4dCwgdGhpcy5wYXR0ZXJuLCB0aGlzLnBhdHRlcm5BbHBoYWJldCwge1xuICAgICAgbG9jYXRpb24sXG4gICAgICBkaXN0YW5jZSxcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGZpbmRBbGxNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoLFxuICAgICAgaW5jbHVkZU1hdGNoZXNcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQml0YXBTZWFyY2hcbiIsIi8vIFRva2VuOiAnZmlsZVxuLy8gTWF0Y2ggdHlwZTogZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGluY2x1ZGUgYGZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gXCInXCJcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGluZGV4ID0gdGV4dC5pbmRleE9mKHNhbml0aXplZFBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSBpbmRleCA+IC0xXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwLFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAhZmlyZVxuLy8gTWF0Y2ggdHlwZTogaW52ZXJzZS1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IGluY2x1ZGUgYGZpcmVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gdGV4dC5pbmRleE9mKHNhbml0aXplZFBhdHRlcm4pID09PSAtMVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiBeZmlsZVxuLy8gTWF0Y2ggdHlwZTogcHJlZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBmaWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICdeJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuc3RhcnRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAhXmZpcmVcbi8vIE1hdGNoIHR5cGU6IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZmlyZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnIScgJiYgcGF0dGVybi5jaGFyQXQoMSkgPT0gJ14nXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigyKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gIXRleHQuc3RhcnRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAuZmlsZSRcbi8vIE1hdGNoIHR5cGU6IHN1ZmZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZW5kIHdpdGggYC5maWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgPT0gJyQnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigwLCBwYXR0ZXJuLmxlbmd0aCAtIDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LmVuZHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46ICEuZmlsZSRcbi8vIE1hdGNoIHR5cGU6IGludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBkbyBub3QgZW5kIHdpdGggYC5maWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICchJyAmJiBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aCAtIDEpID09ICckJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHJpbmcoMSwgcGF0dGVybi5sZW5ndGggLSAxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gIXRleHQuZW5kc1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCJjb25zdCBJTkZJTklUWSA9IDEgLyAwXG5cbmNvbnN0IGlzQXJyYXkgPSB2YWx1ZSA9PiAhQXJyYXkuaXNBcnJheVxuICA/IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgOiBBcnJheS5pc0FycmF5KHZhbHVlKVxuXG4vLyBBZGFwdGVkIGZyb206XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaC9ibG9iL2Y0Y2EzOTZhNzk2NDM1NDIyYmQ0ZmQ0MWZhZGJkMjI1ZWRkZGYxNzUvLmludGVybmFsL2Jhc2VUb1N0cmluZy5qc1xuY29uc3QgYmFzZVRvU3RyaW5nID0gdmFsdWUgPT4ge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGxldCByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxuY29uc3QgdG9TdHJpbmcgPSB2YWx1ZSA9PiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xuXG5jb25zdCBpc1N0cmluZyA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcblxuY29uc3QgaXNOdW1iZXIgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInXG5cbmNvbnN0IGlzT2JqZWN0ID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuXG5jb25zdCBpc0RlZmluZWQgPSB2YWx1ZSA9PiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0RlZmluZWQsXG4gIGlzQXJyYXksXG4gIGlzU3RyaW5nLFxuICBpc051bWJlcixcbiAgaXNPYmplY3QsXG4gIHRvU3RyaW5nXG59XG4iLCJjb25zdCBleGFjdE1hdGNoID0gcmVxdWlyZSgnLi9leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlRXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1leGFjdC1tYXRjaCcpXG5jb25zdCBwcmVmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9wcmVmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IHN1ZmZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL3N1ZmZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgQml0YXBTZWFyY2ggPSByZXF1aXJlKCcuLi9iaXRhcC1zZWFyY2gnKVxuXG5jb25zdCB7IGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG4vLyBSZXR1cm4gYSAyRCBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVlcnksIGZvciBzaW1wbGVyIHBhcnNpbmcuXG4vLyBFeGFtcGxlOlxuLy8gXCJeY29yZSBnbyQgfCByYiQgfCBweSQgeHkkXCIgPT4gW1tcIl5jb3JlXCIsIFwiZ28kXCJdLCBbXCJyYiRcIl0sIFtcInB5JFwiLCBcInh5JFwiXV1cbmNvbnN0IHF1ZXJ5ZnkgPSAocGF0dGVybikgPT4gcGF0dGVybi5zcGxpdCgnfCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpLnNwbGl0KC8gKy9nKSlcblxuLyoqXG4gKiBDb21tYW5kLWxpa2Ugc2VhcmNoaW5nXG4gKiA9PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogR2l2ZW4gbXVsdGlwbGUgc2VhcmNoIHRlcm1zIGRlbGltaXRlZCBieSBzcGFjZXMuZS5nLiBgXmpzY3JpcHQgLnB5dGhvbiQgcnVieSAhamF2YWAsXG4gKiBzZWFyY2ggaW4gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIFNlYXJjaCBzeW50YXg6XG4gKlxuICogfCBUb2tlbiAgICAgICB8IE1hdGNoIHR5cGUgICAgICAgICAgICAgICAgIHwgRGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAtLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBganNjcmlwdGAgICB8IGZ1enp5LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBtYXRjaCBganNjcmlwdGAgICAgICAgICAgICAgfFxuICogfCBgJ3B5dGhvbmAgICB8IGV4YWN0LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBpbmNsdWRlIGBweXRob25gICAgICAgICAgICAgfFxuICogfCBgIXJ1YnlgICAgICB8IGludmVyc2UtZXhhY3QtbWF0Y2ggICAgICAgIHwgSXRlbXMgdGhhdCBkbyBub3QgaW5jbHVkZSBgcnVieWAgICAgICAgfFxuICogfCBgXmphdmFgICAgICB8IHByZWZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBqYXZhYCAgICAgICAgICAgfFxuICogfCBgIV5lYXJsYW5nYCB8IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZWFybGFuZ2AgfFxuICogfCBgLmpzJGAgICAgICB8IHN1ZmZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBlbmQgd2l0aCBgLmpzYCAgICAgICAgICAgICAgfFxuICogfCBgIS5nbyRgICAgICB8IGludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3QgZW5kIHdpdGggYC5nb2AgICAgICAgfFxuICpcbiAqIEEgc2luZ2xlIHBpcGUgY2hhcmFjdGVyIGFjdHMgYXMgYW4gT1Igb3BlcmF0b3IuIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nXG4gKiBxdWVyeSBtYXRjaGVzIGVudHJpZXMgdGhhdCBzdGFydCB3aXRoIGBjb3JlYCBhbmQgZW5kIHdpdGggZWl0aGVyYGdvYCwgYHJiYCxcbiAqIG9yYHB5YC5cbiAqXG4gKiBgYGBcbiAqIF5jb3JlIGdvJCB8IHJiJCB8IHB5JFxuICogYGBgXG4gKi9cbmNsYXNzIEV4dGVuZGVkU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgaXNDYXNlU2Vuc2l0aXZlIH0gPSBvcHRpb25zXG4gICAgdGhpcy5xdWVyeSA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgLy8gQSA8cGF0dGVybj46PEJpdGFwU2VhcmNoPiBrZXktdmFsdWUgcGFpciBmb3Igb3B0aW1pemluZyBzZWFyY2hpbmdcbiAgICB0aGlzLl9mdXp6eUNhY2hlID0ge31cblxuICAgIGlmIChpc1N0cmluZyhwYXR0ZXJuKSAmJiBwYXR0ZXJuLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhdHRlcm4gPSBpc0Nhc2VTZW5zaXRpdmUgPyBwYXR0ZXJuIDogcGF0dGVybi50b0xvd2VyQ2FzZSgpXG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlmeSh0aGlzLnBhdHRlcm4pXG4gICAgfVxuICB9XG5cbiAgc2VhcmNoSW4odmFsdWUpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucXVlcnlcblxuICAgIGlmICghdGhpcy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNNYXRjaDogZmFsc2UsXG4gICAgICAgIHNjb3JlOiAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRleHQgPSB2YWx1ZS4kXG5cbiAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmlzQ2FzZVNlbnNpdGl2ZSA/IHRleHQgOiB0ZXh0LnRvTG93ZXJDYXNlKClcblxuICAgIGxldCBtYXRjaEZvdW5kID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAwLCBxTGVuID0gcXVlcnkubGVuZ3RoOyBpIDwgcUxlbjsgaSArPSAxKSB7XG5cbiAgICAgIGNvbnN0IHBhcnRzID0gcXVlcnlbaV1cbiAgICAgIGxldCByZXN1bHQgPSBudWxsXG4gICAgICBtYXRjaEZvdW5kID0gdHJ1ZVxuXG4gICAgICBmb3IgKGxldCBqID0gMCwgcExlbiA9IHBhcnRzLmxlbmd0aDsgaiA8IHBMZW47IGogKz0gMSkge1xuICAgICAgICBsZXQgdG9rZW4gPSBwYXJ0c1tqXVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9zZWFyY2godG9rZW4sIHRleHQpXG4gICAgICAgIGlmICghcmVzdWx0LmlzTWF0Y2gpIHtcbiAgICAgICAgICAvLyBBTkQgY29uZGl0aW9uLCBzaG9ydC1jaXJjdWl0IGFuZCBtb3ZlIG9uIHRvIG5leHQgcGFydFxuICAgICAgICAgIG1hdGNoRm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT1IgY29uZGl0aW9uLCBzbyBpZiBUUlVFLCByZXR1cm5cbiAgICAgIGlmIChtYXRjaEZvdW5kKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3RoaW5nIHdhcyBtYXRjaGVkXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2g6IGZhbHNlLFxuICAgICAgc2NvcmU6IDFcbiAgICB9XG4gIH1cblxuICBfc2VhcmNoKHBhdHRlcm4sIHRleHQpIHtcbiAgICBpZiAoZXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBleGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChwcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIHByZWZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoc3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBzdWZmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlRXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlRXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VhcmNoZXIgPSB0aGlzLl9mdXp6eUNhY2hlW3BhdHRlcm5dXG4gICAgICBpZiAoIXNlYXJjaGVyKSB7XG4gICAgICAgIHNlYXJjaGVyID0gbmV3IEJpdGFwU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICAgICAgdGhpcy5fZnV6enlDYWNoZVtwYXR0ZXJuXSA9IHNlYXJjaGVyXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VhcmNoZXIuc2VhcmNoSW5TdHJpbmcodGV4dClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbmRlZFNlYXJjaCIsImNvbnN0IE5HUkFNX0xFTiA9IDNcblxubW9kdWxlLmV4cG9ydHMgPSAodGV4dCwgeyBuID0gTkdSQU1fTEVOLCBwYWQgPSB0cnVlLCBzb3J0ID0gZmFsc2UgfSkgPT4ge1xuICBsZXQgbkdyYW1zID0gW11cblxuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbkdyYW1zXG4gIH1cblxuICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpXG4gIGlmIChwYWQpIHtcbiAgICB0ZXh0ID0gYCAke3RleHR9IGBcbiAgfVxuXG4gIGxldCBpbmRleCA9IHRleHQubGVuZ3RoIC0gbiArIDFcbiAgaWYgKGluZGV4IDwgMSkge1xuICAgIHJldHVybiBuR3JhbXNcbiAgfVxuXG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgbkdyYW1zW2luZGV4XSA9IHRleHQuc3Vic3RyKGluZGV4LCBuKVxuICB9XG5cbiAgaWYgKHNvcnQpIHtcbiAgICBuR3JhbXMuc29ydCgoYSwgYikgPT4gYSA9PSBiID8gMCA6IGEgPCBiID8gLTEgOiAxKVxuICB9XG5cbiAgcmV0dXJuIG5HcmFtc1xufSIsIi8vIEFzc3VtZXMgYXJyYXlzIGFyZSBzb3J0ZWRcbm1vZHVsZS5leHBvcnRzID0gKGFycjEsIGFycjIpID0+IHtcbiAgbGV0IHJlc3VsdCA9IFtdXG4gIGxldCBpID0gMFxuICBsZXQgaiA9IDBcblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoICYmIGogPCBhcnIyLmxlbmd0aCkge1xuICAgIGxldCBpdGVtMSA9IGFycjFbaV1cbiAgICBsZXQgaXRlbTIgPSBhcnIyW2pdXG5cbiAgICBpZiAoaXRlbTEgPCBpdGVtMikge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTEpXG4gICAgICBpICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0yIDwgaXRlbTEpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0yKVxuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0yKVxuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9XG4gIH1cblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnB1c2goYXJyMVtpXSlcbiAgICBpICs9IDFcbiAgfVxuXG4gIHdoaWxlIChqIDwgYXJyMi5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaChhcnIyW2pdKVxuICAgIGogKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIEFzc3VtZXMgYXJyYXlzIGFyZSBzb3J0ZWRcbm1vZHVsZS5leHBvcnRzID0gKGFycjEsIGFycjIpID0+IHtcbiAgbGV0IHJlc3VsdCA9IFtdXG4gIGxldCBpID0gMFxuICBsZXQgaiA9IDBcblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoICYmIGogPCBhcnIyLmxlbmd0aCkge1xuICAgIGxldCBpdGVtMSA9IGFycjFbaV1cbiAgICBsZXQgaXRlbTIgPSBhcnIyW2pdXG5cbiAgICBpZiAoaXRlbTEgPT0gaXRlbTIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0xKVxuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0xIDwgaXRlbTIpIHtcbiAgICAgIGkgKz0gMVxuICAgIH0gZWxzZSBpZiAoaXRlbTEgPiBpdGVtMikge1xuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIGkgKz0gMVxuICAgICAgaiArPSAxXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdW5pb246IHJlcXVpcmUoJy4vdW5pb24nKSxcbiAgaW50ZXJzZWN0aW9uOiByZXF1aXJlKCcuL2ludGVyc2VjdGlvbicpXG59IiwiY29uc3QgeyB1bmlvbiwgaW50ZXJzZWN0aW9uIH0gPSByZXF1aXJlKCcuLi9hcnJheS11dGlscycpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5HcmFtMSwgbkdyYW0yKSA9PiB7XG4gIGxldCBuR3JhbVVuaW9uID0gdW5pb24obkdyYW0xLCBuR3JhbTIpXG4gIGxldCBuR3JhbUludGVyc2VjdGlvbiA9IGludGVyc2VjdGlvbihuR3JhbTEsIG5HcmFtMilcblxuICByZXR1cm4gMSAtIG5HcmFtSW50ZXJzZWN0aW9uLmxlbmd0aCAvIG5HcmFtVW5pb24ubGVuZ3RoXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGphY2NhcmREaXN0YW5jZTogcmVxdWlyZSgnLi9qYWNjYXJkLWRpc3RhbmNlJylcbn0iLCJjb25zdCBuZ3JhbSA9IHJlcXVpcmUoJy4vbmdyYW0nKVxuY29uc3QgeyBqYWNjYXJkRGlzdGFuY2UgfSA9IHJlcXVpcmUoJy4vZGlzdGFuY2UnKVxuXG5jbGFzcyBOR3JhbVNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4sIG9wdGlvbnMgPSB7IHRocmVzaG9sZDogMC42IH0pIHtcbiAgICAvLyBDcmVhdGUgdGhlIG5ncmFtLCBhbmQgc29ydCBpdFxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdHRlcm5OZ3JhbSA9IG5ncmFtKHBhdHRlcm4sIHsgc29ydDogdHJ1ZSB9KVxuICB9XG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgbGV0IHRleHROZ3JhbSA9IHZhbHVlLm5nXG4gICAgaWYgKCF0ZXh0TmdyYW0pIHtcbiAgICAgIHRleHROZ3JhbSA9IG5ncmFtKHZhbHVlLiQsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgdmFsdWUubmcgPSB0ZXh0TmdyYW1cbiAgICB9XG5cbiAgICBsZXQgamFjYXJkUmVzdWx0ID0gamFjY2FyZERpc3RhbmNlKHRoaXMucGF0dGVybk5ncmFtLCB0ZXh0TmdyYW0pXG5cbiAgICBjb25zdCBpc01hdGNoID0gamFjYXJkUmVzdWx0IDwgdGhpcy5vcHRpb25zLnRocmVzaG9sZFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3JlOiBpc01hdGNoID8gamFjYXJkUmVzdWx0IDogMSxcbiAgICAgIGlzTWF0Y2hcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOR3JhbVNlYXJjaCIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBCaXRhcFNlYXJjaDogcmVxdWlyZSgnLi9iaXRhcC1zZWFyY2gnKSxcbiAgRXh0ZW5kZWRTZWFyY2g6IHJlcXVpcmUoJy4vZXh0ZW5kZWQtc2VhcmNoJyksXG4gIE5HcmFtU2VhcmNoOiByZXF1aXJlKCcuL25ncmFtLXNlYXJjaCcpXG59IiwiY29uc3Qge1xuICBpc0RlZmluZWQsXG4gIGlzU3RyaW5nLFxuICBpc051bWJlcixcbiAgaXNBcnJheSxcbiAgdG9TdHJpbmdcbn0gPSByZXF1aXJlKCcuL3R5cGUtY2hlY2tlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChvYmosIHBhdGgpID0+IHtcbiAgbGV0IGxpc3QgPSBbXVxuICBsZXQgYXJyID0gZmFsc2VcblxuICBjb25zdCBfZ2V0ID0gKG9iaiwgcGF0aCkgPT4ge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgLy8gSWYgdGhlcmUncyBubyBwYXRoIGxlZnQsIHdlJ3ZlIGdvdHRlbiB0byB0aGUgb2JqZWN0IHdlIGNhcmUgYWJvdXQuXG4gICAgICBsaXN0LnB1c2gob2JqKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkb3RJbmRleCA9IHBhdGguaW5kZXhPZignLicpXG5cbiAgICAgIGxldCBrZXkgPSBwYXRoXG4gICAgICBsZXQgcmVtYWluaW5nID0gbnVsbFxuXG4gICAgICBpZiAoZG90SW5kZXggIT09IC0xKSB7XG4gICAgICAgIGtleSA9IHBhdGguc2xpY2UoMCwgZG90SW5kZXgpXG4gICAgICAgIHJlbWFpbmluZyA9IHBhdGguc2xpY2UoZG90SW5kZXggKyAxKVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldXG5cbiAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIGlmICghcmVtYWluaW5nICYmIChpc1N0cmluZyh2YWx1ZSkgfHwgaXNOdW1iZXIodmFsdWUpKSkge1xuICAgICAgICAgIGxpc3QucHVzaCh0b1N0cmluZyh2YWx1ZSkpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBhcnIgPSB0cnVlXG4gICAgICAgICAgLy8gU2VhcmNoIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBfZ2V0KHZhbHVlW2ldLCByZW1haW5pbmcpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlbWFpbmluZykge1xuICAgICAgICAgIC8vIEFuIG9iamVjdC4gUmVjdXJzZSBmdXJ0aGVyLlxuICAgICAgICAgIF9nZXQodmFsdWUsIHJlbWFpbmluZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9nZXQob2JqLCBwYXRoKVxuXG4gIGlmIChhcnIpIHtcbiAgICByZXR1cm4gbGlzdFxuICB9XG5cbiAgcmV0dXJuIGxpc3RbMF1cbn0iLCJjb25zdCB7IGlzQXJyYXksIGlzRGVmaW5lZCwgaXNTdHJpbmcgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2dldCcpXG5jb25zdCBuZ3JhbSA9IHJlcXVpcmUoJy4uL3NlYXJjaC9uZ3JhbS1zZWFyY2gvbmdyYW0nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChrZXlzLCBsaXN0LCB7IGdldEZuID0gZ2V0LCBuZ3JhbXMgPSBmYWxzZSB9ID0ge30pID0+IHtcbiAgbGV0IGluZGV4ZWRMaXN0ID0gW11cblxuICAvLyBMaXN0IGlzIEFycmF5PFN0cmluZz5cbiAgaWYgKGlzU3RyaW5nKGxpc3RbMF0pKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgbGlzdFxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGxpc3RbaV1cblxuICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgLy8gaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgLy8gICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGxldCByZWNvcmQgPSB7XG4gICAgICAgICAgJDogdmFsdWUsXG4gICAgICAgICAgaWR4OiBpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmdyYW1zKSB7XG4gICAgICAgICAgcmVjb3JkLm5nID0gbmdyYW0odmFsdWUsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXhlZExpc3QucHVzaChyZWNvcmQpXG4gICAgICB9XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgY29uc3Qga2V5c0xlbiA9IGtleXMubGVuZ3RoXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgbGV0IGl0ZW0gPSBsaXN0W2ldXG5cbiAgICAgIGxldCByZWNvcmQgPSB7IGlkeDogaSwgJDoge30gfVxuXG4gICAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkga2V5IChpLmUsIHBhdGgpLCBhbmQgZmV0Y2ggdGhlIHZhbHVlIGF0IHRoYXQga2V5XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXNMZW47IGogKz0gMSkge1xuICAgICAgICBsZXQga2V5ID0ga2V5c1tqXVxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRGbihpdGVtLCBrZXkpXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGxldCBzdWJSZWNvcmRzID0gW11cbiAgICAgICAgICBjb25zdCBzdGFjayA9IFt7IGFycmF5SW5kZXg6IC0xLCB2YWx1ZSB9XVxuXG4gICAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgeyBhcnJheUluZGV4LCB2YWx1ZSB9ID0gc3RhY2sucG9wKClcblxuICAgICAgICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcblxuICAgICAgICAgICAgICAvLyBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICAgICAgICAvLyAgIHYgPSB2LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgIGxldCBzdWJSZWNvcmQgPSB7ICQ6IHZhbHVlLCBpZHg6IGFycmF5SW5kZXggfVxuXG4gICAgICAgICAgICAgIGlmIChuZ3JhbXMpIHtcbiAgICAgICAgICAgICAgICBzdWJSZWNvcmQubmcgPSBuZ3JhbSh2YWx1ZSwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzdWJSZWNvcmRzLnB1c2goc3ViUmVjb3JkKVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBhcnJMZW4gPSB2YWx1ZS5sZW5ndGg7IGsgPCBhcnJMZW47IGsgKz0gMSkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgYXJyYXlJbmRleDogayxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVtrXSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlY29yZC4kW2tleV0gPSBzdWJSZWNvcmRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgICAvLyAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIC8vIH1cblxuICAgICAgICAgIGxldCBzdWJSZWNvcmQgPSB7ICQ6IHZhbHVlIH1cblxuICAgICAgICAgIGlmIChuZ3JhbXMpIHtcbiAgICAgICAgICAgIHN1YlJlY29yZC5uZyA9IG5ncmFtKHZhbHVlLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWNvcmQuJFtrZXldID0gc3ViUmVjb3JkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5kZXhlZExpc3QucHVzaChyZWNvcmQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZGV4ZWRMaXN0XG59IiwiY29uc3QgeyBpc1N0cmluZyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcblxuY2xhc3MgS2V5U3RvcmUge1xuICBjb25zdHJ1Y3RvcihrZXlzKSB7XG4gICAgdGhpcy5fa2V5cyA9IHt9XG4gICAgdGhpcy5fa2V5TmFtZXMgPSBbXVxuICAgIHRoaXMuX2xlbmd0aCA9IGtleXMubGVuZ3RoXG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkga2V5XG4gICAgaWYgKGtleXMubGVuZ3RoICYmIGlzU3RyaW5nKGtleXNbMF0pKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0ge1xuICAgICAgICAgIHdlaWdodDogMVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2tleU5hbWVzLnB1c2goa2V5KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdG90YWxXZWlnaHQgPSAwXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCduYW1lJykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJuYW1lXCIgcHJvcGVydHkgaW4ga2V5IG9iamVjdCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXlOYW1lID0ga2V5Lm5hbWVcbiAgICAgICAgdGhpcy5fa2V5TmFtZXMucHVzaChrZXlOYW1lKVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCd3ZWlnaHQnKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBcIndlaWdodFwiIHByb3BlcnR5IGluIGtleSBvYmplY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd2VpZ2h0ID0ga2V5LndlaWdodFxuXG4gICAgICAgIGlmICh3ZWlnaHQgPD0gMCB8fCB3ZWlnaHQgPj0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgbXVzdCBiZWluIHRoZSByYW5nZSBvZiAoMCwgMSknKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2V5c1trZXlOYW1lXSA9IHtcbiAgICAgICAgICB3ZWlnaHRcbiAgICAgICAgfVxuXG4gICAgICAgIHRvdGFsV2VpZ2h0ICs9IHdlaWdodFxuICAgICAgfVxuXG4gICAgICAvLyBOb3JtYWxpemUgd2VpZ2h0cyBzbyB0aGF0IHRoZWlyIHN1bSBpcyBlcXVhbCB0byAxXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleU5hbWUgPSB0aGlzLl9rZXlOYW1lc1tpXVxuICAgICAgICBjb25zdCBrZXlXZWlnaHQgPSB0aGlzLl9rZXlzW2tleU5hbWVdLndlaWdodFxuICAgICAgICB0aGlzLl9rZXlzW2tleU5hbWVdLndlaWdodCA9IGtleVdlaWdodCAvIHRvdGFsV2VpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldChrZXksIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5c1trZXldID8gdGhpcy5fa2V5c1trZXldW25hbWVdIDogLTFcbiAgfVxuICBrZXlzKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlOYW1lc1xuICB9XG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9sZW5ndGhcbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuX2tleXMpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlTdG9yZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVJbmRleDogcmVxdWlyZSgnLi9jcmVhdGUtaW5kZXgnKSxcbiAgS2V5U3RvcmU6IHJlcXVpcmUoJy4va2V5LXN0b3JlJylcbn0iLCJjb25zdCB7IGlzQXJyYXksIGlzRGVmaW5lZCwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc09iamVjdCB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcblxubW9kdWxlLmV4cG9ydHMgPSAocmVzdWx0LCBkYXRhKSA9PiB7XG4gIGNvbnN0IG1hdGNoZXMgPSByZXN1bHQubWF0Y2hlc1xuICBkYXRhLm1hdGNoZXMgPSBbXVxuXG4gIGlmICghaXNEZWZpbmVkKG1hdGNoZXMpKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gbWF0Y2hlcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIGxldCBtYXRjaCA9IG1hdGNoZXNbaV1cblxuICAgIGlmICghaXNEZWZpbmVkKG1hdGNoLmluZGljZXMpIHx8IG1hdGNoLmluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGxldCBvYmogPSB7XG4gICAgICBpbmRpY2VzOiBtYXRjaC5pbmRpY2VzLFxuICAgICAgdmFsdWU6IG1hdGNoLnZhbHVlXG4gICAgfVxuXG4gICAgaWYgKG1hdGNoLmtleSkge1xuICAgICAgb2JqLmtleSA9IG1hdGNoLmtleVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5pZHggPiAtMSkge1xuICAgICAgb2JqLnJlZkluZGV4ID0gbWF0Y2guaWR4XG4gICAgfVxuXG4gICAgZGF0YS5tYXRjaGVzLnB1c2gob2JqKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChyZXN1bHQsIGRhdGEpID0+IHtcbiAgZGF0YS5zY29yZSA9IHJlc3VsdC5zY29yZVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0cmFuc2Zvcm1NYXRjaGVzOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1tYXRjaGVzJyksXG4gIHRyYW5zZm9ybVNjb3JlOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1zY29yZScpXG59IiwiXG5jb25zdCB7IEJpdGFwU2VhcmNoLCBFeHRlbmRlZFNlYXJjaCwgTkdyYW1TZWFyY2ggfSA9IHJlcXVpcmUoJy4vc2VhcmNoJylcbmNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzT2JqZWN0IH0gPSByZXF1aXJlKCcuL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2hlbHBlcnMvZ2V0JylcbmNvbnN0IHsgY3JlYXRlSW5kZXgsIEtleVN0b3JlIH0gPSByZXF1aXJlKCcuL3Rvb2xzJylcbmNvbnN0IHsgdHJhbnNmb3JtTWF0Y2hlcywgdHJhbnNmb3JtU2NvcmUgfSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtJylcbmNvbnN0IHsgTUFYX0JJVFMgfSA9IHJlcXVpcmUoJy4vc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMnKVxuXG4vLyAvLyBXaWxsIHByaW50IHRvIHRoZSBjb25zb2xlLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbi8vIGZ1bmN0aW9uIGRlYnVnKCkge1xuLy8gICBpZiAoRnVzZS52ZXJib3NlKSB7XG4vLyAgICAgY29uc29sZS5sb2coLi4uYXJndW1lbnRzKVxuLy8gICAgIC8vIGNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbi8vICAgICAvLyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoLi4uYXJndW1lbnRzLCBmYWxzZSwgbnVsbCwgdHJ1ZSAvKiBlbmFibGUgY29sb3JzICovKSlcbi8vICAgfVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBkZWJ1Z1RpbWUodmFsdWUpIHtcbi8vICAgaWYgKEZ1c2UudmVyYm9zZVRpbWUpIHtcbi8vICAgICBjb25zb2xlLnRpbWUodmFsdWUpXG4vLyAgIH1cbi8vIH1cblxuLy8gZnVuY3Rpb24gZGVidWdUaW1lRW5kKHZhbHVlKSB7XG4vLyAgIGlmIChGdXNlLnZlcmJvc2VUaW1lKSB7XG4vLyAgICAgY29uc29sZS50aW1lRW5kKHZhbHVlKVxuLy8gICB9XG4vLyB9XG5cbmxldCBGdXNlT3B0aW9ucyA9IHtcbiAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgLy8gbWF0Y2ggaXMgZm91bmQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHNhbWUgaW5wdXQuXG4gIGlzQ2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgLy8gQW4gZXhhY3QgbGV0dGVyIG1hdGNoIHdoaWNoIGlzICdkaXN0YW5jZScgY2hhcmFjdGVycyBhd2F5IGZyb20gdGhlIGZ1enp5IGxvY2F0aW9uXG4gIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gdG8gYmUgd2l0aGluIDgwMCBjaGFyYWN0ZXJzIG9mIHRoZSBmdXp6eSBsb2NhdGlvbiB0byBiZSBmb3VuZCB1c2luZyBhIDAuOCB0aHJlc2hvbGQuXG4gIGRpc3RhbmNlOiAxMDAsXG4gIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICBmaW5kQWxsTWF0Y2hlczogZmFsc2UsXG4gIC8vIFRoZSBnZXQgZnVuY3Rpb24gdG8gdXNlIHdoZW4gZmV0Y2hpbmcgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gVGhlIGRlZmF1bHQgd2lsbCBzZWFyY2ggbmVzdGVkIHBhdGhzICppZSBmb28uYmFyLmJheipcbiAgZ2V0Rm46IGdldCxcbiAgaW5jbHVkZU1hdGNoZXM6IGZhbHNlLFxuICBpbmNsdWRlU2NvcmU6IGZhbHNlLFxuICAvLyBMaXN0IG9mIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHNlYXJjaGVkLiBUaGlzIGFsc28gc3VwcG9ydHMgbmVzdGVkIHByb3BlcnRpZXMuXG4gIGtleXM6IFtdLFxuICAvLyBBcHByb3hpbWF0ZWx5IHdoZXJlIGluIHRoZSB0ZXh0IGlzIHRoZSBwYXR0ZXJuIGV4cGVjdGVkIHRvIGJlIGZvdW5kP1xuICBsb2NhdGlvbjogMCxcbiAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gIG1pbk1hdGNoQ2hhckxlbmd0aDogMSxcbiAgLy8gV2hldGhlciB0byBzb3J0IHRoZSByZXN1bHQgbGlzdCwgYnkgc2NvcmVcbiAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgLy8gRGVmYXVsdCBzb3J0IGZ1bmN0aW9uXG4gIHNvcnRGbjogKGEsIGIpID0+IChhLnNjb3JlIC0gYi5zY29yZSksXG4gIC8vIEF0IHdoYXQgcG9pbnQgZG9lcyB0aGUgbWF0Y2ggYWxnb3JpdGhtIGdpdmUgdXAuIEEgdGhyZXNob2xkIG9mICcwLjAnIHJlcXVpcmVzIGEgcGVyZmVjdCBtYXRjaFxuICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICB0aHJlc2hvbGQ6IDAuNixcbiAgLy8gRW5hYmxlZCBleHRlbmRlZC1zZWFyY2hpbmdcbiAgdXNlRXh0ZW5kZWRTZWFyY2g6IGZhbHNlXG59XG5cbmNsYXNzIEZ1c2Uge1xuICBjb25zdHJ1Y3RvcihsaXN0LCBvcHRpb25zID0gRnVzZU9wdGlvbnMsIGluZGV4ID0gbnVsbCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRnVzZU9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuICAgIC8vIGBjYXNlU2Vuc2l0aXZlYCBpcyBkZXByZWNhdGVkLCB1c2UgYGlzQ2FzZVNlbnNpdGl2ZWAgaW5zdGVhZFxuICAgIHRoaXMub3B0aW9ucy5pc0Nhc2VTZW5zaXRpdmUgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmVcbiAgICBkZWxldGUgdGhpcy5vcHRpb25zLmNhc2VTZW5zaXRpdmVcblxuICAgIC8vIGRlYnVnVGltZSgnQ29uc3RydWN0aW5nJylcbiAgICB0aGlzLl9wcm9jZXNzS2V5cyh0aGlzLm9wdGlvbnMua2V5cylcbiAgICB0aGlzLnNldENvbGxlY3Rpb24obGlzdCwgaW5kZXgpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb25zdHJ1Y3RpbmcnKVxuICB9XG5cbiAgc2V0Q29sbGVjdGlvbihsaXN0LCBpbmRleCA9IG51bGwpIHtcbiAgICB0aGlzLmxpc3QgPSBsaXN0XG4gICAgdGhpcy5saXN0SXNTdHJpbmdBcnJheSA9IGlzU3RyaW5nKGxpc3RbMF0pXG5cbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlYnVnVGltZSgnUHJvY2VzcyBpbmRleCcpXG4gICAgICB0aGlzLnNldEluZGV4KHRoaXMuX2NyZWF0ZUluZGV4KCkpXG4gICAgICAvLyBkZWJ1Z1RpbWVFbmQoJ1Byb2Nlc3MgaW5kZXgnKVxuICAgIH1cbiAgfVxuXG4gIHNldEluZGV4KGxpc3RJbmRleCkge1xuICAgIHRoaXMuX2luZGV4ZWRMaXN0ID0gbGlzdEluZGV4XG4gICAgLy8gZGVidWcobGlzdEluZGV4KVxuICB9XG5cbiAgX3Byb2Nlc3NLZXlzKGtleXMpIHtcbiAgICB0aGlzLl9rZXlTdG9yZSA9IG5ldyBLZXlTdG9yZShrZXlzKVxuXG4gICAgLy8gZGVidWcoJ1Byb2Nlc3MgS2V5cycpXG4gICAgaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgICAgLy8gZGVidWcodGhpcy5fa2V5U3RvcmUudG9KU09OKCkpXG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUluZGV4KCkge1xuICAgIHJldHVybiBjcmVhdGVJbmRleCh0aGlzLl9rZXlTdG9yZS5rZXlzKCksIHRoaXMubGlzdCwge1xuICAgICAgZ2V0Rm46IHRoaXMub3B0aW9ucy5nZXRGblxuICAgIH0pXG4gIH1cblxuICBzZWFyY2gocGF0dGVybiwgb3B0cyA9IHsgbGltaXQ6IGZhbHNlIH0pIHtcbiAgICAvLyBkZWJ1ZyhgLS0tLS0tLS0tIFNlYXJjaCBwYXR0ZXJuOiBcIiR7cGF0dGVybn1cImApXG4gICAgY29uc3QgeyB1c2VFeHRlbmRlZFNlYXJjaCwgc2hvdWxkU29ydCB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBsZXQgc2VhcmNoZXIgPSBudWxsXG5cbiAgICBpZiAodXNlRXh0ZW5kZWRTZWFyY2gpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IEV4dGVuZGVkU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2UgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IE5HcmFtU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoZXIgPSBuZXcgQml0YXBTZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIC8vIGRlYnVnVGltZSgnU2VhcmNoIHRpbWUnKTtcbiAgICBsZXQgcmVzdWx0cyA9IHRoaXMuX3NlYXJjaFVzaW5nKHNlYXJjaGVyKVxuICAgIC8vIGRlYnVnVGltZUVuZCgnU2VhcmNoIHRpbWUnKTtcblxuICAgIC8vIGRlYnVnVGltZSgnQ29tcHV0ZSBzY29yZSB0aW1lJyk7XG4gICAgdGhpcy5fY29tcHV0ZVNjb3JlKHJlc3VsdHMpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb21wdXRlIHNjb3JlIHRpbWUnKTtcblxuICAgIGlmIChzaG91bGRTb3J0KSB7XG4gICAgICB0aGlzLl9zb3J0KHJlc3VsdHMpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMubGltaXQgJiYgaXNOdW1iZXIob3B0cy5saW1pdCkpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIG9wdHMubGltaXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdChyZXN1bHRzKVxuICB9XG5cbiAgX3NlYXJjaFVzaW5nKHNlYXJjaGVyKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2luZGV4ZWRMaXN0XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdXG4gICAgY29uc3QgeyBpbmNsdWRlTWF0Y2hlcyB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICAvLyBMaXN0IGlzIEFycmF5PFN0cmluZz5cbiAgICBpZiAodGhpcy5saXN0SXNTdHJpbmdBcnJheSkge1xuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgbGlzdFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbGlzdFtpXVxuICAgICAgICBsZXQgeyAkOiB0ZXh0LCBpZHggfSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQodGV4dCkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgIGNvbnN0IHsgaXNNYXRjaCwgc2NvcmUgfSA9IHNlYXJjaFJlc3VsdFxuXG4gICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCB2YWx1ZTogdGV4dCB9XG5cbiAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgbWF0Y2guaW5kaWNlcyA9IHNlYXJjaFJlc3VsdC5tYXRjaGVkSW5kaWNlc1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICBpdGVtOiB0ZXh0LFxuICAgICAgICAgIGlkeCxcbiAgICAgICAgICBtYXRjaGVzOiBbbWF0Y2hdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgICBjb25zdCBrZXlOYW1lcyA9IHRoaXMuX2tleVN0b3JlLmtleXMoKVxuICAgICAgY29uc3Qga2V5c0xlbiA9IHRoaXMuX2tleVN0b3JlLmNvdW50KClcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHsgJDogaXRlbSwgaWR4IH0gPSBsaXN0W2ldXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoZXMgPSBbXVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzTGVuOyBqICs9IDEpIHtcbiAgICAgICAgICBsZXQga2V5ID0ga2V5TmFtZXNbal1cbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV1cblxuICAgICAgICAgIC8vIGRlYnVnKGAgS2V5OiAke2tleSA9PT0gJycgPyAnLS0nIDoga2V5fWApXG5cbiAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBrIDwgbGVuOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGFyckl0ZW0gPSB2YWx1ZVtrXVxuICAgICAgICAgICAgICBsZXQgdGV4dCA9IGFyckl0ZW0uJFxuICAgICAgICAgICAgICBsZXQgaWR4ID0gYXJySXRlbS5pZHhcblxuICAgICAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gc2VhcmNoZXIuc2VhcmNoSW4oYXJySXRlbSlcblxuICAgICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgICAvLyBkZWJ1ZyhgRnVsbCB0ZXh0OiBcIiR7dGV4dH1cIiwgc2NvcmU6ICR7c2NvcmV9YClcblxuICAgICAgICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IG1hdGNoID0geyBzY29yZSwga2V5LCB2YWx1ZTogdGV4dCwgaWR4IH1cblxuICAgICAgICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBtYXRjaC5pbmRpY2VzID0gc2VhcmNoUmVzdWx0Lm1hdGNoZWRJbmRpY2VzXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgLy8gZGVidWcoYEZ1bGwgdGV4dDogXCIke3RleHR9XCIsIHNjb3JlOiAke3Njb3JlfWApXG5cbiAgICAgICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCBrZXksIHZhbHVlOiB0ZXh0IH1cblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgICAgIG1hdGNoLmluZGljZXMgPSBzZWFyY2hSZXN1bHQubWF0Y2hlZEluZGljZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG1hdGNoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBpZHgsXG4gICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgbWF0Y2hlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLSBSRVNVTFRTIC0tLS0tLS0tLS0tXCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgX2NvbXB1dGVTY29yZShyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ0NvbXB1dGluZyBzY29yZTogJylcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZXN1bHRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2ldXG4gICAgICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgICAgIGNvbnN0IHNjb3JlTGVuID0gbWF0Y2hlcy5sZW5ndGhcblxuICAgICAgbGV0IHRvdGFsV2VpZ2h0ZWRTY29yZSA9IDFcbiAgICAgIC8vIGxldCBiZXN0U2NvcmUgPSAtMVxuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNjb3JlTGVuOyBqICs9IDEpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG1hdGNoZXNbal1cbiAgICAgICAgY29uc3Qga2V5ID0gaXRlbS5rZXlcbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0gdGhpcy5fa2V5U3RvcmUuZ2V0KGtleSwgJ3dlaWdodCcpXG4gICAgICAgIGNvbnN0IHdlaWdodCA9IGtleVdlaWdodCA+IC0xID8ga2V5V2VpZ2h0IDogMVxuICAgICAgICBjb25zdCBzY29yZSA9IGl0ZW0uc2NvcmUgPT09IDAgJiYga2V5V2VpZ2h0ID4gLTFcbiAgICAgICAgICA/IE51bWJlci5FUFNJTE9OXG4gICAgICAgICAgOiBpdGVtLnNjb3JlXG5cbiAgICAgICAgdG90YWxXZWlnaHRlZFNjb3JlICo9IE1hdGgucG93KHNjb3JlLCB3ZWlnaHQpXG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgYmVzdCBzY29yZS4uIGp1c3QgaW4gY2FzZVxuICAgICAgICAvLyBBY3R1YWxseSwgd2UncmUgbm90IHJlYWxseSB1c2luZyBpdC4uIGJ1dCBuZWVkIHRvIHRoaW5rIG9mIGEgd2F5IHRvIGluY29ycG9yYXRlIHRoaXNcbiAgICAgICAgLy8gYmVzdFNjb3JlID0gYmVzdFNjb3JlID09IC0xID8gaXRlbS5zY29yZSA6IE1hdGgubWluKGJlc3RTY29yZSwgaXRlbS5zY29yZSlcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnNjb3JlID0gdG90YWxXZWlnaHRlZFNjb3JlXG4gICAgICAvLyByZXN1bHQuJHNjb3JlID0gYmVzdFNjb3JlXG5cbiAgICAgIC8vIGRlYnVnKHJlc3VsdClcbiAgICB9XG4gIH1cblxuICBfc29ydChyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ1NvcnRpbmcuLi4uJylcbiAgICByZXN1bHRzLnNvcnQodGhpcy5vcHRpb25zLnNvcnRGbilcbiAgfVxuXG4gIF9mb3JtYXQocmVzdWx0cykge1xuICAgIGNvbnN0IGZpbmFsT3V0cHV0ID0gW11cblxuICAgIGNvbnN0IHsgaW5jbHVkZU1hdGNoZXMsIGluY2x1ZGVTY29yZSwgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgLy8gaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgIC8vICAgbGV0IGNhY2hlID0gW11cbiAgICAvLyAgIGRlYnVnKCdPdXRwdXQ6JywgSlNPTi5zdHJpbmdpZnkocmVzdWx0cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAvLyAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgLy8gICAgICAgaWYgKGNhY2hlLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgIC8vICAgICAgICAgLy8gQ2lyY3VsYXIgcmVmZXJlbmNlIGZvdW5kLCBkaXNjYXJkIGtleVxuICAgIC8vICAgICAgICAgcmV0dXJuXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIC8vIFN0b3JlIHZhbHVlIGluIG91ciBjb2xsZWN0aW9uXG4gICAgLy8gICAgICAgY2FjaGUucHVzaCh2YWx1ZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gdmFsdWVcbiAgICAvLyAgIH0sIDIpKVxuICAgIC8vICAgY2FjaGUgPSBudWxsXG4gICAgLy8gfVxuXG4gICAgbGV0IHRyYW5zZm9ybWVycyA9IFtdXG5cbiAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHRyYW5zZm9ybWVycy5wdXNoKHRyYW5zZm9ybU1hdGNoZXMpXG4gICAgaWYgKGluY2x1ZGVTY29yZSkgdHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtU2NvcmUpXG5cbiAgICAvLyBkZWJ1ZyhcIj09PT09IFJFU1VMVFMgPT09PT09XCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIj09PT09PT09PT09PT09PT09PT09XCIpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXVxuXG4gICAgICAvLyBkZWJ1ZygncmVzdWx0JywgcmVzdWx0KVxuXG4gICAgICBjb25zdCB7IGlkeCB9ID0gcmVzdWx0XG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGl0ZW06IHRoaXMubGlzdFtpZHhdLFxuICAgICAgICByZWZJbmRleDogaWR4XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0cmFuc2Zvcm1lcnMubGVuZ3RoOyBqIDwgbGVuOyBqICs9IDEpIHtcbiAgICAgICAgICB0cmFuc2Zvcm1lcnNbal0ocmVzdWx0LCBkYXRhKVxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgZmluYWxPdXRwdXQucHVzaChkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBmaW5hbE91dHB1dFxuICB9XG59XG5cbkZ1c2UuY3JlYXRlSW5kZXggPSBjcmVhdGVJbmRleFxuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1c2VcbiJdLCJuYW1lcyI6WyJwYXR0ZXJuIiwiZXJyb3JzIiwiY3VycmVudExvY2F0aW9uIiwiZXhwZWN0ZWRMb2NhdGlvbiIsImRpc3RhbmNlIiwiYWNjdXJhY3kiLCJsZW5ndGgiLCJwcm94aW1pdHkiLCJNYXRoIiwiYWJzIiwibWF0Y2htYXNrIiwibWluTWF0Y2hDaGFyTGVuZ3RoIiwibWF0Y2hlZEluZGljZXMiLCJzdGFydCIsImVuZCIsImkiLCJsZW4iLCJtYXRjaCIsInB1c2giLCJ0ZXh0IiwicGF0dGVybkFscGhhYmV0IiwibG9jYXRpb24iLCJ0aHJlc2hvbGQiLCJmaW5kQWxsTWF0Y2hlcyIsImluY2x1ZGVNYXRjaGVzIiwicGF0dGVybkxlbiIsInRleHRMZW4iLCJtYXgiLCJtaW4iLCJjdXJyZW50VGhyZXNob2xkIiwiYmVzdExvY2F0aW9uIiwiaW5kZXhPZiIsIm1hdGNoTWFzayIsInNjb3JlIiwiYml0YXBTY29yZSIsImxhc3RJbmRleE9mIiwibGFzdEJpdEFyciIsImZpbmFsU2NvcmUiLCJiaW5NYXgiLCJtYXNrIiwiYmluTWluIiwiYmluTWlkIiwiZmxvb3IiLCJmaW5pc2giLCJiaXRBcnIiLCJBcnJheSIsImoiLCJjaGFyTWF0Y2giLCJjaGFyQXQiLCJyZXN1bHQiLCJpc01hdGNoIiwiTUFYX0JJVFMiLCJyZXF1aXJlJCQwIiwiQml0YXBTZWFyY2giLCJpc0Nhc2VTZW5zaXRpdmUiLCJvcHRpb25zIiwiRXJyb3IiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiJCIsInNlYXJjaEluU3RyaW5nIiwiYml0YXBTZWFyY2giLCJpc0ZvclBhdHRlcm4iLCJzYW5pdGl6ZSIsInN1YnN0ciIsInNhbml0aXplZFBhdHRlcm4iLCJpbmRleCIsInN0YXJ0c1dpdGgiLCJlbmRzV2l0aCIsInN1YnN0cmluZyIsIklORklOSVRZIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImJhc2VUb1N0cmluZyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc09iamVjdCIsImlzRGVmaW5lZCIsInVuZGVmaW5lZCIsInF1ZXJ5ZnkiLCJzcGxpdCIsIm1hcCIsIml0ZW0iLCJ0cmltIiwiRXh0ZW5kZWRTZWFyY2giLCJxdWVyeSIsIl9mdXp6eUNhY2hlIiwibWF0Y2hGb3VuZCIsInFMZW4iLCJwYXJ0cyIsInBMZW4iLCJ0b2tlbiIsIl9zZWFyY2giLCJleGFjdE1hdGNoIiwicHJlZml4RXhhY3RNYXRjaCIsImludmVyc2VQcmVmaXhFeGFjdE1hdGNoIiwiaW52ZXJzZVN1ZmZpeEV4YWN0TWF0Y2giLCJzdWZmaXhFeGFjdE1hdGNoIiwiaW52ZXJzZUV4YWN0TWF0Y2giLCJzZWFyY2hlciIsIk5HUkFNX0xFTiIsIm4iLCJwYWQiLCJzb3J0IiwibkdyYW1zIiwiYSIsImIiLCJhcnIxIiwiYXJyMiIsIml0ZW0xIiwiaXRlbTIiLCJ1bmlvbiIsImludGVyc2VjdGlvbiIsInJlcXVpcmUkJDEiLCJuR3JhbTEiLCJuR3JhbTIiLCJuR3JhbVVuaW9uIiwibkdyYW1JbnRlcnNlY3Rpb24iLCJqYWNjYXJkRGlzdGFuY2UiLCJOR3JhbVNlYXJjaCIsInBhdHRlcm5OZ3JhbSIsIm5ncmFtIiwidGV4dE5ncmFtIiwibmciLCJqYWNhcmRSZXN1bHQiLCJyZXF1aXJlJCQyIiwib2JqIiwicGF0aCIsImxpc3QiLCJhcnIiLCJfZ2V0IiwiZG90SW5kZXgiLCJrZXkiLCJyZW1haW5pbmciLCJzbGljZSIsImtleXMiLCJnZXRGbiIsImdldCIsIm5ncmFtcyIsImluZGV4ZWRMaXN0IiwicmVjb3JkIiwiaWR4Iiwia2V5c0xlbiIsInN1YlJlY29yZHMiLCJzdGFjayIsImFycmF5SW5kZXgiLCJwb3AiLCJzdWJSZWNvcmQiLCJrIiwiYXJyTGVuIiwiS2V5U3RvcmUiLCJfa2V5cyIsIl9rZXlOYW1lcyIsIl9sZW5ndGgiLCJ3ZWlnaHQiLCJ0b3RhbFdlaWdodCIsImhhc093blByb3BlcnR5Iiwia2V5TmFtZSIsIm5hbWUiLCJrZXlXZWlnaHQiLCJKU09OIiwic3RyaW5naWZ5IiwiY3JlYXRlSW5kZXgiLCJkYXRhIiwibWF0Y2hlcyIsImluZGljZXMiLCJyZWZJbmRleCIsInRyYW5zZm9ybU1hdGNoZXMiLCJ0cmFuc2Zvcm1TY29yZSIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwiRnVzZU9wdGlvbnMiLCJpbmNsdWRlU2NvcmUiLCJzaG91bGRTb3J0Iiwic29ydEZuIiwidXNlRXh0ZW5kZWRTZWFyY2giLCJGdXNlIiwiY2FzZVNlbnNpdGl2ZSIsIl9wcm9jZXNzS2V5cyIsInNldENvbGxlY3Rpb24iLCJsaXN0SXNTdHJpbmdBcnJheSIsInNldEluZGV4IiwiX2NyZWF0ZUluZGV4IiwibGlzdEluZGV4IiwiX2luZGV4ZWRMaXN0IiwiX2tleVN0b3JlIiwib3B0cyIsImxpbWl0IiwicmVzdWx0cyIsIl9zZWFyY2hVc2luZyIsIl9jb21wdXRlU2NvcmUiLCJfc29ydCIsIl9mb3JtYXQiLCJzZWFyY2hSZXN1bHQiLCJzZWFyY2hJbiIsImtleU5hbWVzIiwiY291bnQiLCJhcnJJdGVtIiwic2NvcmVMZW4iLCJ0b3RhbFdlaWdodGVkU2NvcmUiLCJOdW1iZXIiLCJFUFNJTE9OIiwicG93IiwiZmluYWxPdXRwdXQiLCJ0cmFuc2Zvcm1lcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
