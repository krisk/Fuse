/*!
 * Fuse.js v5.0.3-beta - Lightweight fuzzy-search (http://fusejs.io)
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/helpers/get.js":
/*!****************************!*\
  !*** ./src/helpers/get.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(/*! ./type-checkers */ "./src/helpers/type-checkers.js"),
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

/***/ "./src/helpers/type-checkers.js":
/*!**************************************!*\
  !*** ./src/helpers/type-checkers.js ***!
  \**************************************/
/*! no static exports found */
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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = __webpack_require__(/*! ./search */ "./src/search/index.js"),
    BitapSearch = _require.BitapSearch,
    ExtendedSearch = _require.ExtendedSearch,
    NGramSearch = _require.NGramSearch;

var _require2 = __webpack_require__(/*! ./helpers/type-checkers */ "./src/helpers/type-checkers.js"),
    isArray = _require2.isArray,
    isDefined = _require2.isDefined,
    isString = _require2.isString,
    isNumber = _require2.isNumber,
    isObject = _require2.isObject;

var get = __webpack_require__(/*! ./helpers/get */ "./src/helpers/get.js");

var _require3 = __webpack_require__(/*! ./tools */ "./src/tools/index.js"),
    createIndex = _require3.createIndex,
    KeyStore = _require3.KeyStore;

var _require4 = __webpack_require__(/*! ./transform */ "./src/transform/index.js"),
    transformMatches = _require4.transformMatches,
    transformScore = _require4.transformScore;

var _require5 = __webpack_require__(/*! ./search/bitap-search/constants */ "./src/search/bitap-search/constants.js"),
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

          var weight = keyWeight || 1;
          var score = item.score === 0 && keyWeight && keyWeight > 0 ? Number.EPSILON : item.score;
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

/***/ "./src/search/bitap-search/bitap-matched-indices.js":
/*!**********************************************************!*\
  !*** ./src/search/bitap-search/bitap-matched-indices.js ***!
  \**********************************************************/
/*! no static exports found */
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

/***/ "./src/search/bitap-search/bitap-pattern-alphabet.js":
/*!***********************************************************!*\
  !*** ./src/search/bitap-search/bitap-pattern-alphabet.js ***!
  \***********************************************************/
/*! no static exports found */
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

/***/ "./src/search/bitap-search/bitap-score.js":
/*!************************************************!*\
  !*** ./src/search/bitap-search/bitap-score.js ***!
  \************************************************/
/*! no static exports found */
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

/***/ "./src/search/bitap-search/bitap-search.js":
/*!*************************************************!*\
  !*** ./src/search/bitap-search/bitap-search.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bitapScore = __webpack_require__(/*! ./bitap-score */ "./src/search/bitap-search/bitap-score.js");

var matchedIndices = __webpack_require__(/*! ./bitap-matched-indices */ "./src/search/bitap-search/bitap-matched-indices.js");

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

/***/ "./src/search/bitap-search/constants.js":
/*!**********************************************!*\
  !*** ./src/search/bitap-search/constants.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Machine word size
module.exports.MAX_BITS = 32;

/***/ }),

/***/ "./src/search/bitap-search/index.js":
/*!******************************************!*\
  !*** ./src/search/bitap-search/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var bitapSearch = __webpack_require__(/*! ./bitap-search */ "./src/search/bitap-search/bitap-search.js");

var patternAlphabet = __webpack_require__(/*! ./bitap-pattern-alphabet */ "./src/search/bitap-search/bitap-pattern-alphabet.js");

var _require = __webpack_require__(/*! ./constants */ "./src/search/bitap-search/constants.js"),
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

/***/ "./src/search/extended-search/exact-match.js":
/*!***************************************************!*\
  !*** ./src/search/extended-search/exact-match.js ***!
  \***************************************************/
/*! no static exports found */
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

/***/ "./src/search/extended-search/index.js":
/*!*********************************************!*\
  !*** ./src/search/extended-search/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var exactMatch = __webpack_require__(/*! ./exact-match */ "./src/search/extended-search/exact-match.js");

var inverseExactMatch = __webpack_require__(/*! ./inverse-exact-match */ "./src/search/extended-search/inverse-exact-match.js");

var prefixExactMatch = __webpack_require__(/*! ./prefix-exact-match */ "./src/search/extended-search/prefix-exact-match.js");

var inversePrefixExactMatch = __webpack_require__(/*! ./inverse-prefix-exact-match */ "./src/search/extended-search/inverse-prefix-exact-match.js");

var suffixExactMatch = __webpack_require__(/*! ./suffix-exact-match */ "./src/search/extended-search/suffix-exact-match.js");

var inverseSuffixExactMatch = __webpack_require__(/*! ./inverse-suffix-exact-match */ "./src/search/extended-search/inverse-suffix-exact-match.js");

var BitapSearch = __webpack_require__(/*! ../bitap-search */ "./src/search/bitap-search/index.js"); // Return a 2D array representation of the query, for simpler parsing.
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
    this.options = options;
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.query = queryfy(this.pattern); // A <pattern>:<BitapSearch> key-value pair for optimizing searching

    this._fuzzyCache = {};
  }

  _createClass(ExtendedSearch, [{
    key: "searchIn",
    value: function searchIn(value) {
      var text = value.$;
      var query = this.query;
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

        return searcher.search(text);
      }
    }
  }]);

  return ExtendedSearch;
}();

module.exports = ExtendedSearch;

/***/ }),

/***/ "./src/search/extended-search/inverse-exact-match.js":
/*!***********************************************************!*\
  !*** ./src/search/extended-search/inverse-exact-match.js ***!
  \***********************************************************/
/*! no static exports found */
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

/***/ "./src/search/extended-search/inverse-prefix-exact-match.js":
/*!******************************************************************!*\
  !*** ./src/search/extended-search/inverse-prefix-exact-match.js ***!
  \******************************************************************/
/*! no static exports found */
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

/***/ "./src/search/extended-search/inverse-suffix-exact-match.js":
/*!******************************************************************!*\
  !*** ./src/search/extended-search/inverse-suffix-exact-match.js ***!
  \******************************************************************/
/*! no static exports found */
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

/***/ "./src/search/extended-search/prefix-exact-match.js":
/*!**********************************************************!*\
  !*** ./src/search/extended-search/prefix-exact-match.js ***!
  \**********************************************************/
/*! no static exports found */
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

/***/ "./src/search/extended-search/suffix-exact-match.js":
/*!**********************************************************!*\
  !*** ./src/search/extended-search/suffix-exact-match.js ***!
  \**********************************************************/
/*! no static exports found */
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

/***/ "./src/search/index.js":
/*!*****************************!*\
  !*** ./src/search/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  BitapSearch: __webpack_require__(/*! ./bitap-search */ "./src/search/bitap-search/index.js"),
  ExtendedSearch: __webpack_require__(/*! ./extended-search */ "./src/search/extended-search/index.js"),
  NGramSearch: __webpack_require__(/*! ./ngram-search */ "./src/search/ngram-search/index.js")
};

/***/ }),

/***/ "./src/search/ngram-search/array-utils/index.js":
/*!******************************************************!*\
  !*** ./src/search/ngram-search/array-utils/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  union: __webpack_require__(/*! ./union */ "./src/search/ngram-search/array-utils/union.js"),
  intersection: __webpack_require__(/*! ./intersection */ "./src/search/ngram-search/array-utils/intersection.js")
};

/***/ }),

/***/ "./src/search/ngram-search/array-utils/intersection.js":
/*!*************************************************************!*\
  !*** ./src/search/ngram-search/array-utils/intersection.js ***!
  \*************************************************************/
/*! no static exports found */
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

/***/ "./src/search/ngram-search/array-utils/union.js":
/*!******************************************************!*\
  !*** ./src/search/ngram-search/array-utils/union.js ***!
  \******************************************************/
/*! no static exports found */
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

/***/ "./src/search/ngram-search/distance/index.js":
/*!***************************************************!*\
  !*** ./src/search/ngram-search/distance/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  jaccardDistance: __webpack_require__(/*! ./jaccard-distance */ "./src/search/ngram-search/distance/jaccard-distance.js")
};

/***/ }),

/***/ "./src/search/ngram-search/distance/jaccard-distance.js":
/*!**************************************************************!*\
  !*** ./src/search/ngram-search/distance/jaccard-distance.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(/*! ../array-utils */ "./src/search/ngram-search/array-utils/index.js"),
    union = _require.union,
    intersection = _require.intersection;

module.exports = function (nGram1, nGram2) {
  var nGramUnion = union(nGram1, nGram2);
  var nGramIntersection = intersection(nGram1, nGram2);
  return 1 - nGramIntersection.length / nGramUnion.length;
};

/***/ }),

/***/ "./src/search/ngram-search/index.js":
/*!******************************************!*\
  !*** ./src/search/ngram-search/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ngram = __webpack_require__(/*! ./ngram */ "./src/search/ngram-search/ngram.js");

var _require = __webpack_require__(/*! ./distance */ "./src/search/ngram-search/distance/index.js"),
    jaccardDistance = _require.jaccardDistance;

var NGramSearch = /*#__PURE__*/function () {
  function NGramSearch(pattern) {
    _classCallCheck(this, NGramSearch);

    // Create the ngram, and sort it
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
      return {
        score: jacardResult,
        isMatch: jacardResult < 1
      };
    }
  }]);

  return NGramSearch;
}();

module.exports = NGramSearch;

/***/ }),

/***/ "./src/search/ngram-search/ngram.js":
/*!******************************************!*\
  !*** ./src/search/ngram-search/ngram.js ***!
  \******************************************/
/*! no static exports found */
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

/***/ "./src/tools/create-index.js":
/*!***********************************!*\
  !*** ./src/tools/create-index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(/*! ../helpers/type-checkers */ "./src/helpers/type-checkers.js"),
    isArray = _require.isArray,
    isDefined = _require.isDefined,
    isString = _require.isString;

var get = __webpack_require__(/*! ../helpers/get */ "./src/helpers/get.js");

var ngram = __webpack_require__(/*! ../search/ngram-search/ngram */ "./src/search/ngram-search/ngram.js");

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

/***/ "./src/tools/index.js":
/*!****************************!*\
  !*** ./src/tools/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  createIndex: __webpack_require__(/*! ./create-index */ "./src/tools/create-index.js"),
  KeyStore: __webpack_require__(/*! ./key-store */ "./src/tools/key-store.js")
};

/***/ }),

/***/ "./src/tools/key-store.js":
/*!********************************!*\
  !*** ./src/tools/key-store.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = __webpack_require__(/*! ../helpers/type-checkers */ "./src/helpers/type-checkers.js"),
    isString = _require.isString;

var KeyStore = /*#__PURE__*/function () {
  function KeyStore(keys) {
    _classCallCheck(this, KeyStore);

    this._keys = {};
    this._keyNames = [];
    this._length = keys.length;
    this._hasWeights = false; // Iterate over every key

    if (keys.length && isString(keys[0])) {
      for (var i = 0; i < this._length; i += 1) {
        var key = keys[i];
        this._keys[key] = {
          weight: 1
        };

        this._keyNames.push(key);
      }
    } else {
      var keyWeightsTotal = 0;

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

        var keyWeight = _key.weight;

        if (keyWeight <= 0 || keyWeight >= 1) {
          throw new Error('"weight" property in key must bein the range of (0, 1)');
        }

        this._keys[keyName] = {
          weight: keyWeight
        };
        keyWeightsTotal += keyWeight;
        this._hasWeights = true;
      }

      if (keyWeightsTotal > 1) {
        throw new Error('Total of keyWeights cannot exceed 1');
      }
    }
  }

  _createClass(KeyStore, [{
    key: "get",
    value: function get(key, name) {
      return this._keys[key] ? this._keys[key][name] : null;
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

/***/ "./src/transform/index.js":
/*!********************************!*\
  !*** ./src/transform/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  transformMatches: __webpack_require__(/*! ./transform-matches */ "./src/transform/transform-matches.js"),
  transformScore: __webpack_require__(/*! ./transform-score */ "./src/transform/transform-score.js")
};

/***/ }),

