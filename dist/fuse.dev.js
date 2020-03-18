/*!
 * Fuse.js v5.0.4-beta - Lightweight fuzzy-search (http://fusejs.io)
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

var BitapSearch = __webpack_require__(/*! ../bitap-search */ "./src/search/bitap-search/index.js");

var _require = __webpack_require__(/*! ../../helpers/type-checkers */ "./src/helpers/type-checkers.js"),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Z1c2UvLi9zcmMvaGVscGVycy9nZXQuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9oZWxwZXJzL3R5cGUtY2hlY2tlcnMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtbWF0Y2hlZC1pbmRpY2VzLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1zY29yZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtc2VhcmNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9pbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9zdWZmaXgtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9hcnJheS11dGlscy9pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL3VuaW9uLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9kaXN0YW5jZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvZGlzdGFuY2UvamFjY2FyZC1kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvY3JlYXRlLWluZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90b29scy9rZXktc3RvcmUuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLW1hdGNoZXMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLXNjb3JlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJpc0RlZmluZWQiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNBcnJheSIsInRvU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIm9iaiIsInBhdGgiLCJsaXN0IiwiYXJyIiwiX2dldCIsInB1c2giLCJkb3RJbmRleCIsImluZGV4T2YiLCJrZXkiLCJyZW1haW5pbmciLCJzbGljZSIsInZhbHVlIiwiaSIsImxlbiIsImxlbmd0aCIsIklORklOSVRZIiwiQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJjYWxsIiwiYmFzZVRvU3RyaW5nIiwicmVzdWx0IiwiaXNPYmplY3QiLCJ1bmRlZmluZWQiLCJCaXRhcFNlYXJjaCIsIkV4dGVuZGVkU2VhcmNoIiwiTkdyYW1TZWFyY2giLCJnZXQiLCJjcmVhdGVJbmRleCIsIktleVN0b3JlIiwidHJhbnNmb3JtTWF0Y2hlcyIsInRyYW5zZm9ybVNjb3JlIiwiTUFYX0JJVFMiLCJGdXNlT3B0aW9ucyIsImlzQ2FzZVNlbnNpdGl2ZSIsImRpc3RhbmNlIiwiZmluZEFsbE1hdGNoZXMiLCJnZXRGbiIsImluY2x1ZGVNYXRjaGVzIiwiaW5jbHVkZVNjb3JlIiwia2V5cyIsImxvY2F0aW9uIiwibWluTWF0Y2hDaGFyTGVuZ3RoIiwic2hvdWxkU29ydCIsInNvcnRGbiIsImEiLCJiIiwic2NvcmUiLCJ0aHJlc2hvbGQiLCJ1c2VFeHRlbmRlZFNlYXJjaCIsIkZ1c2UiLCJvcHRpb25zIiwiaW5kZXgiLCJjYXNlU2Vuc2l0aXZlIiwiX3Byb2Nlc3NLZXlzIiwic2V0Q29sbGVjdGlvbiIsImxpc3RJc1N0cmluZ0FycmF5Iiwic2V0SW5kZXgiLCJfY3JlYXRlSW5kZXgiLCJsaXN0SW5kZXgiLCJfaW5kZXhlZExpc3QiLCJfa2V5U3RvcmUiLCJ2ZXJib3NlIiwicGF0dGVybiIsIm9wdHMiLCJsaW1pdCIsInNlYXJjaGVyIiwicmVzdWx0cyIsIl9zZWFyY2hVc2luZyIsIl9jb21wdXRlU2NvcmUiLCJfc29ydCIsIl9mb3JtYXQiLCJ0ZXh0IiwiJCIsImlkeCIsInNlYXJjaFJlc3VsdCIsInNlYXJjaEluIiwiaXNNYXRjaCIsIm1hdGNoIiwiaW5kaWNlcyIsIm1hdGNoZWRJbmRpY2VzIiwiaXRlbSIsIm1hdGNoZXMiLCJrZXlOYW1lcyIsImtleXNMZW4iLCJjb3VudCIsImoiLCJrIiwiYXJySXRlbSIsInNjb3JlTGVuIiwidG90YWxXZWlnaHRlZFNjb3JlIiwia2V5V2VpZ2h0Iiwid2VpZ2h0IiwiTnVtYmVyIiwiRVBTSUxPTiIsIk1hdGgiLCJwb3ciLCJzb3J0IiwiZmluYWxPdXRwdXQiLCJ0cmFuc2Zvcm1lcnMiLCJkYXRhIiwicmVmSW5kZXgiLCJtYXRjaG1hc2siLCJzdGFydCIsImVuZCIsIm1hc2siLCJjaGFyQXQiLCJlcnJvcnMiLCJjdXJyZW50TG9jYXRpb24iLCJleHBlY3RlZExvY2F0aW9uIiwiYWNjdXJhY3kiLCJwcm94aW1pdHkiLCJhYnMiLCJiaXRhcFNjb3JlIiwicGF0dGVybkFscGhhYmV0IiwicGF0dGVybkxlbiIsInRleHRMZW4iLCJtYXgiLCJtaW4iLCJjdXJyZW50VGhyZXNob2xkIiwiYmVzdExvY2F0aW9uIiwibWF0Y2hNYXNrIiwibGFzdEluZGV4T2YiLCJsYXN0Qml0QXJyIiwiZmluYWxTY29yZSIsImJpbk1heCIsImJpbk1pbiIsImJpbk1pZCIsImZsb29yIiwiZmluaXNoIiwiYml0QXJyIiwiY2hhck1hdGNoIiwiYml0YXBTZWFyY2giLCJFcnJvciIsInRvTG93ZXJDYXNlIiwiaXNGb3JQYXR0ZXJuIiwic2FuaXRpemUiLCJzdWJzdHIiLCJzYW5pdGl6ZWRQYXR0ZXJuIiwiZXhhY3RNYXRjaCIsImludmVyc2VFeGFjdE1hdGNoIiwicHJlZml4RXhhY3RNYXRjaCIsImludmVyc2VQcmVmaXhFeGFjdE1hdGNoIiwic3VmZml4RXhhY3RNYXRjaCIsImludmVyc2VTdWZmaXhFeGFjdE1hdGNoIiwicXVlcnlmeSIsInNwbGl0IiwibWFwIiwidHJpbSIsInF1ZXJ5IiwiX2Z1enp5Q2FjaGUiLCJtYXRjaEZvdW5kIiwicUxlbiIsInBhcnRzIiwicExlbiIsInRva2VuIiwiX3NlYXJjaCIsInNlYXJjaCIsInN0YXJ0c1dpdGgiLCJzdWJzdHJpbmciLCJlbmRzV2l0aCIsInVuaW9uIiwiaW50ZXJzZWN0aW9uIiwiYXJyMSIsImFycjIiLCJpdGVtMSIsIml0ZW0yIiwiamFjY2FyZERpc3RhbmNlIiwibkdyYW0xIiwibkdyYW0yIiwibkdyYW1VbmlvbiIsIm5HcmFtSW50ZXJzZWN0aW9uIiwibmdyYW0iLCJwYXR0ZXJuTmdyYW0iLCJ0ZXh0TmdyYW0iLCJuZyIsImphY2FyZFJlc3VsdCIsIk5HUkFNX0xFTiIsIm4iLCJwYWQiLCJuR3JhbXMiLCJuZ3JhbXMiLCJpbmRleGVkTGlzdCIsInJlY29yZCIsInN1YlJlY29yZHMiLCJzdGFjayIsImFycmF5SW5kZXgiLCJwb3AiLCJzdWJSZWNvcmQiLCJhcnJMZW4iLCJfa2V5cyIsIl9rZXlOYW1lcyIsIl9sZW5ndGgiLCJfaGFzV2VpZ2h0cyIsImtleVdlaWdodHNUb3RhbCIsImhhc093blByb3BlcnR5Iiwia2V5TmFtZSIsIm5hbWUiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5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SyxHQUFHSSxPQUFPLENBQUN0RSxDQUFELENBQW5COztBQUVBLFFBQUksQ0FBQ25CLFNBQVMsQ0FBQ3FGLEtBQUssQ0FBQ0MsT0FBUCxDQUFWLElBQTZCRCxLQUFLLENBQUNDLE9BQU4sQ0FBY2pFLE1BQWQsS0FBeUIsQ0FBMUQsRUFBNkQ7QUFDM0Q7QUFDRDs7QUFFRCxRQUFJZCxHQUFHLEdBQUc7QUFDUitFLGFBQU8sRUFBRUQsS0FBSyxDQUFDQyxPQURQO0FBRVJwRSxXQUFLLEVBQUVtRSxLQUFLLENBQUNuRTtBQUZMLEtBQVY7O0FBS0EsUUFBSW1FLEtBQUssQ0FBQ3RFLEdBQVYsRUFBZTtBQUNiUixTQUFHLENBQUNRLEdBQUosR0FBVXNFLEtBQUssQ0FBQ3RFLEdBQWhCO0FBQ0Q7O0FBRUQsUUFBSXNFLEtBQUssQ0FBQ0osR0FBTixHQUFZLENBQUMsQ0FBakIsRUFBb0I7QUFDbEIxRSxTQUFHLENBQUNxRyxRQUFKLEdBQWV2QixLQUFLLENBQUNKLEdBQXJCO0FBQ0Q7O0FBRUQwQixRQUFJLENBQUNsQixPQUFMLENBQWE3RSxJQUFiLENBQWtCTCxHQUFsQjtBQUNEO0FBQ0YsQ0E5QkQsQzs7Ozs7Ozs7Ozs7QUNGQUYsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUNzQixNQUFELEVBQVMrRSxJQUFULEVBQWtCO0FBQ2pDQSxNQUFJLENBQUNyRCxLQUFMLEdBQWExQixNQUFNLENBQUMwQixLQUFwQjtBQUNELENBRkQsQyIsImZpbGUiOiJmdXNlLmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRnVzZVwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJGdXNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkZ1c2VcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImNvbnN0IHtcbiAgaXNEZWZpbmVkLFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzQXJyYXksXG4gIHRvU3RyaW5nXG59ID0gcmVxdWlyZSgnLi90eXBlLWNoZWNrZXJzJylcblxubW9kdWxlLmV4cG9ydHMgPSAob2JqLCBwYXRoKSA9PiB7XG4gIGxldCBsaXN0ID0gW11cbiAgbGV0IGFyciA9IGZhbHNlXG5cbiAgY29uc3QgX2dldCA9IChvYmosIHBhdGgpID0+IHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gcGF0aCBsZWZ0LCB3ZSd2ZSBnb3R0ZW4gdG8gdGhlIG9iamVjdCB3ZSBjYXJlIGFib3V0LlxuICAgICAgbGlzdC5wdXNoKG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZG90SW5kZXggPSBwYXRoLmluZGV4T2YoJy4nKVxuXG4gICAgICBsZXQga2V5ID0gcGF0aFxuICAgICAgbGV0IHJlbWFpbmluZyA9IG51bGxcblxuICAgICAgaWYgKGRvdEluZGV4ICE9PSAtMSkge1xuICAgICAgICBrZXkgPSBwYXRoLnNsaWNlKDAsIGRvdEluZGV4KVxuICAgICAgICByZW1haW5pbmcgPSBwYXRoLnNsaWNlKGRvdEluZGV4ICsgMSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuXG4gICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICBpZiAoIXJlbWFpbmluZyAmJiAoaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSkpIHtcbiAgICAgICAgICBsaXN0LnB1c2godG9TdHJpbmcodmFsdWUpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgYXJyID0gdHJ1ZVxuICAgICAgICAgIC8vIFNlYXJjaCBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5LlxuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgX2dldCh2YWx1ZVtpXSwgcmVtYWluaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZW1haW5pbmcpIHtcbiAgICAgICAgICAvLyBBbiBvYmplY3QuIFJlY3Vyc2UgZnVydGhlci5cbiAgICAgICAgICBfZ2V0KHZhbHVlLCByZW1haW5pbmcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZ2V0KG9iaiwgcGF0aClcblxuICBpZiAoYXJyKSB7XG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIHJldHVybiBsaXN0WzBdXG59IiwiY29uc3QgSU5GSU5JVFkgPSAxIC8gMFxuXG5jb25zdCBpc0FycmF5ID0gdmFsdWUgPT4gIUFycmF5LmlzQXJyYXlcbiAgPyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nXG4gIDogQXJyYXkuaXNBcnJheSh2YWx1ZSlcblxuLy8gQWRhcHRlZCBmcm9tOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi9mNGNhMzk2YTc5NjQzNTQyMmJkNGZkNDFmYWRiZDIyNWVkZGRmMTc1Ly5pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanNcbmNvbnN0IGJhc2VUb1N0cmluZyA9IHZhbHVlID0+IHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBsZXQgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbmNvbnN0IHRvU3RyaW5nID0gdmFsdWUgPT4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcblxuY29uc3QgaXNTdHJpbmcgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG5cbmNvbnN0IGlzTnVtYmVyID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xuXG5jb25zdCBpc09iamVjdCA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblxuY29uc3QgaXNEZWZpbmVkID0gdmFsdWUgPT4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNEZWZpbmVkLFxuICBpc0FycmF5LFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzT2JqZWN0LFxuICB0b1N0cmluZ1xufVxuIiwiXG5jb25zdCB7IEJpdGFwU2VhcmNoLCBFeHRlbmRlZFNlYXJjaCwgTkdyYW1TZWFyY2ggfSA9IHJlcXVpcmUoJy4vc2VhcmNoJylcbmNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzT2JqZWN0IH0gPSByZXF1aXJlKCcuL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2hlbHBlcnMvZ2V0JylcbmNvbnN0IHsgY3JlYXRlSW5kZXgsIEtleVN0b3JlIH0gPSByZXF1aXJlKCcuL3Rvb2xzJylcbmNvbnN0IHsgdHJhbnNmb3JtTWF0Y2hlcywgdHJhbnNmb3JtU2NvcmUgfSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtJylcbmNvbnN0IHsgTUFYX0JJVFMgfSA9IHJlcXVpcmUoJy4vc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMnKVxuXG4vLyAvLyBXaWxsIHByaW50IHRvIHRoZSBjb25zb2xlLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbi8vIGZ1bmN0aW9uIGRlYnVnKCkge1xuLy8gICBpZiAoRnVzZS52ZXJib3NlKSB7XG4vLyAgICAgY29uc29sZS5sb2coLi4uYXJndW1lbnRzKVxuLy8gICAgIC8vIGNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbi8vICAgICAvLyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoLi4uYXJndW1lbnRzLCBmYWxzZSwgbnVsbCwgdHJ1ZSAvKiBlbmFibGUgY29sb3JzICovKSlcbi8vICAgfVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBkZWJ1Z1RpbWUodmFsdWUpIHtcbi8vICAgaWYgKEZ1c2UudmVyYm9zZVRpbWUpIHtcbi8vICAgICBjb25zb2xlLnRpbWUodmFsdWUpXG4vLyAgIH1cbi8vIH1cblxuLy8gZnVuY3Rpb24gZGVidWdUaW1lRW5kKHZhbHVlKSB7XG4vLyAgIGlmIChGdXNlLnZlcmJvc2VUaW1lKSB7XG4vLyAgICAgY29uc29sZS50aW1lRW5kKHZhbHVlKVxuLy8gICB9XG4vLyB9XG5cbmxldCBGdXNlT3B0aW9ucyA9IHtcbiAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgLy8gbWF0Y2ggaXMgZm91bmQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHNhbWUgaW5wdXQuXG4gIGlzQ2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgLy8gQW4gZXhhY3QgbGV0dGVyIG1hdGNoIHdoaWNoIGlzICdkaXN0YW5jZScgY2hhcmFjdGVycyBhd2F5IGZyb20gdGhlIGZ1enp5IGxvY2F0aW9uXG4gIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gdG8gYmUgd2l0aGluIDgwMCBjaGFyYWN0ZXJzIG9mIHRoZSBmdXp6eSBsb2NhdGlvbiB0byBiZSBmb3VuZCB1c2luZyBhIDAuOCB0aHJlc2hvbGQuXG4gIGRpc3RhbmNlOiAxMDAsXG4gIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICBmaW5kQWxsTWF0Y2hlczogZmFsc2UsXG4gIC8vIFRoZSBnZXQgZnVuY3Rpb24gdG8gdXNlIHdoZW4gZmV0Y2hpbmcgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gVGhlIGRlZmF1bHQgd2lsbCBzZWFyY2ggbmVzdGVkIHBhdGhzICppZSBmb28uYmFyLmJheipcbiAgZ2V0Rm46IGdldCxcbiAgaW5jbHVkZU1hdGNoZXM6IGZhbHNlLFxuICBpbmNsdWRlU2NvcmU6IGZhbHNlLFxuICAvLyBMaXN0IG9mIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHNlYXJjaGVkLiBUaGlzIGFsc28gc3VwcG9ydHMgbmVzdGVkIHByb3BlcnRpZXMuXG4gIGtleXM6IFtdLFxuICAvLyBBcHByb3hpbWF0ZWx5IHdoZXJlIGluIHRoZSB0ZXh0IGlzIHRoZSBwYXR0ZXJuIGV4cGVjdGVkIHRvIGJlIGZvdW5kP1xuICBsb2NhdGlvbjogMCxcbiAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gIG1pbk1hdGNoQ2hhckxlbmd0aDogMSxcbiAgLy8gV2hldGhlciB0byBzb3J0IHRoZSByZXN1bHQgbGlzdCwgYnkgc2NvcmVcbiAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgLy8gRGVmYXVsdCBzb3J0IGZ1bmN0aW9uXG4gIHNvcnRGbjogKGEsIGIpID0+IChhLnNjb3JlIC0gYi5zY29yZSksXG4gIC8vIEF0IHdoYXQgcG9pbnQgZG9lcyB0aGUgbWF0Y2ggYWxnb3JpdGhtIGdpdmUgdXAuIEEgdGhyZXNob2xkIG9mICcwLjAnIHJlcXVpcmVzIGEgcGVyZmVjdCBtYXRjaFxuICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICB0aHJlc2hvbGQ6IDAuNixcbiAgLy8gRW5hYmxlZCBleHRlbmRlZC1zZWFyY2hpbmdcbiAgdXNlRXh0ZW5kZWRTZWFyY2g6IGZhbHNlXG59XG5cbmNsYXNzIEZ1c2Uge1xuICBjb25zdHJ1Y3RvcihsaXN0LCBvcHRpb25zID0gRnVzZU9wdGlvbnMsIGluZGV4ID0gbnVsbCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRnVzZU9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuICAgIC8vIGBjYXNlU2Vuc2l0aXZlYCBpcyBkZXByZWNhdGVkLCB1c2UgYGlzQ2FzZVNlbnNpdGl2ZWAgaW5zdGVhZFxuICAgIHRoaXMub3B0aW9ucy5pc0Nhc2VTZW5zaXRpdmUgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmVcbiAgICBkZWxldGUgdGhpcy5vcHRpb25zLmNhc2VTZW5zaXRpdmVcblxuICAgIC8vIGRlYnVnVGltZSgnQ29uc3RydWN0aW5nJylcbiAgICB0aGlzLl9wcm9jZXNzS2V5cyh0aGlzLm9wdGlvbnMua2V5cylcbiAgICB0aGlzLnNldENvbGxlY3Rpb24obGlzdCwgaW5kZXgpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb25zdHJ1Y3RpbmcnKVxuICB9XG5cbiAgc2V0Q29sbGVjdGlvbihsaXN0LCBpbmRleCA9IG51bGwpIHtcbiAgICB0aGlzLmxpc3QgPSBsaXN0XG4gICAgdGhpcy5saXN0SXNTdHJpbmdBcnJheSA9IGlzU3RyaW5nKGxpc3RbMF0pXG5cbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlYnVnVGltZSgnUHJvY2VzcyBpbmRleCcpXG4gICAgICB0aGlzLnNldEluZGV4KHRoaXMuX2NyZWF0ZUluZGV4KCkpXG4gICAgICAvLyBkZWJ1Z1RpbWVFbmQoJ1Byb2Nlc3MgaW5kZXgnKVxuICAgIH1cbiAgfVxuXG4gIHNldEluZGV4KGxpc3RJbmRleCkge1xuICAgIHRoaXMuX2luZGV4ZWRMaXN0ID0gbGlzdEluZGV4XG4gICAgLy8gZGVidWcobGlzdEluZGV4KVxuICB9XG5cbiAgX3Byb2Nlc3NLZXlzKGtleXMpIHtcbiAgICB0aGlzLl9rZXlTdG9yZSA9IG5ldyBLZXlTdG9yZShrZXlzKVxuXG4gICAgLy8gZGVidWcoJ1Byb2Nlc3MgS2V5cycpXG4gICAgaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgICAgLy8gZGVidWcodGhpcy5fa2V5U3RvcmUudG9KU09OKCkpXG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUluZGV4KCkge1xuICAgIHJldHVybiBjcmVhdGVJbmRleCh0aGlzLl9rZXlTdG9yZS5rZXlzKCksIHRoaXMubGlzdCwge1xuICAgICAgZ2V0Rm46IHRoaXMub3B0aW9ucy5nZXRGblxuICAgIH0pXG4gIH1cblxuICBzZWFyY2gocGF0dGVybiwgb3B0cyA9IHsgbGltaXQ6IGZhbHNlIH0pIHtcbiAgICAvLyBkZWJ1ZyhgLS0tLS0tLS0tIFNlYXJjaCBwYXR0ZXJuOiBcIiR7cGF0dGVybn1cImApXG4gICAgY29uc3QgeyB1c2VFeHRlbmRlZFNlYXJjaCwgc2hvdWxkU29ydCB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBsZXQgc2VhcmNoZXIgPSBudWxsXG5cbiAgICBpZiAodXNlRXh0ZW5kZWRTZWFyY2gpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IEV4dGVuZGVkU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2UgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IE5HcmFtU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoZXIgPSBuZXcgQml0YXBTZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIC8vIGRlYnVnVGltZSgnU2VhcmNoIHRpbWUnKTtcbiAgICBsZXQgcmVzdWx0cyA9IHRoaXMuX3NlYXJjaFVzaW5nKHNlYXJjaGVyKVxuICAgIC8vIGRlYnVnVGltZUVuZCgnU2VhcmNoIHRpbWUnKTtcblxuICAgIC8vIGRlYnVnVGltZSgnQ29tcHV0ZSBzY29yZSB0aW1lJyk7XG4gICAgdGhpcy5fY29tcHV0ZVNjb3JlKHJlc3VsdHMpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb21wdXRlIHNjb3JlIHRpbWUnKTtcblxuICAgIGlmIChzaG91bGRTb3J0KSB7XG4gICAgICB0aGlzLl9zb3J0KHJlc3VsdHMpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMubGltaXQgJiYgaXNOdW1iZXIob3B0cy5saW1pdCkpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIG9wdHMubGltaXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdChyZXN1bHRzKVxuICB9XG5cbiAgX3NlYXJjaFVzaW5nKHNlYXJjaGVyKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2luZGV4ZWRMaXN0XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdXG4gICAgY29uc3QgeyBpbmNsdWRlTWF0Y2hlcyB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICAvLyBMaXN0IGlzIEFycmF5PFN0cmluZz5cbiAgICBpZiAodGhpcy5saXN0SXNTdHJpbmdBcnJheSkge1xuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgbGlzdFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbGlzdFtpXVxuICAgICAgICBsZXQgeyAkOiB0ZXh0LCBpZHggfSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQodGV4dCkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgIGNvbnN0IHsgaXNNYXRjaCwgc2NvcmUgfSA9IHNlYXJjaFJlc3VsdFxuXG4gICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCB2YWx1ZTogdGV4dCB9XG5cbiAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgbWF0Y2guaW5kaWNlcyA9IHNlYXJjaFJlc3VsdC5tYXRjaGVkSW5kaWNlc1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICBpdGVtOiB0ZXh0LFxuICAgICAgICAgIGlkeCxcbiAgICAgICAgICBtYXRjaGVzOiBbbWF0Y2hdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgICBjb25zdCBrZXlOYW1lcyA9IHRoaXMuX2tleVN0b3JlLmtleXMoKVxuICAgICAgY29uc3Qga2V5c0xlbiA9IHRoaXMuX2tleVN0b3JlLmNvdW50KClcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHsgJDogaXRlbSwgaWR4IH0gPSBsaXN0W2ldXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoZXMgPSBbXVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzTGVuOyBqICs9IDEpIHtcbiAgICAgICAgICBsZXQga2V5ID0ga2V5TmFtZXNbal1cbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV1cblxuICAgICAgICAgIC8vIGRlYnVnKGAgS2V5OiAke2tleSA9PT0gJycgPyAnLS0nIDoga2V5fWApXG5cbiAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBrIDwgbGVuOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGFyckl0ZW0gPSB2YWx1ZVtrXVxuICAgICAgICAgICAgICBsZXQgdGV4dCA9IGFyckl0ZW0uJFxuICAgICAgICAgICAgICBsZXQgaWR4ID0gYXJySXRlbS5pZHhcblxuICAgICAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gc2VhcmNoZXIuc2VhcmNoSW4oYXJySXRlbSlcblxuICAgICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgICAvLyBkZWJ1ZyhgRnVsbCB0ZXh0OiBcIiR7dGV4dH1cIiwgc2NvcmU6ICR7c2NvcmV9YClcblxuICAgICAgICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IG1hdGNoID0geyBzY29yZSwga2V5LCB2YWx1ZTogdGV4dCwgaWR4IH1cblxuICAgICAgICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBtYXRjaC5pbmRpY2VzID0gc2VhcmNoUmVzdWx0Lm1hdGNoZWRJbmRpY2VzXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgLy8gZGVidWcoYEZ1bGwgdGV4dDogXCIke3RleHR9XCIsIHNjb3JlOiAke3Njb3JlfWApXG5cbiAgICAgICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCBrZXksIHZhbHVlOiB0ZXh0IH1cblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgICAgIG1hdGNoLmluZGljZXMgPSBzZWFyY2hSZXN1bHQubWF0Y2hlZEluZGljZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG1hdGNoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBpZHgsXG4gICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgbWF0Y2hlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLSBSRVNVTFRTIC0tLS0tLS0tLS0tXCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgX2NvbXB1dGVTY29yZShyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ0NvbXB1dGluZyBzY29yZTogJylcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZXN1bHRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2ldXG4gICAgICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgICAgIGNvbnN0IHNjb3JlTGVuID0gbWF0Y2hlcy5sZW5ndGhcblxuICAgICAgbGV0IHRvdGFsV2VpZ2h0ZWRTY29yZSA9IDFcbiAgICAgIC8vIGxldCBiZXN0U2NvcmUgPSAtMVxuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNjb3JlTGVuOyBqICs9IDEpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG1hdGNoZXNbal1cbiAgICAgICAgY29uc3Qga2V5ID0gaXRlbS5rZXlcbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0gdGhpcy5fa2V5U3RvcmUuZ2V0KGtleSwgJ3dlaWdodCcpXG4gICAgICAgIGNvbnN0IHdlaWdodCA9IGtleVdlaWdodCB8fCAxXG4gICAgICAgIGNvbnN0IHNjb3JlID0gaXRlbS5zY29yZSA9PT0gMCAmJiBrZXlXZWlnaHQgJiYga2V5V2VpZ2h0ID4gMFxuICAgICAgICAgID8gTnVtYmVyLkVQU0lMT05cbiAgICAgICAgICA6IGl0ZW0uc2NvcmVcblxuICAgICAgICB0b3RhbFdlaWdodGVkU2NvcmUgKj0gTWF0aC5wb3coc2NvcmUsIHdlaWdodClcblxuICAgICAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBiZXN0IHNjb3JlLi4ganVzdCBpbiBjYXNlXG4gICAgICAgIC8vIEFjdHVhbGx5LCB3ZSdyZSBub3QgcmVhbGx5IHVzaW5nIGl0Li4gYnV0IG5lZWQgdG8gdGhpbmsgb2YgYSB3YXkgdG8gaW5jb3Jwb3JhdGUgdGhpc1xuICAgICAgICAvLyBiZXN0U2NvcmUgPSBiZXN0U2NvcmUgPT0gLTEgPyBpdGVtLnNjb3JlIDogTWF0aC5taW4oYmVzdFNjb3JlLCBpdGVtLnNjb3JlKVxuICAgICAgfVxuXG4gICAgICByZXN1bHQuc2NvcmUgPSB0b3RhbFdlaWdodGVkU2NvcmVcbiAgICAgIC8vIHJlc3VsdC4kc2NvcmUgPSBiZXN0U2NvcmVcblxuICAgICAgLy8gZGVidWcocmVzdWx0KVxuICAgIH1cbiAgfVxuXG4gIF9zb3J0KHJlc3VsdHMpIHtcbiAgICAvLyBkZWJ1ZygnU29ydGluZy4uLi4nKVxuICAgIHJlc3VsdHMuc29ydCh0aGlzLm9wdGlvbnMuc29ydEZuKVxuICB9XG5cbiAgX2Zvcm1hdChyZXN1bHRzKSB7XG4gICAgY29uc3QgZmluYWxPdXRwdXQgPSBbXVxuXG4gICAgY29uc3QgeyBpbmNsdWRlTWF0Y2hlcywgaW5jbHVkZVNjb3JlLCB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICAvLyBpZiAoRnVzZS52ZXJib3NlKSB7XG4gICAgLy8gICBsZXQgY2FjaGUgPSBbXVxuICAgIC8vICAgZGVidWcoJ091dHB1dDonLCBKU09OLnN0cmluZ2lmeShyZXN1bHRzLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgIC8vICAgICBpZiAoaXNPYmplY3QodmFsdWUpICYmIGlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAvLyAgICAgICBpZiAoY2FjaGUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgLy8gICAgICAgICAvLyBDaXJjdWxhciByZWZlcmVuY2UgZm91bmQsIGRpc2NhcmQga2V5XG4gICAgLy8gICAgICAgICByZXR1cm5cbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgICAgLy8gU3RvcmUgdmFsdWUgaW4gb3VyIGNvbGxlY3Rpb25cbiAgICAvLyAgICAgICBjYWNoZS5wdXNoKHZhbHVlKVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHJldHVybiB2YWx1ZVxuICAgIC8vICAgfSwgMikpXG4gICAgLy8gICBjYWNoZSA9IG51bGxcbiAgICAvLyB9XG5cbiAgICBsZXQgdHJhbnNmb3JtZXJzID0gW11cblxuICAgIGlmIChpbmNsdWRlTWF0Y2hlcykgdHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtTWF0Y2hlcylcbiAgICBpZiAoaW5jbHVkZVNjb3JlKSB0cmFuc2Zvcm1lcnMucHVzaCh0cmFuc2Zvcm1TY29yZSlcblxuICAgIC8vIGRlYnVnKFwiPT09PT0gUkVTVUxUUyA9PT09PT1cIilcbiAgICAvLyBkZWJ1ZyhyZXN1bHRzKVxuICAgIC8vIGRlYnVnKFwiPT09PT09PT09PT09PT09PT09PT1cIilcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZXN1bHRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2ldXG5cbiAgICAgIC8vIGRlYnVnKCdyZXN1bHQnLCByZXN1bHQpXG5cbiAgICAgIGNvbnN0IHsgaWR4IH0gPSByZXN1bHRcblxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgaXRlbTogdGhpcy5saXN0W2lkeF0sXG4gICAgICAgIHJlZkluZGV4OiBpZHhcbiAgICAgIH1cblxuICAgICAgaWYgKHRyYW5zZm9ybWVycy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDAsIGxlbiA9IHRyYW5zZm9ybWVycy5sZW5ndGg7IGogPCBsZW47IGogKz0gMSkge1xuICAgICAgICAgIHRyYW5zZm9ybWVyc1tqXShyZXN1bHQsIGRhdGEpXG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgICBmaW5hbE91dHB1dC5wdXNoKGRhdGEpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbmFsT3V0cHV0XG4gIH1cbn1cblxuRnVzZS5jcmVhdGVJbmRleCA9IGNyZWF0ZUluZGV4XG5cbm1vZHVsZS5leHBvcnRzID0gRnVzZVxuIiwibW9kdWxlLmV4cG9ydHMgPSAobWF0Y2htYXNrID0gW10sIG1pbk1hdGNoQ2hhckxlbmd0aCA9IDEpID0+IHtcbiAgbGV0IG1hdGNoZWRJbmRpY2VzID0gW11cbiAgbGV0IHN0YXJ0ID0gLTFcbiAgbGV0IGVuZCA9IC0xXG4gIGxldCBpID0gMFxuXG4gIGZvciAobGV0IGxlbiA9IG1hdGNobWFzay5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIGxldCBtYXRjaCA9IG1hdGNobWFza1tpXVxuICAgIGlmIChtYXRjaCAmJiBzdGFydCA9PT0gLTEpIHtcbiAgICAgIHN0YXJ0ID0gaVxuICAgIH0gZWxzZSBpZiAoIW1hdGNoICYmIHN0YXJ0ICE9PSAtMSkge1xuICAgICAgZW5kID0gaSAtIDFcbiAgICAgIGlmICgoZW5kIC0gc3RhcnQpICsgMSA+PSBtaW5NYXRjaENoYXJMZW5ndGgpIHtcbiAgICAgICAgbWF0Y2hlZEluZGljZXMucHVzaChbc3RhcnQsIGVuZF0pXG4gICAgICB9XG4gICAgICBzdGFydCA9IC0xXG4gICAgfVxuICB9XG5cbiAgLy8gKGktMSAtIHN0YXJ0KSArIDEgPT4gaSAtIHN0YXJ0XG4gIGlmIChtYXRjaG1hc2tbaSAtIDFdICYmIChpIC0gc3RhcnQpID49IG1pbk1hdGNoQ2hhckxlbmd0aCkge1xuICAgIG1hdGNoZWRJbmRpY2VzLnB1c2goW3N0YXJ0LCBpIC0gMV0pO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoZWRJbmRpY2VzXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHBhdHRlcm4gPT4ge1xuICBsZXQgbWFzayA9IHt9XG4gIGxldCBsZW4gPSBwYXR0ZXJuLmxlbmd0aFxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBtYXNrW3BhdHRlcm4uY2hhckF0KGkpXSA9IDBcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBtYXNrW3BhdHRlcm4uY2hhckF0KGkpXSB8PSAxIDw8IChsZW4gLSBpIC0gMSlcbiAgfVxuXG4gIHJldHVybiBtYXNrXG59IiwibW9kdWxlLmV4cG9ydHMgPSAocGF0dGVybiwgeyBlcnJvcnMgPSAwLCBjdXJyZW50TG9jYXRpb24gPSAwLCBleHBlY3RlZExvY2F0aW9uID0gMCwgZGlzdGFuY2UgPSAxMDAgfSkgPT4ge1xuICBjb25zdCBhY2N1cmFjeSA9IGVycm9ycyAvIHBhdHRlcm4ubGVuZ3RoXG4gIGNvbnN0IHByb3hpbWl0eSA9IE1hdGguYWJzKGV4cGVjdGVkTG9jYXRpb24gLSBjdXJyZW50TG9jYXRpb24pXG5cbiAgaWYgKCFkaXN0YW5jZSkge1xuICAgIC8vIERvZGdlIGRpdmlkZSBieSB6ZXJvIGVycm9yLlxuICAgIHJldHVybiBwcm94aW1pdHkgPyAxLjAgOiBhY2N1cmFjeVxuICB9XG5cbiAgcmV0dXJuIGFjY3VyYWN5ICsgKHByb3hpbWl0eSAvIGRpc3RhbmNlKVxufVxuIiwiY29uc3QgYml0YXBTY29yZSA9IHJlcXVpcmUoJy4vYml0YXAtc2NvcmUnKVxuY29uc3QgbWF0Y2hlZEluZGljZXMgPSByZXF1aXJlKCcuL2JpdGFwLW1hdGNoZWQtaW5kaWNlcycpXG5cbm1vZHVsZS5leHBvcnRzID0gKHRleHQsIHBhdHRlcm4sIHBhdHRlcm5BbHBoYWJldCwgeyBsb2NhdGlvbiA9IDAsIGRpc3RhbmNlID0gMTAwLCB0aHJlc2hvbGQgPSAwLjYsIGZpbmRBbGxNYXRjaGVzID0gZmFsc2UsIG1pbk1hdGNoQ2hhckxlbmd0aCA9IDEsIGluY2x1ZGVNYXRjaGVzID0gZmFsc2UgfSkgPT4ge1xuICBjb25zdCBwYXR0ZXJuTGVuID0gcGF0dGVybi5sZW5ndGhcbiAgLy8gU2V0IHN0YXJ0aW5nIGxvY2F0aW9uIGF0IGJlZ2lubmluZyB0ZXh0IGFuZCBpbml0aWFsaXplIHRoZSBhbHBoYWJldC5cbiAgY29uc3QgdGV4dExlbiA9IHRleHQubGVuZ3RoXG4gIC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVuIGxvY2F0aW9uID4gdGV4dC5sZW5ndGhcbiAgY29uc3QgZXhwZWN0ZWRMb2NhdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxvY2F0aW9uLCB0ZXh0TGVuKSlcbiAgLy8gSGlnaGVzdCBzY29yZSBiZXlvbmQgd2hpY2ggd2UgZ2l2ZSB1cC5cbiAgbGV0IGN1cnJlbnRUaHJlc2hvbGQgPSB0aHJlc2hvbGRcbiAgLy8gSXMgdGhlcmUgYSBuZWFyYnkgZXhhY3QgbWF0Y2g/IChzcGVlZHVwKVxuICBsZXQgYmVzdExvY2F0aW9uID0gdGV4dC5pbmRleE9mKHBhdHRlcm4sIGV4cGVjdGVkTG9jYXRpb24pXG5cbiAgLy8gYSBtYXNrIG9mIHRoZSBtYXRjaGVzXG4gIGNvbnN0IG1hdGNoTWFzayA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dExlbjsgaSArPSAxKSB7XG4gICAgbWF0Y2hNYXNrW2ldID0gMFxuICB9XG5cbiAgaWYgKGJlc3RMb2NhdGlvbiAhPT0gLTEpIHtcbiAgICBsZXQgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgIGVycm9yczogMCxcbiAgICAgIGN1cnJlbnRMb2NhdGlvbjogYmVzdExvY2F0aW9uLFxuICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlXG4gICAgfSlcbiAgICBjdXJyZW50VGhyZXNob2xkID0gTWF0aC5taW4oc2NvcmUsIGN1cnJlbnRUaHJlc2hvbGQpXG5cbiAgICAvLyBXaGF0IGFib3V0IGluIHRoZSBvdGhlciBkaXJlY3Rpb24/IChzcGVlZCB1cClcbiAgICBiZXN0TG9jYXRpb24gPSB0ZXh0Lmxhc3RJbmRleE9mKHBhdHRlcm4sIGV4cGVjdGVkTG9jYXRpb24gKyBwYXR0ZXJuTGVuKVxuXG4gICAgaWYgKGJlc3RMb2NhdGlvbiAhPT0gLTEpIHtcbiAgICAgIGxldCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgICBlcnJvcnM6IDAsXG4gICAgICAgIGN1cnJlbnRMb2NhdGlvbjogYmVzdExvY2F0aW9uLFxuICAgICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgICBkaXN0YW5jZVxuICAgICAgfSlcbiAgICAgIGN1cnJlbnRUaHJlc2hvbGQgPSBNYXRoLm1pbihzY29yZSwgY3VycmVudFRocmVzaG9sZClcbiAgICB9XG4gIH1cblxuICAvLyBSZXNldCB0aGUgYmVzdCBsb2NhdGlvblxuICBiZXN0TG9jYXRpb24gPSAtMVxuXG4gIGxldCBsYXN0Qml0QXJyID0gW11cbiAgbGV0IGZpbmFsU2NvcmUgPSAxXG4gIGxldCBiaW5NYXggPSBwYXR0ZXJuTGVuICsgdGV4dExlblxuXG4gIGNvbnN0IG1hc2sgPSAxIDw8IChwYXR0ZXJuTGVuIDw9IDMxID8gcGF0dGVybkxlbiAtIDEgOiAzMClcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdHRlcm5MZW47IGkgKz0gMSkge1xuICAgIC8vIFNjYW4gZm9yIHRoZSBiZXN0IG1hdGNoOyBlYWNoIGl0ZXJhdGlvbiBhbGxvd3MgZm9yIG9uZSBtb3JlIGVycm9yLlxuICAgIC8vIFJ1biBhIGJpbmFyeSBzZWFyY2ggdG8gZGV0ZXJtaW5lIGhvdyBmYXIgZnJvbSB0aGUgbWF0Y2ggbG9jYXRpb24gd2UgY2FuIHN0cmF5XG4gICAgLy8gYXQgdGhpcyBlcnJvciBsZXZlbC5cbiAgICBsZXQgYmluTWluID0gMFxuICAgIGxldCBiaW5NaWQgPSBiaW5NYXhcblxuICAgIHdoaWxlIChiaW5NaW4gPCBiaW5NaWQpIHtcbiAgICAgIGNvbnN0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICAgIGVycm9yczogaSxcbiAgICAgICAgY3VycmVudExvY2F0aW9uOiBleHBlY3RlZExvY2F0aW9uICsgYmluTWlkLFxuICAgICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgICBkaXN0YW5jZVxuICAgICAgfSlcblxuICAgICAgaWYgKHNjb3JlIDw9IGN1cnJlbnRUaHJlc2hvbGQpIHtcbiAgICAgICAgYmluTWluID0gYmluTWlkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiaW5NYXggPSBiaW5NaWRcbiAgICAgIH1cblxuICAgICAgYmluTWlkID0gTWF0aC5mbG9vcigoYmluTWF4IC0gYmluTWluKSAvIDIgKyBiaW5NaW4pXG4gICAgfVxuXG4gICAgLy8gVXNlIHRoZSByZXN1bHQgZnJvbSB0aGlzIGl0ZXJhdGlvbiBhcyB0aGUgbWF4aW11bSBmb3IgdGhlIG5leHQuXG4gICAgYmluTWF4ID0gYmluTWlkXG5cbiAgICBsZXQgc3RhcnQgPSBNYXRoLm1heCgxLCBleHBlY3RlZExvY2F0aW9uIC0gYmluTWlkICsgMSlcbiAgICBsZXQgZmluaXNoID0gZmluZEFsbE1hdGNoZXMgPyB0ZXh0TGVuIDogTWF0aC5taW4oZXhwZWN0ZWRMb2NhdGlvbiArIGJpbk1pZCwgdGV4dExlbikgKyBwYXR0ZXJuTGVuXG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBiaXQgYXJyYXlcbiAgICBsZXQgYml0QXJyID0gQXJyYXkoZmluaXNoICsgMilcblxuICAgIGJpdEFycltmaW5pc2ggKyAxXSA9ICgxIDw8IGkpIC0gMVxuXG4gICAgZm9yIChsZXQgaiA9IGZpbmlzaDsgaiA+PSBzdGFydDsgaiAtPSAxKSB7XG4gICAgICBsZXQgY3VycmVudExvY2F0aW9uID0gaiAtIDFcbiAgICAgIGxldCBjaGFyTWF0Y2ggPSBwYXR0ZXJuQWxwaGFiZXRbdGV4dC5jaGFyQXQoY3VycmVudExvY2F0aW9uKV1cblxuICAgICAgaWYgKGNoYXJNYXRjaCkge1xuICAgICAgICBtYXRjaE1hc2tbY3VycmVudExvY2F0aW9uXSA9IDFcbiAgICAgIH1cblxuICAgICAgLy8gRmlyc3QgcGFzczogZXhhY3QgbWF0Y2hcbiAgICAgIGJpdEFycltqXSA9ICgoYml0QXJyW2ogKyAxXSA8PCAxKSB8IDEpICYgY2hhck1hdGNoXG5cbiAgICAgIC8vIFN1YnNlcXVlbnQgcGFzc2VzOiBmdXp6eSBtYXRjaFxuICAgICAgaWYgKGkgIT09IDApIHtcbiAgICAgICAgYml0QXJyW2pdIHw9ICgoKGxhc3RCaXRBcnJbaiArIDFdIHwgbGFzdEJpdEFycltqXSkgPDwgMSkgfCAxKSB8IGxhc3RCaXRBcnJbaiArIDFdXG4gICAgICB9XG5cbiAgICAgIGlmIChiaXRBcnJbal0gJiBtYXNrKSB7XG4gICAgICAgIGZpbmFsU2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgICAgICBlcnJvcnM6IGksXG4gICAgICAgICAgY3VycmVudExvY2F0aW9uLFxuICAgICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgICAgZGlzdGFuY2VcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBUaGlzIG1hdGNoIHdpbGwgYWxtb3N0IGNlcnRhaW5seSBiZSBiZXR0ZXIgdGhhbiBhbnkgZXhpc3RpbmcgbWF0Y2guXG4gICAgICAgIC8vIEJ1dCBjaGVjayBhbnl3YXkuXG4gICAgICAgIGlmIChmaW5hbFNjb3JlIDw9IGN1cnJlbnRUaHJlc2hvbGQpIHtcbiAgICAgICAgICAvLyBJbmRlZWQgaXQgaXNcbiAgICAgICAgICBjdXJyZW50VGhyZXNob2xkID0gZmluYWxTY29yZVxuICAgICAgICAgIGJlc3RMb2NhdGlvbiA9IGN1cnJlbnRMb2NhdGlvblxuXG4gICAgICAgICAgLy8gQWxyZWFkeSBwYXNzZWQgYGxvY2AsIGRvd25oaWxsIGZyb20gaGVyZSBvbiBpbi5cbiAgICAgICAgICBpZiAoYmVzdExvY2F0aW9uIDw9IGV4cGVjdGVkTG9jYXRpb24pIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2hlbiBwYXNzaW5nIGBiZXN0TG9jYXRpb25gLCBkb24ndCBleGNlZWQgb3VyIGN1cnJlbnQgZGlzdGFuY2UgZnJvbSBgZXhwZWN0ZWRMb2NhdGlvbmAuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLm1heCgxLCAyICogZXhwZWN0ZWRMb2NhdGlvbiAtIGJlc3RMb2NhdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vIGhvcGUgZm9yIGEgKGJldHRlcikgbWF0Y2ggYXQgZ3JlYXRlciBlcnJvciBsZXZlbHMuXG4gICAgY29uc3Qgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgIGVycm9yczogaSArIDEsXG4gICAgICBjdXJyZW50TG9jYXRpb246IGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZGlzdGFuY2VcbiAgICB9KVxuXG4gICAgaWYgKHNjb3JlID4gY3VycmVudFRocmVzaG9sZCkge1xuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBsYXN0Qml0QXJyID0gYml0QXJyXG4gIH1cblxuICBsZXQgcmVzdWx0ID0ge1xuICAgIGlzTWF0Y2g6IGJlc3RMb2NhdGlvbiA+PSAwLFxuICAgIC8vIENvdW50IGV4YWN0IG1hdGNoZXMgKHRob3NlIHdpdGggYSBzY29yZSBvZiAwKSB0byBiZSBcImFsbW9zdFwiIGV4YWN0XG4gICAgc2NvcmU6ICFmaW5hbFNjb3JlID8gMC4wMDEgOiBmaW5hbFNjb3JlLFxuICB9XG5cbiAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgcmVzdWx0Lm1hdGNoZWRJbmRpY2VzID0gbWF0Y2hlZEluZGljZXMobWF0Y2hNYXNrLCBtaW5NYXRjaENoYXJMZW5ndGgpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG4iLCIvLyBNYWNoaW5lIHdvcmQgc2l6ZVxubW9kdWxlLmV4cG9ydHMuTUFYX0JJVFMgPSAzMiIsImNvbnN0IGJpdGFwU2VhcmNoID0gcmVxdWlyZSgnLi9iaXRhcC1zZWFyY2gnKVxuY29uc3QgcGF0dGVybkFscGhhYmV0ID0gcmVxdWlyZSgnLi9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0JylcbmNvbnN0IHsgTUFYX0JJVFMgfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJylcblxuY2xhc3MgQml0YXBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuLCB7XG4gICAgLy8gQXBwcm94aW1hdGVseSB3aGVyZSBpbiB0aGUgdGV4dCBpcyB0aGUgcGF0dGVybiBleHBlY3RlZCB0byBiZSBmb3VuZD9cbiAgICBsb2NhdGlvbiA9IDAsXG4gICAgLy8gRGV0ZXJtaW5lcyBob3cgY2xvc2UgdGhlIG1hdGNoIG11c3QgYmUgdG8gdGhlIGZ1enp5IGxvY2F0aW9uIChzcGVjaWZpZWQgYWJvdmUpLlxuICAgIC8vIEFuIGV4YWN0IGxldHRlciBtYXRjaCB3aGljaCBpcyAnZGlzdGFuY2UnIGNoYXJhY3RlcnMgYXdheSBmcm9tIHRoZSBmdXp6eSBsb2NhdGlvblxuICAgIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAgIC8vIHRoZSBleGFjdCBsb2NhdGlvbiBzcGVjaWZpZWQsIGEgdGhyZXNob2xkIG9mICcxMDAwJyB3b3VsZCByZXF1aXJlIGEgcGVyZmVjdCBtYXRjaFxuICAgIC8vIHRvIGJlIHdpdGhpbiA4MDAgY2hhcmFjdGVycyBvZiB0aGUgZnV6enkgbG9jYXRpb24gdG8gYmUgZm91bmQgdXNpbmcgYSAwLjggdGhyZXNob2xkLlxuICAgIGRpc3RhbmNlID0gMTAwLFxuICAgIC8vIEF0IHdoYXQgcG9pbnQgZG9lcyB0aGUgbWF0Y2ggYWxnb3JpdGhtIGdpdmUgdXAuIEEgdGhyZXNob2xkIG9mICcwLjAnIHJlcXVpcmVzIGEgcGVyZmVjdCBtYXRjaFxuICAgIC8vIChvZiBib3RoIGxldHRlcnMgYW5kIGxvY2F0aW9uKSwgYSB0aHJlc2hvbGQgb2YgJzEuMCcgd291bGQgbWF0Y2ggYW55dGhpbmcuXG4gICAgdGhyZXNob2xkID0gMC42LFxuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIGNvbXBhcmlzb25zIHNob3VsZCBiZSBjYXNlIHNlbnNpdGl2ZS5cbiAgICBpc0Nhc2VTZW5zaXRpdmUgPSBmYWxzZSxcbiAgICAvLyBXaGVuIHRydWUsIHRoZSBhbGdvcml0aG0gY29udGludWVzIHNlYXJjaGluZyB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCBldmVuIGlmIGEgcGVyZmVjdFxuICAgIC8vIG1hdGNoIGlzIGZvdW5kIGJlZm9yZSB0aGUgZW5kIG9mIHRoZSBzYW1lIGlucHV0LlxuICAgIGZpbmRBbGxNYXRjaGVzID0gZmFsc2UsXG4gICAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gICAgbWluTWF0Y2hDaGFyTGVuZ3RoID0gMSxcblxuICAgIGluY2x1ZGVNYXRjaGVzID0gZmFsc2VcbiAgfSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgZGlzdGFuY2UsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIGluY2x1ZGVNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoXG4gICAgfVxuXG4gICAgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGF0dGVybiBsZW5ndGggZXhjZWVkcyBtYXggb2YgJHtNQVhfQklUU30uYCk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXR0ZXJuID0gaXNDYXNlU2Vuc2l0aXZlID8gcGF0dGVybiA6IHBhdHRlcm4udG9Mb3dlckNhc2UoKVxuICAgIHRoaXMucGF0dGVybkFscGhhYmV0ID0gcGF0dGVybkFscGhhYmV0KHRoaXMucGF0dGVybilcbiAgfVxuXG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgbGV0IHRleHQgPSB2YWx1ZS4kXG5cbiAgICBjb25zdCB7IGlzQ2FzZVNlbnNpdGl2ZSwgaW5jbHVkZU1hdGNoZXMgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgIHRleHQgPSB0ZXh0LnRvTG93ZXJDYXNlKClcbiAgICB9XG5cbiAgICAvLyBFeGFjdCBtYXRjaFxuICAgIGlmICh0aGlzLnBhdHRlcm4gPT09IHRleHQpIHtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgIGlzTWF0Y2g6IHRydWUsXG4gICAgICAgIHNjb3JlOiAwXG4gICAgICB9XG5cbiAgICAgIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgICAgICByZXN1bHQubWF0Y2hlZEluZGljZXMgPSBbWzAsIHRleHQubGVuZ3RoIC0gMV1dXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UsIHVzZSBCaXRhcCBhbGdvcml0aG1cbiAgICBjb25zdCB7IGxvY2F0aW9uLCBkaXN0YW5jZSwgdGhyZXNob2xkLCBmaW5kQWxsTWF0Y2hlcywgbWluTWF0Y2hDaGFyTGVuZ3RoIH0gPSB0aGlzLm9wdGlvbnNcbiAgICByZXR1cm4gYml0YXBTZWFyY2godGV4dCwgdGhpcy5wYXR0ZXJuLCB0aGlzLnBhdHRlcm5BbHBoYWJldCwge1xuICAgICAgbG9jYXRpb24sXG4gICAgICBkaXN0YW5jZSxcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGZpbmRBbGxNYXRjaGVzLFxuICAgICAgbWluTWF0Y2hDaGFyTGVuZ3RoLFxuICAgICAgaW5jbHVkZU1hdGNoZXNcbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQml0YXBTZWFyY2hcbiIsIi8vIFRva2VuOiAnZmlsZVxuLy8gTWF0Y2ggdHlwZTogZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGluY2x1ZGUgYGZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gXCInXCJcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGluZGV4ID0gdGV4dC5pbmRleE9mKHNhbml0aXplZFBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSBpbmRleCA+IC0xXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwLFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsImNvbnN0IGV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2V4YWN0LW1hdGNoJylcbmNvbnN0IGludmVyc2VFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9pbnZlcnNlLWV4YWN0LW1hdGNoJylcbmNvbnN0IHByZWZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL3ByZWZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlUHJlZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1wcmVmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3Qgc3VmZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vc3VmZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IGludmVyc2VTdWZmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9pbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBCaXRhcFNlYXJjaCA9IHJlcXVpcmUoJy4uL2JpdGFwLXNlYXJjaCcpXG5cbmNvbnN0IHsgaXNTdHJpbmcgfSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5cbi8vIFJldHVybiBhIDJEIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBxdWVyeSwgZm9yIHNpbXBsZXIgcGFyc2luZy5cbi8vIEV4YW1wbGU6XG4vLyBcIl5jb3JlIGdvJCB8IHJiJCB8IHB5JCB4eSRcIiA9PiBbW1wiXmNvcmVcIiwgXCJnbyRcIl0sIFtcInJiJFwiXSwgW1wicHkkXCIsIFwieHkkXCJdXVxuY29uc3QgcXVlcnlmeSA9IChwYXR0ZXJuKSA9PiBwYXR0ZXJuLnNwbGl0KCd8JykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkuc3BsaXQoLyArL2cpKVxuXG4vKipcbiAqIENvbW1hbmQtbGlrZSBzZWFyY2hpbmdcbiAqID09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBHaXZlbiBtdWx0aXBsZSBzZWFyY2ggdGVybXMgZGVsaW1pdGVkIGJ5IHNwYWNlcy5lLmcuIGBeanNjcmlwdCAucHl0aG9uJCBydWJ5ICFqYXZhYCxcbiAqIHNlYXJjaCBpbiBhIGdpdmVuIHRleHQuXG4gKlxuICogU2VhcmNoIHN5bnRheDpcbiAqXG4gKiB8IFRva2VuICAgICAgIHwgTWF0Y2ggdHlwZSAgICAgICAgICAgICAgICAgfCBEZXNjcmlwdGlvbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IGBqc2NyaXB0YCAgIHwgZnV6enktbWF0Y2ggICAgICAgICAgICAgICAgfCBJdGVtcyB0aGF0IG1hdGNoIGBqc2NyaXB0YCAgICAgICAgICAgICB8XG4gKiB8IGAncHl0aG9uYCAgIHwgZXhhY3QtbWF0Y2ggICAgICAgICAgICAgICAgfCBJdGVtcyB0aGF0IGluY2x1ZGUgYHB5dGhvbmAgICAgICAgICAgICB8XG4gKiB8IGAhcnVieWAgICAgIHwgaW52ZXJzZS1leGFjdC1tYXRjaCAgICAgICAgfCBJdGVtcyB0aGF0IGRvIG5vdCBpbmNsdWRlIGBydWJ5YCAgICAgICB8XG4gKiB8IGBeamF2YWAgICAgIHwgcHJlZml4LWV4YWN0LW1hdGNoICAgICAgICAgfCBJdGVtcyB0aGF0IHN0YXJ0IHdpdGggYGphdmFgICAgICAgICAgICB8XG4gKiB8IGAhXmVhcmxhbmdgIHwgaW52ZXJzZS1wcmVmaXgtZXhhY3QtbWF0Y2ggfCBJdGVtcyB0aGF0IGRvIG5vdCBzdGFydCB3aXRoIGBlYXJsYW5nYCB8XG4gKiB8IGAuanMkYCAgICAgIHwgc3VmZml4LWV4YWN0LW1hdGNoICAgICAgICAgfCBJdGVtcyB0aGF0IGVuZCB3aXRoIGAuanNgICAgICAgICAgICAgICB8XG4gKiB8IGAhLmdvJGAgICAgIHwgaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2ggfCBJdGVtcyB0aGF0IGRvIG5vdCBlbmQgd2l0aCBgLmdvYCAgICAgICB8XG4gKlxuICogQSBzaW5nbGUgcGlwZSBjaGFyYWN0ZXIgYWN0cyBhcyBhbiBPUiBvcGVyYXRvci4gRm9yIGV4YW1wbGUsIHRoZSBmb2xsb3dpbmdcbiAqIHF1ZXJ5IG1hdGNoZXMgZW50cmllcyB0aGF0IHN0YXJ0IHdpdGggYGNvcmVgIGFuZCBlbmQgd2l0aCBlaXRoZXJgZ29gLCBgcmJgLFxuICogb3JgcHlgLlxuICpcbiAqIGBgYFxuICogXmNvcmUgZ28kIHwgcmIkIHwgcHkkXG4gKiBgYGBcbiAqL1xuY2xhc3MgRXh0ZW5kZWRTZWFyY2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuLCBvcHRpb25zKSB7XG4gICAgY29uc3QgeyBpc0Nhc2VTZW5zaXRpdmUgfSA9IG9wdGlvbnNcbiAgICB0aGlzLnF1ZXJ5ID0gbnVsbFxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICAvLyBBIDxwYXR0ZXJuPjo8Qml0YXBTZWFyY2g+IGtleS12YWx1ZSBwYWlyIGZvciBvcHRpbWl6aW5nIHNlYXJjaGluZ1xuICAgIHRoaXMuX2Z1enp5Q2FjaGUgPSB7fVxuXG4gICAgaWYgKGlzU3RyaW5nKHBhdHRlcm4pICYmIHBhdHRlcm4udHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcbiAgICAgIHRoaXMucXVlcnkgPSBxdWVyeWZ5KHRoaXMucGF0dGVybilcbiAgICB9XG4gIH1cblxuICBzZWFyY2hJbih2YWx1ZSkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5xdWVyeVxuXG4gICAgaWYgKCF0aGlzLnF1ZXJ5KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc01hdGNoOiBmYWxzZSxcbiAgICAgICAgc2NvcmU6IDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdGV4dCA9IHZhbHVlLiRcblxuICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuaXNDYXNlU2Vuc2l0aXZlID8gdGV4dCA6IHRleHQudG9Mb3dlckNhc2UoKVxuXG4gICAgbGV0IG1hdGNoRm91bmQgPSBmYWxzZVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIHFMZW4gPSBxdWVyeS5sZW5ndGg7IGkgPCBxTGVuOyBpICs9IDEpIHtcblxuICAgICAgY29uc3QgcGFydHMgPSBxdWVyeVtpXVxuICAgICAgbGV0IHJlc3VsdCA9IG51bGxcbiAgICAgIG1hdGNoRm91bmQgPSB0cnVlXG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBwTGVuID0gcGFydHMubGVuZ3RoOyBqIDwgcExlbjsgaiArPSAxKSB7XG4gICAgICAgIGxldCB0b2tlbiA9IHBhcnRzW2pdXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX3NlYXJjaCh0b2tlbiwgdGV4dClcbiAgICAgICAgaWYgKCFyZXN1bHQuaXNNYXRjaCkge1xuICAgICAgICAgIC8vIEFORCBjb25kaXRpb24sIHNob3J0LWNpcmN1aXQgYW5kIG1vdmUgb24gdG8gbmV4dCBwYXJ0XG4gICAgICAgICAgbWF0Y2hGb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBPUiBjb25kaXRpb24sIHNvIGlmIFRSVUUsIHJldHVyblxuICAgICAgaWYgKG1hdGNoRm91bmQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGhpbmcgd2FzIG1hdGNoZWRcbiAgICByZXR1cm4ge1xuICAgICAgaXNNYXRjaDogZmFsc2UsXG4gICAgICBzY29yZTogMVxuICAgIH1cbiAgfVxuXG4gIF9zZWFyY2gocGF0dGVybiwgdGV4dCkge1xuICAgIGlmIChleGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKHByZWZpeEV4YWN0TWF0Y2guaXNGb3JQYXR0ZXJuKHBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gcHJlZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2guaXNGb3JQYXR0ZXJuKHBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKGludmVyc2VTdWZmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGludmVyc2VTdWZmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChzdWZmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIHN1ZmZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKGludmVyc2VFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGludmVyc2VFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZWFyY2hlciA9IHRoaXMuX2Z1enp5Q2FjaGVbcGF0dGVybl1cbiAgICAgIGlmICghc2VhcmNoZXIpIHtcbiAgICAgICAgc2VhcmNoZXIgPSBuZXcgQml0YXBTZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgICAgICB0aGlzLl9mdXp6eUNhY2hlW3BhdHRlcm5dID0gc2VhcmNoZXJcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWFyY2hlci5zZWFyY2godGV4dClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbmRlZFNlYXJjaCIsIi8vIFRva2VuOiAhZmlyZVxuLy8gTWF0Y2ggdHlwZTogaW52ZXJzZS1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IGluY2x1ZGUgYGZpcmVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gdGV4dC5pbmRleE9mKHNhbml0aXplZFBhdHRlcm4pID09PSAtMVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAhXmZpcmVcbi8vIE1hdGNoIHR5cGU6IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZmlyZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnIScgJiYgcGF0dGVybi5jaGFyQXQoMSkgPT0gJ14nXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigyKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gIXRleHQuc3RhcnRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAhLmZpbGUkXG4vLyBNYXRjaCB0eXBlOiBpbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IGVuZCB3aXRoIGAuZmlsZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnIScgJiYgcGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSA9PSAnJCdcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyaW5nKDEsIHBhdHRlcm4ubGVuZ3RoIC0gMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9ICF0ZXh0LmVuZHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46IF5maWxlXG4vLyBNYXRjaCB0eXBlOiBwcmVmaXgtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IHN0YXJ0IHdpdGggYGZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJ14nXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gdGV4dC5zdGFydHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46IC5maWxlJFxuLy8gTWF0Y2ggdHlwZTogc3VmZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBlbmQgd2l0aCBgLmZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSA9PSAnJCdcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDAsIHBhdHRlcm4ubGVuZ3RoIC0gMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuZW5kc1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgQml0YXBTZWFyY2g6IHJlcXVpcmUoJy4vYml0YXAtc2VhcmNoJyksXG4gIEV4dGVuZGVkU2VhcmNoOiByZXF1aXJlKCcuL2V4dGVuZGVkLXNlYXJjaCcpLFxuICBOR3JhbVNlYXJjaDogcmVxdWlyZSgnLi9uZ3JhbS1zZWFyY2gnKVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB1bmlvbjogcmVxdWlyZSgnLi91bmlvbicpLFxuICBpbnRlcnNlY3Rpb246IHJlcXVpcmUoJy4vaW50ZXJzZWN0aW9uJylcbn0iLCIvLyBBc3N1bWVzIGFycmF5cyBhcmUgc29ydGVkXG5tb2R1bGUuZXhwb3J0cyA9IChhcnIxLCBhcnIyKSA9PiB7XG4gIGxldCByZXN1bHQgPSBbXVxuICBsZXQgaSA9IDBcbiAgbGV0IGogPSAwXG5cbiAgd2hpbGUgKGkgPCBhcnIxLmxlbmd0aCAmJiBqIDwgYXJyMi5sZW5ndGgpIHtcbiAgICBsZXQgaXRlbTEgPSBhcnIxW2ldXG4gICAgbGV0IGl0ZW0yID0gYXJyMltqXVxuXG4gICAgaWYgKGl0ZW0xID09IGl0ZW0yKSB7XG4gICAgICByZXN1bHQucHVzaChpdGVtMSlcbiAgICAgIGkgKz0gMVxuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIGlmIChpdGVtMSA8IGl0ZW0yKSB7XG4gICAgICBpICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0xID4gaXRlbTIpIHtcbiAgICAgIGogKz0gMVxuICAgIH0gZWxzZSB7XG4gICAgICBpICs9IDFcbiAgICAgIGogKz0gMVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiLy8gQXNzdW1lcyBhcnJheXMgYXJlIHNvcnRlZFxubW9kdWxlLmV4cG9ydHMgPSAoYXJyMSwgYXJyMikgPT4ge1xuICBsZXQgcmVzdWx0ID0gW11cbiAgbGV0IGkgPSAwXG4gIGxldCBqID0gMFxuXG4gIHdoaWxlIChpIDwgYXJyMS5sZW5ndGggJiYgaiA8IGFycjIubGVuZ3RoKSB7XG4gICAgbGV0IGl0ZW0xID0gYXJyMVtpXVxuICAgIGxldCBpdGVtMiA9IGFycjJbal1cblxuICAgIGlmIChpdGVtMSA8IGl0ZW0yKSB7XG4gICAgICByZXN1bHQucHVzaChpdGVtMSlcbiAgICAgIGkgKz0gMVxuICAgIH0gZWxzZSBpZiAoaXRlbTIgPCBpdGVtMSkge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTIpXG4gICAgICBqICs9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTIpXG4gICAgICBpICs9IDFcbiAgICAgIGogKz0gMVxuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChpIDwgYXJyMS5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaChhcnIxW2ldKVxuICAgIGkgKz0gMVxuICB9XG5cbiAgd2hpbGUgKGogPCBhcnIyLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKGFycjJbal0pXG4gICAgaiArPSAxXG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGphY2NhcmREaXN0YW5jZTogcmVxdWlyZSgnLi9qYWNjYXJkLWRpc3RhbmNlJylcbn0iLCJjb25zdCB7IHVuaW9uLCBpbnRlcnNlY3Rpb24gfSA9IHJlcXVpcmUoJy4uL2FycmF5LXV0aWxzJylcblxubW9kdWxlLmV4cG9ydHMgPSAobkdyYW0xLCBuR3JhbTIpID0+IHtcbiAgbGV0IG5HcmFtVW5pb24gPSB1bmlvbihuR3JhbTEsIG5HcmFtMilcbiAgbGV0IG5HcmFtSW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0aW9uKG5HcmFtMSwgbkdyYW0yKVxuXG4gIHJldHVybiAxIC0gbkdyYW1JbnRlcnNlY3Rpb24ubGVuZ3RoIC8gbkdyYW1Vbmlvbi5sZW5ndGhcbn0iLCJjb25zdCBuZ3JhbSA9IHJlcXVpcmUoJy4vbmdyYW0nKVxuY29uc3QgeyBqYWNjYXJkRGlzdGFuY2UgfSA9IHJlcXVpcmUoJy4vZGlzdGFuY2UnKVxuXG5jbGFzcyBOR3JhbVNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4pIHtcbiAgICAvLyBDcmVhdGUgdGhlIG5ncmFtLCBhbmQgc29ydCBpdFxuICAgIHRoaXMucGF0dGVybk5ncmFtID0gbmdyYW0ocGF0dGVybiwgeyBzb3J0OiB0cnVlIH0pXG4gIH1cbiAgc2VhcmNoSW4odmFsdWUpIHtcbiAgICBsZXQgdGV4dE5ncmFtID0gdmFsdWUubmdcbiAgICBpZiAoIXRleHROZ3JhbSkge1xuICAgICAgdGV4dE5ncmFtID0gbmdyYW0odmFsdWUuJCwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICB2YWx1ZS5uZyA9IHRleHROZ3JhbVxuICAgIH1cblxuICAgIGxldCBqYWNhcmRSZXN1bHQgPSBqYWNjYXJkRGlzdGFuY2UodGhpcy5wYXR0ZXJuTmdyYW0sIHRleHROZ3JhbSlcblxuICAgIHJldHVybiB7XG4gICAgICBzY29yZTogamFjYXJkUmVzdWx0LFxuICAgICAgaXNNYXRjaDogamFjYXJkUmVzdWx0IDwgMVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5HcmFtU2VhcmNoIiwiY29uc3QgTkdSQU1fTEVOID0gM1xuXG5tb2R1bGUuZXhwb3J0cyA9ICh0ZXh0LCB7IG4gPSBOR1JBTV9MRU4sIHBhZCA9IHRydWUsIHNvcnQgPSBmYWxzZSB9KSA9PiB7XG4gIGxldCBuR3JhbXMgPSBbXVxuXG4gIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuR3JhbXNcbiAgfVxuXG4gIHRleHQgPSB0ZXh0LnRvTG93ZXJDYXNlKClcbiAgaWYgKHBhZCkge1xuICAgIHRleHQgPSBgICR7dGV4dH0gYFxuICB9XG5cbiAgbGV0IGluZGV4ID0gdGV4dC5sZW5ndGggLSBuICsgMVxuICBpZiAoaW5kZXggPCAxKSB7XG4gICAgcmV0dXJuIG5HcmFtc1xuICB9XG5cbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICBuR3JhbXNbaW5kZXhdID0gdGV4dC5zdWJzdHIoaW5kZXgsIG4pXG4gIH1cblxuICBpZiAoc29ydCkge1xuICAgIG5HcmFtcy5zb3J0KChhLCBiKSA9PiBhID09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDEpXG4gIH1cblxuICByZXR1cm4gbkdyYW1zXG59IiwiY29uc3QgeyBpc0FycmF5LCBpc0RlZmluZWQsIGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuY29uc3QgZ2V0ID0gcmVxdWlyZSgnLi4vaGVscGVycy9nZXQnKVxuY29uc3QgbmdyYW0gPSByZXF1aXJlKCcuLi9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtJylcblxubW9kdWxlLmV4cG9ydHMgPSAoa2V5cywgbGlzdCwgeyBnZXRGbiA9IGdldCwgbmdyYW1zID0gZmFsc2UgfSA9IHt9KSA9PiB7XG4gIGxldCBpbmRleGVkTGlzdCA9IFtdXG5cbiAgLy8gTGlzdCBpcyBBcnJheTxTdHJpbmc+XG4gIGlmIChpc1N0cmluZyhsaXN0WzBdKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBzdHJpbmcgaW4gdGhlIGxpc3RcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBsaXN0W2ldXG5cbiAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIC8vIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgIC8vICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC8vIH1cblxuICAgICAgICBsZXQgcmVjb3JkID0ge1xuICAgICAgICAgICQ6IHZhbHVlLFxuICAgICAgICAgIGlkeDogaVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ncmFtcykge1xuICAgICAgICAgIHJlY29yZC5uZyA9IG5ncmFtKHZhbHVlLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4ZWRMaXN0LnB1c2gocmVjb3JkKVxuICAgICAgfVxuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIC8vIExpc3QgaXMgQXJyYXk8T2JqZWN0PlxuICAgIGNvbnN0IGtleXNMZW4gPSBrZXlzLmxlbmd0aFxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBpdGVtID0gbGlzdFtpXVxuXG4gICAgICBsZXQgcmVjb3JkID0geyBpZHg6IGksICQ6IHt9IH1cblxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IGtleSAoaS5lLCBwYXRoKSwgYW5kIGZldGNoIHRoZSB2YWx1ZSBhdCB0aGF0IGtleVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzTGVuOyBqICs9IDEpIHtcbiAgICAgICAgbGV0IGtleSA9IGtleXNbal1cbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0Rm4oaXRlbSwga2V5KVxuXG4gICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgc3ViUmVjb3JkcyA9IFtdXG4gICAgICAgICAgY29uc3Qgc3RhY2sgPSBbeyBhcnJheUluZGV4OiAtMSwgdmFsdWUgfV1cblxuICAgICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgYXJyYXlJbmRleCwgdmFsdWUgfSA9IHN0YWNrLnBvcCgpXG5cbiAgICAgICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG5cbiAgICAgICAgICAgICAgLy8gaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgICAgICAgLy8gICB2ID0gdi50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICBsZXQgc3ViUmVjb3JkID0geyAkOiB2YWx1ZSwgaWR4OiBhcnJheUluZGV4IH1cblxuICAgICAgICAgICAgICBpZiAobmdyYW1zKSB7XG4gICAgICAgICAgICAgICAgc3ViUmVjb3JkLm5nID0gbmdyYW0odmFsdWUsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc3ViUmVjb3Jkcy5wdXNoKHN1YlJlY29yZClcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgYXJyTGVuID0gdmFsdWUubGVuZ3RoOyBrIDwgYXJyTGVuOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIGFycmF5SW5kZXg6IGssXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVba10sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZWNvcmQuJFtrZXldID0gc3ViUmVjb3Jkc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgICAgLy8gICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICBsZXQgc3ViUmVjb3JkID0geyAkOiB2YWx1ZSB9XG5cbiAgICAgICAgICBpZiAobmdyYW1zKSB7XG4gICAgICAgICAgICBzdWJSZWNvcmQubmcgPSBuZ3JhbSh2YWx1ZSwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVjb3JkLiRba2V5XSA9IHN1YlJlY29yZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluZGV4ZWRMaXN0LnB1c2gocmVjb3JkKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRleGVkTGlzdFxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVJbmRleDogcmVxdWlyZSgnLi9jcmVhdGUtaW5kZXgnKSxcbiAgS2V5U3RvcmU6IHJlcXVpcmUoJy4va2V5LXN0b3JlJylcbn0iLCJjb25zdCB7IGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG5jbGFzcyBLZXlTdG9yZSB7XG4gIGNvbnN0cnVjdG9yKGtleXMpIHtcbiAgICB0aGlzLl9rZXlzID0ge31cbiAgICB0aGlzLl9rZXlOYW1lcyA9IFtdXG4gICAgdGhpcy5fbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICB0aGlzLl9oYXNXZWlnaHRzID0gZmFsc2VcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXlcbiAgICBpZiAoa2V5cy5sZW5ndGggJiYgaXNTdHJpbmcoa2V5c1swXSkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgICAgICB0aGlzLl9rZXlzW2tleV0gPSB7XG4gICAgICAgICAgd2VpZ2h0OiAxXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fa2V5TmFtZXMucHVzaChrZXkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBrZXlXZWlnaHRzVG90YWwgPSAwXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCduYW1lJykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJuYW1lXCIgcHJvcGVydHkgaW4ga2V5IG9iamVjdCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXlOYW1lID0ga2V5Lm5hbWVcbiAgICAgICAgdGhpcy5fa2V5TmFtZXMucHVzaChrZXlOYW1lKVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCd3ZWlnaHQnKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBcIndlaWdodFwiIHByb3BlcnR5IGluIGtleSBvYmplY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0ga2V5LndlaWdodFxuXG4gICAgICAgIGlmIChrZXlXZWlnaHQgPD0gMCB8fCBrZXlXZWlnaHQgPj0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgbXVzdCBiZWluIHRoZSByYW5nZSBvZiAoMCwgMSknKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2V5c1trZXlOYW1lXSA9IHtcbiAgICAgICAgICB3ZWlnaHQ6IGtleVdlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAga2V5V2VpZ2h0c1RvdGFsICs9IGtleVdlaWdodFxuXG4gICAgICAgIHRoaXMuX2hhc1dlaWdodHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlXZWlnaHRzVG90YWwgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVG90YWwgb2Yga2V5V2VpZ2h0cyBjYW5ub3QgZXhjZWVkIDEnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQoa2V5LCBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleXNba2V5XSA/IHRoaXMuX2tleXNba2V5XVtuYW1lXSA6IG51bGxcbiAgfVxuICBrZXlzKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlOYW1lc1xuICB9XG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9sZW5ndGhcbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuX2tleXMpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlTdG9yZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0cmFuc2Zvcm1NYXRjaGVzOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1tYXRjaGVzJyksXG4gIHRyYW5zZm9ybVNjb3JlOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1zY29yZScpXG59IiwiY29uc3QgeyBpc0FycmF5LCBpc0RlZmluZWQsIGlzU3RyaW5nLCBpc051bWJlciwgaXNPYmplY3QgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlc3VsdCwgZGF0YSkgPT4ge1xuICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgZGF0YS5tYXRjaGVzID0gW11cblxuICBpZiAoIWlzRGVmaW5lZChtYXRjaGVzKSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1hdGNoZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBsZXQgbWF0Y2ggPSBtYXRjaGVzW2ldXG5cbiAgICBpZiAoIWlzRGVmaW5lZChtYXRjaC5pbmRpY2VzKSB8fCBtYXRjaC5pbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBsZXQgb2JqID0ge1xuICAgICAgaW5kaWNlczogbWF0Y2guaW5kaWNlcyxcbiAgICAgIHZhbHVlOiBtYXRjaC52YWx1ZVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5rZXkpIHtcbiAgICAgIG9iai5rZXkgPSBtYXRjaC5rZXlcbiAgICB9XG5cbiAgICBpZiAobWF0Y2guaWR4ID4gLTEpIHtcbiAgICAgIG9iai5yZWZJbmRleCA9IG1hdGNoLmlkeFxuICAgIH1cblxuICAgIGRhdGEubWF0Y2hlcy5wdXNoKG9iailcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAocmVzdWx0LCBkYXRhKSA9PiB7XG4gIGRhdGEuc2NvcmUgPSByZXN1bHQuc2NvcmVcbn0iXSwic291cmNlUm9vdCI6IiJ9