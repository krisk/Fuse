/*!
 * Fuse.js v5.0.7-beta - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2020 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Fuse", [], factory);
	else if(typeof exports === 'object')
		exports["Fuse"] = factory();
	else
		root["Fuse"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = __webpack_require__(1),
    BitapSearch = _require.BitapSearch,
    ExtendedSearch = _require.ExtendedSearch,
    NGramSearch = _require.NGramSearch;

var _require2 = __webpack_require__(15),
    isArray = _require2.isArray,
    isDefined = _require2.isDefined,
    isString = _require2.isString,
    isNumber = _require2.isNumber,
    isObject = _require2.isObject;

var get = __webpack_require__(23);

var _require3 = __webpack_require__(24),
    createIndex = _require3.createIndex,
    KeyStore = _require3.KeyStore;

var _require4 = __webpack_require__(27),
    transformMatches = _require4.transformMatches,
    transformScore = _require4.transformScore;

var _require5 = __webpack_require__(7),
    MAX_BITS = _require5.MAX_BITS; // // Will print to the console. Useful for debugging.
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

    this.options = _objectSpread({}, FuseOptions, {}, options); // `caseSensitive` is deprecated, use `isCaseSensitive` instead

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
      this.listIsStringArray = isString(list[0]);

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
      this._keyStore = new KeyStore(keys); // debug('Process Keys')

      if (Fuse.verbose) {// debug(this._keyStore.toJSON())
      }
    }
  }, {
    key: "_createIndex",
    value: function _createIndex() {
      return createIndex(this._keyStore.keys(), this.list, {
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
        searcher = new ExtendedSearch(pattern, this.options);
      } else if (pattern.length > MAX_BITS) {
        searcher = new NGramSearch(pattern, this.options);
      } else {
        searcher = new BitapSearch(pattern, this.options);
      } // debugTime('Search time');


      var results = this._searchUsing(searcher); // debugTimeEnd('Search time');
      // debugTime('Compute score time');


      this._computeScore(results); // debugTimeEnd('Compute score time');


      if (shouldSort) {
        this._sort(results);
      }

      if (opts.limit && isNumber(opts.limit)) {
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

          if (!isDefined(text)) {
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

          if (!isDefined(item)) {
            continue;
          }

          var matches = []; // Iterate over every key (i.e, path), and fetch the value at that key

          for (var j = 0; j < keysLen; j += 1) {
            var key = keyNames[j];
            var _value = item[key]; // debug(` Key: ${key === '' ? '--' : key}`)

            if (!isDefined(_value)) {
              continue;
            }

            if (isArray(_value)) {
              for (var k = 0, _len2 = _value.length; k < _len2; k += 1) {
                var arrItem = _value[k];
                var _text = arrItem.$;
                var _idx2 = arrItem.idx;

                if (!isDefined(_text)) {
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
      if (includeMatches) transformers.push(transformMatches);
      if (includeScore) transformers.push(transformScore); // debug("===== RESULTS ======")
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

Fuse.createIndex = createIndex;
module.exports = Fuse;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  BitapSearch: __webpack_require__(2),
  ExtendedSearch: __webpack_require__(8),
  NGramSearch: __webpack_require__(16)
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var bitapSearch = __webpack_require__(3);

var patternAlphabet = __webpack_require__(6);

var _require = __webpack_require__(7),
    MAX_BITS = _require.MAX_BITS;

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

    if (pattern.length > MAX_BITS) {
      throw new Error("Pattern length exceeds max of ".concat(MAX_BITS, "."));
    }

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.patternAlphabet = patternAlphabet(this.pattern);
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

module.exports = BitapSearch;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var bitapScore = __webpack_require__(4);

var matchedIndices = __webpack_require__(5);

module.exports = function (text, pattern, patternAlphabet, _ref) {
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
    result.matchedIndices = matchedIndices(matchMask, minMatchCharLength);
  }

  return result;
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (pattern, _ref) {
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

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function () {
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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (pattern) {
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

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// Machine word size
module.exports.MAX_BITS = 32;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var exactMatch = __webpack_require__(9);

var inverseExactMatch = __webpack_require__(10);

var prefixExactMatch = __webpack_require__(11);

var inversePrefixExactMatch = __webpack_require__(12);

var suffixExactMatch = __webpack_require__(13);

var inverseSuffixExactMatch = __webpack_require__(14);

var BitapSearch = __webpack_require__(2);

var _require = __webpack_require__(15),
    isString = _require.isString; // Return a 2D array representation of the query, for simpler parsing.
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

    if (isString(pattern) && pattern.trim().length > 0) {
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
          searcher = new BitapSearch(pattern, this.options);
          this._fuzzyCache[pattern] = searcher;
        }

        return searcher.searchInString(text);
      }
    }
  }]);

  return ExtendedSearch;
}();

module.exports = ExtendedSearch;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

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

module.exports = {
  isForPattern: isForPattern,
  sanitize: sanitize,
  match: match
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// Token: !fire
// Match type: inverse-exact-match
// Description: Items that do not include `fire`
var isForPattern = function isForPattern(pattern) {
  return pattern.charAt(0) == '!';
};

var sanitize = function sanitize(pattern) {
  return pattern.substr(1);
};

var match = function match(pattern, text) {
  var sanitizedPattern = sanitize(pattern);
  var isMatch = text.indexOf(sanitizedPattern) === -1;
  return {
    isMatch: isMatch,
    score: 0
  };
};

module.exports = {
  isForPattern: isForPattern,
  sanitize: sanitize,
  match: match
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// Token: ^file
// Match type: prefix-exact-match
// Description: Items that start with `file`
var isForPattern = function isForPattern(pattern) {
  return pattern.charAt(0) == '^';
};

var sanitize = function sanitize(pattern) {
  return pattern.substr(1);
};

var match = function match(pattern, text) {
  var sanitizedPattern = sanitize(pattern);
  var isMatch = text.startsWith(sanitizedPattern);
  return {
    isMatch: isMatch,
    score: 0
  };
};

module.exports = {
  isForPattern: isForPattern,
  sanitize: sanitize,
  match: match
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// Token: !^fire
// Match type: inverse-prefix-exact-match
// Description: Items that do not start with `fire`
var isForPattern = function isForPattern(pattern) {
  return pattern.charAt(0) == '!' && pattern.charAt(1) == '^';
};

var sanitize = function sanitize(pattern) {
  return pattern.substr(2);
};

var match = function match(pattern, text) {
  var sanitizedPattern = sanitize(pattern);
  var isMatch = !text.startsWith(sanitizedPattern);
  return {
    isMatch: isMatch,
    score: 0
  };
};

module.exports = {
  isForPattern: isForPattern,
  sanitize: sanitize,
  match: match
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

// Token: .file$
// Match type: suffix-exact-match
// Description: Items that end with `.file`
var isForPattern = function isForPattern(pattern) {
  return pattern.charAt(pattern.length - 1) == '$';
};

var sanitize = function sanitize(pattern) {
  return pattern.substr(0, pattern.length - 1);
};

var match = function match(pattern, text) {
  var sanitizedPattern = sanitize(pattern);
  var isMatch = text.endsWith(sanitizedPattern);
  return {
    isMatch: isMatch,
    score: 0
  };
};

module.exports = {
  isForPattern: isForPattern,
  sanitize: sanitize,
  match: match
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// Token: !.file$
// Match type: inverse-suffix-exact-match
// Description: Items that do not end with `.file`
var isForPattern = function isForPattern(pattern) {
  return pattern.charAt(0) == '!' && pattern.charAt(pattern.length - 1) == '$';
};

var sanitize = function sanitize(pattern) {
  return pattern.substring(1, pattern.length - 1);
};

var match = function match(pattern, text) {
  var sanitizedPattern = sanitize(pattern);
  var isMatch = !text.endsWith(sanitizedPattern);
  return {
    isMatch: isMatch,
    score: 0
  };
};

module.exports = {
  isForPattern: isForPattern,
  sanitize: sanitize,
  match: match
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

module.exports = {
  isDefined: isDefined,
  isArray: isArray,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  toString: toString
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ngram = __webpack_require__(17);

var _require = __webpack_require__(18),
    jaccardDistance = _require.jaccardDistance;

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

      var jacardResult = jaccardDistance(this.patternNgram, textNgram);
      var isMatch = jacardResult < this.options.threshold;
      return {
        score: isMatch ? jacardResult : 1,
        isMatch: isMatch
      };
    }
  }]);

  return NGramSearch;
}();

module.exports = NGramSearch;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var NGRAM_LEN = 3;

module.exports = function (text, _ref) {
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

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  jaccardDistance: __webpack_require__(19)
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(20),
    union = _require.union,
    intersection = _require.intersection;

module.exports = function (nGram1, nGram2) {
  var nGramUnion = union(nGram1, nGram2);
  var nGramIntersection = intersection(nGram1, nGram2);
  return 1 - nGramIntersection.length / nGramUnion.length;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  union: __webpack_require__(21),
  intersection: __webpack_require__(22)
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// Assumes arrays are sorted
module.exports = function (arr1, arr2) {
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

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// Assumes arrays are sorted
module.exports = function (arr1, arr2) {
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

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(15),
    isDefined = _require.isDefined,
    isString = _require.isString,
    isNumber = _require.isNumber,
    isArray = _require.isArray,
    toString = _require.toString;

module.exports = function (obj, path) {
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

      if (isDefined(value)) {
        if (!remaining && (isString(value) || isNumber(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
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

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  createIndex: __webpack_require__(25),
  KeyStore: __webpack_require__(26)
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(15),
    isArray = _require.isArray,
    isDefined = _require.isDefined,
    isString = _require.isString;

var get = __webpack_require__(23);

var ngram = __webpack_require__(17);

module.exports = function (keys, list) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$getFn = _ref.getFn,
      getFn = _ref$getFn === void 0 ? get : _ref$getFn,
      _ref$ngrams = _ref.ngrams,
      ngrams = _ref$ngrams === void 0 ? false : _ref$ngrams;

  var indexedList = []; // List is Array<String>

  if (isString(list[0])) {
    // Iterate over every string in the list
    for (var i = 0, len = list.length; i < len; i += 1) {
      var value = list[i];

      if (isDefined(value)) {
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

        if (!isDefined(_value)) {
          continue;
        }

        if (isArray(_value)) {
          var subRecords = [];
          var stack = [{
            arrayIndex: -1,
            value: _value
          }];

          while (stack.length) {
            var _stack$pop = stack.pop(),
                arrayIndex = _stack$pop.arrayIndex,
                _value2 = _stack$pop.value;

            if (!isDefined(_value2)) {
              continue;
            }

            if (isString(_value2)) {
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
            } else if (isArray(_value2)) {
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

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = __webpack_require__(15),
    isString = _require.isString;

var KeyStore = /*#__PURE__*/function () {
  function KeyStore(keys) {
    _classCallCheck(this, KeyStore);

    this._keys = {};
    this._keyNames = [];
    this._length = keys.length; // Iterate over every key

    if (keys.length && isString(keys[0])) {
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

module.exports = KeyStore;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  transformMatches: __webpack_require__(28),
  transformScore: __webpack_require__(29)
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(15),
    isArray = _require.isArray,
    isDefined = _require.isDefined,
    isString = _require.isString,
    isNumber = _require.isNumber,
    isObject = _require.isObject;

module.exports = function (result, data) {
  var matches = result.matches;
  data.matches = [];

  if (!isDefined(matches)) {
    return;
  }

  for (var i = 0, len = matches.length; i < len; i += 1) {
    var match = matches[i];

    if (!isDefined(match.indices) || match.indices.length === 0) {
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

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function (result, data) {
  data.score = result.score;
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=fuse.raw.js.map