/***/ "./src/transform/transform-matches.js":
/*!********************************************!*\
  !*** ./src/transform/transform-matches.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(/*! ../helpers/type-checkers */ "./src/helpers/type-checkers.js"),
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

/***/ "./src/transform/transform-score.js":
/*!******************************************!*\
  !*** ./src/transform/transform-score.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (result, data) {
  data.score = result.score;
};

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Z1c2UvLi9zcmMvaGVscGVycy9nZXQuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9oZWxwZXJzL3R5cGUtY2hlY2tlcnMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtbWF0Y2hlZC1pbmRpY2VzLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1zY29yZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtc2VhcmNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9pbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9zdWZmaXgtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9hcnJheS11dGlscy9pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL3VuaW9uLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9kaXN0YW5jZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvZGlzdGFuY2UvamFjY2FyZC1kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvY3JlYXRlLWluZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90b29scy9rZXktc3RvcmUuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLW1hdGNoZXMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLXNjb3JlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJpc0RlZmluZWQiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNBcnJheSIsInRvU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIm9iaiIsInBhdGgiLCJsaXN0IiwiYXJyIiwiX2dldCIsInB1c2giLCJkb3RJbmRleCIsImluZGV4T2YiLCJrZXkiLCJyZW1haW5pbmciLCJzbGljZSIsInZhbHVlIiwiaSIsImxlbiIsImxlbmd0aCIsIklORklOSVRZIiwiQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJjYWxsIiwiYmFzZVRvU3RyaW5nIiwicmVzdWx0IiwiaXNPYmplY3QiLCJ1bmRlZmluZWQiLCJCaXRhcFNlYXJjaCIsIkV4dGVuZGVkU2VhcmNoIiwiTkdyYW1TZWFyY2giLCJnZXQiLCJjcmVhdGVJbmRleCIsIktleVN0b3JlIiwidHJhbnNmb3JtTWF0Y2hlcyIsInRyYW5zZm9ybVNjb3JlIiwiTUFYX0JJVFMiLCJGdXNlT3B0aW9ucyIsImlzQ2FzZVNlbnNpdGl2ZSIsImRpc3RhbmNlIiwiZmluZEFsbE1hdGNoZXMiLCJnZXRGbiIsImluY2x1ZGVNYXRjaGVzIiwiaW5jbHVkZVNjb3JlIiwia2V5cyIsImxvY2F0aW9uIiwibWluTWF0Y2hDaGFyTGVuZ3RoIiwic2hvdWxkU29ydCIsInNvcnRGbiIsImEiLCJiIiwic2NvcmUiLCJ0aHJlc2hvbGQiLCJ1c2VFeHRlbmRlZFNlYXJjaCIsIkZ1c2UiLCJvcHRpb25zIiwiaW5kZXgiLCJjYXNlU2Vuc2l0aXZlIiwiX3Byb2Nlc3NLZXlzIiwic2V0Q29sbGVjdGlvbiIsImxpc3RJc1N0cmluZ0FycmF5Iiwic2V0SW5kZXgiLCJfY3JlYXRlSW5kZXgiLCJsaXN0SW5kZXgiLCJfaW5kZXhlZExpc3QiLCJfa2V5U3RvcmUiLCJ2ZXJib3NlIiwicGF0dGVybiIsIm9wdHMiLCJsaW1pdCIsInNlYXJjaGVyIiwicmVzdWx0cyIsIl9zZWFyY2hVc2luZyIsIl9jb21wdXRlU2NvcmUiLCJfc29ydCIsIl9mb3JtYXQiLCJ0ZXh0IiwiJCIsImlkeCIsInNlYXJjaFJlc3VsdCIsInNlYXJjaEluIiwiaXNNYXRjaCIsIm1hdGNoIiwiaW5kaWNlcyIsIm1hdGNoZWRJbmRpY2VzIiwiaXRlbSIsIm1hdGNoZXMiLCJrZXlOYW1lcyIsImtleXNMZW4iLCJjb3VudCIsImoiLCJrIiwiYXJySXRlbSIsInNjb3JlTGVuIiwidG90YWxXZWlnaHRlZFNjb3JlIiwia2V5V2VpZ2h0Iiwid2VpZ2h0IiwiTnVtYmVyIiwiRVBTSUxPTiIsIk1hdGgiLCJwb3ciLCJzb3J0IiwiZmluYWxPdXRwdXQiLCJ0cmFuc2Zvcm1lcnMiLCJkYXRhIiwicmVmSW5kZXgiLCJtYXRjaG1hc2siLCJzdGFydCIsImVuZCIsIm1hc2siLCJjaGFyQXQiLCJlcnJvcnMiLCJjdXJyZW50TG9jYXRpb24iLCJleHBlY3RlZExvY2F0aW9uIiwiYWNjdXJhY3kiLCJwcm94aW1pdHkiLCJhYnMiLCJiaXRhcFNjb3JlIiwicGF0dGVybkFscGhhYmV0IiwicGF0dGVybkxlbiIsInRleHRMZW4iLCJtYXgiLCJtaW4iLCJjdXJyZW50VGhyZXNob2xkIiwiYmVzdExvY2F0aW9uIiwibWF0Y2hNYXNrIiwibGFzdEluZGV4T2YiLCJsYXN0Qml0QXJyIiwiZmluYWxTY29yZSIsImJpbk1heCIsImJpbk1pbiIsImJpbk1pZCIsImZsb29yIiwiZmluaXNoIiwiYml0QXJyIiwiY2hhck1hdGNoIiwiYml0YXBTZWFyY2giLCJFcnJvciIsInRvTG93ZXJDYXNlIiwiaXNGb3JQYXR0ZXJuIiwic2FuaXRpemUiLCJzdWJzdHIiLCJzYW5pdGl6ZWRQYXR0ZXJuIiwiZXhhY3RNYXRjaCIsImludmVyc2VFeGFjdE1hdGNoIiwicHJlZml4RXhhY3RNYXRjaCIsImludmVyc2VQcmVmaXhFeGFjdE1hdGNoIiwic3VmZml4RXhhY3RNYXRjaCIsImludmVyc2VTdWZmaXhFeGFjdE1hdGNoIiwicXVlcnlmeSIsInNwbGl0IiwibWFwIiwidHJpbSIsInF1ZXJ5IiwiX2Z1enp5Q2FjaGUiLCJtYXRjaEZvdW5kIiwicUxlbiIsInBhcnRzIiwicExlbiIsInRva2VuIiwiX3NlYXJjaCIsInNlYXJjaCIsInN0YXJ0c1dpdGgiLCJzdWJzdHJpbmciLCJlbmRzV2l0aCIsInVuaW9uIiwiaW50ZXJzZWN0aW9uIiwiYXJyMSIsImFycjIiLCJpdGVtMSIsIml0ZW0yIiwiamFjY2FyZERpc3RhbmNlIiwibkdyYW0xIiwibkdyYW0yIiwibkdyYW1VbmlvbiIsIm5HcmFtSW50ZXJzZWN0aW9uIiwibmdyYW0iLCJwYXR0ZXJuTmdyYW0iLCJ0ZXh0TmdyYW0iLCJuZyIsImphY2FyZFJlc3VsdCIsIk5HUkFNX0xFTiIsIm4iLCJwYWQiLCJuR3JhbXMiLCJuZ3JhbXMiLCJpbmRleGVkTGlzdCIsInJlY29yZCIsInN1YlJlY29yZHMiLCJzdGFjayIsImFycmF5SW5kZXgiLCJwb3AiLCJzdWJSZWNvcmQiLCJhcnJMZW4iLCJfa2V5cyIsIl9rZXlOYW1lcyIsIl9sZW5ndGgiLCJfaGFzV2VpZ2h0cyIsImtleVdlaWdodHNUb3RhbCIsImhhc093blByb3BlcnR5Iiwia2V5TmFtZSIsIm5hbWUiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5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QUN0RSxHQUFWLEVBQWU7QUFDYlIsU0FBRyxDQUFDUSxHQUFKLEdBQVVzRSxLQUFLLENBQUN0RSxHQUFoQjtBQUNEOztBQUVELFFBQUlzRSxLQUFLLENBQUNKLEdBQU4sR0FBWSxDQUFDLENBQWpCLEVBQW9CO0FBQ2xCMUUsU0FBRyxDQUFDcUcsUUFBSixHQUFldkIsS0FBSyxDQUFDSixHQUFyQjtBQUNEOztBQUVEMEIsUUFBSSxDQUFDbEIsT0FBTCxDQUFhN0UsSUFBYixDQUFrQkwsR0FBbEI7QUFDRDtBQUNGLENBOUJELEM7Ozs7Ozs7Ozs7O0FDRkFGLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFDc0IsTUFBRCxFQUFTK0UsSUFBVCxFQUFrQjtBQUNqQ0EsTUFBSSxDQUFDckQsS0FBTCxHQUFhMUIsTUFBTSxDQUFDMEIsS0FBcEI7QUFDRCxDQUZELEMiLCJmaWxlIjoiZnVzZS5kZXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkZ1c2VcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRnVzZVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJGdXNlXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJjb25zdCB7XG4gIGlzRGVmaW5lZCxcbiAgaXNTdHJpbmcsXG4gIGlzTnVtYmVyLFxuICBpc0FycmF5LFxuICB0b1N0cmluZ1xufSA9IHJlcXVpcmUoJy4vdHlwZS1jaGVja2VycycpXG5cbm1vZHVsZS5leHBvcnRzID0gKG9iaiwgcGF0aCkgPT4ge1xuICBsZXQgbGlzdCA9IFtdXG4gIGxldCBhcnIgPSBmYWxzZVxuXG4gIGNvbnN0IF9nZXQgPSAob2JqLCBwYXRoKSA9PiB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICAvLyBJZiB0aGVyZSdzIG5vIHBhdGggbGVmdCwgd2UndmUgZ290dGVuIHRvIHRoZSBvYmplY3Qgd2UgY2FyZSBhYm91dC5cbiAgICAgIGxpc3QucHVzaChvYmopXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRvdEluZGV4ID0gcGF0aC5pbmRleE9mKCcuJylcblxuICAgICAgbGV0IGtleSA9IHBhdGhcbiAgICAgIGxldCByZW1haW5pbmcgPSBudWxsXG5cbiAgICAgIGlmIChkb3RJbmRleCAhPT0gLTEpIHtcbiAgICAgICAga2V5ID0gcGF0aC5zbGljZSgwLCBkb3RJbmRleClcbiAgICAgICAgcmVtYWluaW5nID0gcGF0aC5zbGljZShkb3RJbmRleCArIDEpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cblxuICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKCFyZW1haW5pbmcgJiYgKGlzU3RyaW5nKHZhbHVlKSB8fCBpc051bWJlcih2YWx1ZSkpKSB7XG4gICAgICAgICAgbGlzdC5wdXNoKHRvU3RyaW5nKHZhbHVlKSlcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGFyciA9IHRydWVcbiAgICAgICAgICAvLyBTZWFyY2ggZWFjaCBpdGVtIGluIHRoZSBhcnJheS5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIF9nZXQodmFsdWVbaV0sIHJlbWFpbmluZylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVtYWluaW5nKSB7XG4gICAgICAgICAgLy8gQW4gb2JqZWN0LiBSZWN1cnNlIGZ1cnRoZXIuXG4gICAgICAgICAgX2dldCh2YWx1ZSwgcmVtYWluaW5nKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2dldChvYmosIHBhdGgpXG5cbiAgaWYgKGFycikge1xuICAgIHJldHVybiBsaXN0XG4gIH1cblxuICByZXR1cm4gbGlzdFswXVxufSIsImNvbnN0IElORklOSVRZID0gMSAvIDBcblxuY29uc3QgaXNBcnJheSA9IHZhbHVlID0+ICFBcnJheS5pc0FycmF5XG4gID8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICA6IEFycmF5LmlzQXJyYXkodmFsdWUpXG5cbi8vIEFkYXB0ZWQgZnJvbTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvZjRjYTM5NmE3OTY0MzU0MjJiZDRmZDQxZmFkYmQyMjVlZGRkZjE3NS8uaW50ZXJuYWwvYmFzZVRvU3RyaW5nLmpzXG5jb25zdCBiYXNlVG9TdHJpbmcgPSB2YWx1ZSA9PiB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgbGV0IHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5jb25zdCB0b1N0cmluZyA9IHZhbHVlID0+IHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG5cbmNvbnN0IGlzU3RyaW5nID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuXG5jb25zdCBpc051bWJlciA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcidcblxuY29uc3QgaXNPYmplY3QgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG5cbmNvbnN0IGlzRGVmaW5lZCA9IHZhbHVlID0+IHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRGVmaW5lZCxcbiAgaXNBcnJheSxcbiAgaXNTdHJpbmcsXG4gIGlzTnVtYmVyLFxuICBpc09iamVjdCxcbiAgdG9TdHJpbmdcbn1cbiIsIlxuY29uc3QgeyBCaXRhcFNlYXJjaCwgRXh0ZW5kZWRTZWFyY2gsIE5HcmFtU2VhcmNoIH0gPSByZXF1aXJlKCcuL3NlYXJjaCcpXG5jb25zdCB7IGlzQXJyYXksIGlzRGVmaW5lZCwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc09iamVjdCB9ID0gcmVxdWlyZSgnLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuY29uc3QgZ2V0ID0gcmVxdWlyZSgnLi9oZWxwZXJzL2dldCcpXG5jb25zdCB7IGNyZWF0ZUluZGV4LCBLZXlTdG9yZSB9ID0gcmVxdWlyZSgnLi90b29scycpXG5jb25zdCB7IHRyYW5zZm9ybU1hdGNoZXMsIHRyYW5zZm9ybVNjb3JlIH0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybScpXG5jb25zdCB7IE1BWF9CSVRTIH0gPSByZXF1aXJlKCcuL3NlYXJjaC9iaXRhcC1zZWFyY2gvY29uc3RhbnRzJylcblxuLy8gLy8gV2lsbCBwcmludCB0byB0aGUgY29uc29sZS4gVXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4vLyBmdW5jdGlvbiBkZWJ1ZygpIHtcbi8vICAgaWYgKEZ1c2UudmVyYm9zZSkge1xuLy8gICAgIGNvbnNvbGUubG9nKC4uLmFyZ3VtZW50cylcbi8vICAgICAvLyBjb25zdCB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG4vLyAgICAgLy8gY29uc29sZS5sb2codXRpbC5pbnNwZWN0KC4uLmFyZ3VtZW50cywgZmFsc2UsIG51bGwsIHRydWUgLyogZW5hYmxlIGNvbG9ycyAqLykpXG4vLyAgIH1cbi8vIH1cblxuLy8gZnVuY3Rpb24gZGVidWdUaW1lKHZhbHVlKSB7XG4vLyAgIGlmIChGdXNlLnZlcmJvc2VUaW1lKSB7XG4vLyAgICAgY29uc29sZS50aW1lKHZhbHVlKVxuLy8gICB9XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGRlYnVnVGltZUVuZCh2YWx1ZSkge1xuLy8gICBpZiAoRnVzZS52ZXJib3NlVGltZSkge1xuLy8gICAgIGNvbnNvbGUudGltZUVuZCh2YWx1ZSlcbi8vICAgfVxuLy8gfVxuXG5sZXQgRnVzZU9wdGlvbnMgPSB7XG4gIC8vIFdoZW4gdHJ1ZSwgdGhlIGFsZ29yaXRobSBjb250aW51ZXMgc2VhcmNoaW5nIHRvIHRoZSBlbmQgb2YgdGhlIGlucHV0IGV2ZW4gaWYgYSBwZXJmZWN0XG4gIC8vIG1hdGNoIGlzIGZvdW5kIGJlZm9yZSB0aGUgZW5kIG9mIHRoZSBzYW1lIGlucHV0LlxuICBpc0Nhc2VTZW5zaXRpdmU6IGZhbHNlLFxuICAvLyBEZXRlcm1pbmVzIGhvdyBjbG9zZSB0aGUgbWF0Y2ggbXVzdCBiZSB0byB0aGUgZnV6enkgbG9jYXRpb24gKHNwZWNpZmllZCBhYm92ZSkuXG4gIC8vIEFuIGV4YWN0IGxldHRlciBtYXRjaCB3aGljaCBpcyAnZGlzdGFuY2UnIGNoYXJhY3RlcnMgYXdheSBmcm9tIHRoZSBmdXp6eSBsb2NhdGlvblxuICAvLyB3b3VsZCBzY29yZSBhcyBhIGNvbXBsZXRlIG1pc21hdGNoLiBBIGRpc3RhbmNlIG9mICcwJyByZXF1aXJlcyB0aGUgbWF0Y2ggYmUgYXRcbiAgLy8gdGhlIGV4YWN0IGxvY2F0aW9uIHNwZWNpZmllZCwgYSB0aHJlc2hvbGQgb2YgJzEwMDAnIHdvdWxkIHJlcXVpcmUgYSBwZXJmZWN0IG1hdGNoXG4gIC8vIHRvIGJlIHdpdGhpbiA4MDAgY2hhcmFjdGVycyBvZiB0aGUgZnV6enkgbG9jYXRpb24gdG8gYmUgZm91bmQgdXNpbmcgYSAwLjggdGhyZXNob2xkLlxuICBkaXN0YW5jZTogMTAwLFxuICAvLyBNaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgbXVzdCBiZSBtYXRjaGVkIGJlZm9yZSBhIHJlc3VsdCBpcyBjb25zaWRlcmVkIGEgbWF0Y2hcbiAgZmluZEFsbE1hdGNoZXM6IGZhbHNlLFxuICAvLyBUaGUgZ2V0IGZ1bmN0aW9uIHRvIHVzZSB3aGVuIGZldGNoaW5nIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIFRoZSBkZWZhdWx0IHdpbGwgc2VhcmNoIG5lc3RlZCBwYXRocyAqaWUgZm9vLmJhci5iYXoqXG4gIGdldEZuOiBnZXQsXG4gIGluY2x1ZGVNYXRjaGVzOiBmYWxzZSxcbiAgaW5jbHVkZVNjb3JlOiBmYWxzZSxcbiAgLy8gTGlzdCBvZiBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSBzZWFyY2hlZC4gVGhpcyBhbHNvIHN1cHBvcnRzIG5lc3RlZCBwcm9wZXJ0aWVzLlxuICBrZXlzOiBbXSxcbiAgLy8gQXBwcm94aW1hdGVseSB3aGVyZSBpbiB0aGUgdGV4dCBpcyB0aGUgcGF0dGVybiBleHBlY3RlZCB0byBiZSBmb3VuZD9cbiAgbG9jYXRpb246IDAsXG4gIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICBtaW5NYXRjaENoYXJMZW5ndGg6IDEsXG4gIC8vIFdoZXRoZXIgdG8gc29ydCB0aGUgcmVzdWx0IGxpc3QsIGJ5IHNjb3JlXG4gIHNob3VsZFNvcnQ6IHRydWUsXG4gIC8vIERlZmF1bHQgc29ydCBmdW5jdGlvblxuICBzb3J0Rm46IChhLCBiKSA9PiAoYS5zY29yZSAtIGIuc2NvcmUpLFxuICAvLyBBdCB3aGF0IHBvaW50IGRvZXMgdGhlIG1hdGNoIGFsZ29yaXRobSBnaXZlIHVwLiBBIHRocmVzaG9sZCBvZiAnMC4wJyByZXF1aXJlcyBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gKG9mIGJvdGggbGV0dGVycyBhbmQgbG9jYXRpb24pLCBhIHRocmVzaG9sZCBvZiAnMS4wJyB3b3VsZCBtYXRjaCBhbnl0aGluZy5cbiAgdGhyZXNob2xkOiAwLjYsXG4gIC8vIEVuYWJsZWQgZXh0ZW5kZWQtc2VhcmNoaW5nXG4gIHVzZUV4dGVuZGVkU2VhcmNoOiBmYWxzZVxufVxuXG5jbGFzcyBGdXNlIHtcbiAgY29uc3RydWN0b3IobGlzdCwgb3B0aW9ucyA9IEZ1c2VPcHRpb25zLCBpbmRleCA9IG51bGwpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7IC4uLkZ1c2VPcHRpb25zLCAuLi5vcHRpb25zIH1cbiAgICAvLyBgY2FzZVNlbnNpdGl2ZWAgaXMgZGVwcmVjYXRlZCwgdXNlIGBpc0Nhc2VTZW5zaXRpdmVgIGluc3RlYWRcbiAgICB0aGlzLm9wdGlvbnMuaXNDYXNlU2Vuc2l0aXZlID0gb3B0aW9ucy5jYXNlU2Vuc2l0aXZlXG4gICAgZGVsZXRlIHRoaXMub3B0aW9ucy5jYXNlU2Vuc2l0aXZlXG5cbiAgICAvLyBkZWJ1Z1RpbWUoJ0NvbnN0cnVjdGluZycpXG4gICAgdGhpcy5fcHJvY2Vzc0tleXModGhpcy5vcHRpb25zLmtleXMpXG4gICAgdGhpcy5zZXRDb2xsZWN0aW9uKGxpc3QsIGluZGV4KVxuICAgIC8vIGRlYnVnVGltZUVuZCgnQ29uc3RydWN0aW5nJylcbiAgfVxuXG4gIHNldENvbGxlY3Rpb24obGlzdCwgaW5kZXggPSBudWxsKSB7XG4gICAgdGhpcy5saXN0ID0gbGlzdFxuICAgIHRoaXMubGlzdElzU3RyaW5nQXJyYXkgPSBpc1N0cmluZyhsaXN0WzBdKVxuXG4gICAgaWYgKGluZGV4KSB7XG4gICAgICB0aGlzLnNldEluZGV4KGluZGV4KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWJ1Z1RpbWUoJ1Byb2Nlc3MgaW5kZXgnKVxuICAgICAgdGhpcy5zZXRJbmRleCh0aGlzLl9jcmVhdGVJbmRleCgpKVxuICAgICAgLy8gZGVidWdUaW1lRW5kKCdQcm9jZXNzIGluZGV4JylcbiAgICB9XG4gIH1cblxuICBzZXRJbmRleChsaXN0SW5kZXgpIHtcbiAgICB0aGlzLl9pbmRleGVkTGlzdCA9IGxpc3RJbmRleFxuICAgIC8vIGRlYnVnKGxpc3RJbmRleClcbiAgfVxuXG4gIF9wcm9jZXNzS2V5cyhrZXlzKSB7XG4gICAgdGhpcy5fa2V5U3RvcmUgPSBuZXcgS2V5U3RvcmUoa2V5cylcblxuICAgIC8vIGRlYnVnKCdQcm9jZXNzIEtleXMnKVxuICAgIGlmIChGdXNlLnZlcmJvc2UpIHtcbiAgICAgIC8vIGRlYnVnKHRoaXMuX2tleVN0b3JlLnRvSlNPTigpKVxuICAgIH1cbiAgfVxuXG4gIF9jcmVhdGVJbmRleCgpIHtcbiAgICByZXR1cm4gY3JlYXRlSW5kZXgodGhpcy5fa2V5U3RvcmUua2V5cygpLCB0aGlzLmxpc3QsIHtcbiAgICAgIGdldEZuOiB0aGlzLm9wdGlvbnMuZ2V0Rm5cbiAgICB9KVxuICB9XG5cbiAgc2VhcmNoKHBhdHRlcm4sIG9wdHMgPSB7IGxpbWl0OiBmYWxzZSB9KSB7XG4gICAgLy8gZGVidWcoYC0tLS0tLS0tLSBTZWFyY2ggcGF0dGVybjogXCIke3BhdHRlcm59XCJgKVxuICAgIGNvbnN0IHsgdXNlRXh0ZW5kZWRTZWFyY2gsIHNob3VsZFNvcnQgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgbGV0IHNlYXJjaGVyID0gbnVsbFxuXG4gICAgaWYgKHVzZUV4dGVuZGVkU2VhcmNoKSB7XG4gICAgICBzZWFyY2hlciA9IG5ldyBFeHRlbmRlZFNlYXJjaChwYXR0ZXJuLCB0aGlzLm9wdGlvbnMpXG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuLmxlbmd0aCA+IE1BWF9CSVRTKSB7XG4gICAgICBzZWFyY2hlciA9IG5ldyBOR3JhbVNlYXJjaChwYXR0ZXJuLCB0aGlzLm9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IEJpdGFwU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9XG5cbiAgICAvLyBkZWJ1Z1RpbWUoJ1NlYXJjaCB0aW1lJyk7XG4gICAgbGV0IHJlc3VsdHMgPSB0aGlzLl9zZWFyY2hVc2luZyhzZWFyY2hlcilcbiAgICAvLyBkZWJ1Z1RpbWVFbmQoJ1NlYXJjaCB0aW1lJyk7XG5cbiAgICAvLyBkZWJ1Z1RpbWUoJ0NvbXB1dGUgc2NvcmUgdGltZScpO1xuICAgIHRoaXMuX2NvbXB1dGVTY29yZShyZXN1bHRzKVxuICAgIC8vIGRlYnVnVGltZUVuZCgnQ29tcHV0ZSBzY29yZSB0aW1lJyk7XG5cbiAgICBpZiAoc2hvdWxkU29ydCkge1xuICAgICAgdGhpcy5fc29ydChyZXN1bHRzKVxuICAgIH1cblxuICAgIGlmIChvcHRzLmxpbWl0ICYmIGlzTnVtYmVyKG9wdHMubGltaXQpKSB7XG4gICAgICByZXN1bHRzID0gcmVzdWx0cy5zbGljZSgwLCBvcHRzLmxpbWl0KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mb3JtYXQocmVzdWx0cylcbiAgfVxuXG4gIF9zZWFyY2hVc2luZyhzZWFyY2hlcikge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLl9pbmRleGVkTGlzdFxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXVxuICAgIGNvbnN0IHsgaW5jbHVkZU1hdGNoZXMgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgLy8gTGlzdCBpcyBBcnJheTxTdHJpbmc+XG4gICAgaWYgKHRoaXMubGlzdElzU3RyaW5nQXJyYXkpIHtcbiAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBzdHJpbmcgaW4gdGhlIGxpc3RcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGxpc3RbaV1cbiAgICAgICAgbGV0IHsgJDogdGV4dCwgaWR4IH0gPSB2YWx1ZVxuXG4gICAgICAgIGlmICghaXNEZWZpbmVkKHRleHQpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZWFyY2hSZXN1bHQgPSBzZWFyY2hlci5zZWFyY2hJbih2YWx1ZSlcblxuICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoID0geyBzY29yZSwgdmFsdWU6IHRleHQgfVxuXG4gICAgICAgIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgICAgICAgIG1hdGNoLmluZGljZXMgPSBzZWFyY2hSZXN1bHQubWF0Y2hlZEluZGljZXNcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgaXRlbTogdGV4dCxcbiAgICAgICAgICBpZHgsXG4gICAgICAgICAgbWF0Y2hlczogW21hdGNoXVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3QgaXMgQXJyYXk8T2JqZWN0PlxuICAgICAgY29uc3Qga2V5TmFtZXMgPSB0aGlzLl9rZXlTdG9yZS5rZXlzKClcbiAgICAgIGNvbnN0IGtleXNMZW4gPSB0aGlzLl9rZXlTdG9yZS5jb3VudCgpXG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGxldCB7ICQ6IGl0ZW0sIGlkeCB9ID0gbGlzdFtpXVxuXG4gICAgICAgIGlmICghaXNEZWZpbmVkKGl0ZW0pKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaGVzID0gW11cblxuICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkga2V5IChpLmUsIHBhdGgpLCBhbmQgZmV0Y2ggdGhlIHZhbHVlIGF0IHRoYXQga2V5XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwga2V5c0xlbjsgaiArPSAxKSB7XG4gICAgICAgICAgbGV0IGtleSA9IGtleU5hbWVzW2pdXG4gICAgICAgICAgbGV0IHZhbHVlID0gaXRlbVtrZXldXG5cbiAgICAgICAgICAvLyBkZWJ1ZyhgIEtleTogJHtrZXkgPT09ICcnID8gJy0tJyA6IGtleX1gKVxuXG4gICAgICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDsgayA8IGxlbjsgayArPSAxKSB7XG4gICAgICAgICAgICAgIGxldCBhcnJJdGVtID0gdmFsdWVba11cbiAgICAgICAgICAgICAgbGV0IHRleHQgPSBhcnJJdGVtLiRcbiAgICAgICAgICAgICAgbGV0IGlkeCA9IGFyckl0ZW0uaWR4XG5cbiAgICAgICAgICAgICAgaWYgKCFpc0RlZmluZWQodGV4dCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKGFyckl0ZW0pXG5cbiAgICAgICAgICAgICAgY29uc3QgeyBpc01hdGNoLCBzY29yZSB9ID0gc2VhcmNoUmVzdWx0XG5cbiAgICAgICAgICAgICAgLy8gZGVidWcoYEZ1bGwgdGV4dDogXCIke3RleHR9XCIsIHNjb3JlOiAke3Njb3JlfWApXG5cbiAgICAgICAgICAgICAgaWYgKCFpc01hdGNoKSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxldCBtYXRjaCA9IHsgc2NvcmUsIGtleSwgdmFsdWU6IHRleHQsIGlkeCB9XG5cbiAgICAgICAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2guaW5kaWNlcyA9IHNlYXJjaFJlc3VsdC5tYXRjaGVkSW5kaWNlc1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG1hdGNoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IHZhbHVlLiRcbiAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHQgPSBzZWFyY2hlci5zZWFyY2hJbih2YWx1ZSlcblxuICAgICAgICAgICAgY29uc3QgeyBpc01hdGNoLCBzY29yZSB9ID0gc2VhcmNoUmVzdWx0XG5cbiAgICAgICAgICAgIC8vIGRlYnVnKGBGdWxsIHRleHQ6IFwiJHt0ZXh0fVwiLCBzY29yZTogJHtzY29yZX1gKVxuXG4gICAgICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IG1hdGNoID0geyBzY29yZSwga2V5LCB2YWx1ZTogdGV4dCB9XG5cbiAgICAgICAgICAgIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgICAgICAgICAgICBtYXRjaC5pbmRpY2VzID0gc2VhcmNoUmVzdWx0Lm1hdGNoZWRJbmRpY2VzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGNoZXMucHVzaChtYXRjaClcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgaWR4LFxuICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgIG1hdGNoZXNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVidWcoXCItLS0tLS0tLS0gUkVTVUxUUyAtLS0tLS0tLS0tLVwiKVxuICAgIC8vIGRlYnVnKHJlc3VsdHMpXG4gICAgLy8gZGVidWcoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuXG4gIF9jb21wdXRlU2NvcmUocmVzdWx0cykge1xuICAgIC8vIGRlYnVnKCdDb21wdXRpbmcgc2NvcmU6ICcpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXVxuICAgICAgY29uc3QgbWF0Y2hlcyA9IHJlc3VsdC5tYXRjaGVzXG4gICAgICBjb25zdCBzY29yZUxlbiA9IG1hdGNoZXMubGVuZ3RoXG5cbiAgICAgIGxldCB0b3RhbFdlaWdodGVkU2NvcmUgPSAxXG4gICAgICAvLyBsZXQgYmVzdFNjb3JlID0gLTFcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzY29yZUxlbjsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBtYXRjaGVzW2pdXG4gICAgICAgIGNvbnN0IGtleSA9IGl0ZW0ua2V5XG4gICAgICAgIGNvbnN0IGtleVdlaWdodCA9IHRoaXMuX2tleVN0b3JlLmdldChrZXksICd3ZWlnaHQnKVxuICAgICAgICBjb25zdCB3ZWlnaHQgPSBrZXlXZWlnaHQgfHwgMVxuICAgICAgICBjb25zdCBzY29yZSA9IGl0ZW0uc2NvcmUgPT09IDAgJiYga2V5V2VpZ2h0ICYmIGtleVdlaWdodCA+IDBcbiAgICAgICAgICA/IE51bWJlci5FUFNJTE9OXG4gICAgICAgICAgOiBpdGVtLnNjb3JlXG5cbiAgICAgICAgdG90YWxXZWlnaHRlZFNjb3JlICo9IE1hdGgucG93KHNjb3JlLCB3ZWlnaHQpXG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgYmVzdCBzY29yZS4uIGp1c3QgaW4gY2FzZVxuICAgICAgICAvLyBBY3R1YWxseSwgd2UncmUgbm90IHJlYWxseSB1c2luZyBpdC4uIGJ1dCBuZWVkIHRvIHRoaW5rIG9mIGEgd2F5IHRvIGluY29ycG9yYXRlIHRoaXNcbiAgICAgICAgLy8gYmVzdFNjb3JlID0gYmVzdFNjb3JlID09IC0xID8gaXRlbS5zY29yZSA6IE1hdGgubWluKGJlc3RTY29yZSwgaXRlbS5zY29yZSlcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnNjb3JlID0gdG90YWxXZWlnaHRlZFNjb3JlXG4gICAgICAvLyByZXN1bHQuJHNjb3JlID0gYmVzdFNjb3JlXG5cbiAgICAgIC8vIGRlYnVnKHJlc3VsdClcbiAgICB9XG4gIH1cblxuICBfc29ydChyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ1NvcnRpbmcuLi4uJylcbiAgICByZXN1bHRzLnNvcnQodGhpcy5vcHRpb25zLnNvcnRGbilcbiAgfVxuXG4gIF9mb3JtYXQocmVzdWx0cykge1xuICAgIGNvbnN0IGZpbmFsT3V0cHV0ID0gW11cblxuICAgIGNvbnN0IHsgaW5jbHVkZU1hdGNoZXMsIGluY2x1ZGVTY29yZSwgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgLy8gaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgIC8vICAgbGV0IGNhY2hlID0gW11cbiAgICAvLyAgIGRlYnVnKCdPdXRwdXQ6JywgSlNPTi5zdHJpbmdpZnkocmVzdWx0cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAvLyAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgLy8gICAgICAgaWYgKGNhY2hlLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgIC8vICAgICAgICAgLy8gQ2lyY3VsYXIgcmVmZXJlbmNlIGZvdW5kLCBkaXNjYXJkIGtleVxuICAgIC8vICAgICAgICAgcmV0dXJuXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIC8vIFN0b3JlIHZhbHVlIGluIG91ciBjb2xsZWN0aW9uXG4gICAgLy8gICAgICAgY2FjaGUucHVzaCh2YWx1ZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gdmFsdWVcbiAgICAvLyAgIH0sIDIpKVxuICAgIC8vICAgY2FjaGUgPSBudWxsXG4gICAgLy8gfVxuXG4gICAgbGV0IHRyYW5zZm9ybWVycyA9IFtdXG5cbiAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHRyYW5zZm9ybWVycy5wdXNoKHRyYW5zZm9ybU1hdGNoZXMpXG4gICAgaWYgKGluY2x1ZGVTY29yZSkgdHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtU2NvcmUpXG5cbiAgICAvLyBkZWJ1ZyhcIj09PT09IFJFU1VMVFMgPT09PT09XCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIj09PT09PT09PT09PT09PT09PT09XCIpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXVxuXG4gICAgICAvLyBkZWJ1ZygncmVzdWx0JywgcmVzdWx0KVxuXG4gICAgICBjb25zdCB7IGlkeCB9ID0gcmVzdWx0XG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGl0ZW06IHRoaXMubGlzdFtpZHhdLFxuICAgICAgICByZWZJbmRleDogaWR4XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0cmFuc2Zvcm1lcnMubGVuZ3RoOyBqIDwgbGVuOyBqICs9IDEpIHtcbiAgICAgICAgICB0cmFuc2Zvcm1lcnNbal0ocmVzdWx0LCBkYXRhKVxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgZmluYWxPdXRwdXQucHVzaChkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBmaW5hbE91dHB1dFxuICB9XG59XG5cbkZ1c2UuY3JlYXRlSW5kZXggPSBjcmVhdGVJbmRleFxuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1c2VcbiIsIm1vZHVsZS5leHBvcnRzID0gKG1hdGNobWFzayA9IFtdLCBtaW5NYXRjaENoYXJMZW5ndGggPSAxKSA9PiB7XG4gIGxldCBtYXRjaGVkSW5kaWNlcyA9IFtdXG4gIGxldCBzdGFydCA9IC0xXG4gIGxldCBlbmQgPSAtMVxuICBsZXQgaSA9IDBcblxuICBmb3IgKGxldCBsZW4gPSBtYXRjaG1hc2subGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBsZXQgbWF0Y2ggPSBtYXRjaG1hc2tbaV1cbiAgICBpZiAobWF0Y2ggJiYgc3RhcnQgPT09IC0xKSB7XG4gICAgICBzdGFydCA9IGlcbiAgICB9IGVsc2UgaWYgKCFtYXRjaCAmJiBzdGFydCAhPT0gLTEpIHtcbiAgICAgIGVuZCA9IGkgLSAxXG4gICAgICBpZiAoKGVuZCAtIHN0YXJ0KSArIDEgPj0gbWluTWF0Y2hDaGFyTGVuZ3RoKSB7XG4gICAgICAgIG1hdGNoZWRJbmRpY2VzLnB1c2goW3N0YXJ0LCBlbmRdKVxuICAgICAgfVxuICAgICAgc3RhcnQgPSAtMVxuICAgIH1cbiAgfVxuXG4gIC8vIChpLTEgLSBzdGFydCkgKyAxID0+IGkgLSBzdGFydFxuICBpZiAobWF0Y2htYXNrW2kgLSAxXSAmJiAoaSAtIHN0YXJ0KSA+PSBtaW5NYXRjaENoYXJMZW5ndGgpIHtcbiAgICBtYXRjaGVkSW5kaWNlcy5wdXNoKFtzdGFydCwgaSAtIDFdKTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVkSW5kaWNlc1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBwYXR0ZXJuID0+IHtcbiAgbGV0IG1hc2sgPSB7fVxuICBsZXQgbGVuID0gcGF0dGVybi5sZW5ndGhcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbWFza1twYXR0ZXJuLmNoYXJBdChpKV0gPSAwXG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbWFza1twYXR0ZXJuLmNoYXJBdChpKV0gfD0gMSA8PCAobGVuIC0gaSAtIDEpXG4gIH1cblxuICByZXR1cm4gbWFza1xufSIsIm1vZHVsZS5leHBvcnRzID0gKHBhdHRlcm4sIHsgZXJyb3JzID0gMCwgY3VycmVudExvY2F0aW9uID0gMCwgZXhwZWN0ZWRMb2NhdGlvbiA9IDAsIGRpc3RhbmNlID0gMTAwIH0pID0+IHtcbiAgY29uc3QgYWNjdXJhY3kgPSBlcnJvcnMgLyBwYXR0ZXJuLmxlbmd0aFxuICBjb25zdCBwcm94aW1pdHkgPSBNYXRoLmFicyhleHBlY3RlZExvY2F0aW9uIC0gY3VycmVudExvY2F0aW9uKVxuXG4gIGlmICghZGlzdGFuY2UpIHtcbiAgICAvLyBEb2RnZSBkaXZpZGUgYnkgemVybyBlcnJvci5cbiAgICByZXR1cm4gcHJveGltaXR5ID8gMS4wIDogYWNjdXJhY3lcbiAgfVxuXG4gIHJldHVybiBhY2N1cmFjeSArIChwcm94aW1pdHkgLyBkaXN0YW5jZSlcbn1cbiIsImNvbnN0IGJpdGFwU2NvcmUgPSByZXF1aXJlKCcuL2JpdGFwLXNjb3JlJylcbmNvbnN0IG1hdGNoZWRJbmRpY2VzID0gcmVxdWlyZSgnLi9iaXRhcC1tYXRjaGVkLWluZGljZXMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICh0ZXh0LCBwYXR0ZXJuLCBwYXR0ZXJuQWxwaGFiZXQsIHsgbG9jYXRpb24gPSAwLCBkaXN0YW5jZSA9IDEwMCwgdGhyZXNob2xkID0gMC42LCBmaW5kQWxsTWF0Y2hlcyA9IGZhbHNlLCBtaW5NYXRjaENoYXJMZW5ndGggPSAxLCBpbmNsdWRlTWF0Y2hlcyA9IGZhbHNlIH0pID0+IHtcbiAgY29uc3QgcGF0dGVybkxlbiA9IHBhdHRlcm4ubGVuZ3RoXG4gIC8vIFNldCBzdGFydGluZyBsb2NhdGlvbiBhdCBiZWdpbm5pbmcgdGV4dCBhbmQgaW5pdGlhbGl6ZSB0aGUgYWxwaGFiZXQuXG4gIGNvbnN0IHRleHRMZW4gPSB0ZXh0Lmxlbmd0aFxuICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBsb2NhdGlvbiA+IHRleHQubGVuZ3RoXG4gIGNvbnN0IGV4cGVjdGVkTG9jYXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsb2NhdGlvbiwgdGV4dExlbikpXG4gIC8vIEhpZ2hlc3Qgc2NvcmUgYmV5b25kIHdoaWNoIHdlIGdpdmUgdXAuXG4gIGxldCBjdXJyZW50VGhyZXNob2xkID0gdGhyZXNob2xkXG4gIC8vIElzIHRoZXJlIGEgbmVhcmJ5IGV4YWN0IG1hdGNoPyAoc3BlZWR1cClcbiAgbGV0IGJlc3RMb2NhdGlvbiA9IHRleHQuaW5kZXhPZihwYXR0ZXJuLCBleHBlY3RlZExvY2F0aW9uKVxuXG4gIC8vIGEgbWFzayBvZiB0aGUgbWF0Y2hlc1xuICBjb25zdCBtYXRjaE1hc2sgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRMZW47IGkgKz0gMSkge1xuICAgIG1hdGNoTWFza1tpXSA9IDBcbiAgfVxuXG4gIGlmIChiZXN0TG9jYXRpb24gIT09IC0xKSB7XG4gICAgbGV0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICBlcnJvcnM6IDAsXG4gICAgICBjdXJyZW50TG9jYXRpb246IGJlc3RMb2NhdGlvbixcbiAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBkaXN0YW5jZVxuICAgIH0pXG4gICAgY3VycmVudFRocmVzaG9sZCA9IE1hdGgubWluKHNjb3JlLCBjdXJyZW50VGhyZXNob2xkKVxuXG4gICAgLy8gV2hhdCBhYm91dCBpbiB0aGUgb3RoZXIgZGlyZWN0aW9uPyAoc3BlZWQgdXApXG4gICAgYmVzdExvY2F0aW9uID0gdGV4dC5sYXN0SW5kZXhPZihwYXR0ZXJuLCBleHBlY3RlZExvY2F0aW9uICsgcGF0dGVybkxlbilcblxuICAgIGlmIChiZXN0TG9jYXRpb24gIT09IC0xKSB7XG4gICAgICBsZXQgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgICAgZXJyb3JzOiAwLFxuICAgICAgICBjdXJyZW50TG9jYXRpb246IGJlc3RMb2NhdGlvbixcbiAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgZGlzdGFuY2VcbiAgICAgIH0pXG4gICAgICBjdXJyZW50VGhyZXNob2xkID0gTWF0aC5taW4oc2NvcmUsIGN1cnJlbnRUaHJlc2hvbGQpXG4gICAgfVxuICB9XG5cbiAgLy8gUmVzZXQgdGhlIGJlc3QgbG9jYXRpb25cbiAgYmVzdExvY2F0aW9uID0gLTFcblxuICBsZXQgbGFzdEJpdEFyciA9IFtdXG4gIGxldCBmaW5hbFNjb3JlID0gMVxuICBsZXQgYmluTWF4ID0gcGF0dGVybkxlbiArIHRleHRMZW5cblxuICBjb25zdCBtYXNrID0gMSA8PCAocGF0dGVybkxlbiA8PSAzMSA/IHBhdHRlcm5MZW4gLSAxIDogMzApXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuTGVuOyBpICs9IDEpIHtcbiAgICAvLyBTY2FuIGZvciB0aGUgYmVzdCBtYXRjaDsgZWFjaCBpdGVyYXRpb24gYWxsb3dzIGZvciBvbmUgbW9yZSBlcnJvci5cbiAgICAvLyBSdW4gYSBiaW5hcnkgc2VhcmNoIHRvIGRldGVybWluZSBob3cgZmFyIGZyb20gdGhlIG1hdGNoIGxvY2F0aW9uIHdlIGNhbiBzdHJheVxuICAgIC8vIGF0IHRoaXMgZXJyb3IgbGV2ZWwuXG4gICAgbGV0IGJpbk1pbiA9IDBcbiAgICBsZXQgYmluTWlkID0gYmluTWF4XG5cbiAgICB3aGlsZSAoYmluTWluIDwgYmluTWlkKSB7XG4gICAgICBjb25zdCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgICBlcnJvcnM6IGksXG4gICAgICAgIGN1cnJlbnRMb2NhdGlvbjogZXhwZWN0ZWRMb2NhdGlvbiArIGJpbk1pZCxcbiAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgZGlzdGFuY2VcbiAgICAgIH0pXG5cbiAgICAgIGlmIChzY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgIGJpbk1pbiA9IGJpbk1pZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluTWF4ID0gYmluTWlkXG4gICAgICB9XG5cbiAgICAgIGJpbk1pZCA9IE1hdGguZmxvb3IoKGJpbk1heCAtIGJpbk1pbikgLyAyICsgYmluTWluKVxuICAgIH1cblxuICAgIC8vIFVzZSB0aGUgcmVzdWx0IGZyb20gdGhpcyBpdGVyYXRpb24gYXMgdGhlIG1heGltdW0gZm9yIHRoZSBuZXh0LlxuICAgIGJpbk1heCA9IGJpbk1pZFxuXG4gICAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMSwgZXhwZWN0ZWRMb2NhdGlvbiAtIGJpbk1pZCArIDEpXG4gICAgbGV0IGZpbmlzaCA9IGZpbmRBbGxNYXRjaGVzID8gdGV4dExlbiA6IE1hdGgubWluKGV4cGVjdGVkTG9jYXRpb24gKyBiaW5NaWQsIHRleHRMZW4pICsgcGF0dGVybkxlblxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgYml0IGFycmF5XG4gICAgbGV0IGJpdEFyciA9IEFycmF5KGZpbmlzaCArIDIpXG5cbiAgICBiaXRBcnJbZmluaXNoICsgMV0gPSAoMSA8PCBpKSAtIDFcblxuICAgIGZvciAobGV0IGogPSBmaW5pc2g7IGogPj0gc3RhcnQ7IGogLT0gMSkge1xuICAgICAgbGV0IGN1cnJlbnRMb2NhdGlvbiA9IGogLSAxXG4gICAgICBsZXQgY2hhck1hdGNoID0gcGF0dGVybkFscGhhYmV0W3RleHQuY2hhckF0KGN1cnJlbnRMb2NhdGlvbildXG5cbiAgICAgIGlmIChjaGFyTWF0Y2gpIHtcbiAgICAgICAgbWF0Y2hNYXNrW2N1cnJlbnRMb2NhdGlvbl0gPSAxXG4gICAgICB9XG5cbiAgICAgIC8vIEZpcnN0IHBhc3M6IGV4YWN0IG1hdGNoXG4gICAgICBiaXRBcnJbal0gPSAoKGJpdEFycltqICsgMV0gPDwgMSkgfCAxKSAmIGNoYXJNYXRjaFxuXG4gICAgICAvLyBTdWJzZXF1ZW50IHBhc3NlczogZnV6enkgbWF0Y2hcbiAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgIGJpdEFycltqXSB8PSAoKChsYXN0Qml0QXJyW2ogKyAxXSB8IGxhc3RCaXRBcnJbal0pIDw8IDEpIHwgMSkgfCBsYXN0Qml0QXJyW2ogKyAxXVxuICAgICAgfVxuXG4gICAgICBpZiAoYml0QXJyW2pdICYgbWFzaykge1xuICAgICAgICBmaW5hbFNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICAgICAgZXJyb3JzOiBpLFxuICAgICAgICAgIGN1cnJlbnRMb2NhdGlvbixcbiAgICAgICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgICAgIGRpc3RhbmNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gVGhpcyBtYXRjaCB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmUgYmV0dGVyIHRoYW4gYW55IGV4aXN0aW5nIG1hdGNoLlxuICAgICAgICAvLyBCdXQgY2hlY2sgYW55d2F5LlxuICAgICAgICBpZiAoZmluYWxTY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gSW5kZWVkIGl0IGlzXG4gICAgICAgICAgY3VycmVudFRocmVzaG9sZCA9IGZpbmFsU2NvcmVcbiAgICAgICAgICBiZXN0TG9jYXRpb24gPSBjdXJyZW50TG9jYXRpb25cblxuICAgICAgICAgIC8vIEFscmVhZHkgcGFzc2VkIGBsb2NgLCBkb3duaGlsbCBmcm9tIGhlcmUgb24gaW4uXG4gICAgICAgICAgaWYgKGJlc3RMb2NhdGlvbiA8PSBleHBlY3RlZExvY2F0aW9uKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFdoZW4gcGFzc2luZyBgYmVzdExvY2F0aW9uYCwgZG9uJ3QgZXhjZWVkIG91ciBjdXJyZW50IGRpc3RhbmNlIGZyb20gYGV4cGVjdGVkTG9jYXRpb25gLlxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoMSwgMiAqIGV4cGVjdGVkTG9jYXRpb24gLSBiZXN0TG9jYXRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBObyBob3BlIGZvciBhIChiZXR0ZXIpIG1hdGNoIGF0IGdyZWF0ZXIgZXJyb3IgbGV2ZWxzLlxuICAgIGNvbnN0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICBlcnJvcnM6IGkgKyAxLFxuICAgICAgY3VycmVudExvY2F0aW9uOiBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlXG4gICAgfSlcblxuICAgIGlmIChzY29yZSA+IGN1cnJlbnRUaHJlc2hvbGQpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgbGFzdEJpdEFyciA9IGJpdEFyclxuICB9XG5cbiAgbGV0IHJlc3VsdCA9IHtcbiAgICBpc01hdGNoOiBiZXN0TG9jYXRpb24gPj0gMCxcbiAgICAvLyBDb3VudCBleGFjdCBtYXRjaGVzICh0aG9zZSB3aXRoIGEgc2NvcmUgb2YgMCkgdG8gYmUgXCJhbG1vc3RcIiBleGFjdFxuICAgIHNjb3JlOiAhZmluYWxTY29yZSA/IDAuMDAxIDogZmluYWxTY29yZSxcbiAgfVxuXG4gIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgIHJlc3VsdC5tYXRjaGVkSW5kaWNlcyA9IG1hdGNoZWRJbmRpY2VzKG1hdGNoTWFzaywgbWluTWF0Y2hDaGFyTGVuZ3RoKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuIiwiLy8gTWFjaGluZSB3b3JkIHNpemVcbm1vZHVsZS5leHBvcnRzLk1BWF9CSVRTID0gMzIiLCJjb25zdCBiaXRhcFNlYXJjaCA9IHJlcXVpcmUoJy4vYml0YXAtc2VhcmNoJylcbmNvbnN0IHBhdHRlcm5BbHBoYWJldCA9IHJlcXVpcmUoJy4vYml0YXAtcGF0dGVybi1hbHBoYWJldCcpXG5jb25zdCB7IE1BWF9CSVRTIH0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG5cbmNsYXNzIEJpdGFwU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwge1xuICAgIC8vIEFwcHJveGltYXRlbHkgd2hlcmUgaW4gdGhlIHRleHQgaXMgdGhlIHBhdHRlcm4gZXhwZWN0ZWQgdG8gYmUgZm91bmQ/XG4gICAgbG9jYXRpb24gPSAwLFxuICAgIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgICAvLyBBbiBleGFjdCBsZXR0ZXIgbWF0Y2ggd2hpY2ggaXMgJ2Rpc3RhbmNlJyBjaGFyYWN0ZXJzIGF3YXkgZnJvbSB0aGUgZnV6enkgbG9jYXRpb25cbiAgICAvLyB3b3VsZCBzY29yZSBhcyBhIGNvbXBsZXRlIG1pc21hdGNoLiBBIGRpc3RhbmNlIG9mICcwJyByZXF1aXJlcyB0aGUgbWF0Y2ggYmUgYXRcbiAgICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgICAvLyB0byBiZSB3aXRoaW4gODAwIGNoYXJhY3RlcnMgb2YgdGhlIGZ1enp5IGxvY2F0aW9uIHRvIGJlIGZvdW5kIHVzaW5nIGEgMC44IHRocmVzaG9sZC5cbiAgICBkaXN0YW5jZSA9IDEwMCxcbiAgICAvLyBBdCB3aGF0IHBvaW50IGRvZXMgdGhlIG1hdGNoIGFsZ29yaXRobSBnaXZlIHVwLiBBIHRocmVzaG9sZCBvZiAnMC4wJyByZXF1aXJlcyBhIHBlcmZlY3QgbWF0Y2hcbiAgICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICAgIHRocmVzaG9sZCA9IDAuNixcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciBjb21wYXJpc29ucyBzaG91bGQgYmUgY2FzZSBzZW5zaXRpdmUuXG4gICAgaXNDYXNlU2Vuc2l0aXZlID0gZmFsc2UsXG4gICAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgICAvLyBtYXRjaCBpcyBmb3VuZCBiZWZvcmUgdGhlIGVuZCBvZiB0aGUgc2FtZSBpbnB1dC5cbiAgICBmaW5kQWxsTWF0Y2hlcyA9IGZhbHNlLFxuICAgIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICAgIG1pbk1hdGNoQ2hhckxlbmd0aCA9IDEsXG5cbiAgICBpbmNsdWRlTWF0Y2hlcyA9IGZhbHNlXG4gIH0pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlLFxuICAgICAgdGhyZXNob2xkLFxuICAgICAgaXNDYXNlU2Vuc2l0aXZlLFxuICAgICAgZmluZEFsbE1hdGNoZXMsXG4gICAgICBpbmNsdWRlTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aFxuICAgIH1cblxuICAgIGlmIChwYXR0ZXJuLmxlbmd0aCA+IE1BWF9CSVRTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhdHRlcm4gbGVuZ3RoIGV4Y2VlZHMgbWF4IG9mICR7TUFYX0JJVFN9LmApO1xuICAgIH1cblxuICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcbiAgICB0aGlzLnBhdHRlcm5BbHBoYWJldCA9IHBhdHRlcm5BbHBoYWJldCh0aGlzLnBhdHRlcm4pXG4gIH1cblxuICBzZWFyY2hJbih2YWx1ZSkge1xuICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuXG4gICAgY29uc3QgeyBpc0Nhc2VTZW5zaXRpdmUsIGluY2x1ZGVNYXRjaGVzIH0gPSB0aGlzLm9wdGlvbnNcblxuICAgIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfVxuXG4gICAgLy8gRXhhY3QgbWF0Y2hcbiAgICBpZiAodGhpcy5wYXR0ZXJuID09PSB0ZXh0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICBpc01hdGNoOiB0cnVlLFxuICAgICAgICBzY29yZTogMFxuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgcmVzdWx0Lm1hdGNoZWRJbmRpY2VzID0gW1swLCB0ZXh0Lmxlbmd0aCAtIDFdXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCB1c2UgQml0YXAgYWxnb3JpdGhtXG4gICAgY29uc3QgeyBsb2NhdGlvbiwgZGlzdGFuY2UsIHRocmVzaG9sZCwgZmluZEFsbE1hdGNoZXMsIG1pbk1hdGNoQ2hhckxlbmd0aCB9ID0gdGhpcy5vcHRpb25zXG4gICAgcmV0dXJuIGJpdGFwU2VhcmNoKHRleHQsIHRoaXMucGF0dGVybiwgdGhpcy5wYXR0ZXJuQWxwaGFiZXQsIHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgZGlzdGFuY2UsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGluY2x1ZGVNYXRjaGVzXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJpdGFwU2VhcmNoXG4iLCIvLyBUb2tlbjogJ2ZpbGVcbi8vIE1hdGNoIHR5cGU6IGV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBpbmNsdWRlIGBmaWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09IFwiJ1wiXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpbmRleCA9IHRleHQuaW5kZXhPZihzYW5pdGl6ZWRQYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gaW5kZXggPiAtMVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMCxcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCJjb25zdCBleGFjdE1hdGNoID0gcmVxdWlyZSgnLi9leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlRXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1leGFjdC1tYXRjaCcpXG5jb25zdCBwcmVmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9wcmVmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IHN1ZmZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL3N1ZmZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgQml0YXBTZWFyY2ggPSByZXF1aXJlKCcuLi9iaXRhcC1zZWFyY2gnKVxuXG4vLyBSZXR1cm4gYSAyRCBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVlcnksIGZvciBzaW1wbGVyIHBhcnNpbmcuXG4vLyBFeGFtcGxlOlxuLy8gXCJeY29yZSBnbyQgfCByYiQgfCBweSQgeHkkXCIgPT4gW1tcIl5jb3JlXCIsIFwiZ28kXCJdLCBbXCJyYiRcIl0sIFtcInB5JFwiLCBcInh5JFwiXV1cbmNvbnN0IHF1ZXJ5ZnkgPSAocGF0dGVybikgPT4gcGF0dGVybi5zcGxpdCgnfCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpLnNwbGl0KC8gKy9nKSlcblxuLyoqXG4gKiBDb21tYW5kLWxpa2Ugc2VhcmNoaW5nXG4gKiA9PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogR2l2ZW4gbXVsdGlwbGUgc2VhcmNoIHRlcm1zIGRlbGltaXRlZCBieSBzcGFjZXMuZS5nLiBgXmpzY3JpcHQgLnB5dGhvbiQgcnVieSAhamF2YWAsXG4gKiBzZWFyY2ggaW4gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIFNlYXJjaCBzeW50YXg6XG4gKlxuICogfCBUb2tlbiAgICAgICB8IE1hdGNoIHR5cGUgICAgICAgICAgICAgICAgIHwgRGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAtLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBganNjcmlwdGAgICB8IGZ1enp5LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBtYXRjaCBganNjcmlwdGAgICAgICAgICAgICAgfFxuICogfCBgJ3B5dGhvbmAgICB8IGV4YWN0LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBpbmNsdWRlIGBweXRob25gICAgICAgICAgICAgfFxuICogfCBgIXJ1YnlgICAgICB8IGludmVyc2UtZXhhY3QtbWF0Y2ggICAgICAgIHwgSXRlbXMgdGhhdCBkbyBub3QgaW5jbHVkZSBgcnVieWAgICAgICAgfFxuICogfCBgXmphdmFgICAgICB8IHByZWZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBqYXZhYCAgICAgICAgICAgfFxuICogfCBgIV5lYXJsYW5nYCB8IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZWFybGFuZ2AgfFxuICogfCBgLmpzJGAgICAgICB8IHN1ZmZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBlbmQgd2l0aCBgLmpzYCAgICAgICAgICAgICAgfFxuICogfCBgIS5nbyRgICAgICB8IGludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3QgZW5kIHdpdGggYC5nb2AgICAgICAgfFxuICpcbiAqIEEgc2luZ2xlIHBpcGUgY2hhcmFjdGVyIGFjdHMgYXMgYW4gT1Igb3BlcmF0b3IuIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nXG4gKiBxdWVyeSBtYXRjaGVzIGVudHJpZXMgdGhhdCBzdGFydCB3aXRoIGBjb3JlYCBhbmQgZW5kIHdpdGggZWl0aGVyYGdvYCwgYHJiYCxcbiAqIG9yYHB5YC5cbiAqXG4gKiBgYGBcbiAqIF5jb3JlIGdvJCB8IHJiJCB8IHB5JFxuICogYGBgXG4gKi9cbmNsYXNzIEV4dGVuZGVkU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgaXNDYXNlU2Vuc2l0aXZlIH0gPSBvcHRpb25zXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcbiAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlmeSh0aGlzLnBhdHRlcm4pXG4gICAgLy8gQSA8cGF0dGVybj46PEJpdGFwU2VhcmNoPiBrZXktdmFsdWUgcGFpciBmb3Igb3B0aW1pemluZyBzZWFyY2hpbmdcbiAgICB0aGlzLl9mdXp6eUNhY2hlID0ge31cbiAgfVxuXG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgbGV0IHRleHQgPSB2YWx1ZS4kXG5cbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucXVlcnlcbiAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmlzQ2FzZVNlbnNpdGl2ZSA/IHRleHQgOiB0ZXh0LnRvTG93ZXJDYXNlKClcblxuICAgIGxldCBtYXRjaEZvdW5kID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAwLCBxTGVuID0gcXVlcnkubGVuZ3RoOyBpIDwgcUxlbjsgaSArPSAxKSB7XG5cbiAgICAgIGNvbnN0IHBhcnRzID0gcXVlcnlbaV1cbiAgICAgIGxldCByZXN1bHQgPSBudWxsXG4gICAgICBtYXRjaEZvdW5kID0gdHJ1ZVxuXG4gICAgICBmb3IgKGxldCBqID0gMCwgcExlbiA9IHBhcnRzLmxlbmd0aDsgaiA8IHBMZW47IGogKz0gMSkge1xuICAgICAgICBsZXQgdG9rZW4gPSBwYXJ0c1tqXVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9zZWFyY2godG9rZW4sIHRleHQpXG4gICAgICAgIGlmICghcmVzdWx0LmlzTWF0Y2gpIHtcbiAgICAgICAgICAvLyBBTkQgY29uZGl0aW9uLCBzaG9ydC1jaXJjdWl0IGFuZCBtb3ZlIG9uIHRvIG5leHQgcGFydFxuICAgICAgICAgIG1hdGNoRm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT1IgY29uZGl0aW9uLCBzbyBpZiBUUlVFLCByZXR1cm5cbiAgICAgIGlmIChtYXRjaEZvdW5kKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3RoaW5nIHdhcyBtYXRjaGVkXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2g6IGZhbHNlLFxuICAgICAgc2NvcmU6IDFcbiAgICB9XG4gIH1cblxuICBfc2VhcmNoKHBhdHRlcm4sIHRleHQpIHtcbiAgICBpZiAoZXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBleGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChwcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIHByZWZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoc3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBzdWZmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlRXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlRXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VhcmNoZXIgPSB0aGlzLl9mdXp6eUNhY2hlW3BhdHRlcm5dXG4gICAgICBpZiAoIXNlYXJjaGVyKSB7XG4gICAgICAgIHNlYXJjaGVyID0gbmV3IEJpdGFwU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICAgICAgdGhpcy5fZnV6enlDYWNoZVtwYXR0ZXJuXSA9IHNlYXJjaGVyXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VhcmNoZXIuc2VhcmNoKHRleHQpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXh0ZW5kZWRTZWFyY2giLCIvLyBUb2tlbjogIWZpcmVcbi8vIE1hdGNoIHR5cGU6IGludmVyc2UtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGRvIG5vdCBpbmNsdWRlIGBmaXJlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICchJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuaW5kZXhPZihzYW5pdGl6ZWRQYXR0ZXJuKSA9PT0gLTFcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCIvLyBUb2tlbjogIV5maXJlXG4vLyBNYXRjaCB0eXBlOiBpbnZlcnNlLXByZWZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggYGZpcmVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnICYmIHBhdHRlcm4uY2hhckF0KDEpID09ICdeJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMilcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9ICF0ZXh0LnN0YXJ0c1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCIvLyBUb2tlbjogIS5maWxlJFxuLy8gTWF0Y2ggdHlwZTogaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGRvIG5vdCBlbmQgd2l0aCBgLmZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnICYmIHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgPT0gJyQnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cmluZygxLCBwYXR0ZXJuLmxlbmd0aCAtIDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSAhdGV4dC5lbmRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiBeZmlsZVxuLy8gTWF0Y2ggdHlwZTogcHJlZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBmaWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICdeJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuc3RhcnRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAuZmlsZSRcbi8vIE1hdGNoIHR5cGU6IHN1ZmZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZW5kIHdpdGggYC5maWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgPT0gJyQnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigwLCBwYXR0ZXJuLmxlbmd0aCAtIDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LmVuZHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJpdGFwU2VhcmNoOiByZXF1aXJlKCcuL2JpdGFwLXNlYXJjaCcpLFxuICBFeHRlbmRlZFNlYXJjaDogcmVxdWlyZSgnLi9leHRlbmRlZC1zZWFyY2gnKSxcbiAgTkdyYW1TZWFyY2g6IHJlcXVpcmUoJy4vbmdyYW0tc2VhcmNoJylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdW5pb246IHJlcXVpcmUoJy4vdW5pb24nKSxcbiAgaW50ZXJzZWN0aW9uOiByZXF1aXJlKCcuL2ludGVyc2VjdGlvbicpXG59IiwiLy8gQXNzdW1lcyBhcnJheXMgYXJlIHNvcnRlZFxubW9kdWxlLmV4cG9ydHMgPSAoYXJyMSwgYXJyMikgPT4ge1xuICBsZXQgcmVzdWx0ID0gW11cbiAgbGV0IGkgPSAwXG4gIGxldCBqID0gMFxuXG4gIHdoaWxlIChpIDwgYXJyMS5sZW5ndGggJiYgaiA8IGFycjIubGVuZ3RoKSB7XG4gICAgbGV0IGl0ZW0xID0gYXJyMVtpXVxuICAgIGxldCBpdGVtMiA9IGFycjJbal1cblxuICAgIGlmIChpdGVtMSA9PSBpdGVtMikge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTEpXG4gICAgICBpICs9IDFcbiAgICAgIGogKz0gMVxuICAgIH0gZWxzZSBpZiAoaXRlbTEgPCBpdGVtMikge1xuICAgICAgaSArPSAxXG4gICAgfSBlbHNlIGlmIChpdGVtMSA+IGl0ZW0yKSB7XG4gICAgICBqICs9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSIsIi8vIEFzc3VtZXMgYXJyYXlzIGFyZSBzb3J0ZWRcbm1vZHVsZS5leHBvcnRzID0gKGFycjEsIGFycjIpID0+IHtcbiAgbGV0IHJlc3VsdCA9IFtdXG4gIGxldCBpID0gMFxuICBsZXQgaiA9IDBcblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoICYmIGogPCBhcnIyLmxlbmd0aCkge1xuICAgIGxldCBpdGVtMSA9IGFycjFbaV1cbiAgICBsZXQgaXRlbTIgPSBhcnIyW2pdXG5cbiAgICBpZiAoaXRlbTEgPCBpdGVtMikge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTEpXG4gICAgICBpICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0yIDwgaXRlbTEpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0yKVxuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0yKVxuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9XG4gIH1cblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnB1c2goYXJyMVtpXSlcbiAgICBpICs9IDFcbiAgfVxuXG4gIHdoaWxlIChqIDwgYXJyMi5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaChhcnIyW2pdKVxuICAgIGogKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBqYWNjYXJkRGlzdGFuY2U6IHJlcXVpcmUoJy4vamFjY2FyZC1kaXN0YW5jZScpXG59IiwiY29uc3QgeyB1bmlvbiwgaW50ZXJzZWN0aW9uIH0gPSByZXF1aXJlKCcuLi9hcnJheS11dGlscycpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5HcmFtMSwgbkdyYW0yKSA9PiB7XG4gIGxldCBuR3JhbVVuaW9uID0gdW5pb24obkdyYW0xLCBuR3JhbTIpXG4gIGxldCBuR3JhbUludGVyc2VjdGlvbiA9IGludGVyc2VjdGlvbihuR3JhbTEsIG5HcmFtMilcblxuICByZXR1cm4gMSAtIG5HcmFtSW50ZXJzZWN0aW9uLmxlbmd0aCAvIG5HcmFtVW5pb24ubGVuZ3RoXG59IiwiY29uc3QgbmdyYW0gPSByZXF1aXJlKCcuL25ncmFtJylcbmNvbnN0IHsgamFjY2FyZERpc3RhbmNlIH0gPSByZXF1aXJlKCcuL2Rpc3RhbmNlJylcblxuY2xhc3MgTkdyYW1TZWFyY2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBuZ3JhbSwgYW5kIHNvcnQgaXRcbiAgICB0aGlzLnBhdHRlcm5OZ3JhbSA9IG5ncmFtKHBhdHRlcm4sIHsgc29ydDogdHJ1ZSB9KVxuICB9XG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgbGV0IHRleHROZ3JhbSA9IHZhbHVlLm5nXG4gICAgaWYgKCF0ZXh0TmdyYW0pIHtcbiAgICAgIHRleHROZ3JhbSA9IG5ncmFtKHZhbHVlLiQsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgdmFsdWUubmcgPSB0ZXh0TmdyYW1cbiAgICB9XG5cbiAgICBsZXQgamFjYXJkUmVzdWx0ID0gamFjY2FyZERpc3RhbmNlKHRoaXMucGF0dGVybk5ncmFtLCB0ZXh0TmdyYW0pXG5cbiAgICByZXR1cm4ge1xuICAgICAgc2NvcmU6IGphY2FyZFJlc3VsdCxcbiAgICAgIGlzTWF0Y2g6IGphY2FyZFJlc3VsdCA8IDFcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOR3JhbVNlYXJjaCIsImNvbnN0IE5HUkFNX0xFTiA9IDNcblxubW9kdWxlLmV4cG9ydHMgPSAodGV4dCwgeyBuID0gTkdSQU1fTEVOLCBwYWQgPSB0cnVlLCBzb3J0ID0gZmFsc2UgfSkgPT4ge1xuICBsZXQgbkdyYW1zID0gW11cblxuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbkdyYW1zXG4gIH1cblxuICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpXG4gIGlmIChwYWQpIHtcbiAgICB0ZXh0ID0gYCAke3RleHR9IGBcbiAgfVxuXG4gIGxldCBpbmRleCA9IHRleHQubGVuZ3RoIC0gbiArIDFcbiAgaWYgKGluZGV4IDwgMSkge1xuICAgIHJldHVybiBuR3JhbXNcbiAgfVxuXG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgbkdyYW1zW2luZGV4XSA9IHRleHQuc3Vic3RyKGluZGV4LCBuKVxuICB9XG5cbiAgaWYgKHNvcnQpIHtcbiAgICBuR3JhbXMuc29ydCgoYSwgYikgPT4gYSA9PSBiID8gMCA6IGEgPCBiID8gLTEgOiAxKVxuICB9XG5cbiAgcmV0dXJuIG5HcmFtc1xufSIsImNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcbmNvbnN0IGdldCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvZ2V0JylcbmNvbnN0IG5ncmFtID0gcmVxdWlyZSgnLi4vc2VhcmNoL25ncmFtLXNlYXJjaC9uZ3JhbScpXG5cbm1vZHVsZS5leHBvcnRzID0gKGtleXMsIGxpc3QsIHsgZ2V0Rm4gPSBnZXQsIG5ncmFtcyA9IGZhbHNlIH0gPSB7fSkgPT4ge1xuICBsZXQgaW5kZXhlZExpc3QgPSBbXVxuXG4gIC8vIExpc3QgaXMgQXJyYXk8U3RyaW5nPlxuICBpZiAoaXNTdHJpbmcobGlzdFswXSkpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkgc3RyaW5nIGluIHRoZSBsaXN0XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbGlzdFtpXVxuXG4gICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAvLyBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICAvLyAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgbGV0IHJlY29yZCA9IHtcbiAgICAgICAgICAkOiB2YWx1ZSxcbiAgICAgICAgICBpZHg6IGlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZ3JhbXMpIHtcbiAgICAgICAgICByZWNvcmQubmcgPSBuZ3JhbSh2YWx1ZSwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpbmRleGVkTGlzdC5wdXNoKHJlY29yZClcbiAgICAgIH1cbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICAvLyBMaXN0IGlzIEFycmF5PE9iamVjdD5cbiAgICBjb25zdCBrZXlzTGVuID0ga2V5cy5sZW5ndGhcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgaXRlbSA9IGxpc3RbaV1cblxuICAgICAgbGV0IHJlY29yZCA9IHsgaWR4OiBpLCAkOiB7fSB9XG5cbiAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwga2V5c0xlbjsgaiArPSAxKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlzW2pdXG4gICAgICAgIGxldCB2YWx1ZSA9IGdldEZuKGl0ZW0sIGtleSlcblxuICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgbGV0IHN1YlJlY29yZHMgPSBbXVxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gW3sgYXJyYXlJbmRleDogLTEsIHZhbHVlIH1dXG5cbiAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB7IGFycmF5SW5kZXgsIHZhbHVlIH0gPSBzdGFjay5wb3AoKVxuXG4gICAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuXG4gICAgICAgICAgICAgIC8vIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgICAgICAgIC8vICAgdiA9IHYudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgbGV0IHN1YlJlY29yZCA9IHsgJDogdmFsdWUsIGlkeDogYXJyYXlJbmRleCB9XG5cbiAgICAgICAgICAgICAgaWYgKG5ncmFtcykge1xuICAgICAgICAgICAgICAgIHN1YlJlY29yZC5uZyA9IG5ncmFtKHZhbHVlLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHN1YlJlY29yZHMucHVzaChzdWJSZWNvcmQpXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGFyckxlbiA9IHZhbHVlLmxlbmd0aDsgayA8IGFyckxlbjsgayArPSAxKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICBhcnJheUluZGV4OiBrLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlW2tdLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVjb3JkLiRba2V5XSA9IHN1YlJlY29yZHNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICAgIC8vICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgbGV0IHN1YlJlY29yZCA9IHsgJDogdmFsdWUgfVxuXG4gICAgICAgICAgaWYgKG5ncmFtcykge1xuICAgICAgICAgICAgc3ViUmVjb3JkLm5nID0gbmdyYW0odmFsdWUsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlY29yZC4kW2tleV0gPSBzdWJSZWNvcmRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbmRleGVkTGlzdC5wdXNoKHJlY29yZClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXhlZExpc3Rcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlSW5kZXg6IHJlcXVpcmUoJy4vY3JlYXRlLWluZGV4JyksXG4gIEtleVN0b3JlOiByZXF1aXJlKCcuL2tleS1zdG9yZScpXG59IiwiY29uc3QgeyBpc1N0cmluZyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcblxuY2xhc3MgS2V5U3RvcmUge1xuICBjb25zdHJ1Y3RvcihrZXlzKSB7XG4gICAgdGhpcy5fa2V5cyA9IHt9XG4gICAgdGhpcy5fa2V5TmFtZXMgPSBbXVxuICAgIHRoaXMuX2xlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgdGhpcy5faGFzV2VpZ2h0cyA9IGZhbHNlXG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkga2V5XG4gICAgaWYgKGtleXMubGVuZ3RoICYmIGlzU3RyaW5nKGtleXNbMF0pKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0ge1xuICAgICAgICAgIHdlaWdodDogMVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2tleU5hbWVzLnB1c2goa2V5KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQga2V5V2VpZ2h0c1RvdGFsID0gMFxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cblxuICAgICAgICBpZiAoIWtleS5oYXNPd25Qcm9wZXJ0eSgnbmFtZScpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIFwibmFtZVwiIHByb3BlcnR5IGluIGtleSBvYmplY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5TmFtZSA9IGtleS5uYW1lXG4gICAgICAgIHRoaXMuX2tleU5hbWVzLnB1c2goa2V5TmFtZSlcblxuICAgICAgICBpZiAoIWtleS5oYXNPd25Qcm9wZXJ0eSgnd2VpZ2h0JykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgb2JqZWN0JylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtleVdlaWdodCA9IGtleS53ZWlnaHRcblxuICAgICAgICBpZiAoa2V5V2VpZ2h0IDw9IDAgfHwga2V5V2VpZ2h0ID49IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wid2VpZ2h0XCIgcHJvcGVydHkgaW4ga2V5IG11c3QgYmVpbiB0aGUgcmFuZ2Ugb2YgKDAsIDEpJylcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2tleXNba2V5TmFtZV0gPSB7XG4gICAgICAgICAgd2VpZ2h0OiBrZXlXZWlnaHRcbiAgICAgICAgfVxuXG4gICAgICAgIGtleVdlaWdodHNUb3RhbCArPSBrZXlXZWlnaHRcblxuICAgICAgICB0aGlzLl9oYXNXZWlnaHRzID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5V2VpZ2h0c1RvdGFsID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvdGFsIG9mIGtleVdlaWdodHMgY2Fubm90IGV4Y2VlZCAxJylcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0KGtleSwgbmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9rZXlzW2tleV0gPyB0aGlzLl9rZXlzW2tleV1bbmFtZV0gOiBudWxsXG4gIH1cbiAga2V5cygpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5TmFtZXNcbiAgfVxuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGVuZ3RoXG4gIH1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLl9rZXlzKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5U3RvcmUiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJhbnNmb3JtTWF0Y2hlczogcmVxdWlyZSgnLi90cmFuc2Zvcm0tbWF0Y2hlcycpLFxuICB0cmFuc2Zvcm1TY29yZTogcmVxdWlyZSgnLi90cmFuc2Zvcm0tc2NvcmUnKVxufSIsImNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzT2JqZWN0IH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXN1bHQsIGRhdGEpID0+IHtcbiAgY29uc3QgbWF0Y2hlcyA9IHJlc3VsdC5tYXRjaGVzXG4gIGRhdGEubWF0Y2hlcyA9IFtdXG5cbiAgaWYgKCFpc0RlZmluZWQobWF0Y2hlcykpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbGV0IG1hdGNoID0gbWF0Y2hlc1tpXVxuXG4gICAgaWYgKCFpc0RlZmluZWQobWF0Y2guaW5kaWNlcykgfHwgbWF0Y2guaW5kaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgbGV0IG9iaiA9IHtcbiAgICAgIGluZGljZXM6IG1hdGNoLmluZGljZXMsXG4gICAgICB2YWx1ZTogbWF0Y2gudmFsdWVcbiAgICB9XG5cbiAgICBpZiAobWF0Y2gua2V5KSB7XG4gICAgICBvYmoua2V5ID0gbWF0Y2gua2V5XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoLmlkeCA+IC0xKSB7XG4gICAgICBvYmoucmVmSW5kZXggPSBtYXRjaC5pZHhcbiAgICB9XG5cbiAgICBkYXRhLm1hdGNoZXMucHVzaChvYmopXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKHJlc3VsdCwgZGF0YSkgPT4ge1xuICBkYXRhLnNjb3JlID0gcmVzdWx0LnNjb3JlXG59Il0sInNvdXJjZVJvb3QiOiIifQ==