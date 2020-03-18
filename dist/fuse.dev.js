/*!
 * Fuse.js v5.0.5-beta - Lightweight fuzzy-search (http://fusejs.io)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Z1c2UvLi9zcmMvaGVscGVycy9nZXQuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9oZWxwZXJzL3R5cGUtY2hlY2tlcnMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtbWF0Y2hlZC1pbmRpY2VzLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1zY29yZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtc2VhcmNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9pbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9zdWZmaXgtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9hcnJheS11dGlscy9pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL3VuaW9uLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9kaXN0YW5jZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvZGlzdGFuY2UvamFjY2FyZC1kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvY3JlYXRlLWluZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90b29scy9rZXktc3RvcmUuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLW1hdGNoZXMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLXNjb3JlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJpc0RlZmluZWQiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNBcnJheSIsInRvU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIm9iaiIsInBhdGgiLCJsaXN0IiwiYXJyIiwiX2dldCIsInB1c2giLCJkb3RJbmRleCIsImluZGV4T2YiLCJrZXkiLCJyZW1haW5pbmciLCJzbGljZSIsInZhbHVlIiwiaSIsImxlbiIsImxlbmd0aCIsIklORklOSVRZIiwiQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJjYWxsIiwiYmFzZVRvU3RyaW5nIiwicmVzdWx0IiwiaXNPYmplY3QiLCJ1bmRlZmluZWQiLCJCaXRhcFNlYXJjaCIsIkV4dGVuZGVkU2VhcmNoIiwiTkdyYW1TZWFyY2giLCJnZXQiLCJjcmVhdGVJbmRleCIsIktleVN0b3JlIiwidHJhbnNmb3JtTWF0Y2hlcyIsInRyYW5zZm9ybVNjb3JlIiwiTUFYX0JJVFMiLCJGdXNlT3B0aW9ucyIsImlzQ2FzZVNlbnNpdGl2ZSIsImRpc3RhbmNlIiwiZmluZEFsbE1hdGNoZXMiLCJnZXRGbiIsImluY2x1ZGVNYXRjaGVzIiwiaW5jbHVkZVNjb3JlIiwia2V5cyIsImxvY2F0aW9uIiwibWluTWF0Y2hDaGFyTGVuZ3RoIiwic2hvdWxkU29ydCIsInNvcnRGbiIsImEiLCJiIiwic2NvcmUiLCJ0aHJlc2hvbGQiLCJ1c2VFeHRlbmRlZFNlYXJjaCIsIkZ1c2UiLCJvcHRpb25zIiwiaW5kZXgiLCJjYXNlU2Vuc2l0aXZlIiwiX3Byb2Nlc3NLZXlzIiwic2V0Q29sbGVjdGlvbiIsImxpc3RJc1N0cmluZ0FycmF5Iiwic2V0SW5kZXgiLCJfY3JlYXRlSW5kZXgiLCJsaXN0SW5kZXgiLCJfaW5kZXhlZExpc3QiLCJfa2V5U3RvcmUiLCJ2ZXJib3NlIiwicGF0dGVybiIsIm9wdHMiLCJsaW1pdCIsInNlYXJjaGVyIiwicmVzdWx0cyIsIl9zZWFyY2hVc2luZyIsIl9jb21wdXRlU2NvcmUiLCJfc29ydCIsIl9mb3JtYXQiLCJ0ZXh0IiwiJCIsImlkeCIsInNlYXJjaFJlc3VsdCIsInNlYXJjaEluIiwiaXNNYXRjaCIsIm1hdGNoIiwiaW5kaWNlcyIsIm1hdGNoZWRJbmRpY2VzIiwiaXRlbSIsIm1hdGNoZXMiLCJrZXlOYW1lcyIsImtleXNMZW4iLCJjb3VudCIsImoiLCJrIiwiYXJySXRlbSIsInNjb3JlTGVuIiwidG90YWxXZWlnaHRlZFNjb3JlIiwia2V5V2VpZ2h0Iiwid2VpZ2h0IiwiTnVtYmVyIiwiRVBTSUxPTiIsIk1hdGgiLCJwb3ciLCJzb3J0IiwiZmluYWxPdXRwdXQiLCJ0cmFuc2Zvcm1lcnMiLCJkYXRhIiwicmVmSW5kZXgiLCJtYXRjaG1hc2siLCJzdGFydCIsImVuZCIsIm1hc2siLCJjaGFyQXQiLCJlcnJvcnMiLCJjdXJyZW50TG9jYXRpb24iLCJleHBlY3RlZExvY2F0aW9uIiwiYWNjdXJhY3kiLCJwcm94aW1pdHkiLCJhYnMiLCJiaXRhcFNjb3JlIiwicGF0dGVybkFscGhhYmV0IiwicGF0dGVybkxlbiIsInRleHRMZW4iLCJtYXgiLCJtaW4iLCJjdXJyZW50VGhyZXNob2xkIiwiYmVzdExvY2F0aW9uIiwibWF0Y2hNYXNrIiwibGFzdEluZGV4T2YiLCJsYXN0Qml0QXJyIiwiZmluYWxTY29yZSIsImJpbk1heCIsImJpbk1pbiIsImJpbk1pZCIsImZsb29yIiwiZmluaXNoIiwiYml0QXJyIiwiY2hhck1hdGNoIiwiYml0YXBTZWFyY2giLCJFcnJvciIsInRvTG93ZXJDYXNlIiwiaXNGb3JQYXR0ZXJuIiwic2FuaXRpemUiLCJzdWJzdHIiLCJzYW5pdGl6ZWRQYXR0ZXJuIiwiZXhhY3RNYXRjaCIsImludmVyc2VFeGFjdE1hdGNoIiwicHJlZml4RXhhY3RNYXRjaCIsImludmVyc2VQcmVmaXhFeGFjdE1hdGNoIiwic3VmZml4RXhhY3RNYXRjaCIsImludmVyc2VTdWZmaXhFeGFjdE1hdGNoIiwicXVlcnlmeSIsInNwbGl0IiwibWFwIiwidHJpbSIsInF1ZXJ5IiwiX2Z1enp5Q2FjaGUiLCJtYXRjaEZvdW5kIiwicUxlbiIsInBhcnRzIiwicExlbiIsInRva2VuIiwiX3NlYXJjaCIsInNlYXJjaCIsInN0YXJ0c1dpdGgiLCJzdWJzdHJpbmciLCJlbmRzV2l0aCIsInVuaW9uIiwiaW50ZXJzZWN0aW9uIiwiYXJyMSIsImFycjIiLCJpdGVtMSIsIml0ZW0yIiwiamFjY2FyZERpc3RhbmNlIiwibkdyYW0xIiwibkdyYW0yIiwibkdyYW1VbmlvbiIsIm5HcmFtSW50ZXJzZWN0aW9uIiwibmdyYW0iLCJwYXR0ZXJuTmdyYW0iLCJ0ZXh0TmdyYW0iLCJuZyIsImphY2FyZFJlc3VsdCIsIk5HUkFNX0xFTiIsIm4iLCJwYWQiLCJuR3JhbXMiLCJuZ3JhbXMiLCJpbmRleGVkTGlzdCIsInJlY29yZCIsInN1YlJlY29yZHMiLCJzdGFjayIsImFycmF5SW5kZXgiLCJwb3AiLCJzdWJSZWNvcmQiLCJhcnJMZW4iLCJfa2V5cyIsIl9rZXlOYW1lcyIsIl9sZW5ndGgiLCJfaGFzV2VpZ2h0cyIsImtleVdlaWdodHNUb3RhbCIsImhhc093blByb3BlcnR5Iiwia2V5TmFtZSIsIm5hbWUiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7ZUM1RUlBLG1CQUFPLENBQUMsdURBQUQsQztJQUxUQyxTLFlBQUFBLFM7SUFDQUMsUSxZQUFBQSxRO0lBQ0FDLFEsWUFBQUEsUTtJQUNBQyxPLFlBQUFBLE87SUFDQUMsUSxZQUFBQSxROztBQUdGQyxNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDOUIsTUFBSUMsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJQyxHQUFHLEdBQUcsS0FBVjs7QUFFQSxNQUFNQyxJQUFJLEdBQUcsU0FBUEEsSUFBTyxDQUFDSixHQUFELEVBQU1DLElBQU4sRUFBZTtBQUMxQixRQUFJLENBQUNBLElBQUwsRUFBVztBQUNUO0FBQ0FDLFVBQUksQ0FBQ0csSUFBTCxDQUFVTCxHQUFWO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsVUFBTU0sUUFBUSxHQUFHTCxJQUFJLENBQUNNLE9BQUwsQ0FBYSxHQUFiLENBQWpCO0FBRUEsVUFBSUMsR0FBRyxHQUFHUCxJQUFWO0FBQ0EsVUFBSVEsU0FBUyxHQUFHLElBQWhCOztBQUVBLFVBQUlILFFBQVEsS0FBSyxDQUFDLENBQWxCLEVBQXFCO0FBQ25CRSxXQUFHLEdBQUdQLElBQUksQ0FBQ1MsS0FBTCxDQUFXLENBQVgsRUFBY0osUUFBZCxDQUFOO0FBQ0FHLGlCQUFTLEdBQUdSLElBQUksQ0FBQ1MsS0FBTCxDQUFXSixRQUFRLEdBQUcsQ0FBdEIsQ0FBWjtBQUNEOztBQUVELFVBQU1LLEtBQUssR0FBR1gsR0FBRyxDQUFDUSxHQUFELENBQWpCOztBQUVBLFVBQUlmLFNBQVMsQ0FBQ2tCLEtBQUQsQ0FBYixFQUFzQjtBQUNwQixZQUFJLENBQUNGLFNBQUQsS0FBZWYsUUFBUSxDQUFDaUIsS0FBRCxDQUFSLElBQW1CaEIsUUFBUSxDQUFDZ0IsS0FBRCxDQUExQyxDQUFKLEVBQXdEO0FBQ3REVCxjQUFJLENBQUNHLElBQUwsQ0FBVVIsUUFBUSxDQUFDYyxLQUFELENBQWxCO0FBQ0QsU0FGRCxNQUVPLElBQUlmLE9BQU8sQ0FBQ2UsS0FBRCxDQUFYLEVBQW9CO0FBQ3pCUixhQUFHLEdBQUcsSUFBTixDQUR5QixDQUV6Qjs7QUFDQSxlQUFLLElBQUlTLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR0YsS0FBSyxDQUFDRyxNQUE1QixFQUFvQ0YsQ0FBQyxHQUFHQyxHQUF4QyxFQUE2Q0QsQ0FBQyxJQUFJLENBQWxELEVBQXFEO0FBQ25EUixnQkFBSSxDQUFDTyxLQUFLLENBQUNDLENBQUQsQ0FBTixFQUFXSCxTQUFYLENBQUo7QUFDRDtBQUNGLFNBTk0sTUFNQSxJQUFJQSxTQUFKLEVBQWU7QUFDcEI7QUFDQUwsY0FBSSxDQUFDTyxLQUFELEVBQVFGLFNBQVIsQ0FBSjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLEdBaENEOztBQWtDQUwsTUFBSSxDQUFDSixHQUFELEVBQU1DLElBQU4sQ0FBSjs7QUFFQSxNQUFJRSxHQUFKLEVBQVM7QUFDUCxXQUFPRCxJQUFQO0FBQ0Q7O0FBRUQsU0FBT0EsSUFBSSxDQUFDLENBQUQsQ0FBWDtBQUNELENBN0NELEM7Ozs7Ozs7Ozs7Ozs7QUNSQSxJQUFNYSxRQUFRLEdBQUcsSUFBSSxDQUFyQjs7QUFFQSxJQUFNbkIsT0FBTyxHQUFHLFNBQVZBLE9BQVUsQ0FBQWUsS0FBSztBQUFBLFNBQUksQ0FBQ0ssS0FBSyxDQUFDcEIsT0FBUCxHQUNyQnFCLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQnJCLFFBQWpCLENBQTBCc0IsSUFBMUIsQ0FBK0JSLEtBQS9CLE1BQTBDLGdCQURyQixHQUVyQkssS0FBSyxDQUFDcEIsT0FBTixDQUFjZSxLQUFkLENBRmlCO0FBQUEsQ0FBckIsQyxDQUlBO0FBQ0E7OztBQUNBLElBQU1TLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUFULEtBQUssRUFBSTtBQUM1QjtBQUNBLE1BQUksT0FBT0EsS0FBUCxJQUFnQixRQUFwQixFQUE4QjtBQUM1QixXQUFPQSxLQUFQO0FBQ0Q7O0FBQ0QsTUFBSVUsTUFBTSxHQUFJVixLQUFLLEdBQUcsRUFBdEI7QUFDQSxTQUFRVSxNQUFNLElBQUksR0FBVixJQUFrQixJQUFJVixLQUFMLElBQWUsQ0FBQ0ksUUFBbEMsR0FBOEMsSUFBOUMsR0FBcURNLE1BQTVEO0FBQ0QsQ0FQRDs7QUFTQSxJQUFNeEIsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQWMsS0FBSztBQUFBLFNBQUlBLEtBQUssSUFBSSxJQUFULEdBQWdCLEVBQWhCLEdBQXFCUyxZQUFZLENBQUNULEtBQUQsQ0FBckM7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNakIsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQWlCLEtBQUs7QUFBQSxTQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckI7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNaEIsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQWdCLEtBQUs7QUFBQSxTQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBckI7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNVyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBWCxLQUFLO0FBQUEsU0FBSSxRQUFPQSxLQUFQLE1BQWlCLFFBQXJCO0FBQUEsQ0FBdEI7O0FBRUEsSUFBTWxCLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUFrQixLQUFLO0FBQUEsU0FBSUEsS0FBSyxLQUFLWSxTQUFWLElBQXVCWixLQUFLLEtBQUssSUFBckM7QUFBQSxDQUF2Qjs7QUFFQWIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2ZOLFdBQVMsRUFBVEEsU0FEZTtBQUVmRyxTQUFPLEVBQVBBLE9BRmU7QUFHZkYsVUFBUSxFQUFSQSxRQUhlO0FBSWZDLFVBQVEsRUFBUkEsUUFKZTtBQUtmMkIsVUFBUSxFQUFSQSxRQUxlO0FBTWZ6QixVQUFRLEVBQVJBO0FBTmUsQ0FBakIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUMxQnFETCxtQkFBTyxDQUFDLHVDQUFELEM7SUFBcERnQyxXLFlBQUFBLFc7SUFBYUMsYyxZQUFBQSxjO0lBQWdCQyxXLFlBQUFBLFc7O2dCQUN3QmxDLG1CQUFPLENBQUMsK0RBQUQsQztJQUE1REksTyxhQUFBQSxPO0lBQVNILFMsYUFBQUEsUztJQUFXQyxRLGFBQUFBLFE7SUFBVUMsUSxhQUFBQSxRO0lBQVUyQixRLGFBQUFBLFE7O0FBQ2hELElBQU1LLEdBQUcsR0FBR25DLG1CQUFPLENBQUMsMkNBQUQsQ0FBbkI7O2dCQUNrQ0EsbUJBQU8sQ0FBQyxxQ0FBRCxDO0lBQWpDb0MsVyxhQUFBQSxXO0lBQWFDLFEsYUFBQUEsUTs7Z0JBQ3dCckMsbUJBQU8sQ0FBQyw2Q0FBRCxDO0lBQTVDc0MsZ0IsYUFBQUEsZ0I7SUFBa0JDLGMsYUFBQUEsYzs7Z0JBQ0x2QyxtQkFBTyxDQUFDLCtFQUFELEM7SUFBcEJ3QyxRLGFBQUFBLFEsRUFFUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLElBQUlDLFdBQVcsR0FBRztBQUNoQjtBQUNBO0FBQ0FDLGlCQUFlLEVBQUUsS0FIRDtBQUloQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLFVBQVEsRUFBRSxHQVRNO0FBVWhCO0FBQ0FDLGdCQUFjLEVBQUUsS0FYQTtBQVloQjtBQUNBO0FBQ0FDLE9BQUssRUFBRVYsR0FkUztBQWVoQlcsZ0JBQWMsRUFBRSxLQWZBO0FBZ0JoQkMsY0FBWSxFQUFFLEtBaEJFO0FBaUJoQjtBQUNBQyxNQUFJLEVBQUUsRUFsQlU7QUFtQmhCO0FBQ0FDLFVBQVEsRUFBRSxDQXBCTTtBQXFCaEI7QUFDQUMsb0JBQWtCLEVBQUUsQ0F0Qko7QUF1QmhCO0FBQ0FDLFlBQVUsRUFBRSxJQXhCSTtBQXlCaEI7QUFDQUMsUUFBTSxFQUFFLGdCQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxXQUFXRCxDQUFDLENBQUNFLEtBQUYsR0FBVUQsQ0FBQyxDQUFDQyxLQUF2QjtBQUFBLEdBMUJRO0FBMkJoQjtBQUNBO0FBQ0FDLFdBQVMsRUFBRSxHQTdCSztBQThCaEI7QUFDQUMsbUJBQWlCLEVBQUU7QUEvQkgsQ0FBbEI7O0lBa0NNQyxJO0FBQ0osZ0JBQVloRCxJQUFaLEVBQXVEO0FBQUEsUUFBckNpRCxPQUFxQyx1RUFBM0JsQixXQUEyQjtBQUFBLFFBQWRtQixLQUFjLHVFQUFOLElBQU07O0FBQUE7O0FBQ3JELFNBQUtELE9BQUwscUJBQW9CbEIsV0FBcEIsTUFBb0NrQixPQUFwQyxFQURxRCxDQUVyRDs7QUFDQSxTQUFLQSxPQUFMLENBQWFqQixlQUFiLEdBQStCaUIsT0FBTyxDQUFDRSxhQUF2QztBQUNBLFdBQU8sS0FBS0YsT0FBTCxDQUFhRSxhQUFwQixDQUpxRCxDQU1yRDs7QUFDQSxTQUFLQyxZQUFMLENBQWtCLEtBQUtILE9BQUwsQ0FBYVgsSUFBL0I7O0FBQ0EsU0FBS2UsYUFBTCxDQUFtQnJELElBQW5CLEVBQXlCa0QsS0FBekIsRUFScUQsQ0FTckQ7QUFDRDs7OztrQ0FFYWxELEksRUFBb0I7QUFBQSxVQUFka0QsS0FBYyx1RUFBTixJQUFNO0FBQ2hDLFdBQUtsRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxXQUFLc0QsaUJBQUwsR0FBeUI5RCxRQUFRLENBQUNRLElBQUksQ0FBQyxDQUFELENBQUwsQ0FBakM7O0FBRUEsVUFBSWtELEtBQUosRUFBVztBQUNULGFBQUtLLFFBQUwsQ0FBY0wsS0FBZDtBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0EsYUFBS0ssUUFBTCxDQUFjLEtBQUtDLFlBQUwsRUFBZCxFQUZLLENBR0w7QUFDRDtBQUNGOzs7NkJBRVFDLFMsRUFBVztBQUNsQixXQUFLQyxZQUFMLEdBQW9CRCxTQUFwQixDQURrQixDQUVsQjtBQUNEOzs7aUNBRVluQixJLEVBQU07QUFDakIsV0FBS3FCLFNBQUwsR0FBaUIsSUFBSWhDLFFBQUosQ0FBYVcsSUFBYixDQUFqQixDQURpQixDQUdqQjs7QUFDQSxVQUFJVSxJQUFJLENBQUNZLE9BQVQsRUFBa0IsQ0FDaEI7QUFDRDtBQUNGOzs7bUNBRWM7QUFDYixhQUFPbEMsV0FBVyxDQUFDLEtBQUtpQyxTQUFMLENBQWVyQixJQUFmLEVBQUQsRUFBd0IsS0FBS3RDLElBQTdCLEVBQW1DO0FBQ25EbUMsYUFBSyxFQUFFLEtBQUtjLE9BQUwsQ0FBYWQ7QUFEK0IsT0FBbkMsQ0FBbEI7QUFHRDs7OzJCQUVNMEIsTyxFQUFrQztBQUFBLFVBQXpCQyxJQUF5Qix1RUFBbEI7QUFBRUMsYUFBSyxFQUFFO0FBQVQsT0FBa0I7QUFDdkM7QUFEdUMsMEJBRUcsS0FBS2QsT0FGUjtBQUFBLFVBRS9CRixpQkFGK0IsaUJBRS9CQSxpQkFGK0I7QUFBQSxVQUVaTixVQUZZLGlCQUVaQSxVQUZZO0FBSXZDLFVBQUl1QixRQUFRLEdBQUcsSUFBZjs7QUFFQSxVQUFJakIsaUJBQUosRUFBdUI7QUFDckJpQixnQkFBUSxHQUFHLElBQUl6QyxjQUFKLENBQW1Cc0MsT0FBbkIsRUFBNEIsS0FBS1osT0FBakMsQ0FBWDtBQUNELE9BRkQsTUFFTyxJQUFJWSxPQUFPLENBQUNqRCxNQUFSLEdBQWlCa0IsUUFBckIsRUFBK0I7QUFDcENrQyxnQkFBUSxHQUFHLElBQUl4QyxXQUFKLENBQWdCcUMsT0FBaEIsRUFBeUIsS0FBS1osT0FBOUIsQ0FBWDtBQUNELE9BRk0sTUFFQTtBQUNMZSxnQkFBUSxHQUFHLElBQUkxQyxXQUFKLENBQWdCdUMsT0FBaEIsRUFBeUIsS0FBS1osT0FBOUIsQ0FBWDtBQUNELE9BWnNDLENBY3ZDOzs7QUFDQSxVQUFJZ0IsT0FBTyxHQUFHLEtBQUtDLFlBQUwsQ0FBa0JGLFFBQWxCLENBQWQsQ0FmdUMsQ0FnQnZDO0FBRUE7OztBQUNBLFdBQUtHLGFBQUwsQ0FBbUJGLE9BQW5CLEVBbkJ1QyxDQW9CdkM7OztBQUVBLFVBQUl4QixVQUFKLEVBQWdCO0FBQ2QsYUFBSzJCLEtBQUwsQ0FBV0gsT0FBWDtBQUNEOztBQUVELFVBQUlILElBQUksQ0FBQ0MsS0FBTCxJQUFjdEUsUUFBUSxDQUFDcUUsSUFBSSxDQUFDQyxLQUFOLENBQTFCLEVBQXdDO0FBQ3RDRSxlQUFPLEdBQUdBLE9BQU8sQ0FBQ3pELEtBQVIsQ0FBYyxDQUFkLEVBQWlCc0QsSUFBSSxDQUFDQyxLQUF0QixDQUFWO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLTSxPQUFMLENBQWFKLE9BQWIsQ0FBUDtBQUNEOzs7aUNBRVlELFEsRUFBVTtBQUNyQixVQUFNaEUsSUFBSSxHQUFHLEtBQUswRCxZQUFsQjtBQUNBLFVBQU1PLE9BQU8sR0FBRyxFQUFoQjtBQUZxQixVQUdiN0IsY0FIYSxHQUdNLEtBQUthLE9BSFgsQ0FHYmIsY0FIYSxFQUtyQjs7QUFDQSxVQUFJLEtBQUtrQixpQkFBVCxFQUE0QjtBQUMxQjtBQUNBLGFBQUssSUFBSTVDLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR1gsSUFBSSxDQUFDWSxNQUEzQixFQUFtQ0YsQ0FBQyxHQUFHQyxHQUF2QyxFQUE0Q0QsQ0FBQyxJQUFJLENBQWpELEVBQW9EO0FBQ2xELGNBQUlELEtBQUssR0FBR1QsSUFBSSxDQUFDVSxDQUFELENBQWhCO0FBRGtELGNBRXpDNEQsSUFGeUMsR0FFM0I3RCxLQUYyQixDQUU1QzhELENBRjRDO0FBQUEsY0FFbkNDLEdBRm1DLEdBRTNCL0QsS0FGMkIsQ0FFbkMrRCxHQUZtQzs7QUFJbEQsY0FBSSxDQUFDakYsU0FBUyxDQUFDK0UsSUFBRCxDQUFkLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQsY0FBSUcsWUFBWSxHQUFHVCxRQUFRLENBQUNVLFFBQVQsQ0FBa0JqRSxLQUFsQixDQUFuQjtBQVJrRCxjQVUxQ2tFLE9BVjBDLEdBVXZCRixZQVZ1QixDQVUxQ0UsT0FWMEM7QUFBQSxjQVVqQzlCLEtBVmlDLEdBVXZCNEIsWUFWdUIsQ0FVakM1QixLQVZpQzs7QUFZbEQsY0FBSSxDQUFDOEIsT0FBTCxFQUFjO0FBQ1o7QUFDRDs7QUFFRCxjQUFJQyxLQUFLLEdBQUc7QUFBRS9CLGlCQUFLLEVBQUxBLEtBQUY7QUFBU3BDLGlCQUFLLEVBQUU2RDtBQUFoQixXQUFaOztBQUVBLGNBQUlsQyxjQUFKLEVBQW9CO0FBQ2xCd0MsaUJBQUssQ0FBQ0MsT0FBTixHQUFnQkosWUFBWSxDQUFDSyxjQUE3QjtBQUNEOztBQUVEYixpQkFBTyxDQUFDOUQsSUFBUixDQUFhO0FBQ1g0RSxnQkFBSSxFQUFFVCxJQURLO0FBRVhFLGVBQUcsRUFBSEEsR0FGVztBQUdYUSxtQkFBTyxFQUFFLENBQUNKLEtBQUQ7QUFIRSxXQUFiO0FBS0Q7QUFFRixPQS9CRCxNQStCTztBQUNMO0FBQ0EsWUFBTUssUUFBUSxHQUFHLEtBQUt0QixTQUFMLENBQWVyQixJQUFmLEVBQWpCOztBQUNBLFlBQU00QyxPQUFPLEdBQUcsS0FBS3ZCLFNBQUwsQ0FBZXdCLEtBQWYsRUFBaEI7O0FBRUEsYUFBSyxJQUFJekUsRUFBQyxHQUFHLENBQVIsRUFBV0MsSUFBRyxHQUFHWCxJQUFJLENBQUNZLE1BQTNCLEVBQW1DRixFQUFDLEdBQUdDLElBQXZDLEVBQTRDRCxFQUFDLElBQUksQ0FBakQsRUFBb0Q7QUFBQSx5QkFDM0JWLElBQUksQ0FBQ1UsRUFBRCxDQUR1QjtBQUFBLGNBQ3pDcUUsSUFEeUMsWUFDNUNSLENBRDRDO0FBQUEsY0FDbkNDLElBRG1DLFlBQ25DQSxHQURtQzs7QUFHbEQsY0FBSSxDQUFDakYsU0FBUyxDQUFDd0YsSUFBRCxDQUFkLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQsY0FBSUMsT0FBTyxHQUFHLEVBQWQsQ0FQa0QsQ0FTbEQ7O0FBQ0EsZUFBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixPQUFwQixFQUE2QkUsQ0FBQyxJQUFJLENBQWxDLEVBQXFDO0FBQ25DLGdCQUFJOUUsR0FBRyxHQUFHMkUsUUFBUSxDQUFDRyxDQUFELENBQWxCO0FBQ0EsZ0JBQUkzRSxNQUFLLEdBQUdzRSxJQUFJLENBQUN6RSxHQUFELENBQWhCLENBRm1DLENBSW5DOztBQUVBLGdCQUFJLENBQUNmLFNBQVMsQ0FBQ2tCLE1BQUQsQ0FBZCxFQUF1QjtBQUNyQjtBQUNEOztBQUVELGdCQUFJZixPQUFPLENBQUNlLE1BQUQsQ0FBWCxFQUFvQjtBQUNsQixtQkFBSyxJQUFJNEUsQ0FBQyxHQUFHLENBQVIsRUFBVzFFLEtBQUcsR0FBR0YsTUFBSyxDQUFDRyxNQUE1QixFQUFvQ3lFLENBQUMsR0FBRzFFLEtBQXhDLEVBQTZDMEUsQ0FBQyxJQUFJLENBQWxELEVBQXFEO0FBQ25ELG9CQUFJQyxPQUFPLEdBQUc3RSxNQUFLLENBQUM0RSxDQUFELENBQW5CO0FBQ0Esb0JBQUlmLEtBQUksR0FBR2dCLE9BQU8sQ0FBQ2YsQ0FBbkI7QUFDQSxvQkFBSUMsS0FBRyxHQUFHYyxPQUFPLENBQUNkLEdBQWxCOztBQUVBLG9CQUFJLENBQUNqRixTQUFTLENBQUMrRSxLQUFELENBQWQsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxvQkFBSUcsYUFBWSxHQUFHVCxRQUFRLENBQUNVLFFBQVQsQ0FBa0JZLE9BQWxCLENBQW5COztBQVRtRCxvQkFXM0NYLFFBWDJDLEdBV3hCRixhQVh3QixDQVczQ0UsT0FYMkM7QUFBQSxvQkFXbEM5QixNQVhrQyxHQVd4QjRCLGFBWHdCLENBV2xDNUIsS0FYa0MsRUFhbkQ7O0FBRUEsb0JBQUksQ0FBQzhCLFFBQUwsRUFBYztBQUNaO0FBQ0Q7O0FBRUQsb0JBQUlDLE1BQUssR0FBRztBQUFFL0IsdUJBQUssRUFBTEEsTUFBRjtBQUFTdkMscUJBQUcsRUFBSEEsR0FBVDtBQUFjRyx1QkFBSyxFQUFFNkQsS0FBckI7QUFBMkJFLHFCQUFHLEVBQUhBO0FBQTNCLGlCQUFaOztBQUVBLG9CQUFJcEMsY0FBSixFQUFvQjtBQUNsQndDLHdCQUFLLENBQUNDLE9BQU4sR0FBZ0JKLGFBQVksQ0FBQ0ssY0FBN0I7QUFDRDs7QUFFREUsdUJBQU8sQ0FBQzdFLElBQVIsQ0FBYXlFLE1BQWI7QUFDRDtBQUNGLGFBNUJELE1BNEJPO0FBQ0wsa0JBQUlOLE1BQUksR0FBRzdELE1BQUssQ0FBQzhELENBQWpCOztBQUNBLGtCQUFJRSxjQUFZLEdBQUdULFFBQVEsQ0FBQ1UsUUFBVCxDQUFrQmpFLE1BQWxCLENBQW5COztBQUZLLGtCQUlHa0UsU0FKSCxHQUlzQkYsY0FKdEIsQ0FJR0UsT0FKSDtBQUFBLGtCQUlZOUIsT0FKWixHQUlzQjRCLGNBSnRCLENBSVk1QixLQUpaLEVBTUw7O0FBRUEsa0JBQUksQ0FBQzhCLFNBQUwsRUFBYztBQUNaO0FBQ0Q7O0FBRUQsa0JBQUlDLE9BQUssR0FBRztBQUFFL0IscUJBQUssRUFBTEEsT0FBRjtBQUFTdkMsbUJBQUcsRUFBSEEsR0FBVDtBQUFjRyxxQkFBSyxFQUFFNkQ7QUFBckIsZUFBWjs7QUFFQSxrQkFBSWxDLGNBQUosRUFBb0I7QUFDbEJ3Qyx1QkFBSyxDQUFDQyxPQUFOLEdBQWdCSixjQUFZLENBQUNLLGNBQTdCO0FBQ0Q7O0FBRURFLHFCQUFPLENBQUM3RSxJQUFSLENBQWF5RSxPQUFiO0FBQ0Q7QUFDRjs7QUFFRCxjQUFJSSxPQUFPLENBQUNwRSxNQUFaLEVBQW9CO0FBQ2xCcUQsbUJBQU8sQ0FBQzlELElBQVIsQ0FBYTtBQUNYcUUsaUJBQUcsRUFBSEEsSUFEVztBQUVYTyxrQkFBSSxFQUFKQSxJQUZXO0FBR1hDLHFCQUFPLEVBQVBBO0FBSFcsYUFBYjtBQUtEO0FBQ0Y7QUFDRixPQXhIb0IsQ0EwSHJCO0FBQ0E7QUFDQTs7O0FBRUEsYUFBT2YsT0FBUDtBQUNEOzs7a0NBRWFBLE8sRUFBUztBQUNyQjtBQUVBLFdBQUssSUFBSXZELENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR3NELE9BQU8sQ0FBQ3JELE1BQTlCLEVBQXNDRixDQUFDLEdBQUdDLEdBQTFDLEVBQStDRCxDQUFDLElBQUksQ0FBcEQsRUFBdUQ7QUFDckQsWUFBTVMsTUFBTSxHQUFHOEMsT0FBTyxDQUFDdkQsQ0FBRCxDQUF0QjtBQUNBLFlBQU1zRSxPQUFPLEdBQUc3RCxNQUFNLENBQUM2RCxPQUF2QjtBQUNBLFlBQU1PLFFBQVEsR0FBR1AsT0FBTyxDQUFDcEUsTUFBekI7QUFFQSxZQUFJNEUsa0JBQWtCLEdBQUcsQ0FBekIsQ0FMcUQsQ0FNckQ7O0FBRUEsYUFBSyxJQUFJSixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRyxRQUFwQixFQUE4QkgsQ0FBQyxJQUFJLENBQW5DLEVBQXNDO0FBQ3BDLGNBQU1MLElBQUksR0FBR0MsT0FBTyxDQUFDSSxDQUFELENBQXBCO0FBQ0EsY0FBTTlFLEdBQUcsR0FBR3lFLElBQUksQ0FBQ3pFLEdBQWpCOztBQUNBLGNBQU1tRixTQUFTLEdBQUcsS0FBSzlCLFNBQUwsQ0FBZWxDLEdBQWYsQ0FBbUJuQixHQUFuQixFQUF3QixRQUF4QixDQUFsQjs7QUFDQSxjQUFNb0YsTUFBTSxHQUFHRCxTQUFTLElBQUksQ0FBNUI7QUFDQSxjQUFNNUMsS0FBSyxHQUFHa0MsSUFBSSxDQUFDbEMsS0FBTCxLQUFlLENBQWYsSUFBb0I0QyxTQUFwQixJQUFpQ0EsU0FBUyxHQUFHLENBQTdDLEdBQ1ZFLE1BQU0sQ0FBQ0MsT0FERyxHQUVWYixJQUFJLENBQUNsQyxLQUZUO0FBSUEyQyw0QkFBa0IsSUFBSUssSUFBSSxDQUFDQyxHQUFMLENBQVNqRCxLQUFULEVBQWdCNkMsTUFBaEIsQ0FBdEIsQ0FUb0MsQ0FXcEM7QUFDQTtBQUNBO0FBQ0Q7O0FBRUR2RSxjQUFNLENBQUMwQixLQUFQLEdBQWUyQyxrQkFBZixDQXhCcUQsQ0F5QnJEO0FBRUE7QUFDRDtBQUNGOzs7MEJBRUt2QixPLEVBQVM7QUFDYjtBQUNBQSxhQUFPLENBQUM4QixJQUFSLENBQWEsS0FBSzlDLE9BQUwsQ0FBYVAsTUFBMUI7QUFDRDs7OzRCQUVPdUIsTyxFQUFTO0FBQ2YsVUFBTStCLFdBQVcsR0FBRyxFQUFwQjtBQURlLDJCQUcyQixLQUFLL0MsT0FIaEM7QUFBQSxVQUdQYixjQUhPLGtCQUdQQSxjQUhPO0FBQUEsVUFHU0MsWUFIVCxrQkFHU0EsWUFIVCxFQUtmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFJNEQsWUFBWSxHQUFHLEVBQW5CO0FBRUEsVUFBSTdELGNBQUosRUFBb0I2RCxZQUFZLENBQUM5RixJQUFiLENBQWtCeUIsZ0JBQWxCO0FBQ3BCLFVBQUlTLFlBQUosRUFBa0I0RCxZQUFZLENBQUM5RixJQUFiLENBQWtCMEIsY0FBbEIsRUF4QkgsQ0EwQmY7QUFDQTtBQUNBOztBQUVBLFdBQUssSUFBSW5CLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR3NELE9BQU8sQ0FBQ3JELE1BQTlCLEVBQXNDRixDQUFDLEdBQUdDLEdBQTFDLEVBQStDRCxDQUFDLElBQUksQ0FBcEQsRUFBdUQ7QUFDckQsWUFBTVMsTUFBTSxHQUFHOEMsT0FBTyxDQUFDdkQsQ0FBRCxDQUF0QixDQURxRCxDQUdyRDs7QUFIcUQsWUFLN0M4RCxHQUw2QyxHQUtyQ3JELE1BTHFDLENBSzdDcUQsR0FMNkM7QUFPckQsWUFBTTBCLElBQUksR0FBRztBQUNYbkIsY0FBSSxFQUFFLEtBQUsvRSxJQUFMLENBQVV3RSxHQUFWLENBREs7QUFFWDJCLGtCQUFRLEVBQUUzQjtBQUZDLFNBQWI7O0FBS0EsWUFBSXlCLFlBQVksQ0FBQ3JGLE1BQWpCLEVBQXlCO0FBQ3ZCLGVBQUssSUFBSXdFLENBQUMsR0FBRyxDQUFSLEVBQVd6RSxLQUFHLEdBQUdzRixZQUFZLENBQUNyRixNQUFuQyxFQUEyQ3dFLENBQUMsR0FBR3pFLEtBQS9DLEVBQW9EeUUsQ0FBQyxJQUFJLENBQXpELEVBQTREO0FBQzFEYSx3QkFBWSxDQUFDYixDQUFELENBQVosQ0FBZ0JqRSxNQUFoQixFQUF3QitFLElBQXhCO0FBQ0Q7QUFDRjs7QUFHREYsbUJBQVcsQ0FBQzdGLElBQVosQ0FBaUIrRixJQUFqQjtBQUNEOztBQUVELGFBQU9GLFdBQVA7QUFDRDs7Ozs7O0FBR0hoRCxJQUFJLENBQUN0QixXQUFMLEdBQW1CQSxXQUFuQjtBQUVBOUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbUQsSUFBakIsQzs7Ozs7Ozs7Ozs7QUNoWEFwRCxNQUFNLENBQUNDLE9BQVAsR0FBaUIsWUFBNEM7QUFBQSxNQUEzQ3VHLFNBQTJDLHVFQUEvQixFQUErQjtBQUFBLE1BQTNCNUQsa0JBQTJCLHVFQUFOLENBQU07QUFDM0QsTUFBSXNDLGNBQWMsR0FBRyxFQUFyQjtBQUNBLE1BQUl1QixLQUFLLEdBQUcsQ0FBQyxDQUFiO0FBQ0EsTUFBSUMsR0FBRyxHQUFHLENBQUMsQ0FBWDtBQUNBLE1BQUk1RixDQUFDLEdBQUcsQ0FBUjs7QUFFQSxPQUFLLElBQUlDLEdBQUcsR0FBR3lGLFNBQVMsQ0FBQ3hGLE1BQXpCLEVBQWlDRixDQUFDLEdBQUdDLEdBQXJDLEVBQTBDRCxDQUFDLElBQUksQ0FBL0MsRUFBa0Q7QUFDaEQsUUFBSWtFLEtBQUssR0FBR3dCLFNBQVMsQ0FBQzFGLENBQUQsQ0FBckI7O0FBQ0EsUUFBSWtFLEtBQUssSUFBSXlCLEtBQUssS0FBSyxDQUFDLENBQXhCLEVBQTJCO0FBQ3pCQSxXQUFLLEdBQUczRixDQUFSO0FBQ0QsS0FGRCxNQUVPLElBQUksQ0FBQ2tFLEtBQUQsSUFBVXlCLEtBQUssS0FBSyxDQUFDLENBQXpCLEVBQTRCO0FBQ2pDQyxTQUFHLEdBQUc1RixDQUFDLEdBQUcsQ0FBVjs7QUFDQSxVQUFLNEYsR0FBRyxHQUFHRCxLQUFQLEdBQWdCLENBQWhCLElBQXFCN0Qsa0JBQXpCLEVBQTZDO0FBQzNDc0Msc0JBQWMsQ0FBQzNFLElBQWYsQ0FBb0IsQ0FBQ2tHLEtBQUQsRUFBUUMsR0FBUixDQUFwQjtBQUNEOztBQUNERCxXQUFLLEdBQUcsQ0FBQyxDQUFUO0FBQ0Q7QUFDRixHQWpCMEQsQ0FtQjNEOzs7QUFDQSxNQUFJRCxTQUFTLENBQUMxRixDQUFDLEdBQUcsQ0FBTCxDQUFULElBQXFCQSxDQUFDLEdBQUcyRixLQUFMLElBQWU3RCxrQkFBdkMsRUFBMkQ7QUFDekRzQyxrQkFBYyxDQUFDM0UsSUFBZixDQUFvQixDQUFDa0csS0FBRCxFQUFRM0YsQ0FBQyxHQUFHLENBQVosQ0FBcEI7QUFDRDs7QUFFRCxTQUFPb0UsY0FBUDtBQUNELENBekJELEM7Ozs7Ozs7Ozs7O0FDQUFsRixNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQWdFLE9BQU8sRUFBSTtBQUMxQixNQUFJMEMsSUFBSSxHQUFHLEVBQVg7QUFDQSxNQUFJNUYsR0FBRyxHQUFHa0QsT0FBTyxDQUFDakQsTUFBbEI7O0FBRUEsT0FBSyxJQUFJRixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHQyxHQUFwQixFQUF5QkQsQ0FBQyxJQUFJLENBQTlCLEVBQWlDO0FBQy9CNkYsUUFBSSxDQUFDMUMsT0FBTyxDQUFDMkMsTUFBUixDQUFlOUYsQ0FBZixDQUFELENBQUosR0FBMEIsQ0FBMUI7QUFDRDs7QUFFRCxPQUFLLElBQUlBLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdDLEdBQXBCLEVBQXlCRCxFQUFDLElBQUksQ0FBOUIsRUFBaUM7QUFDL0I2RixRQUFJLENBQUMxQyxPQUFPLENBQUMyQyxNQUFSLENBQWU5RixFQUFmLENBQUQsQ0FBSixJQUEyQixLQUFNQyxHQUFHLEdBQUdELEVBQU4sR0FBVSxDQUEzQztBQUNEOztBQUVELFNBQU82RixJQUFQO0FBQ0QsQ0FiRCxDOzs7Ozs7Ozs7OztBQ0FBM0csTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUNnRSxPQUFELFFBQXdGO0FBQUEseUJBQTVFNEMsTUFBNEU7QUFBQSxNQUE1RUEsTUFBNEUsNEJBQW5FLENBQW1FO0FBQUEsa0NBQWhFQyxlQUFnRTtBQUFBLE1BQWhFQSxlQUFnRSxxQ0FBOUMsQ0FBOEM7QUFBQSxtQ0FBM0NDLGdCQUEyQztBQUFBLE1BQTNDQSxnQkFBMkMsc0NBQXhCLENBQXdCO0FBQUEsMkJBQXJCMUUsUUFBcUI7QUFBQSxNQUFyQkEsUUFBcUIsOEJBQVYsR0FBVTtBQUN2RyxNQUFNMkUsUUFBUSxHQUFHSCxNQUFNLEdBQUc1QyxPQUFPLENBQUNqRCxNQUFsQztBQUNBLE1BQU1pRyxTQUFTLEdBQUdoQixJQUFJLENBQUNpQixHQUFMLENBQVNILGdCQUFnQixHQUFHRCxlQUE1QixDQUFsQjs7QUFFQSxNQUFJLENBQUN6RSxRQUFMLEVBQWU7QUFDYjtBQUNBLFdBQU80RSxTQUFTLEdBQUcsR0FBSCxHQUFTRCxRQUF6QjtBQUNEOztBQUVELFNBQU9BLFFBQVEsR0FBSUMsU0FBUyxHQUFHNUUsUUFBL0I7QUFDRCxDQVZELEM7Ozs7Ozs7Ozs7O0FDQUEsSUFBTThFLFVBQVUsR0FBR3pILG1CQUFPLENBQUMsK0RBQUQsQ0FBMUI7O0FBQ0EsSUFBTXdGLGNBQWMsR0FBR3hGLG1CQUFPLENBQUMsbUZBQUQsQ0FBOUI7O0FBRUFNLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFDeUUsSUFBRCxFQUFPVCxPQUFQLEVBQWdCbUQsZUFBaEIsUUFBK0o7QUFBQSwyQkFBNUh6RSxRQUE0SDtBQUFBLE1BQTVIQSxRQUE0SCw4QkFBakgsQ0FBaUg7QUFBQSwyQkFBOUdOLFFBQThHO0FBQUEsTUFBOUdBLFFBQThHLDhCQUFuRyxHQUFtRztBQUFBLDRCQUE5RmEsU0FBOEY7QUFBQSxNQUE5RkEsU0FBOEYsK0JBQWxGLEdBQWtGO0FBQUEsaUNBQTdFWixjQUE2RTtBQUFBLE1BQTdFQSxjQUE2RSxvQ0FBNUQsS0FBNEQ7QUFBQSxtQ0FBckRNLGtCQUFxRDtBQUFBLE1BQXJEQSxrQkFBcUQsc0NBQWhDLENBQWdDO0FBQUEsaUNBQTdCSixjQUE2QjtBQUFBLE1BQTdCQSxjQUE2QixvQ0FBWixLQUFZO0FBQzlLLE1BQU02RSxVQUFVLEdBQUdwRCxPQUFPLENBQUNqRCxNQUEzQixDQUQ4SyxDQUU5Szs7QUFDQSxNQUFNc0csT0FBTyxHQUFHNUMsSUFBSSxDQUFDMUQsTUFBckIsQ0FIOEssQ0FJOUs7O0FBQ0EsTUFBTStGLGdCQUFnQixHQUFHZCxJQUFJLENBQUNzQixHQUFMLENBQVMsQ0FBVCxFQUFZdEIsSUFBSSxDQUFDdUIsR0FBTCxDQUFTN0UsUUFBVCxFQUFtQjJFLE9BQW5CLENBQVosQ0FBekIsQ0FMOEssQ0FNOUs7O0FBQ0EsTUFBSUcsZ0JBQWdCLEdBQUd2RSxTQUF2QixDQVA4SyxDQVE5Szs7QUFDQSxNQUFJd0UsWUFBWSxHQUFHaEQsSUFBSSxDQUFDakUsT0FBTCxDQUFhd0QsT0FBYixFQUFzQjhDLGdCQUF0QixDQUFuQixDQVQ4SyxDQVc5Szs7QUFDQSxNQUFNWSxTQUFTLEdBQUcsRUFBbEI7O0FBQ0EsT0FBSyxJQUFJN0csQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3dHLE9BQXBCLEVBQTZCeEcsQ0FBQyxJQUFJLENBQWxDLEVBQXFDO0FBQ25DNkcsYUFBUyxDQUFDN0csQ0FBRCxDQUFULEdBQWUsQ0FBZjtBQUNEOztBQUVELE1BQUk0RyxZQUFZLEtBQUssQ0FBQyxDQUF0QixFQUF5QjtBQUN2QixRQUFJekUsS0FBSyxHQUFHa0UsVUFBVSxDQUFDbEQsT0FBRCxFQUFVO0FBQzlCNEMsWUFBTSxFQUFFLENBRHNCO0FBRTlCQyxxQkFBZSxFQUFFWSxZQUZhO0FBRzlCWCxzQkFBZ0IsRUFBaEJBLGdCQUg4QjtBQUk5QjFFLGNBQVEsRUFBUkE7QUFKOEIsS0FBVixDQUF0QjtBQU1Bb0Ysb0JBQWdCLEdBQUd4QixJQUFJLENBQUN1QixHQUFMLENBQVN2RSxLQUFULEVBQWdCd0UsZ0JBQWhCLENBQW5CLENBUHVCLENBU3ZCOztBQUNBQyxnQkFBWSxHQUFHaEQsSUFBSSxDQUFDa0QsV0FBTCxDQUFpQjNELE9BQWpCLEVBQTBCOEMsZ0JBQWdCLEdBQUdNLFVBQTdDLENBQWY7O0FBRUEsUUFBSUssWUFBWSxLQUFLLENBQUMsQ0FBdEIsRUFBeUI7QUFDdkIsVUFBSXpFLE1BQUssR0FBR2tFLFVBQVUsQ0FBQ2xELE9BQUQsRUFBVTtBQUM5QjRDLGNBQU0sRUFBRSxDQURzQjtBQUU5QkMsdUJBQWUsRUFBRVksWUFGYTtBQUc5Qlgsd0JBQWdCLEVBQWhCQSxnQkFIOEI7QUFJOUIxRSxnQkFBUSxFQUFSQTtBQUo4QixPQUFWLENBQXRCOztBQU1Bb0Ysc0JBQWdCLEdBQUd4QixJQUFJLENBQUN1QixHQUFMLENBQVN2RSxNQUFULEVBQWdCd0UsZ0JBQWhCLENBQW5CO0FBQ0Q7QUFDRixHQXRDNkssQ0F3QzlLOzs7QUFDQUMsY0FBWSxHQUFHLENBQUMsQ0FBaEI7QUFFQSxNQUFJRyxVQUFVLEdBQUcsRUFBakI7QUFDQSxNQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQSxNQUFJQyxNQUFNLEdBQUdWLFVBQVUsR0FBR0MsT0FBMUI7QUFFQSxNQUFNWCxJQUFJLEdBQUcsTUFBTVUsVUFBVSxJQUFJLEVBQWQsR0FBbUJBLFVBQVUsR0FBRyxDQUFoQyxHQUFvQyxFQUExQyxDQUFiOztBQUVBLE9BQUssSUFBSXZHLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUd1RyxVQUFwQixFQUFnQ3ZHLEVBQUMsSUFBSSxDQUFyQyxFQUF3QztBQUN0QztBQUNBO0FBQ0E7QUFDQSxRQUFJa0gsTUFBTSxHQUFHLENBQWI7QUFDQSxRQUFJQyxNQUFNLEdBQUdGLE1BQWI7O0FBRUEsV0FBT0MsTUFBTSxHQUFHQyxNQUFoQixFQUF3QjtBQUN0QixVQUFNaEYsT0FBSyxHQUFHa0UsVUFBVSxDQUFDbEQsT0FBRCxFQUFVO0FBQ2hDNEMsY0FBTSxFQUFFL0YsRUFEd0I7QUFFaENnRyx1QkFBZSxFQUFFQyxnQkFBZ0IsR0FBR2tCLE1BRko7QUFHaENsQix3QkFBZ0IsRUFBaEJBLGdCQUhnQztBQUloQzFFLGdCQUFRLEVBQVJBO0FBSmdDLE9BQVYsQ0FBeEI7O0FBT0EsVUFBSVksT0FBSyxJQUFJd0UsZ0JBQWIsRUFBK0I7QUFDN0JPLGNBQU0sR0FBR0MsTUFBVDtBQUNELE9BRkQsTUFFTztBQUNMRixjQUFNLEdBQUdFLE1BQVQ7QUFDRDs7QUFFREEsWUFBTSxHQUFHaEMsSUFBSSxDQUFDaUMsS0FBTCxDQUFXLENBQUNILE1BQU0sR0FBR0MsTUFBVixJQUFvQixDQUFwQixHQUF3QkEsTUFBbkMsQ0FBVDtBQUNELEtBdEJxQyxDQXdCdEM7OztBQUNBRCxVQUFNLEdBQUdFLE1BQVQ7QUFFQSxRQUFJeEIsS0FBSyxHQUFHUixJQUFJLENBQUNzQixHQUFMLENBQVMsQ0FBVCxFQUFZUixnQkFBZ0IsR0FBR2tCLE1BQW5CLEdBQTRCLENBQXhDLENBQVo7QUFDQSxRQUFJRSxNQUFNLEdBQUc3RixjQUFjLEdBQUdnRixPQUFILEdBQWFyQixJQUFJLENBQUN1QixHQUFMLENBQVNULGdCQUFnQixHQUFHa0IsTUFBNUIsRUFBb0NYLE9BQXBDLElBQStDRCxVQUF2RixDQTVCc0MsQ0E4QnRDOztBQUNBLFFBQUllLE1BQU0sR0FBR2xILEtBQUssQ0FBQ2lILE1BQU0sR0FBRyxDQUFWLENBQWxCO0FBRUFDLFVBQU0sQ0FBQ0QsTUFBTSxHQUFHLENBQVYsQ0FBTixHQUFxQixDQUFDLEtBQUtySCxFQUFOLElBQVcsQ0FBaEM7O0FBRUEsU0FBSyxJQUFJMEUsQ0FBQyxHQUFHMkMsTUFBYixFQUFxQjNDLENBQUMsSUFBSWlCLEtBQTFCLEVBQWlDakIsQ0FBQyxJQUFJLENBQXRDLEVBQXlDO0FBQ3ZDLFVBQUlzQixlQUFlLEdBQUd0QixDQUFDLEdBQUcsQ0FBMUI7QUFDQSxVQUFJNkMsU0FBUyxHQUFHakIsZUFBZSxDQUFDMUMsSUFBSSxDQUFDa0MsTUFBTCxDQUFZRSxlQUFaLENBQUQsQ0FBL0I7O0FBRUEsVUFBSXVCLFNBQUosRUFBZTtBQUNiVixpQkFBUyxDQUFDYixlQUFELENBQVQsR0FBNkIsQ0FBN0I7QUFDRCxPQU5zQyxDQVF2Qzs7O0FBQ0FzQixZQUFNLENBQUM1QyxDQUFELENBQU4sR0FBWSxDQUFFNEMsTUFBTSxDQUFDNUMsQ0FBQyxHQUFHLENBQUwsQ0FBTixJQUFpQixDQUFsQixHQUF1QixDQUF4QixJQUE2QjZDLFNBQXpDLENBVHVDLENBV3ZDOztBQUNBLFVBQUl2SCxFQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1hzSCxjQUFNLENBQUM1QyxDQUFELENBQU4sSUFBZSxDQUFDcUMsVUFBVSxDQUFDckMsQ0FBQyxHQUFHLENBQUwsQ0FBVixHQUFvQnFDLFVBQVUsQ0FBQ3JDLENBQUQsQ0FBL0IsS0FBdUMsQ0FBeEMsR0FBNkMsQ0FBOUMsR0FBbURxQyxVQUFVLENBQUNyQyxDQUFDLEdBQUcsQ0FBTCxDQUExRTtBQUNEOztBQUVELFVBQUk0QyxNQUFNLENBQUM1QyxDQUFELENBQU4sR0FBWW1CLElBQWhCLEVBQXNCO0FBQ3BCbUIsa0JBQVUsR0FBR1gsVUFBVSxDQUFDbEQsT0FBRCxFQUFVO0FBQy9CNEMsZ0JBQU0sRUFBRS9GLEVBRHVCO0FBRS9CZ0cseUJBQWUsRUFBZkEsZUFGK0I7QUFHL0JDLDBCQUFnQixFQUFoQkEsZ0JBSCtCO0FBSS9CMUUsa0JBQVEsRUFBUkE7QUFKK0IsU0FBVixDQUF2QixDQURvQixDQVFwQjtBQUNBOztBQUNBLFlBQUl5RixVQUFVLElBQUlMLGdCQUFsQixFQUFvQztBQUNsQztBQUNBQSwwQkFBZ0IsR0FBR0ssVUFBbkI7QUFDQUosc0JBQVksR0FBR1osZUFBZixDQUhrQyxDQUtsQzs7QUFDQSxjQUFJWSxZQUFZLElBQUlYLGdCQUFwQixFQUFzQztBQUNwQztBQUNELFdBUmlDLENBVWxDOzs7QUFDQU4sZUFBSyxHQUFHUixJQUFJLENBQUNzQixHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUlSLGdCQUFKLEdBQXVCVyxZQUFuQyxDQUFSO0FBQ0Q7QUFDRjtBQUNGLEtBM0VxQyxDQTZFdEM7OztBQUNBLFFBQU16RSxPQUFLLEdBQUdrRSxVQUFVLENBQUNsRCxPQUFELEVBQVU7QUFDaEM0QyxZQUFNLEVBQUUvRixFQUFDLEdBQUcsQ0FEb0I7QUFFaENnRyxxQkFBZSxFQUFFQyxnQkFGZTtBQUdoQ0Esc0JBQWdCLEVBQWhCQSxnQkFIZ0M7QUFJaEMxRSxjQUFRLEVBQVJBO0FBSmdDLEtBQVYsQ0FBeEI7O0FBT0EsUUFBSVksT0FBSyxHQUFHd0UsZ0JBQVosRUFBOEI7QUFDNUI7QUFDRDs7QUFFREksY0FBVSxHQUFHTyxNQUFiO0FBQ0Q7O0FBRUQsTUFBSTdHLE1BQU0sR0FBRztBQUNYd0QsV0FBTyxFQUFFMkMsWUFBWSxJQUFJLENBRGQ7QUFFWDtBQUNBekUsU0FBSyxFQUFFLENBQUM2RSxVQUFELEdBQWMsS0FBZCxHQUFzQkE7QUFIbEIsR0FBYjs7QUFNQSxNQUFJdEYsY0FBSixFQUFvQjtBQUNsQmpCLFVBQU0sQ0FBQzJELGNBQVAsR0FBd0JBLGNBQWMsQ0FBQ3lDLFNBQUQsRUFBWS9FLGtCQUFaLENBQXRDO0FBQ0Q7O0FBRUQsU0FBT3JCLE1BQVA7QUFDRCxDQXhKRCxDOzs7Ozs7Ozs7OztBQ0hBO0FBQ0F2QixNQUFNLENBQUNDLE9BQVAsQ0FBZWlDLFFBQWYsR0FBMEIsRUFBMUIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNEQSxJQUFNb0csV0FBVyxHQUFHNUksbUJBQU8sQ0FBQyxpRUFBRCxDQUEzQjs7QUFDQSxJQUFNMEgsZUFBZSxHQUFHMUgsbUJBQU8sQ0FBQyxxRkFBRCxDQUEvQjs7ZUFDcUJBLG1CQUFPLENBQUMsMkRBQUQsQztJQUFwQndDLFEsWUFBQUEsUTs7SUFFRlIsVztBQUNKLHVCQUFZdUMsT0FBWixRQXFCRztBQUFBLDZCQW5CRHRCLFFBbUJDO0FBQUEsUUFuQkRBLFFBbUJDLDhCQW5CVSxDQW1CVjtBQUFBLDZCQWJETixRQWFDO0FBQUEsUUFiREEsUUFhQyw4QkFiVSxHQWFWO0FBQUEsOEJBVkRhLFNBVUM7QUFBQSxRQVZEQSxTQVVDLCtCQVZXLEdBVVg7QUFBQSxvQ0FSRGQsZUFRQztBQUFBLFFBUkRBLGVBUUMscUNBUmlCLEtBUWpCO0FBQUEsbUNBTERFLGNBS0M7QUFBQSxRQUxEQSxjQUtDLG9DQUxnQixLQUtoQjtBQUFBLHFDQUhETSxrQkFHQztBQUFBLFFBSERBLGtCQUdDLHNDQUhvQixDQUdwQjtBQUFBLG1DQURESixjQUNDO0FBQUEsUUFEREEsY0FDQyxvQ0FEZ0IsS0FDaEI7O0FBQUE7O0FBQ0QsU0FBS2EsT0FBTCxHQUFlO0FBQ2JWLGNBQVEsRUFBUkEsUUFEYTtBQUViTixjQUFRLEVBQVJBLFFBRmE7QUFHYmEsZUFBUyxFQUFUQSxTQUhhO0FBSWJkLHFCQUFlLEVBQWZBLGVBSmE7QUFLYkUsb0JBQWMsRUFBZEEsY0FMYTtBQU1iRSxvQkFBYyxFQUFkQSxjQU5hO0FBT2JJLHdCQUFrQixFQUFsQkE7QUFQYSxLQUFmOztBQVVBLFFBQUlxQixPQUFPLENBQUNqRCxNQUFSLEdBQWlCa0IsUUFBckIsRUFBK0I7QUFDN0IsWUFBTSxJQUFJcUcsS0FBSix5Q0FBMkNyRyxRQUEzQyxPQUFOO0FBQ0Q7O0FBRUQsU0FBSytCLE9BQUwsR0FBZTdCLGVBQWUsR0FBRzZCLE9BQUgsR0FBYUEsT0FBTyxDQUFDdUUsV0FBUixFQUEzQztBQUNBLFNBQUtwQixlQUFMLEdBQXVCQSxlQUFlLENBQUMsS0FBS25ELE9BQU4sQ0FBdEM7QUFDRDs7Ozs2QkFFUXBELEssRUFBTztBQUNkLFVBQUk2RCxJQUFJLEdBQUc3RCxLQUFLLENBQUM4RCxDQUFqQjtBQURjLDBCQUc4QixLQUFLdEIsT0FIbkM7QUFBQSxVQUdOakIsZUFITSxpQkFHTkEsZUFITTtBQUFBLFVBR1dJLGNBSFgsaUJBR1dBLGNBSFg7O0FBS2QsVUFBSSxDQUFDSixlQUFMLEVBQXNCO0FBQ3BCc0MsWUFBSSxHQUFHQSxJQUFJLENBQUM4RCxXQUFMLEVBQVA7QUFDRCxPQVBhLENBU2Q7OztBQUNBLFVBQUksS0FBS3ZFLE9BQUwsS0FBaUJTLElBQXJCLEVBQTJCO0FBQ3pCLFlBQUluRCxNQUFNLEdBQUc7QUFDWHdELGlCQUFPLEVBQUUsSUFERTtBQUVYOUIsZUFBSyxFQUFFO0FBRkksU0FBYjs7QUFLQSxZQUFJVCxjQUFKLEVBQW9CO0FBQ2xCakIsZ0JBQU0sQ0FBQzJELGNBQVAsR0FBd0IsQ0FBQyxDQUFDLENBQUQsRUFBSVIsSUFBSSxDQUFDMUQsTUFBTCxHQUFjLENBQWxCLENBQUQsQ0FBeEI7QUFDRDs7QUFFRCxlQUFPTyxNQUFQO0FBQ0QsT0FyQmEsQ0F1QmQ7OztBQXZCYywyQkF3QmdFLEtBQUs4QixPQXhCckU7QUFBQSxVQXdCTlYsUUF4Qk0sa0JBd0JOQSxRQXhCTTtBQUFBLFVBd0JJTixRQXhCSixrQkF3QklBLFFBeEJKO0FBQUEsVUF3QmNhLFNBeEJkLGtCQXdCY0EsU0F4QmQ7QUFBQSxVQXdCeUJaLGNBeEJ6QixrQkF3QnlCQSxjQXhCekI7QUFBQSxVQXdCeUNNLGtCQXhCekMsa0JBd0J5Q0Esa0JBeEJ6QztBQXlCZCxhQUFPMEYsV0FBVyxDQUFDNUQsSUFBRCxFQUFPLEtBQUtULE9BQVosRUFBcUIsS0FBS21ELGVBQTFCLEVBQTJDO0FBQzNEekUsZ0JBQVEsRUFBUkEsUUFEMkQ7QUFFM0ROLGdCQUFRLEVBQVJBLFFBRjJEO0FBRzNEYSxpQkFBUyxFQUFUQSxTQUgyRDtBQUkzRFosc0JBQWMsRUFBZEEsY0FKMkQ7QUFLM0RNLDBCQUFrQixFQUFsQkEsa0JBTDJEO0FBTTNESixzQkFBYyxFQUFkQTtBQU4yRCxPQUEzQyxDQUFsQjtBQVFEOzs7Ozs7QUFHSHhDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnlCLFdBQWpCLEM7Ozs7Ozs7Ozs7O0FDakZBO0FBQ0E7QUFDQTtBQUVBLElBQU0rRyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBeEUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZSxDQUFmLEtBQXFCLEdBQXpCO0FBQUEsQ0FBNUI7O0FBRUEsSUFBTThCLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUF6RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMEUsTUFBUixDQUFlLENBQWYsQ0FBSjtBQUFBLENBQXhCOztBQUVBLElBQU0zRCxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDZixPQUFELEVBQVVTLElBQVYsRUFBbUI7QUFDL0IsTUFBTWtFLGdCQUFnQixHQUFHRixRQUFRLENBQUN6RSxPQUFELENBQWpDO0FBQ0EsTUFBTVgsS0FBSyxHQUFHb0IsSUFBSSxDQUFDakUsT0FBTCxDQUFhbUksZ0JBQWIsQ0FBZDtBQUNBLE1BQU03RCxPQUFPLEdBQUd6QixLQUFLLEdBQUcsQ0FBQyxDQUF6QjtBQUVBLFNBQU87QUFDTHlCLFdBQU8sRUFBUEEsT0FESztBQUVMOUIsU0FBSyxFQUFFO0FBRkYsR0FBUDtBQUlELENBVEQ7O0FBV0FqRCxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZndJLGNBQVksRUFBWkEsWUFEZTtBQUVmQyxVQUFRLEVBQVJBLFFBRmU7QUFHZjFELE9BQUssRUFBTEE7QUFIZSxDQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25CQSxJQUFNNkQsVUFBVSxHQUFHbkosbUJBQU8sQ0FBQyxrRUFBRCxDQUExQjs7QUFDQSxJQUFNb0osaUJBQWlCLEdBQUdwSixtQkFBTyxDQUFDLGtGQUFELENBQWpDOztBQUNBLElBQU1xSixnQkFBZ0IsR0FBR3JKLG1CQUFPLENBQUMsZ0ZBQUQsQ0FBaEM7O0FBQ0EsSUFBTXNKLHVCQUF1QixHQUFHdEosbUJBQU8sQ0FBQyxnR0FBRCxDQUF2Qzs7QUFDQSxJQUFNdUosZ0JBQWdCLEdBQUd2SixtQkFBTyxDQUFDLGdGQUFELENBQWhDOztBQUNBLElBQU13Six1QkFBdUIsR0FBR3hKLG1CQUFPLENBQUMsZ0dBQUQsQ0FBdkM7O0FBQ0EsSUFBTWdDLFdBQVcsR0FBR2hDLG1CQUFPLENBQUMsMkRBQUQsQ0FBM0I7O2VBRXFCQSxtQkFBTyxDQUFDLG1FQUFELEM7SUFBcEJFLFEsWUFBQUEsUSxFQUVSO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTXVKLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQUNsRixPQUFEO0FBQUEsU0FBYUEsT0FBTyxDQUFDbUYsS0FBUixDQUFjLEdBQWQsRUFBbUJDLEdBQW5CLENBQXVCLFVBQUFsRSxJQUFJO0FBQUEsV0FBSUEsSUFBSSxDQUFDbUUsSUFBTCxHQUFZRixLQUFaLENBQWtCLEtBQWxCLENBQUo7QUFBQSxHQUEzQixDQUFiO0FBQUEsQ0FBaEI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQk16SCxjO0FBQ0osMEJBQVlzQyxPQUFaLEVBQXFCWixPQUFyQixFQUE4QjtBQUFBOztBQUFBLFFBQ3BCakIsZUFEb0IsR0FDQWlCLE9BREEsQ0FDcEJqQixlQURvQjtBQUU1QixTQUFLbUgsS0FBTCxHQUFhLElBQWI7QUFDQSxTQUFLbEcsT0FBTCxHQUFlQSxPQUFmLENBSDRCLENBSTVCOztBQUNBLFNBQUttRyxXQUFMLEdBQW1CLEVBQW5COztBQUVBLFFBQUk1SixRQUFRLENBQUNxRSxPQUFELENBQVIsSUFBcUJBLE9BQU8sQ0FBQ3FGLElBQVIsR0FBZXRJLE1BQWYsR0FBd0IsQ0FBakQsRUFBb0Q7QUFDbEQsV0FBS2lELE9BQUwsR0FBZTdCLGVBQWUsR0FBRzZCLE9BQUgsR0FBYUEsT0FBTyxDQUFDdUUsV0FBUixFQUEzQztBQUNBLFdBQUtlLEtBQUwsR0FBYUosT0FBTyxDQUFDLEtBQUtsRixPQUFOLENBQXBCO0FBQ0Q7QUFDRjs7Ozs2QkFFUXBELEssRUFBTztBQUNkLFVBQU0wSSxLQUFLLEdBQUcsS0FBS0EsS0FBbkI7O0FBRUEsVUFBSSxDQUFDLEtBQUtBLEtBQVYsRUFBaUI7QUFDZixlQUFPO0FBQ0x4RSxpQkFBTyxFQUFFLEtBREo7QUFFTDlCLGVBQUssRUFBRTtBQUZGLFNBQVA7QUFJRDs7QUFFRCxVQUFJeUIsSUFBSSxHQUFHN0QsS0FBSyxDQUFDOEQsQ0FBakI7QUFFQUQsVUFBSSxHQUFHLEtBQUtyQixPQUFMLENBQWFqQixlQUFiLEdBQStCc0MsSUFBL0IsR0FBc0NBLElBQUksQ0FBQzhELFdBQUwsRUFBN0M7QUFFQSxVQUFJaUIsVUFBVSxHQUFHLEtBQWpCOztBQUVBLFdBQUssSUFBSTNJLENBQUMsR0FBRyxDQUFSLEVBQVc0SSxJQUFJLEdBQUdILEtBQUssQ0FBQ3ZJLE1BQTdCLEVBQXFDRixDQUFDLEdBQUc0SSxJQUF6QyxFQUErQzVJLENBQUMsSUFBSSxDQUFwRCxFQUF1RDtBQUVyRCxZQUFNNkksS0FBSyxHQUFHSixLQUFLLENBQUN6SSxDQUFELENBQW5CO0FBQ0EsWUFBSVMsTUFBTSxHQUFHLElBQWI7QUFDQWtJLGtCQUFVLEdBQUcsSUFBYjs7QUFFQSxhQUFLLElBQUlqRSxDQUFDLEdBQUcsQ0FBUixFQUFXb0UsSUFBSSxHQUFHRCxLQUFLLENBQUMzSSxNQUE3QixFQUFxQ3dFLENBQUMsR0FBR29FLElBQXpDLEVBQStDcEUsQ0FBQyxJQUFJLENBQXBELEVBQXVEO0FBQ3JELGNBQUlxRSxLQUFLLEdBQUdGLEtBQUssQ0FBQ25FLENBQUQsQ0FBakI7QUFDQWpFLGdCQUFNLEdBQUcsS0FBS3VJLE9BQUwsQ0FBYUQsS0FBYixFQUFvQm5GLElBQXBCLENBQVQ7O0FBQ0EsY0FBSSxDQUFDbkQsTUFBTSxDQUFDd0QsT0FBWixFQUFxQjtBQUNuQjtBQUNBMEUsc0JBQVUsR0FBRyxLQUFiO0FBQ0E7QUFDRDtBQUNGLFNBZG9ELENBZ0JyRDs7O0FBQ0EsWUFBSUEsVUFBSixFQUFnQjtBQUNkLGlCQUFPbEksTUFBUDtBQUNEO0FBQ0YsT0FwQ2EsQ0FzQ2Q7OztBQUNBLGFBQU87QUFDTHdELGVBQU8sRUFBRSxLQURKO0FBRUw5QixhQUFLLEVBQUU7QUFGRixPQUFQO0FBSUQ7Ozs0QkFFT2dCLE8sRUFBU1MsSSxFQUFNO0FBQ3JCLFVBQUltRSxVQUFVLENBQUNKLFlBQVgsQ0FBd0J4RSxPQUF4QixDQUFKLEVBQXNDO0FBQ3BDLGVBQU80RSxVQUFVLENBQUM3RCxLQUFYLENBQWlCZixPQUFqQixFQUEwQlMsSUFBMUIsQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJcUUsZ0JBQWdCLENBQUNOLFlBQWpCLENBQThCeEUsT0FBOUIsQ0FBSixFQUE0QztBQUNqRCxlQUFPOEUsZ0JBQWdCLENBQUMvRCxLQUFqQixDQUF1QmYsT0FBdkIsRUFBZ0NTLElBQWhDLENBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSXNFLHVCQUF1QixDQUFDUCxZQUF4QixDQUFxQ3hFLE9BQXJDLENBQUosRUFBbUQ7QUFDeEQsZUFBTytFLHVCQUF1QixDQUFDaEUsS0FBeEIsQ0FBOEJmLE9BQTlCLEVBQXVDUyxJQUF2QyxDQUFQO0FBQ0QsT0FGTSxNQUVBLElBQUl3RSx1QkFBdUIsQ0FBQ1QsWUFBeEIsQ0FBcUN4RSxPQUFyQyxDQUFKLEVBQW1EO0FBQ3hELGVBQU9pRix1QkFBdUIsQ0FBQ2xFLEtBQXhCLENBQThCZixPQUE5QixFQUF1Q1MsSUFBdkMsQ0FBUDtBQUNELE9BRk0sTUFFQSxJQUFJdUUsZ0JBQWdCLENBQUNSLFlBQWpCLENBQThCeEUsT0FBOUIsQ0FBSixFQUE0QztBQUNqRCxlQUFPZ0YsZ0JBQWdCLENBQUNqRSxLQUFqQixDQUF1QmYsT0FBdkIsRUFBZ0NTLElBQWhDLENBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSW9FLGlCQUFpQixDQUFDTCxZQUFsQixDQUErQnhFLE9BQS9CLENBQUosRUFBNkM7QUFDbEQsZUFBTzZFLGlCQUFpQixDQUFDOUQsS0FBbEIsQ0FBd0JmLE9BQXhCLEVBQWlDUyxJQUFqQyxDQUFQO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsWUFBSU4sUUFBUSxHQUFHLEtBQUtvRixXQUFMLENBQWlCdkYsT0FBakIsQ0FBZjs7QUFDQSxZQUFJLENBQUNHLFFBQUwsRUFBZTtBQUNiQSxrQkFBUSxHQUFHLElBQUkxQyxXQUFKLENBQWdCdUMsT0FBaEIsRUFBeUIsS0FBS1osT0FBOUIsQ0FBWDtBQUNBLGVBQUttRyxXQUFMLENBQWlCdkYsT0FBakIsSUFBNEJHLFFBQTVCO0FBQ0Q7O0FBQ0QsZUFBT0EsUUFBUSxDQUFDMkYsTUFBVCxDQUFnQnJGLElBQWhCLENBQVA7QUFDRDtBQUNGOzs7Ozs7QUFHSDFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjBCLGNBQWpCLEM7Ozs7Ozs7Ozs7O0FDN0hBO0FBQ0E7QUFDQTtBQUVBLElBQU04RyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBeEUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZSxDQUFmLEtBQXFCLEdBQXpCO0FBQUEsQ0FBNUI7O0FBRUEsSUFBTThCLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUF6RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMEUsTUFBUixDQUFlLENBQWYsQ0FBSjtBQUFBLENBQXhCOztBQUVBLElBQU0zRCxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDZixPQUFELEVBQVVTLElBQVYsRUFBbUI7QUFDL0IsTUFBTWtFLGdCQUFnQixHQUFHRixRQUFRLENBQUN6RSxPQUFELENBQWpDO0FBQ0EsTUFBTWMsT0FBTyxHQUFHTCxJQUFJLENBQUNqRSxPQUFMLENBQWFtSSxnQkFBYixNQUFtQyxDQUFDLENBQXBEO0FBRUEsU0FBTztBQUNMN0QsV0FBTyxFQUFQQSxPQURLO0FBRUw5QixTQUFLLEVBQUU7QUFGRixHQUFQO0FBSUQsQ0FSRDs7QUFVQWpELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmd0ksY0FBWSxFQUFaQSxZQURlO0FBRWZDLFVBQVEsRUFBUkEsUUFGZTtBQUdmMUQsT0FBSyxFQUFMQTtBQUhlLENBQWpCLEM7Ozs7Ozs7Ozs7O0FDbEJBO0FBQ0E7QUFDQTtBQUVBLElBQU15RCxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBeEUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZSxDQUFmLEtBQXFCLEdBQXJCLElBQTRCM0MsT0FBTyxDQUFDMkMsTUFBUixDQUFlLENBQWYsS0FBcUIsR0FBckQ7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNOEIsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQXpFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMwRSxNQUFSLENBQWUsQ0FBZixDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTTNELEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNa0UsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQ3pFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUcsQ0FBQ0wsSUFBSSxDQUFDc0YsVUFBTCxDQUFnQnBCLGdCQUFoQixDQUFqQjtBQUVBLFNBQU87QUFDTDdELFdBQU8sRUFBUEEsT0FESztBQUVMOUIsU0FBSyxFQUFFO0FBRkYsR0FBUDtBQUlELENBUkQ7O0FBVUFqRCxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZndJLGNBQVksRUFBWkEsWUFEZTtBQUVmQyxVQUFRLEVBQVJBLFFBRmU7QUFHZjFELE9BQUssRUFBTEE7QUFIZSxDQUFqQixDOzs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFFQSxJQUFNeUQsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQXhFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMyQyxNQUFSLENBQWUsQ0FBZixLQUFxQixHQUFyQixJQUE0QjNDLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZTNDLE9BQU8sQ0FBQ2pELE1BQVIsR0FBaUIsQ0FBaEMsS0FBc0MsR0FBdEU7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNMEgsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQXpFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUNnRyxTQUFSLENBQWtCLENBQWxCLEVBQXFCaEcsT0FBTyxDQUFDakQsTUFBUixHQUFpQixDQUF0QyxDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTWdFLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNa0UsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQ3pFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUcsQ0FBQ0wsSUFBSSxDQUFDd0YsUUFBTCxDQUFjdEIsZ0JBQWQsQ0FBakI7QUFFQSxTQUFPO0FBQ0w3RCxXQUFPLEVBQVBBLE9BREs7QUFFTDlCLFNBQUssRUFBRTtBQUZGLEdBQVA7QUFJRCxDQVJEOztBQVVBakQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z3SSxjQUFZLEVBQVpBLFlBRGU7QUFFZkMsVUFBUSxFQUFSQSxRQUZlO0FBR2YxRCxPQUFLLEVBQUxBO0FBSGUsQ0FBakIsQzs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBRUEsSUFBTXlELFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUF4RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMkMsTUFBUixDQUFlLENBQWYsS0FBcUIsR0FBekI7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNOEIsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQXpFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMwRSxNQUFSLENBQWUsQ0FBZixDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTTNELEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNa0UsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQ3pFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUdMLElBQUksQ0FBQ3NGLFVBQUwsQ0FBZ0JwQixnQkFBaEIsQ0FBaEI7QUFFQSxTQUFPO0FBQ0w3RCxXQUFPLEVBQVBBLE9BREs7QUFFTDlCLFNBQUssRUFBRTtBQUZGLEdBQVA7QUFJRCxDQVJEOztBQVVBakQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z3SSxjQUFZLEVBQVpBLFlBRGU7QUFFZkMsVUFBUSxFQUFSQSxRQUZlO0FBR2YxRCxPQUFLLEVBQUxBO0FBSGUsQ0FBakIsQzs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBRUEsSUFBTXlELFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUF4RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMkMsTUFBUixDQUFlM0MsT0FBTyxDQUFDakQsTUFBUixHQUFpQixDQUFoQyxLQUFzQyxHQUExQztBQUFBLENBQTVCOztBQUVBLElBQU0wSCxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBekUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzBFLE1BQVIsQ0FBZSxDQUFmLEVBQWtCMUUsT0FBTyxDQUFDakQsTUFBUixHQUFpQixDQUFuQyxDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTWdFLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNa0UsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQ3pFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUdMLElBQUksQ0FBQ3dGLFFBQUwsQ0FBY3RCLGdCQUFkLENBQWhCO0FBRUEsU0FBTztBQUNMN0QsV0FBTyxFQUFQQSxPQURLO0FBRUw5QixTQUFLLEVBQUU7QUFGRixHQUFQO0FBSUQsQ0FSRDs7QUFVQWpELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmd0ksY0FBWSxFQUFaQSxZQURlO0FBRWZDLFVBQVEsRUFBUkEsUUFGZTtBQUdmMUQsT0FBSyxFQUFMQTtBQUhlLENBQWpCLEM7Ozs7Ozs7Ozs7O0FDbEJBaEYsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z5QixhQUFXLEVBQUVoQyxtQkFBTyxDQUFDLDBEQUFELENBREw7QUFFZmlDLGdCQUFjLEVBQUVqQyxtQkFBTyxDQUFDLGdFQUFELENBRlI7QUFHZmtDLGFBQVcsRUFBRWxDLG1CQUFPLENBQUMsMERBQUQ7QUFITCxDQUFqQixDOzs7Ozs7Ozs7OztBQ0FBTSxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZmtLLE9BQUssRUFBRXpLLG1CQUFPLENBQUMsK0RBQUQsQ0FEQztBQUVmMEssY0FBWSxFQUFFMUssbUJBQU8sQ0FBQyw2RUFBRDtBQUZOLENBQWpCLEM7Ozs7Ozs7Ozs7O0FDQUE7QUFDQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUNvSyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDL0IsTUFBSS9JLE1BQU0sR0FBRyxFQUFiO0FBQ0EsTUFBSVQsQ0FBQyxHQUFHLENBQVI7QUFDQSxNQUFJMEUsQ0FBQyxHQUFHLENBQVI7O0FBRUEsU0FBTzFFLENBQUMsR0FBR3VKLElBQUksQ0FBQ3JKLE1BQVQsSUFBbUJ3RSxDQUFDLEdBQUc4RSxJQUFJLENBQUN0SixNQUFuQyxFQUEyQztBQUN6QyxRQUFJdUosS0FBSyxHQUFHRixJQUFJLENBQUN2SixDQUFELENBQWhCO0FBQ0EsUUFBSTBKLEtBQUssR0FBR0YsSUFBSSxDQUFDOUUsQ0FBRCxDQUFoQjs7QUFFQSxRQUFJK0UsS0FBSyxJQUFJQyxLQUFiLEVBQW9CO0FBQ2xCakosWUFBTSxDQUFDaEIsSUFBUCxDQUFZZ0ssS0FBWjtBQUNBekosT0FBQyxJQUFJLENBQUw7QUFDQTBFLE9BQUMsSUFBSSxDQUFMO0FBQ0QsS0FKRCxNQUlPLElBQUkrRSxLQUFLLEdBQUdDLEtBQVosRUFBbUI7QUFDeEIxSixPQUFDLElBQUksQ0FBTDtBQUNELEtBRk0sTUFFQSxJQUFJeUosS0FBSyxHQUFHQyxLQUFaLEVBQW1CO0FBQ3hCaEYsT0FBQyxJQUFJLENBQUw7QUFDRCxLQUZNLE1BRUE7QUFDTDFFLE9BQUMsSUFBSSxDQUFMO0FBQ0EwRSxPQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7O0FBRUQsU0FBT2pFLE1BQVA7QUFDRCxDQXhCRCxDOzs7Ozs7Ozs7OztBQ0RBO0FBQ0F2QixNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQ29LLElBQUQsRUFBT0MsSUFBUCxFQUFnQjtBQUMvQixNQUFJL0ksTUFBTSxHQUFHLEVBQWI7QUFDQSxNQUFJVCxDQUFDLEdBQUcsQ0FBUjtBQUNBLE1BQUkwRSxDQUFDLEdBQUcsQ0FBUjs7QUFFQSxTQUFPMUUsQ0FBQyxHQUFHdUosSUFBSSxDQUFDckosTUFBVCxJQUFtQndFLENBQUMsR0FBRzhFLElBQUksQ0FBQ3RKLE1BQW5DLEVBQTJDO0FBQ3pDLFFBQUl1SixLQUFLLEdBQUdGLElBQUksQ0FBQ3ZKLENBQUQsQ0FBaEI7QUFDQSxRQUFJMEosS0FBSyxHQUFHRixJQUFJLENBQUM5RSxDQUFELENBQWhCOztBQUVBLFFBQUkrRSxLQUFLLEdBQUdDLEtBQVosRUFBbUI7QUFDakJqSixZQUFNLENBQUNoQixJQUFQLENBQVlnSyxLQUFaO0FBQ0F6SixPQUFDLElBQUksQ0FBTDtBQUNELEtBSEQsTUFHTyxJQUFJMEosS0FBSyxHQUFHRCxLQUFaLEVBQW1CO0FBQ3hCaEosWUFBTSxDQUFDaEIsSUFBUCxDQUFZaUssS0FBWjtBQUNBaEYsT0FBQyxJQUFJLENBQUw7QUFDRCxLQUhNLE1BR0E7QUFDTGpFLFlBQU0sQ0FBQ2hCLElBQVAsQ0FBWWlLLEtBQVo7QUFDQTFKLE9BQUMsSUFBSSxDQUFMO0FBQ0EwRSxPQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTzFFLENBQUMsR0FBR3VKLElBQUksQ0FBQ3JKLE1BQWhCLEVBQXdCO0FBQ3RCTyxVQUFNLENBQUNoQixJQUFQLENBQVk4SixJQUFJLENBQUN2SixDQUFELENBQWhCO0FBQ0FBLEtBQUMsSUFBSSxDQUFMO0FBQ0Q7O0FBRUQsU0FBTzBFLENBQUMsR0FBRzhFLElBQUksQ0FBQ3RKLE1BQWhCLEVBQXdCO0FBQ3RCTyxVQUFNLENBQUNoQixJQUFQLENBQVkrSixJQUFJLENBQUM5RSxDQUFELENBQWhCO0FBQ0FBLEtBQUMsSUFBSSxDQUFMO0FBQ0Q7O0FBRUQsU0FBT2pFLE1BQVA7QUFDRCxDQWpDRCxDOzs7Ozs7Ozs7OztBQ0RBdkIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z3SyxpQkFBZSxFQUFFL0ssbUJBQU8sQ0FBQyxrRkFBRDtBQURULENBQWpCLEM7Ozs7Ozs7Ozs7O2VDQWdDQSxtQkFBTyxDQUFDLHNFQUFELEM7SUFBL0J5SyxLLFlBQUFBLEs7SUFBT0MsWSxZQUFBQSxZOztBQUVmcEssTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5SyxNQUFELEVBQVNDLE1BQVQsRUFBb0I7QUFDbkMsTUFBSUMsVUFBVSxHQUFHVCxLQUFLLENBQUNPLE1BQUQsRUFBU0MsTUFBVCxDQUF0QjtBQUNBLE1BQUlFLGlCQUFpQixHQUFHVCxZQUFZLENBQUNNLE1BQUQsRUFBU0MsTUFBVCxDQUFwQztBQUVBLFNBQU8sSUFBSUUsaUJBQWlCLENBQUM3SixNQUFsQixHQUEyQjRKLFVBQVUsQ0FBQzVKLE1BQWpEO0FBQ0QsQ0FMRCxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBLElBQU04SixLQUFLLEdBQUdwTCxtQkFBTyxDQUFDLG1EQUFELENBQXJCOztlQUM0QkEsbUJBQU8sQ0FBQywrREFBRCxDO0lBQTNCK0ssZSxZQUFBQSxlOztJQUVGN0ksVztBQUNKLHVCQUFZcUMsT0FBWixFQUFtRDtBQUFBLFFBQTlCWixPQUE4Qix1RUFBcEI7QUFBRUgsZUFBUyxFQUFFO0FBQWIsS0FBb0I7O0FBQUE7O0FBQ2pEO0FBQ0EsU0FBS0csT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBSzBILFlBQUwsR0FBb0JELEtBQUssQ0FBQzdHLE9BQUQsRUFBVTtBQUFFa0MsVUFBSSxFQUFFO0FBQVIsS0FBVixDQUF6QjtBQUNEOzs7OzZCQUNRdEYsSyxFQUFPO0FBQ2QsVUFBSW1LLFNBQVMsR0FBR25LLEtBQUssQ0FBQ29LLEVBQXRCOztBQUNBLFVBQUksQ0FBQ0QsU0FBTCxFQUFnQjtBQUNkQSxpQkFBUyxHQUFHRixLQUFLLENBQUNqSyxLQUFLLENBQUM4RCxDQUFQLEVBQVU7QUFBRXdCLGNBQUksRUFBRTtBQUFSLFNBQVYsQ0FBakI7QUFDQXRGLGFBQUssQ0FBQ29LLEVBQU4sR0FBV0QsU0FBWDtBQUNEOztBQUVELFVBQUlFLFlBQVksR0FBR1QsZUFBZSxDQUFDLEtBQUtNLFlBQU4sRUFBb0JDLFNBQXBCLENBQWxDO0FBRUEsVUFBTWpHLE9BQU8sR0FBR21HLFlBQVksR0FBRyxLQUFLN0gsT0FBTCxDQUFhSCxTQUE1QztBQUVBLGFBQU87QUFDTEQsYUFBSyxFQUFFOEIsT0FBTyxHQUFHbUcsWUFBSCxHQUFrQixDQUQzQjtBQUVMbkcsZUFBTyxFQUFQQTtBQUZLLE9BQVA7QUFJRDs7Ozs7O0FBR0gvRSxNQUFNLENBQUNDLE9BQVAsR0FBaUIyQixXQUFqQixDOzs7Ozs7Ozs7OztBQzNCQSxJQUFNdUosU0FBUyxHQUFHLENBQWxCOztBQUVBbkwsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5RSxJQUFELFFBQXVEO0FBQUEsb0JBQTlDMEcsQ0FBOEM7QUFBQSxNQUE5Q0EsQ0FBOEMsdUJBQTFDRCxTQUEwQztBQUFBLHNCQUEvQkUsR0FBK0I7QUFBQSxNQUEvQkEsR0FBK0IseUJBQXpCLElBQXlCO0FBQUEsdUJBQW5CbEYsSUFBbUI7QUFBQSxNQUFuQkEsSUFBbUIsMEJBQVosS0FBWTtBQUN0RSxNQUFJbUYsTUFBTSxHQUFHLEVBQWI7O0FBRUEsTUFBSTVHLElBQUksS0FBSyxJQUFULElBQWlCQSxJQUFJLEtBQUtqRCxTQUE5QixFQUF5QztBQUN2QyxXQUFPNkosTUFBUDtBQUNEOztBQUVENUcsTUFBSSxHQUFHQSxJQUFJLENBQUM4RCxXQUFMLEVBQVA7O0FBQ0EsTUFBSTZDLEdBQUosRUFBUztBQUNQM0csUUFBSSxjQUFPQSxJQUFQLE1BQUo7QUFDRDs7QUFFRCxNQUFJcEIsS0FBSyxHQUFHb0IsSUFBSSxDQUFDMUQsTUFBTCxHQUFjb0ssQ0FBZCxHQUFrQixDQUE5Qjs7QUFDQSxNQUFJOUgsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiLFdBQU9nSSxNQUFQO0FBQ0Q7O0FBRUQsU0FBT2hJLEtBQUssRUFBWixFQUFnQjtBQUNkZ0ksVUFBTSxDQUFDaEksS0FBRCxDQUFOLEdBQWdCb0IsSUFBSSxDQUFDaUUsTUFBTCxDQUFZckYsS0FBWixFQUFtQjhILENBQW5CLENBQWhCO0FBQ0Q7O0FBRUQsTUFBSWpGLElBQUosRUFBVTtBQUNSbUYsVUFBTSxDQUFDbkYsSUFBUCxDQUFZLFVBQUNwRCxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUFVRCxDQUFDLElBQUlDLENBQUwsR0FBUyxDQUFULEdBQWFELENBQUMsR0FBR0MsQ0FBSixHQUFRLENBQUMsQ0FBVCxHQUFhLENBQXBDO0FBQUEsS0FBWjtBQUNEOztBQUVELFNBQU9zSSxNQUFQO0FBQ0QsQ0ExQkQsQzs7Ozs7Ozs7Ozs7ZUNGeUM1TCxtQkFBTyxDQUFDLGdFQUFELEM7SUFBeENJLE8sWUFBQUEsTztJQUFTSCxTLFlBQUFBLFM7SUFBV0MsUSxZQUFBQSxROztBQUM1QixJQUFNaUMsR0FBRyxHQUFHbkMsbUJBQU8sQ0FBQyw0Q0FBRCxDQUFuQjs7QUFDQSxJQUFNb0wsS0FBSyxHQUFHcEwsbUJBQU8sQ0FBQyx3RUFBRCxDQUFyQjs7QUFFQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5QyxJQUFELEVBQU90QyxJQUFQLEVBQXNEO0FBQUEsaUZBQVAsRUFBTztBQUFBLHdCQUF2Q21DLEtBQXVDO0FBQUEsTUFBdkNBLEtBQXVDLDJCQUEvQlYsR0FBK0I7QUFBQSx5QkFBMUIwSixNQUEwQjtBQUFBLE1BQTFCQSxNQUEwQiw0QkFBakIsS0FBaUI7O0FBQ3JFLE1BQUlDLFdBQVcsR0FBRyxFQUFsQixDQURxRSxDQUdyRTs7QUFDQSxNQUFJNUwsUUFBUSxDQUFDUSxJQUFJLENBQUMsQ0FBRCxDQUFMLENBQVosRUFBdUI7QUFDckI7QUFDQSxTQUFLLElBQUlVLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR1gsSUFBSSxDQUFDWSxNQUEzQixFQUFtQ0YsQ0FBQyxHQUFHQyxHQUF2QyxFQUE0Q0QsQ0FBQyxJQUFJLENBQWpELEVBQW9EO0FBQ2xELFVBQU1ELEtBQUssR0FBR1QsSUFBSSxDQUFDVSxDQUFELENBQWxCOztBQUVBLFVBQUluQixTQUFTLENBQUNrQixLQUFELENBQWIsRUFBc0I7QUFDcEI7QUFDQTtBQUNBO0FBRUEsWUFBSTRLLE1BQU0sR0FBRztBQUNYOUcsV0FBQyxFQUFFOUQsS0FEUTtBQUVYK0QsYUFBRyxFQUFFOUQ7QUFGTSxTQUFiOztBQUtBLFlBQUl5SyxNQUFKLEVBQVk7QUFDVkUsZ0JBQU0sQ0FBQ1IsRUFBUCxHQUFZSCxLQUFLLENBQUNqSyxLQUFELEVBQVE7QUFBRXNGLGdCQUFJLEVBQUU7QUFBUixXQUFSLENBQWpCO0FBQ0Q7O0FBRURxRixtQkFBVyxDQUFDakwsSUFBWixDQUFpQmtMLE1BQWpCO0FBQ0Q7QUFDRjtBQUVGLEdBdkJELE1BdUJPO0FBQ0w7QUFDQSxRQUFNbkcsT0FBTyxHQUFHNUMsSUFBSSxDQUFDMUIsTUFBckI7O0FBRUEsU0FBSyxJQUFJRixFQUFDLEdBQUcsQ0FBUixFQUFXQyxJQUFHLEdBQUdYLElBQUksQ0FBQ1ksTUFBM0IsRUFBbUNGLEVBQUMsR0FBR0MsSUFBdkMsRUFBNENELEVBQUMsSUFBSSxDQUFqRCxFQUFvRDtBQUNsRCxVQUFJcUUsSUFBSSxHQUFHL0UsSUFBSSxDQUFDVSxFQUFELENBQWY7QUFFQSxVQUFJMkssT0FBTSxHQUFHO0FBQUU3RyxXQUFHLEVBQUU5RCxFQUFQO0FBQVU2RCxTQUFDLEVBQUU7QUFBYixPQUFiLENBSGtELENBS2xEOztBQUNBLFdBQUssSUFBSWEsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsT0FBcEIsRUFBNkJFLENBQUMsSUFBSSxDQUFsQyxFQUFxQztBQUNuQyxZQUFJOUUsR0FBRyxHQUFHZ0MsSUFBSSxDQUFDOEMsQ0FBRCxDQUFkOztBQUNBLFlBQUkzRSxNQUFLLEdBQUcwQixLQUFLLENBQUM0QyxJQUFELEVBQU96RSxHQUFQLENBQWpCOztBQUVBLFlBQUksQ0FBQ2YsU0FBUyxDQUFDa0IsTUFBRCxDQUFkLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsWUFBSWYsT0FBTyxDQUFDZSxNQUFELENBQVgsRUFBb0I7QUFDbEIsY0FBSTZLLFVBQVUsR0FBRyxFQUFqQjtBQUNBLGNBQU1DLEtBQUssR0FBRyxDQUFDO0FBQUVDLHNCQUFVLEVBQUUsQ0FBQyxDQUFmO0FBQWtCL0ssaUJBQUssRUFBTEE7QUFBbEIsV0FBRCxDQUFkOztBQUVBLGlCQUFPOEssS0FBSyxDQUFDM0ssTUFBYixFQUFxQjtBQUFBLDZCQUNXMkssS0FBSyxDQUFDRSxHQUFOLEVBRFg7QUFBQSxnQkFDWEQsVUFEVyxjQUNYQSxVQURXO0FBQUEsZ0JBQ0MvSyxPQURELGNBQ0NBLEtBREQ7O0FBR25CLGdCQUFJLENBQUNsQixTQUFTLENBQUNrQixPQUFELENBQWQsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxnQkFBSWpCLFFBQVEsQ0FBQ2lCLE9BQUQsQ0FBWixFQUFxQjtBQUVuQjtBQUNBO0FBQ0E7QUFFQSxrQkFBSWlMLFNBQVMsR0FBRztBQUFFbkgsaUJBQUMsRUFBRTlELE9BQUw7QUFBWStELG1CQUFHLEVBQUVnSDtBQUFqQixlQUFoQjs7QUFFQSxrQkFBSUwsTUFBSixFQUFZO0FBQ1ZPLHlCQUFTLENBQUNiLEVBQVYsR0FBZUgsS0FBSyxDQUFDakssT0FBRCxFQUFRO0FBQUVzRixzQkFBSSxFQUFFO0FBQVIsaUJBQVIsQ0FBcEI7QUFDRDs7QUFFRHVGLHdCQUFVLENBQUNuTCxJQUFYLENBQWdCdUwsU0FBaEI7QUFFRCxhQWRELE1BY08sSUFBSWhNLE9BQU8sQ0FBQ2UsT0FBRCxDQUFYLEVBQW9CO0FBQ3pCLG1CQUFLLElBQUk0RSxDQUFDLEdBQUcsQ0FBUixFQUFXc0csTUFBTSxHQUFHbEwsT0FBSyxDQUFDRyxNQUEvQixFQUF1Q3lFLENBQUMsR0FBR3NHLE1BQTNDLEVBQW1EdEcsQ0FBQyxJQUFJLENBQXhELEVBQTJEO0FBQ3pEa0cscUJBQUssQ0FBQ3BMLElBQU4sQ0FBVztBQUNUcUwsNEJBQVUsRUFBRW5HLENBREg7QUFFVDVFLHVCQUFLLEVBQUVBLE9BQUssQ0FBQzRFLENBQUQ7QUFGSCxpQkFBWDtBQUlEO0FBQ0Y7QUFDRjs7QUFDRGdHLGlCQUFNLENBQUM5RyxDQUFQLENBQVNqRSxHQUFULElBQWdCZ0wsVUFBaEI7QUFDRCxTQW5DRCxNQW1DTztBQUNMO0FBQ0E7QUFDQTtBQUVBLGNBQUlJLFVBQVMsR0FBRztBQUFFbkgsYUFBQyxFQUFFOUQ7QUFBTCxXQUFoQjs7QUFFQSxjQUFJMEssTUFBSixFQUFZO0FBQ1ZPLHNCQUFTLENBQUNiLEVBQVYsR0FBZUgsS0FBSyxDQUFDakssTUFBRCxFQUFRO0FBQUVzRixrQkFBSSxFQUFFO0FBQVIsYUFBUixDQUFwQjtBQUNEOztBQUVEc0YsaUJBQU0sQ0FBQzlHLENBQVAsQ0FBU2pFLEdBQVQsSUFBZ0JvTCxVQUFoQjtBQUNEO0FBQ0Y7O0FBRUROLGlCQUFXLENBQUNqTCxJQUFaLENBQWlCa0wsT0FBakI7QUFDRDtBQUNGOztBQUVELFNBQU9ELFdBQVA7QUFDRCxDQXBHRCxDOzs7Ozs7Ozs7OztBQ0pBeEwsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Y2QixhQUFXLEVBQUVwQyxtQkFBTyxDQUFDLG1EQUFELENBREw7QUFFZnFDLFVBQVEsRUFBRXJDLG1CQUFPLENBQUMsNkNBQUQ7QUFGRixDQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7OztlQ0FxQkEsbUJBQU8sQ0FBQyxnRUFBRCxDO0lBQXBCRSxRLFlBQUFBLFE7O0lBRUZtQyxRO0FBQ0osb0JBQVlXLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBS3NKLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUtDLE9BQUwsR0FBZXhKLElBQUksQ0FBQzFCLE1BQXBCO0FBQ0EsU0FBS21MLFdBQUwsR0FBbUIsS0FBbkIsQ0FKZ0IsQ0FNaEI7O0FBQ0EsUUFBSXpKLElBQUksQ0FBQzFCLE1BQUwsSUFBZXBCLFFBQVEsQ0FBQzhDLElBQUksQ0FBQyxDQUFELENBQUwsQ0FBM0IsRUFBc0M7QUFDcEMsV0FBSyxJQUFJNUIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLb0wsT0FBekIsRUFBa0NwTCxDQUFDLElBQUksQ0FBdkMsRUFBMEM7QUFDeEMsWUFBTUosR0FBRyxHQUFHZ0MsSUFBSSxDQUFDNUIsQ0FBRCxDQUFoQjtBQUNBLGFBQUtrTCxLQUFMLENBQVd0TCxHQUFYLElBQWtCO0FBQ2hCb0YsZ0JBQU0sRUFBRTtBQURRLFNBQWxCOztBQUdBLGFBQUttRyxTQUFMLENBQWUxTCxJQUFmLENBQW9CRyxHQUFwQjtBQUNEO0FBQ0YsS0FSRCxNQVFPO0FBQ0wsVUFBSTBMLGVBQWUsR0FBRyxDQUF0Qjs7QUFFQSxXQUFLLElBQUl0TCxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHLEtBQUtvTCxPQUF6QixFQUFrQ3BMLEVBQUMsSUFBSSxDQUF2QyxFQUEwQztBQUN4QyxZQUFNSixJQUFHLEdBQUdnQyxJQUFJLENBQUM1QixFQUFELENBQWhCOztBQUVBLFlBQUksQ0FBQ0osSUFBRyxDQUFDMkwsY0FBSixDQUFtQixNQUFuQixDQUFMLEVBQWlDO0FBQy9CLGdCQUFNLElBQUk5RCxLQUFKLENBQVUsdUNBQVYsQ0FBTjtBQUNEOztBQUVELFlBQU0rRCxPQUFPLEdBQUc1TCxJQUFHLENBQUM2TCxJQUFwQjs7QUFDQSxhQUFLTixTQUFMLENBQWUxTCxJQUFmLENBQW9CK0wsT0FBcEI7O0FBRUEsWUFBSSxDQUFDNUwsSUFBRyxDQUFDMkwsY0FBSixDQUFtQixRQUFuQixDQUFMLEVBQW1DO0FBQ2pDLGdCQUFNLElBQUk5RCxLQUFKLENBQVUseUNBQVYsQ0FBTjtBQUNEOztBQUVELFlBQU0xQyxTQUFTLEdBQUduRixJQUFHLENBQUNvRixNQUF0Qjs7QUFFQSxZQUFJRCxTQUFTLElBQUksQ0FBYixJQUFrQkEsU0FBUyxJQUFJLENBQW5DLEVBQXNDO0FBQ3BDLGdCQUFNLElBQUkwQyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtBQUNEOztBQUVELGFBQUt5RCxLQUFMLENBQVdNLE9BQVgsSUFBc0I7QUFDcEJ4RyxnQkFBTSxFQUFFRDtBQURZLFNBQXRCO0FBSUF1Ryx1QkFBZSxJQUFJdkcsU0FBbkI7QUFFQSxhQUFLc0csV0FBTCxHQUFtQixJQUFuQjtBQUNEOztBQUVELFVBQUlDLGVBQWUsR0FBRyxDQUF0QixFQUF5QjtBQUN2QixjQUFNLElBQUk3RCxLQUFKLENBQVUscUNBQVYsQ0FBTjtBQUNEO0FBQ0Y7QUFDRjs7Ozt3QkFDRzdILEcsRUFBSzZMLEksRUFBTTtBQUNiLGFBQU8sS0FBS1AsS0FBTCxDQUFXdEwsR0FBWCxJQUFrQixLQUFLc0wsS0FBTCxDQUFXdEwsR0FBWCxFQUFnQjZMLElBQWhCLENBQWxCLEdBQTBDLElBQWpEO0FBQ0Q7OzsyQkFDTTtBQUNMLGFBQU8sS0FBS04sU0FBWjtBQUNEOzs7NEJBQ087QUFDTixhQUFPLEtBQUtDLE9BQVo7QUFDRDs7OzZCQUNRO0FBQ1AsYUFBT00sSUFBSSxDQUFDQyxTQUFMLENBQWUsS0FBS1QsS0FBcEIsQ0FBUDtBQUNEOzs7Ozs7QUFHSGhNLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjhCLFFBQWpCLEM7Ozs7Ozs7Ozs7O0FDckVBL0IsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2YrQixrQkFBZ0IsRUFBRXRDLG1CQUFPLENBQUMsaUVBQUQsQ0FEVjtBQUVmdUMsZ0JBQWMsRUFBRXZDLG1CQUFPLENBQUMsNkRBQUQ7QUFGUixDQUFqQixDOzs7Ozs7Ozs7OztlQ0E2REEsbUJBQU8sQ0FBQyxnRUFBRCxDO0lBQTVESSxPLFlBQUFBLE87SUFBU0gsUyxZQUFBQSxTO0lBQVdDLFEsWUFBQUEsUTtJQUFVQyxRLFlBQUFBLFE7SUFBVTJCLFEsWUFBQUEsUTs7QUFFaER4QixNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQ3NCLE1BQUQsRUFBUytFLElBQVQsRUFBa0I7QUFDakMsTUFBTWxCLE9BQU8sR0FBRzdELE1BQU0sQ0FBQzZELE9BQXZCO0FBQ0FrQixNQUFJLENBQUNsQixPQUFMLEdBQWUsRUFBZjs7QUFFQSxNQUFJLENBQUN6RixTQUFTLENBQUN5RixPQUFELENBQWQsRUFBeUI7QUFDdkI7QUFDRDs7QUFFRCxPQUFLLElBQUl0RSxDQUFDLEdBQUcsQ0FBUixFQUFXQyxHQUFHLEdBQUdxRSxPQUFPLENBQUNwRSxNQUE5QixFQUFzQ0YsQ0FBQyxHQUFHQyxHQUExQyxFQUErQ0QsQ0FBQyxJQUFJLENBQXBELEVBQXVEO0FBQ3JELFFBQUlrRSxLQUFLLEdBQUdJLE9BQU8sQ0FBQ3RFLENBQUQsQ0FBbkI7O0FBRUEsUUFBSSxDQUFDbkIsU0FBUyxDQUFDcUYsS0FBSyxDQUFDQyxPQUFQLENBQVYsSUFBNkJELEtBQUssQ0FBQ0MsT0FBTixDQUFjakUsTUFBZCxLQUF5QixDQUExRCxFQUE2RDtBQUMzRDtBQUNEOztBQUVELFFBQUlkLEdBQUcsR0FBRztBQUNSK0UsYUFBTyxFQUFFRCxLQUFLLENBQUNDLE9BRFA7QUFFUnBFLFdBQUssRUFBRW1FLEtBQUssQ0FBQ25FO0FBRkwsS0FBVjs7QUFLQSxRQUFJbUUsS0FBSyxDQUFDdEUsR0FBVixFQUFlO0FBQ2JSLFNBQUcsQ0FBQ1EsR0FBSixHQUFVc0UsS0FBSyxDQUFDdEUsR0FBaEI7QUFDRDs7QUFFRCxRQUFJc0UsS0FBSyxDQUFDSixHQUFOLEdBQVksQ0FBQyxDQUFqQixFQUFvQjtBQUNsQjFFLFNBQUcsQ0FBQ3FHLFFBQUosR0FBZXZCLEtBQUssQ0FBQ0osR0FBckI7QUFDRDs7QUFFRDBCLFFBQUksQ0FBQ2xCLE9BQUwsQ0FBYTdFLElBQWIsQ0FBa0JMLEdBQWxCO0FBQ0Q7QUFDRixDQTlCRCxDOzs7Ozs7Ozs7OztBQ0ZBRixNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQ3NCLE1BQUQsRUFBUytFLElBQVQsRUFBa0I7QUFDakNBLE1BQUksQ0FBQ3JELEtBQUwsR0FBYTFCLE1BQU0sQ0FBQzBCLEtBQXBCO0FBQ0QsQ0FGRCxDIiwiZmlsZSI6ImZ1c2UuZGV2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJGdXNlXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkZ1c2VcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRnVzZVwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiY29uc3Qge1xuICBpc0RlZmluZWQsXG4gIGlzU3RyaW5nLFxuICBpc051bWJlcixcbiAgaXNBcnJheSxcbiAgdG9TdHJpbmdcbn0gPSByZXF1aXJlKCcuL3R5cGUtY2hlY2tlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChvYmosIHBhdGgpID0+IHtcbiAgbGV0IGxpc3QgPSBbXVxuICBsZXQgYXJyID0gZmFsc2VcblxuICBjb25zdCBfZ2V0ID0gKG9iaiwgcGF0aCkgPT4ge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgLy8gSWYgdGhlcmUncyBubyBwYXRoIGxlZnQsIHdlJ3ZlIGdvdHRlbiB0byB0aGUgb2JqZWN0IHdlIGNhcmUgYWJvdXQuXG4gICAgICBsaXN0LnB1c2gob2JqKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkb3RJbmRleCA9IHBhdGguaW5kZXhPZignLicpXG5cbiAgICAgIGxldCBrZXkgPSBwYXRoXG4gICAgICBsZXQgcmVtYWluaW5nID0gbnVsbFxuXG4gICAgICBpZiAoZG90SW5kZXggIT09IC0xKSB7XG4gICAgICAgIGtleSA9IHBhdGguc2xpY2UoMCwgZG90SW5kZXgpXG4gICAgICAgIHJlbWFpbmluZyA9IHBhdGguc2xpY2UoZG90SW5kZXggKyAxKVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldXG5cbiAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIGlmICghcmVtYWluaW5nICYmIChpc1N0cmluZyh2YWx1ZSkgfHwgaXNOdW1iZXIodmFsdWUpKSkge1xuICAgICAgICAgIGxpc3QucHVzaCh0b1N0cmluZyh2YWx1ZSkpXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBhcnIgPSB0cnVlXG4gICAgICAgICAgLy8gU2VhcmNoIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBfZ2V0KHZhbHVlW2ldLCByZW1haW5pbmcpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlbWFpbmluZykge1xuICAgICAgICAgIC8vIEFuIG9iamVjdC4gUmVjdXJzZSBmdXJ0aGVyLlxuICAgICAgICAgIF9nZXQodmFsdWUsIHJlbWFpbmluZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9nZXQob2JqLCBwYXRoKVxuXG4gIGlmIChhcnIpIHtcbiAgICByZXR1cm4gbGlzdFxuICB9XG5cbiAgcmV0dXJuIGxpc3RbMF1cbn0iLCJjb25zdCBJTkZJTklUWSA9IDEgLyAwXG5cbmNvbnN0IGlzQXJyYXkgPSB2YWx1ZSA9PiAhQXJyYXkuaXNBcnJheVxuICA/IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgOiBBcnJheS5pc0FycmF5KHZhbHVlKVxuXG4vLyBBZGFwdGVkIGZyb206XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaC9ibG9iL2Y0Y2EzOTZhNzk2NDM1NDIyYmQ0ZmQ0MWZhZGJkMjI1ZWRkZGYxNzUvLmludGVybmFsL2Jhc2VUb1N0cmluZy5qc1xuY29uc3QgYmFzZVRvU3RyaW5nID0gdmFsdWUgPT4ge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGxldCByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxuY29uc3QgdG9TdHJpbmcgPSB2YWx1ZSA9PiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xuXG5jb25zdCBpc1N0cmluZyA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcblxuY29uc3QgaXNOdW1iZXIgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInXG5cbmNvbnN0IGlzT2JqZWN0ID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xuXG5jb25zdCBpc0RlZmluZWQgPSB2YWx1ZSA9PiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0RlZmluZWQsXG4gIGlzQXJyYXksXG4gIGlzU3RyaW5nLFxuICBpc051bWJlcixcbiAgaXNPYmplY3QsXG4gIHRvU3RyaW5nXG59XG4iLCJcbmNvbnN0IHsgQml0YXBTZWFyY2gsIEV4dGVuZGVkU2VhcmNoLCBOR3JhbVNlYXJjaCB9ID0gcmVxdWlyZSgnLi9zZWFyY2gnKVxuY29uc3QgeyBpc0FycmF5LCBpc0RlZmluZWQsIGlzU3RyaW5nLCBpc051bWJlciwgaXNPYmplY3QgfSA9IHJlcXVpcmUoJy4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcbmNvbnN0IGdldCA9IHJlcXVpcmUoJy4vaGVscGVycy9nZXQnKVxuY29uc3QgeyBjcmVhdGVJbmRleCwgS2V5U3RvcmUgfSA9IHJlcXVpcmUoJy4vdG9vbHMnKVxuY29uc3QgeyB0cmFuc2Zvcm1NYXRjaGVzLCB0cmFuc2Zvcm1TY29yZSB9ID0gcmVxdWlyZSgnLi90cmFuc2Zvcm0nKVxuY29uc3QgeyBNQVhfQklUUyB9ID0gcmVxdWlyZSgnLi9zZWFyY2gvYml0YXAtc2VhcmNoL2NvbnN0YW50cycpXG5cbi8vIC8vIFdpbGwgcHJpbnQgdG8gdGhlIGNvbnNvbGUuIFVzZWZ1bCBmb3IgZGVidWdnaW5nLlxuLy8gZnVuY3Rpb24gZGVidWcoKSB7XG4vLyAgIGlmIChGdXNlLnZlcmJvc2UpIHtcbi8vICAgICBjb25zb2xlLmxvZyguLi5hcmd1bWVudHMpXG4vLyAgICAgLy8gY29uc3QgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuLy8gICAgIC8vIGNvbnNvbGUubG9nKHV0aWwuaW5zcGVjdCguLi5hcmd1bWVudHMsIGZhbHNlLCBudWxsLCB0cnVlIC8qIGVuYWJsZSBjb2xvcnMgKi8pKVxuLy8gICB9XG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGRlYnVnVGltZSh2YWx1ZSkge1xuLy8gICBpZiAoRnVzZS52ZXJib3NlVGltZSkge1xuLy8gICAgIGNvbnNvbGUudGltZSh2YWx1ZSlcbi8vICAgfVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBkZWJ1Z1RpbWVFbmQodmFsdWUpIHtcbi8vICAgaWYgKEZ1c2UudmVyYm9zZVRpbWUpIHtcbi8vICAgICBjb25zb2xlLnRpbWVFbmQodmFsdWUpXG4vLyAgIH1cbi8vIH1cblxubGV0IEZ1c2VPcHRpb25zID0ge1xuICAvLyBXaGVuIHRydWUsIHRoZSBhbGdvcml0aG0gY29udGludWVzIHNlYXJjaGluZyB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCBldmVuIGlmIGEgcGVyZmVjdFxuICAvLyBtYXRjaCBpcyBmb3VuZCBiZWZvcmUgdGhlIGVuZCBvZiB0aGUgc2FtZSBpbnB1dC5cbiAgaXNDYXNlU2Vuc2l0aXZlOiBmYWxzZSxcbiAgLy8gRGV0ZXJtaW5lcyBob3cgY2xvc2UgdGhlIG1hdGNoIG11c3QgYmUgdG8gdGhlIGZ1enp5IGxvY2F0aW9uIChzcGVjaWZpZWQgYWJvdmUpLlxuICAvLyBBbiBleGFjdCBsZXR0ZXIgbWF0Y2ggd2hpY2ggaXMgJ2Rpc3RhbmNlJyBjaGFyYWN0ZXJzIGF3YXkgZnJvbSB0aGUgZnV6enkgbG9jYXRpb25cbiAgLy8gd291bGQgc2NvcmUgYXMgYSBjb21wbGV0ZSBtaXNtYXRjaC4gQSBkaXN0YW5jZSBvZiAnMCcgcmVxdWlyZXMgdGhlIG1hdGNoIGJlIGF0XG4gIC8vIHRoZSBleGFjdCBsb2NhdGlvbiBzcGVjaWZpZWQsIGEgdGhyZXNob2xkIG9mICcxMDAwJyB3b3VsZCByZXF1aXJlIGEgcGVyZmVjdCBtYXRjaFxuICAvLyB0byBiZSB3aXRoaW4gODAwIGNoYXJhY3RlcnMgb2YgdGhlIGZ1enp5IGxvY2F0aW9uIHRvIGJlIGZvdW5kIHVzaW5nIGEgMC44IHRocmVzaG9sZC5cbiAgZGlzdGFuY2U6IDEwMCxcbiAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gIGZpbmRBbGxNYXRjaGVzOiBmYWxzZSxcbiAgLy8gVGhlIGdldCBmdW5jdGlvbiB0byB1c2Ugd2hlbiBmZXRjaGluZyBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBUaGUgZGVmYXVsdCB3aWxsIHNlYXJjaCBuZXN0ZWQgcGF0aHMgKmllIGZvby5iYXIuYmF6KlxuICBnZXRGbjogZ2V0LFxuICBpbmNsdWRlTWF0Y2hlczogZmFsc2UsXG4gIGluY2x1ZGVTY29yZTogZmFsc2UsXG4gIC8vIExpc3Qgb2YgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgc2VhcmNoZWQuIFRoaXMgYWxzbyBzdXBwb3J0cyBuZXN0ZWQgcHJvcGVydGllcy5cbiAga2V5czogW10sXG4gIC8vIEFwcHJveGltYXRlbHkgd2hlcmUgaW4gdGhlIHRleHQgaXMgdGhlIHBhdHRlcm4gZXhwZWN0ZWQgdG8gYmUgZm91bmQ/XG4gIGxvY2F0aW9uOiAwLFxuICAvLyBNaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgbXVzdCBiZSBtYXRjaGVkIGJlZm9yZSBhIHJlc3VsdCBpcyBjb25zaWRlcmVkIGEgbWF0Y2hcbiAgbWluTWF0Y2hDaGFyTGVuZ3RoOiAxLFxuICAvLyBXaGV0aGVyIHRvIHNvcnQgdGhlIHJlc3VsdCBsaXN0LCBieSBzY29yZVxuICBzaG91bGRTb3J0OiB0cnVlLFxuICAvLyBEZWZhdWx0IHNvcnQgZnVuY3Rpb25cbiAgc29ydEZuOiAoYSwgYikgPT4gKGEuc2NvcmUgLSBiLnNjb3JlKSxcbiAgLy8gQXQgd2hhdCBwb2ludCBkb2VzIHRoZSBtYXRjaCBhbGdvcml0aG0gZ2l2ZSB1cC4gQSB0aHJlc2hvbGQgb2YgJzAuMCcgcmVxdWlyZXMgYSBwZXJmZWN0IG1hdGNoXG4gIC8vIChvZiBib3RoIGxldHRlcnMgYW5kIGxvY2F0aW9uKSwgYSB0aHJlc2hvbGQgb2YgJzEuMCcgd291bGQgbWF0Y2ggYW55dGhpbmcuXG4gIHRocmVzaG9sZDogMC42LFxuICAvLyBFbmFibGVkIGV4dGVuZGVkLXNlYXJjaGluZ1xuICB1c2VFeHRlbmRlZFNlYXJjaDogZmFsc2Vcbn1cblxuY2xhc3MgRnVzZSB7XG4gIGNvbnN0cnVjdG9yKGxpc3QsIG9wdGlvbnMgPSBGdXNlT3B0aW9ucywgaW5kZXggPSBudWxsKSB7XG4gICAgdGhpcy5vcHRpb25zID0geyAuLi5GdXNlT3B0aW9ucywgLi4ub3B0aW9ucyB9XG4gICAgLy8gYGNhc2VTZW5zaXRpdmVgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgaXNDYXNlU2Vuc2l0aXZlYCBpbnN0ZWFkXG4gICAgdGhpcy5vcHRpb25zLmlzQ2FzZVNlbnNpdGl2ZSA9IG9wdGlvbnMuY2FzZVNlbnNpdGl2ZVxuICAgIGRlbGV0ZSB0aGlzLm9wdGlvbnMuY2FzZVNlbnNpdGl2ZVxuXG4gICAgLy8gZGVidWdUaW1lKCdDb25zdHJ1Y3RpbmcnKVxuICAgIHRoaXMuX3Byb2Nlc3NLZXlzKHRoaXMub3B0aW9ucy5rZXlzKVxuICAgIHRoaXMuc2V0Q29sbGVjdGlvbihsaXN0LCBpbmRleClcbiAgICAvLyBkZWJ1Z1RpbWVFbmQoJ0NvbnN0cnVjdGluZycpXG4gIH1cblxuICBzZXRDb2xsZWN0aW9uKGxpc3QsIGluZGV4ID0gbnVsbCkge1xuICAgIHRoaXMubGlzdCA9IGxpc3RcbiAgICB0aGlzLmxpc3RJc1N0cmluZ0FycmF5ID0gaXNTdHJpbmcobGlzdFswXSlcblxuICAgIGlmIChpbmRleCkge1xuICAgICAgdGhpcy5zZXRJbmRleChpbmRleClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVidWdUaW1lKCdQcm9jZXNzIGluZGV4JylcbiAgICAgIHRoaXMuc2V0SW5kZXgodGhpcy5fY3JlYXRlSW5kZXgoKSlcbiAgICAgIC8vIGRlYnVnVGltZUVuZCgnUHJvY2VzcyBpbmRleCcpXG4gICAgfVxuICB9XG5cbiAgc2V0SW5kZXgobGlzdEluZGV4KSB7XG4gICAgdGhpcy5faW5kZXhlZExpc3QgPSBsaXN0SW5kZXhcbiAgICAvLyBkZWJ1ZyhsaXN0SW5kZXgpXG4gIH1cblxuICBfcHJvY2Vzc0tleXMoa2V5cykge1xuICAgIHRoaXMuX2tleVN0b3JlID0gbmV3IEtleVN0b3JlKGtleXMpXG5cbiAgICAvLyBkZWJ1ZygnUHJvY2VzcyBLZXlzJylcbiAgICBpZiAoRnVzZS52ZXJib3NlKSB7XG4gICAgICAvLyBkZWJ1Zyh0aGlzLl9rZXlTdG9yZS50b0pTT04oKSlcbiAgICB9XG4gIH1cblxuICBfY3JlYXRlSW5kZXgoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUluZGV4KHRoaXMuX2tleVN0b3JlLmtleXMoKSwgdGhpcy5saXN0LCB7XG4gICAgICBnZXRGbjogdGhpcy5vcHRpb25zLmdldEZuXG4gICAgfSlcbiAgfVxuXG4gIHNlYXJjaChwYXR0ZXJuLCBvcHRzID0geyBsaW1pdDogZmFsc2UgfSkge1xuICAgIC8vIGRlYnVnKGAtLS0tLS0tLS0gU2VhcmNoIHBhdHRlcm46IFwiJHtwYXR0ZXJufVwiYClcbiAgICBjb25zdCB7IHVzZUV4dGVuZGVkU2VhcmNoLCBzaG91bGRTb3J0IH0gPSB0aGlzLm9wdGlvbnNcblxuICAgIGxldCBzZWFyY2hlciA9IG51bGxcblxuICAgIGlmICh1c2VFeHRlbmRlZFNlYXJjaCkge1xuICAgICAgc2VhcmNoZXIgPSBuZXcgRXh0ZW5kZWRTZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgIH0gZWxzZSBpZiAocGF0dGVybi5sZW5ndGggPiBNQVhfQklUUykge1xuICAgICAgc2VhcmNoZXIgPSBuZXcgTkdyYW1TZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWFyY2hlciA9IG5ldyBCaXRhcFNlYXJjaChwYXR0ZXJuLCB0aGlzLm9wdGlvbnMpXG4gICAgfVxuXG4gICAgLy8gZGVidWdUaW1lKCdTZWFyY2ggdGltZScpO1xuICAgIGxldCByZXN1bHRzID0gdGhpcy5fc2VhcmNoVXNpbmcoc2VhcmNoZXIpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdTZWFyY2ggdGltZScpO1xuXG4gICAgLy8gZGVidWdUaW1lKCdDb21wdXRlIHNjb3JlIHRpbWUnKTtcbiAgICB0aGlzLl9jb21wdXRlU2NvcmUocmVzdWx0cylcbiAgICAvLyBkZWJ1Z1RpbWVFbmQoJ0NvbXB1dGUgc2NvcmUgdGltZScpO1xuXG4gICAgaWYgKHNob3VsZFNvcnQpIHtcbiAgICAgIHRoaXMuX3NvcnQocmVzdWx0cylcbiAgICB9XG5cbiAgICBpZiAob3B0cy5saW1pdCAmJiBpc051bWJlcihvcHRzLmxpbWl0KSkge1xuICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc2xpY2UoMCwgb3B0cy5saW1pdClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZm9ybWF0KHJlc3VsdHMpXG4gIH1cblxuICBfc2VhcmNoVXNpbmcoc2VhcmNoZXIpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5faW5kZXhlZExpc3RcbiAgICBjb25zdCByZXN1bHRzID0gW11cbiAgICBjb25zdCB7IGluY2x1ZGVNYXRjaGVzIH0gPSB0aGlzLm9wdGlvbnNcblxuICAgIC8vIExpc3QgaXMgQXJyYXk8U3RyaW5nPlxuICAgIGlmICh0aGlzLmxpc3RJc1N0cmluZ0FycmF5KSB7XG4gICAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkgc3RyaW5nIGluIHRoZSBsaXN0XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBsZXQgdmFsdWUgPSBsaXN0W2ldXG4gICAgICAgIGxldCB7ICQ6IHRleHQsIGlkeCB9ID0gdmFsdWVcblxuICAgICAgICBpZiAoIWlzRGVmaW5lZCh0ZXh0KSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gc2VhcmNoZXIuc2VhcmNoSW4odmFsdWUpXG5cbiAgICAgICAgY29uc3QgeyBpc01hdGNoLCBzY29yZSB9ID0gc2VhcmNoUmVzdWx0XG5cbiAgICAgICAgaWYgKCFpc01hdGNoKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaCA9IHsgc2NvcmUsIHZhbHVlOiB0ZXh0IH1cblxuICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICBtYXRjaC5pbmRpY2VzID0gc2VhcmNoUmVzdWx0Lm1hdGNoZWRJbmRpY2VzXG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgIGl0ZW06IHRleHQsXG4gICAgICAgICAgaWR4LFxuICAgICAgICAgIG1hdGNoZXM6IFttYXRjaF1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBMaXN0IGlzIEFycmF5PE9iamVjdD5cbiAgICAgIGNvbnN0IGtleU5hbWVzID0gdGhpcy5fa2V5U3RvcmUua2V5cygpXG4gICAgICBjb25zdCBrZXlzTGVuID0gdGhpcy5fa2V5U3RvcmUuY291bnQoKVxuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBsZXQgeyAkOiBpdGVtLCBpZHggfSA9IGxpc3RbaV1cblxuICAgICAgICBpZiAoIWlzRGVmaW5lZChpdGVtKSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2hlcyA9IFtdXG5cbiAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IGtleSAoaS5lLCBwYXRoKSwgYW5kIGZldGNoIHRoZSB2YWx1ZSBhdCB0aGF0IGtleVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXNMZW47IGogKz0gMSkge1xuICAgICAgICAgIGxldCBrZXkgPSBrZXlOYW1lc1tqXVxuICAgICAgICAgIGxldCB2YWx1ZSA9IGl0ZW1ba2V5XVxuXG4gICAgICAgICAgLy8gZGVidWcoYCBLZXk6ICR7a2V5ID09PSAnJyA/ICctLScgOiBrZXl9YClcblxuICAgICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGsgPCBsZW47IGsgKz0gMSkge1xuICAgICAgICAgICAgICBsZXQgYXJySXRlbSA9IHZhbHVlW2tdXG4gICAgICAgICAgICAgIGxldCB0ZXh0ID0gYXJySXRlbS4kXG4gICAgICAgICAgICAgIGxldCBpZHggPSBhcnJJdGVtLmlkeFxuXG4gICAgICAgICAgICAgIGlmICghaXNEZWZpbmVkKHRleHQpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxldCBzZWFyY2hSZXN1bHQgPSBzZWFyY2hlci5zZWFyY2hJbihhcnJJdGVtKVxuXG4gICAgICAgICAgICAgIGNvbnN0IHsgaXNNYXRjaCwgc2NvcmUgfSA9IHNlYXJjaFJlc3VsdFxuXG4gICAgICAgICAgICAgIC8vIGRlYnVnKGBGdWxsIHRleHQ6IFwiJHt0ZXh0fVwiLCBzY29yZTogJHtzY29yZX1gKVxuXG4gICAgICAgICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCBrZXksIHZhbHVlOiB0ZXh0LCBpZHggfVxuXG4gICAgICAgICAgICAgIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIG1hdGNoLmluZGljZXMgPSBzZWFyY2hSZXN1bHQubWF0Y2hlZEluZGljZXNcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG1hdGNoZXMucHVzaChtYXRjaClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHRleHQgPSB2YWx1ZS4kXG4gICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gc2VhcmNoZXIuc2VhcmNoSW4odmFsdWUpXG5cbiAgICAgICAgICAgIGNvbnN0IHsgaXNNYXRjaCwgc2NvcmUgfSA9IHNlYXJjaFJlc3VsdFxuXG4gICAgICAgICAgICAvLyBkZWJ1ZyhgRnVsbCB0ZXh0OiBcIiR7dGV4dH1cIiwgc2NvcmU6ICR7c2NvcmV9YClcblxuICAgICAgICAgICAgaWYgKCFpc01hdGNoKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHsgc2NvcmUsIGtleSwgdmFsdWU6IHRleHQgfVxuXG4gICAgICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgbWF0Y2guaW5kaWNlcyA9IHNlYXJjaFJlc3VsdC5tYXRjaGVkSW5kaWNlc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICAgIGlkeCxcbiAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICBtYXRjaGVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRlYnVnKFwiLS0tLS0tLS0tIFJFU1VMVFMgLS0tLS0tLS0tLS1cIilcbiAgICAvLyBkZWJ1ZyhyZXN1bHRzKVxuICAgIC8vIGRlYnVnKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIilcblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICBfY29tcHV0ZVNjb3JlKHJlc3VsdHMpIHtcbiAgICAvLyBkZWJ1ZygnQ29tcHV0aW5nIHNjb3JlOiAnKVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJlc3VsdHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc3VsdHNbaV1cbiAgICAgIGNvbnN0IG1hdGNoZXMgPSByZXN1bHQubWF0Y2hlc1xuICAgICAgY29uc3Qgc2NvcmVMZW4gPSBtYXRjaGVzLmxlbmd0aFxuXG4gICAgICBsZXQgdG90YWxXZWlnaHRlZFNjb3JlID0gMVxuICAgICAgLy8gbGV0IGJlc3RTY29yZSA9IC0xXG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2NvcmVMZW47IGogKz0gMSkge1xuICAgICAgICBjb25zdCBpdGVtID0gbWF0Y2hlc1tqXVxuICAgICAgICBjb25zdCBrZXkgPSBpdGVtLmtleVxuICAgICAgICBjb25zdCBrZXlXZWlnaHQgPSB0aGlzLl9rZXlTdG9yZS5nZXQoa2V5LCAnd2VpZ2h0JylcbiAgICAgICAgY29uc3Qgd2VpZ2h0ID0ga2V5V2VpZ2h0IHx8IDFcbiAgICAgICAgY29uc3Qgc2NvcmUgPSBpdGVtLnNjb3JlID09PSAwICYmIGtleVdlaWdodCAmJiBrZXlXZWlnaHQgPiAwXG4gICAgICAgICAgPyBOdW1iZXIuRVBTSUxPTlxuICAgICAgICAgIDogaXRlbS5zY29yZVxuXG4gICAgICAgIHRvdGFsV2VpZ2h0ZWRTY29yZSAqPSBNYXRoLnBvdyhzY29yZSwgd2VpZ2h0KVxuXG4gICAgICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGJlc3Qgc2NvcmUuLiBqdXN0IGluIGNhc2VcbiAgICAgICAgLy8gQWN0dWFsbHksIHdlJ3JlIG5vdCByZWFsbHkgdXNpbmcgaXQuLiBidXQgbmVlZCB0byB0aGluayBvZiBhIHdheSB0byBpbmNvcnBvcmF0ZSB0aGlzXG4gICAgICAgIC8vIGJlc3RTY29yZSA9IGJlc3RTY29yZSA9PSAtMSA/IGl0ZW0uc2NvcmUgOiBNYXRoLm1pbihiZXN0U2NvcmUsIGl0ZW0uc2NvcmUpXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5zY29yZSA9IHRvdGFsV2VpZ2h0ZWRTY29yZVxuICAgICAgLy8gcmVzdWx0LiRzY29yZSA9IGJlc3RTY29yZVxuXG4gICAgICAvLyBkZWJ1ZyhyZXN1bHQpXG4gICAgfVxuICB9XG5cbiAgX3NvcnQocmVzdWx0cykge1xuICAgIC8vIGRlYnVnKCdTb3J0aW5nLi4uLicpXG4gICAgcmVzdWx0cy5zb3J0KHRoaXMub3B0aW9ucy5zb3J0Rm4pXG4gIH1cblxuICBfZm9ybWF0KHJlc3VsdHMpIHtcbiAgICBjb25zdCBmaW5hbE91dHB1dCA9IFtdXG5cbiAgICBjb25zdCB7IGluY2x1ZGVNYXRjaGVzLCBpbmNsdWRlU2NvcmUsIH0gPSB0aGlzLm9wdGlvbnNcblxuICAgIC8vIGlmIChGdXNlLnZlcmJvc2UpIHtcbiAgICAvLyAgIGxldCBjYWNoZSA9IFtdXG4gICAgLy8gICBkZWJ1ZygnT3V0cHV0OicsIEpTT04uc3RyaW5naWZ5KHJlc3VsdHMsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgLy8gICAgIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgIC8vICAgICAgIGlmIChjYWNoZS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAvLyAgICAgICAgIC8vIENpcmN1bGFyIHJlZmVyZW5jZSBmb3VuZCwgZGlzY2FyZCBrZXlcbiAgICAvLyAgICAgICAgIHJldHVyblxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgICAvLyBTdG9yZSB2YWx1ZSBpbiBvdXIgY29sbGVjdGlvblxuICAgIC8vICAgICAgIGNhY2hlLnB1c2godmFsdWUpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHZhbHVlXG4gICAgLy8gICB9LCAyKSlcbiAgICAvLyAgIGNhY2hlID0gbnVsbFxuICAgIC8vIH1cblxuICAgIGxldCB0cmFuc2Zvcm1lcnMgPSBbXVxuXG4gICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB0cmFuc2Zvcm1lcnMucHVzaCh0cmFuc2Zvcm1NYXRjaGVzKVxuICAgIGlmIChpbmNsdWRlU2NvcmUpIHRyYW5zZm9ybWVycy5wdXNoKHRyYW5zZm9ybVNjb3JlKVxuXG4gICAgLy8gZGVidWcoXCI9PT09PSBSRVNVTFRTID09PT09PVwiKVxuICAgIC8vIGRlYnVnKHJlc3VsdHMpXG4gICAgLy8gZGVidWcoXCI9PT09PT09PT09PT09PT09PT09PVwiKVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHJlc3VsdHMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc3VsdHNbaV1cblxuICAgICAgLy8gZGVidWcoJ3Jlc3VsdCcsIHJlc3VsdClcblxuICAgICAgY29uc3QgeyBpZHggfSA9IHJlc3VsdFxuXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBpdGVtOiB0aGlzLmxpc3RbaWR4XSxcbiAgICAgICAgcmVmSW5kZXg6IGlkeFxuICAgICAgfVxuXG4gICAgICBpZiAodHJhbnNmb3JtZXJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gdHJhbnNmb3JtZXJzLmxlbmd0aDsgaiA8IGxlbjsgaiArPSAxKSB7XG4gICAgICAgICAgdHJhbnNmb3JtZXJzW2pdKHJlc3VsdCwgZGF0YSlcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIGZpbmFsT3V0cHV0LnB1c2goZGF0YSlcbiAgICB9XG5cbiAgICByZXR1cm4gZmluYWxPdXRwdXRcbiAgfVxufVxuXG5GdXNlLmNyZWF0ZUluZGV4ID0gY3JlYXRlSW5kZXhcblxubW9kdWxlLmV4cG9ydHMgPSBGdXNlXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChtYXRjaG1hc2sgPSBbXSwgbWluTWF0Y2hDaGFyTGVuZ3RoID0gMSkgPT4ge1xuICBsZXQgbWF0Y2hlZEluZGljZXMgPSBbXVxuICBsZXQgc3RhcnQgPSAtMVxuICBsZXQgZW5kID0gLTFcbiAgbGV0IGkgPSAwXG5cbiAgZm9yIChsZXQgbGVuID0gbWF0Y2htYXNrLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbGV0IG1hdGNoID0gbWF0Y2htYXNrW2ldXG4gICAgaWYgKG1hdGNoICYmIHN0YXJ0ID09PSAtMSkge1xuICAgICAgc3RhcnQgPSBpXG4gICAgfSBlbHNlIGlmICghbWF0Y2ggJiYgc3RhcnQgIT09IC0xKSB7XG4gICAgICBlbmQgPSBpIC0gMVxuICAgICAgaWYgKChlbmQgLSBzdGFydCkgKyAxID49IG1pbk1hdGNoQ2hhckxlbmd0aCkge1xuICAgICAgICBtYXRjaGVkSW5kaWNlcy5wdXNoKFtzdGFydCwgZW5kXSlcbiAgICAgIH1cbiAgICAgIHN0YXJ0ID0gLTFcbiAgICB9XG4gIH1cblxuICAvLyAoaS0xIC0gc3RhcnQpICsgMSA9PiBpIC0gc3RhcnRcbiAgaWYgKG1hdGNobWFza1tpIC0gMV0gJiYgKGkgLSBzdGFydCkgPj0gbWluTWF0Y2hDaGFyTGVuZ3RoKSB7XG4gICAgbWF0Y2hlZEluZGljZXMucHVzaChbc3RhcnQsIGkgLSAxXSk7XG4gIH1cblxuICByZXR1cm4gbWF0Y2hlZEluZGljZXNcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcGF0dGVybiA9PiB7XG4gIGxldCBtYXNrID0ge31cbiAgbGV0IGxlbiA9IHBhdHRlcm4ubGVuZ3RoXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIG1hc2tbcGF0dGVybi5jaGFyQXQoaSldID0gMFxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIG1hc2tbcGF0dGVybi5jaGFyQXQoaSldIHw9IDEgPDwgKGxlbiAtIGkgLSAxKVxuICB9XG5cbiAgcmV0dXJuIG1hc2tcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IChwYXR0ZXJuLCB7IGVycm9ycyA9IDAsIGN1cnJlbnRMb2NhdGlvbiA9IDAsIGV4cGVjdGVkTG9jYXRpb24gPSAwLCBkaXN0YW5jZSA9IDEwMCB9KSA9PiB7XG4gIGNvbnN0IGFjY3VyYWN5ID0gZXJyb3JzIC8gcGF0dGVybi5sZW5ndGhcbiAgY29uc3QgcHJveGltaXR5ID0gTWF0aC5hYnMoZXhwZWN0ZWRMb2NhdGlvbiAtIGN1cnJlbnRMb2NhdGlvbilcblxuICBpZiAoIWRpc3RhbmNlKSB7XG4gICAgLy8gRG9kZ2UgZGl2aWRlIGJ5IHplcm8gZXJyb3IuXG4gICAgcmV0dXJuIHByb3hpbWl0eSA/IDEuMCA6IGFjY3VyYWN5XG4gIH1cblxuICByZXR1cm4gYWNjdXJhY3kgKyAocHJveGltaXR5IC8gZGlzdGFuY2UpXG59XG4iLCJjb25zdCBiaXRhcFNjb3JlID0gcmVxdWlyZSgnLi9iaXRhcC1zY29yZScpXG5jb25zdCBtYXRjaGVkSW5kaWNlcyA9IHJlcXVpcmUoJy4vYml0YXAtbWF0Y2hlZC1pbmRpY2VzJylcblxubW9kdWxlLmV4cG9ydHMgPSAodGV4dCwgcGF0dGVybiwgcGF0dGVybkFscGhhYmV0LCB7IGxvY2F0aW9uID0gMCwgZGlzdGFuY2UgPSAxMDAsIHRocmVzaG9sZCA9IDAuNiwgZmluZEFsbE1hdGNoZXMgPSBmYWxzZSwgbWluTWF0Y2hDaGFyTGVuZ3RoID0gMSwgaW5jbHVkZU1hdGNoZXMgPSBmYWxzZSB9KSA9PiB7XG4gIGNvbnN0IHBhdHRlcm5MZW4gPSBwYXR0ZXJuLmxlbmd0aFxuICAvLyBTZXQgc3RhcnRpbmcgbG9jYXRpb24gYXQgYmVnaW5uaW5nIHRleHQgYW5kIGluaXRpYWxpemUgdGhlIGFscGhhYmV0LlxuICBjb25zdCB0ZXh0TGVuID0gdGV4dC5sZW5ndGhcbiAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZW4gbG9jYXRpb24gPiB0ZXh0Lmxlbmd0aFxuICBjb25zdCBleHBlY3RlZExvY2F0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obG9jYXRpb24sIHRleHRMZW4pKVxuICAvLyBIaWdoZXN0IHNjb3JlIGJleW9uZCB3aGljaCB3ZSBnaXZlIHVwLlxuICBsZXQgY3VycmVudFRocmVzaG9sZCA9IHRocmVzaG9sZFxuICAvLyBJcyB0aGVyZSBhIG5lYXJieSBleGFjdCBtYXRjaD8gKHNwZWVkdXApXG4gIGxldCBiZXN0TG9jYXRpb24gPSB0ZXh0LmluZGV4T2YocGF0dGVybiwgZXhwZWN0ZWRMb2NhdGlvbilcblxuICAvLyBhIG1hc2sgb2YgdGhlIG1hdGNoZXNcbiAgY29uc3QgbWF0Y2hNYXNrID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0TGVuOyBpICs9IDEpIHtcbiAgICBtYXRjaE1hc2tbaV0gPSAwXG4gIH1cblxuICBpZiAoYmVzdExvY2F0aW9uICE9PSAtMSkge1xuICAgIGxldCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgZXJyb3JzOiAwLFxuICAgICAgY3VycmVudExvY2F0aW9uOiBiZXN0TG9jYXRpb24sXG4gICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZGlzdGFuY2VcbiAgICB9KVxuICAgIGN1cnJlbnRUaHJlc2hvbGQgPSBNYXRoLm1pbihzY29yZSwgY3VycmVudFRocmVzaG9sZClcblxuICAgIC8vIFdoYXQgYWJvdXQgaW4gdGhlIG90aGVyIGRpcmVjdGlvbj8gKHNwZWVkIHVwKVxuICAgIGJlc3RMb2NhdGlvbiA9IHRleHQubGFzdEluZGV4T2YocGF0dGVybiwgZXhwZWN0ZWRMb2NhdGlvbiArIHBhdHRlcm5MZW4pXG5cbiAgICBpZiAoYmVzdExvY2F0aW9uICE9PSAtMSkge1xuICAgICAgbGV0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICAgIGVycm9yczogMCxcbiAgICAgICAgY3VycmVudExvY2F0aW9uOiBiZXN0TG9jYXRpb24sXG4gICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgIGRpc3RhbmNlXG4gICAgICB9KVxuICAgICAgY3VycmVudFRocmVzaG9sZCA9IE1hdGgubWluKHNjb3JlLCBjdXJyZW50VGhyZXNob2xkKVxuICAgIH1cbiAgfVxuXG4gIC8vIFJlc2V0IHRoZSBiZXN0IGxvY2F0aW9uXG4gIGJlc3RMb2NhdGlvbiA9IC0xXG5cbiAgbGV0IGxhc3RCaXRBcnIgPSBbXVxuICBsZXQgZmluYWxTY29yZSA9IDFcbiAgbGV0IGJpbk1heCA9IHBhdHRlcm5MZW4gKyB0ZXh0TGVuXG5cbiAgY29uc3QgbWFzayA9IDEgPDwgKHBhdHRlcm5MZW4gPD0gMzEgPyBwYXR0ZXJuTGVuIC0gMSA6IDMwKVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0dGVybkxlbjsgaSArPSAxKSB7XG4gICAgLy8gU2NhbiBmb3IgdGhlIGJlc3QgbWF0Y2g7IGVhY2ggaXRlcmF0aW9uIGFsbG93cyBmb3Igb25lIG1vcmUgZXJyb3IuXG4gICAgLy8gUnVuIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgaG93IGZhciBmcm9tIHRoZSBtYXRjaCBsb2NhdGlvbiB3ZSBjYW4gc3RyYXlcbiAgICAvLyBhdCB0aGlzIGVycm9yIGxldmVsLlxuICAgIGxldCBiaW5NaW4gPSAwXG4gICAgbGV0IGJpbk1pZCA9IGJpbk1heFxuXG4gICAgd2hpbGUgKGJpbk1pbiA8IGJpbk1pZCkge1xuICAgICAgY29uc3Qgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgICAgZXJyb3JzOiBpLFxuICAgICAgICBjdXJyZW50TG9jYXRpb246IGV4cGVjdGVkTG9jYXRpb24gKyBiaW5NaWQsXG4gICAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICAgIGRpc3RhbmNlXG4gICAgICB9KVxuXG4gICAgICBpZiAoc2NvcmUgPD0gY3VycmVudFRocmVzaG9sZCkge1xuICAgICAgICBiaW5NaW4gPSBiaW5NaWRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJpbk1heCA9IGJpbk1pZFxuICAgICAgfVxuXG4gICAgICBiaW5NaWQgPSBNYXRoLmZsb29yKChiaW5NYXggLSBiaW5NaW4pIC8gMiArIGJpbk1pbilcbiAgICB9XG5cbiAgICAvLyBVc2UgdGhlIHJlc3VsdCBmcm9tIHRoaXMgaXRlcmF0aW9uIGFzIHRoZSBtYXhpbXVtIGZvciB0aGUgbmV4dC5cbiAgICBiaW5NYXggPSBiaW5NaWRcblxuICAgIGxldCBzdGFydCA9IE1hdGgubWF4KDEsIGV4cGVjdGVkTG9jYXRpb24gLSBiaW5NaWQgKyAxKVxuICAgIGxldCBmaW5pc2ggPSBmaW5kQWxsTWF0Y2hlcyA/IHRleHRMZW4gOiBNYXRoLm1pbihleHBlY3RlZExvY2F0aW9uICsgYmluTWlkLCB0ZXh0TGVuKSArIHBhdHRlcm5MZW5cblxuICAgIC8vIEluaXRpYWxpemUgdGhlIGJpdCBhcnJheVxuICAgIGxldCBiaXRBcnIgPSBBcnJheShmaW5pc2ggKyAyKVxuXG4gICAgYml0QXJyW2ZpbmlzaCArIDFdID0gKDEgPDwgaSkgLSAxXG5cbiAgICBmb3IgKGxldCBqID0gZmluaXNoOyBqID49IHN0YXJ0OyBqIC09IDEpIHtcbiAgICAgIGxldCBjdXJyZW50TG9jYXRpb24gPSBqIC0gMVxuICAgICAgbGV0IGNoYXJNYXRjaCA9IHBhdHRlcm5BbHBoYWJldFt0ZXh0LmNoYXJBdChjdXJyZW50TG9jYXRpb24pXVxuXG4gICAgICBpZiAoY2hhck1hdGNoKSB7XG4gICAgICAgIG1hdGNoTWFza1tjdXJyZW50TG9jYXRpb25dID0gMVxuICAgICAgfVxuXG4gICAgICAvLyBGaXJzdCBwYXNzOiBleGFjdCBtYXRjaFxuICAgICAgYml0QXJyW2pdID0gKChiaXRBcnJbaiArIDFdIDw8IDEpIHwgMSkgJiBjaGFyTWF0Y2hcblxuICAgICAgLy8gU3Vic2VxdWVudCBwYXNzZXM6IGZ1enp5IG1hdGNoXG4gICAgICBpZiAoaSAhPT0gMCkge1xuICAgICAgICBiaXRBcnJbal0gfD0gKCgobGFzdEJpdEFycltqICsgMV0gfCBsYXN0Qml0QXJyW2pdKSA8PCAxKSB8IDEpIHwgbGFzdEJpdEFycltqICsgMV1cbiAgICAgIH1cblxuICAgICAgaWYgKGJpdEFycltqXSAmIG1hc2spIHtcbiAgICAgICAgZmluYWxTY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgICAgIGVycm9yczogaSxcbiAgICAgICAgICBjdXJyZW50TG9jYXRpb24sXG4gICAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgICBkaXN0YW5jZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRoaXMgbWF0Y2ggd2lsbCBhbG1vc3QgY2VydGFpbmx5IGJlIGJldHRlciB0aGFuIGFueSBleGlzdGluZyBtYXRjaC5cbiAgICAgICAgLy8gQnV0IGNoZWNrIGFueXdheS5cbiAgICAgICAgaWYgKGZpbmFsU2NvcmUgPD0gY3VycmVudFRocmVzaG9sZCkge1xuICAgICAgICAgIC8vIEluZGVlZCBpdCBpc1xuICAgICAgICAgIGN1cnJlbnRUaHJlc2hvbGQgPSBmaW5hbFNjb3JlXG4gICAgICAgICAgYmVzdExvY2F0aW9uID0gY3VycmVudExvY2F0aW9uXG5cbiAgICAgICAgICAvLyBBbHJlYWR5IHBhc3NlZCBgbG9jYCwgZG93bmhpbGwgZnJvbSBoZXJlIG9uIGluLlxuICAgICAgICAgIGlmIChiZXN0TG9jYXRpb24gPD0gZXhwZWN0ZWRMb2NhdGlvbikge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBXaGVuIHBhc3NpbmcgYGJlc3RMb2NhdGlvbmAsIGRvbid0IGV4Y2VlZCBvdXIgY3VycmVudCBkaXN0YW5jZSBmcm9tIGBleHBlY3RlZExvY2F0aW9uYC5cbiAgICAgICAgICBzdGFydCA9IE1hdGgubWF4KDEsIDIgKiBleHBlY3RlZExvY2F0aW9uIC0gYmVzdExvY2F0aW9uKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm8gaG9wZSBmb3IgYSAoYmV0dGVyKSBtYXRjaCBhdCBncmVhdGVyIGVycm9yIGxldmVscy5cbiAgICBjb25zdCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgZXJyb3JzOiBpICsgMSxcbiAgICAgIGN1cnJlbnRMb2NhdGlvbjogZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBkaXN0YW5jZVxuICAgIH0pXG5cbiAgICBpZiAoc2NvcmUgPiBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGxhc3RCaXRBcnIgPSBiaXRBcnJcbiAgfVxuXG4gIGxldCByZXN1bHQgPSB7XG4gICAgaXNNYXRjaDogYmVzdExvY2F0aW9uID49IDAsXG4gICAgLy8gQ291bnQgZXhhY3QgbWF0Y2hlcyAodGhvc2Ugd2l0aCBhIHNjb3JlIG9mIDApIHRvIGJlIFwiYWxtb3N0XCIgZXhhY3RcbiAgICBzY29yZTogIWZpbmFsU2NvcmUgPyAwLjAwMSA6IGZpbmFsU2NvcmUsXG4gIH1cblxuICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICByZXN1bHQubWF0Y2hlZEluZGljZXMgPSBtYXRjaGVkSW5kaWNlcyhtYXRjaE1hc2ssIG1pbk1hdGNoQ2hhckxlbmd0aClcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiIsIi8vIE1hY2hpbmUgd29yZCBzaXplXG5tb2R1bGUuZXhwb3J0cy5NQVhfQklUUyA9IDMyIiwiY29uc3QgYml0YXBTZWFyY2ggPSByZXF1aXJlKCcuL2JpdGFwLXNlYXJjaCcpXG5jb25zdCBwYXR0ZXJuQWxwaGFiZXQgPSByZXF1aXJlKCcuL2JpdGFwLXBhdHRlcm4tYWxwaGFiZXQnKVxuY29uc3QgeyBNQVhfQklUUyB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuXG5jbGFzcyBCaXRhcFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4sIHtcbiAgICAvLyBBcHByb3hpbWF0ZWx5IHdoZXJlIGluIHRoZSB0ZXh0IGlzIHRoZSBwYXR0ZXJuIGV4cGVjdGVkIHRvIGJlIGZvdW5kP1xuICAgIGxvY2F0aW9uID0gMCxcbiAgICAvLyBEZXRlcm1pbmVzIGhvdyBjbG9zZSB0aGUgbWF0Y2ggbXVzdCBiZSB0byB0aGUgZnV6enkgbG9jYXRpb24gKHNwZWNpZmllZCBhYm92ZSkuXG4gICAgLy8gQW4gZXhhY3QgbGV0dGVyIG1hdGNoIHdoaWNoIGlzICdkaXN0YW5jZScgY2hhcmFjdGVycyBhd2F5IGZyb20gdGhlIGZ1enp5IGxvY2F0aW9uXG4gICAgLy8gd291bGQgc2NvcmUgYXMgYSBjb21wbGV0ZSBtaXNtYXRjaC4gQSBkaXN0YW5jZSBvZiAnMCcgcmVxdWlyZXMgdGhlIG1hdGNoIGJlIGF0XG4gICAgLy8gdGhlIGV4YWN0IGxvY2F0aW9uIHNwZWNpZmllZCwgYSB0aHJlc2hvbGQgb2YgJzEwMDAnIHdvdWxkIHJlcXVpcmUgYSBwZXJmZWN0IG1hdGNoXG4gICAgLy8gdG8gYmUgd2l0aGluIDgwMCBjaGFyYWN0ZXJzIG9mIHRoZSBmdXp6eSBsb2NhdGlvbiB0byBiZSBmb3VuZCB1c2luZyBhIDAuOCB0aHJlc2hvbGQuXG4gICAgZGlzdGFuY2UgPSAxMDAsXG4gICAgLy8gQXQgd2hhdCBwb2ludCBkb2VzIHRoZSBtYXRjaCBhbGdvcml0aG0gZ2l2ZSB1cC4gQSB0aHJlc2hvbGQgb2YgJzAuMCcgcmVxdWlyZXMgYSBwZXJmZWN0IG1hdGNoXG4gICAgLy8gKG9mIGJvdGggbGV0dGVycyBhbmQgbG9jYXRpb24pLCBhIHRocmVzaG9sZCBvZiAnMS4wJyB3b3VsZCBtYXRjaCBhbnl0aGluZy5cbiAgICB0aHJlc2hvbGQgPSAwLjYsXG4gICAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgY29tcGFyaXNvbnMgc2hvdWxkIGJlIGNhc2Ugc2Vuc2l0aXZlLlxuICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IGZhbHNlLFxuICAgIC8vIFdoZW4gdHJ1ZSwgdGhlIGFsZ29yaXRobSBjb250aW51ZXMgc2VhcmNoaW5nIHRvIHRoZSBlbmQgb2YgdGhlIGlucHV0IGV2ZW4gaWYgYSBwZXJmZWN0XG4gICAgLy8gbWF0Y2ggaXMgZm91bmQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHNhbWUgaW5wdXQuXG4gICAgZmluZEFsbE1hdGNoZXMgPSBmYWxzZSxcbiAgICAvLyBNaW5pbXVtIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgbXVzdCBiZSBtYXRjaGVkIGJlZm9yZSBhIHJlc3VsdCBpcyBjb25zaWRlcmVkIGEgbWF0Y2hcbiAgICBtaW5NYXRjaENoYXJMZW5ndGggPSAxLFxuXG4gICAgaW5jbHVkZU1hdGNoZXMgPSBmYWxzZVxuICB9KSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgbG9jYXRpb24sXG4gICAgICBkaXN0YW5jZSxcbiAgICAgIHRocmVzaG9sZCxcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSxcbiAgICAgIGZpbmRBbGxNYXRjaGVzLFxuICAgICAgaW5jbHVkZU1hdGNoZXMsXG4gICAgICBtaW5NYXRjaENoYXJMZW5ndGhcbiAgICB9XG5cbiAgICBpZiAocGF0dGVybi5sZW5ndGggPiBNQVhfQklUUykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXR0ZXJuIGxlbmd0aCBleGNlZWRzIG1heCBvZiAke01BWF9CSVRTfS5gKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhdHRlcm4gPSBpc0Nhc2VTZW5zaXRpdmUgPyBwYXR0ZXJuIDogcGF0dGVybi50b0xvd2VyQ2FzZSgpXG4gICAgdGhpcy5wYXR0ZXJuQWxwaGFiZXQgPSBwYXR0ZXJuQWxwaGFiZXQodGhpcy5wYXR0ZXJuKVxuICB9XG5cbiAgc2VhcmNoSW4odmFsdWUpIHtcbiAgICBsZXQgdGV4dCA9IHZhbHVlLiRcblxuICAgIGNvbnN0IHsgaXNDYXNlU2Vuc2l0aXZlLCBpbmNsdWRlTWF0Y2hlcyB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgdGV4dCA9IHRleHQudG9Mb3dlckNhc2UoKVxuICAgIH1cblxuICAgIC8vIEV4YWN0IG1hdGNoXG4gICAgaWYgKHRoaXMucGF0dGVybiA9PT0gdGV4dCkge1xuICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgaXNNYXRjaDogdHJ1ZSxcbiAgICAgICAgc2NvcmU6IDBcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgIHJlc3VsdC5tYXRjaGVkSW5kaWNlcyA9IFtbMCwgdGV4dC5sZW5ndGggLSAxXV1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgdXNlIEJpdGFwIGFsZ29yaXRobVxuICAgIGNvbnN0IHsgbG9jYXRpb24sIGRpc3RhbmNlLCB0aHJlc2hvbGQsIGZpbmRBbGxNYXRjaGVzLCBtaW5NYXRjaENoYXJMZW5ndGggfSA9IHRoaXMub3B0aW9uc1xuICAgIHJldHVybiBiaXRhcFNlYXJjaCh0ZXh0LCB0aGlzLnBhdHRlcm4sIHRoaXMucGF0dGVybkFscGhhYmV0LCB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlLFxuICAgICAgdGhyZXNob2xkLFxuICAgICAgZmluZEFsbE1hdGNoZXMsXG4gICAgICBtaW5NYXRjaENoYXJMZW5ndGgsXG4gICAgICBpbmNsdWRlTWF0Y2hlc1xuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCaXRhcFNlYXJjaFxuIiwiLy8gVG9rZW46ICdmaWxlXG4vLyBNYXRjaCB0eXBlOiBleGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgaW5jbHVkZSBgZmlsZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSBcIidcIlxuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaW5kZXggPSB0ZXh0LmluZGV4T2Yoc2FuaXRpemVkUGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IGluZGV4ID4gLTFcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDAsXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiY29uc3QgZXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vZXhhY3QtbWF0Y2gnKVxuY29uc3QgaW52ZXJzZUV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2ludmVyc2UtZXhhY3QtbWF0Y2gnKVxuY29uc3QgcHJlZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vcHJlZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IGludmVyc2VQcmVmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9pbnZlcnNlLXByZWZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBzdWZmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9zdWZmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgaW52ZXJzZVN1ZmZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2ludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IEJpdGFwU2VhcmNoID0gcmVxdWlyZSgnLi4vYml0YXAtc2VhcmNoJylcblxuY29uc3QgeyBpc1N0cmluZyB9ID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcblxuLy8gUmV0dXJuIGEgMkQgYXJyYXkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHF1ZXJ5LCBmb3Igc2ltcGxlciBwYXJzaW5nLlxuLy8gRXhhbXBsZTpcbi8vIFwiXmNvcmUgZ28kIHwgcmIkIHwgcHkkIHh5JFwiID0+IFtbXCJeY29yZVwiLCBcImdvJFwiXSwgW1wicmIkXCJdLCBbXCJweSRcIiwgXCJ4eSRcIl1dXG5jb25zdCBxdWVyeWZ5ID0gKHBhdHRlcm4pID0+IHBhdHRlcm4uc3BsaXQoJ3wnKS5tYXAoaXRlbSA9PiBpdGVtLnRyaW0oKS5zcGxpdCgvICsvZykpXG5cbi8qKlxuICogQ29tbWFuZC1saWtlIHNlYXJjaGluZ1xuICogPT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEdpdmVuIG11bHRpcGxlIHNlYXJjaCB0ZXJtcyBkZWxpbWl0ZWQgYnkgc3BhY2VzLmUuZy4gYF5qc2NyaXB0IC5weXRob24kIHJ1YnkgIWphdmFgLFxuICogc2VhcmNoIGluIGEgZ2l2ZW4gdGV4dC5cbiAqXG4gKiBTZWFyY2ggc3ludGF4OlxuICpcbiAqIHwgVG9rZW4gICAgICAgfCBNYXRjaCB0eXBlICAgICAgICAgICAgICAgICB8IERlc2NyaXB0aW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgYGpzY3JpcHRgICAgfCBmdXp6eS1tYXRjaCAgICAgICAgICAgICAgICB8IEl0ZW1zIHRoYXQgbWF0Y2ggYGpzY3JpcHRgICAgICAgICAgICAgIHxcbiAqIHwgYCdweXRob25gICAgfCBleGFjdC1tYXRjaCAgICAgICAgICAgICAgICB8IEl0ZW1zIHRoYXQgaW5jbHVkZSBgcHl0aG9uYCAgICAgICAgICAgIHxcbiAqIHwgYCFydWJ5YCAgICAgfCBpbnZlcnNlLWV4YWN0LW1hdGNoICAgICAgICB8IEl0ZW1zIHRoYXQgZG8gbm90IGluY2x1ZGUgYHJ1YnlgICAgICAgIHxcbiAqIHwgYF5qYXZhYCAgICAgfCBwcmVmaXgtZXhhY3QtbWF0Y2ggICAgICAgICB8IEl0ZW1zIHRoYXQgc3RhcnQgd2l0aCBgamF2YWAgICAgICAgICAgIHxcbiAqIHwgYCFeZWFybGFuZ2AgfCBpbnZlcnNlLXByZWZpeC1leGFjdC1tYXRjaCB8IEl0ZW1zIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggYGVhcmxhbmdgIHxcbiAqIHwgYC5qcyRgICAgICAgfCBzdWZmaXgtZXhhY3QtbWF0Y2ggICAgICAgICB8IEl0ZW1zIHRoYXQgZW5kIHdpdGggYC5qc2AgICAgICAgICAgICAgIHxcbiAqIHwgYCEuZ28kYCAgICAgfCBpbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaCB8IEl0ZW1zIHRoYXQgZG8gbm90IGVuZCB3aXRoIGAuZ29gICAgICAgIHxcbiAqXG4gKiBBIHNpbmdsZSBwaXBlIGNoYXJhY3RlciBhY3RzIGFzIGFuIE9SIG9wZXJhdG9yLiBGb3IgZXhhbXBsZSwgdGhlIGZvbGxvd2luZ1xuICogcXVlcnkgbWF0Y2hlcyBlbnRyaWVzIHRoYXQgc3RhcnQgd2l0aCBgY29yZWAgYW5kIGVuZCB3aXRoIGVpdGhlcmBnb2AsIGByYmAsXG4gKiBvcmBweWAuXG4gKlxuICogYGBgXG4gKiBeY29yZSBnbyQgfCByYiQgfCBweSRcbiAqIGBgYFxuICovXG5jbGFzcyBFeHRlbmRlZFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4sIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGlzQ2FzZVNlbnNpdGl2ZSB9ID0gb3B0aW9uc1xuICAgIHRoaXMucXVlcnkgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIC8vIEEgPHBhdHRlcm4+OjxCaXRhcFNlYXJjaD4ga2V5LXZhbHVlIHBhaXIgZm9yIG9wdGltaXppbmcgc2VhcmNoaW5nXG4gICAgdGhpcy5fZnV6enlDYWNoZSA9IHt9XG5cbiAgICBpZiAoaXNTdHJpbmcocGF0dGVybikgJiYgcGF0dGVybi50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wYXR0ZXJuID0gaXNDYXNlU2Vuc2l0aXZlID8gcGF0dGVybiA6IHBhdHRlcm4udG9Mb3dlckNhc2UoKVxuICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5ZnkodGhpcy5wYXR0ZXJuKVxuICAgIH1cbiAgfVxuXG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnF1ZXJ5XG5cbiAgICBpZiAoIXRoaXMucXVlcnkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzTWF0Y2g6IGZhbHNlLFxuICAgICAgICBzY29yZTogMVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuXG4gICAgdGV4dCA9IHRoaXMub3B0aW9ucy5pc0Nhc2VTZW5zaXRpdmUgPyB0ZXh0IDogdGV4dC50b0xvd2VyQ2FzZSgpXG5cbiAgICBsZXQgbWF0Y2hGb3VuZCA9IGZhbHNlXG5cbiAgICBmb3IgKGxldCBpID0gMCwgcUxlbiA9IHF1ZXJ5Lmxlbmd0aDsgaSA8IHFMZW47IGkgKz0gMSkge1xuXG4gICAgICBjb25zdCBwYXJ0cyA9IHF1ZXJ5W2ldXG4gICAgICBsZXQgcmVzdWx0ID0gbnVsbFxuICAgICAgbWF0Y2hGb3VuZCA9IHRydWVcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIHBMZW4gPSBwYXJ0cy5sZW5ndGg7IGogPCBwTGVuOyBqICs9IDEpIHtcbiAgICAgICAgbGV0IHRva2VuID0gcGFydHNbal1cbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fc2VhcmNoKHRva2VuLCB0ZXh0KVxuICAgICAgICBpZiAoIXJlc3VsdC5pc01hdGNoKSB7XG4gICAgICAgICAgLy8gQU5EIGNvbmRpdGlvbiwgc2hvcnQtY2lyY3VpdCBhbmQgbW92ZSBvbiB0byBuZXh0IHBhcnRcbiAgICAgICAgICBtYXRjaEZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE9SIGNvbmRpdGlvbiwgc28gaWYgVFJVRSwgcmV0dXJuXG4gICAgICBpZiAobWF0Y2hGb3VuZCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm90aGluZyB3YXMgbWF0Y2hlZFxuICAgIHJldHVybiB7XG4gICAgICBpc01hdGNoOiBmYWxzZSxcbiAgICAgIHNjb3JlOiAxXG4gICAgfVxuICB9XG5cbiAgX3NlYXJjaChwYXR0ZXJuLCB0ZXh0KSB7XG4gICAgaWYgKGV4YWN0TWF0Y2guaXNGb3JQYXR0ZXJuKHBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gZXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAocHJlZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBwcmVmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlUHJlZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlUHJlZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoaW52ZXJzZVN1ZmZpeEV4YWN0TWF0Y2guaXNGb3JQYXR0ZXJuKHBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZVN1ZmZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKHN1ZmZpeEV4YWN0TWF0Y2guaXNGb3JQYXR0ZXJuKHBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gc3VmZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoaW52ZXJzZUV4YWN0TWF0Y2guaXNGb3JQYXR0ZXJuKHBhdHRlcm4pKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZUV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHNlYXJjaGVyID0gdGhpcy5fZnV6enlDYWNoZVtwYXR0ZXJuXVxuICAgICAgaWYgKCFzZWFyY2hlcikge1xuICAgICAgICBzZWFyY2hlciA9IG5ldyBCaXRhcFNlYXJjaChwYXR0ZXJuLCB0aGlzLm9wdGlvbnMpXG4gICAgICAgIHRoaXMuX2Z1enp5Q2FjaGVbcGF0dGVybl0gPSBzZWFyY2hlclxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlYXJjaGVyLnNlYXJjaCh0ZXh0KVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4dGVuZGVkU2VhcmNoIiwiLy8gVG9rZW46ICFmaXJlXG4vLyBNYXRjaCB0eXBlOiBpbnZlcnNlLWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBkbyBub3QgaW5jbHVkZSBgZmlyZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnISdcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LmluZGV4T2Yoc2FuaXRpemVkUGF0dGVybikgPT09IC0xXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46ICFeZmlyZVxuLy8gTWF0Y2ggdHlwZTogaW52ZXJzZS1wcmVmaXgtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGRvIG5vdCBzdGFydCB3aXRoIGBmaXJlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICchJyAmJiBwYXR0ZXJuLmNoYXJBdCgxKSA9PSAnXidcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDIpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSAhdGV4dC5zdGFydHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46ICEuZmlsZSRcbi8vIE1hdGNoIHR5cGU6IGludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBkbyBub3QgZW5kIHdpdGggYC5maWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICchJyAmJiBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aCAtIDEpID09ICckJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHJpbmcoMSwgcGF0dGVybi5sZW5ndGggLSAxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gIXRleHQuZW5kc1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCIvLyBUb2tlbjogXmZpbGVcbi8vIE1hdGNoIHR5cGU6IHByZWZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgc3RhcnQgd2l0aCBgZmlsZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnXidcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LnN0YXJ0c1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCIvLyBUb2tlbjogLmZpbGUkXG4vLyBNYXRjaCB0eXBlOiBzdWZmaXgtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGVuZCB3aXRoIGAuZmlsZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aCAtIDEpID09ICckJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMCwgcGF0dGVybi5sZW5ndGggLSAxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gdGV4dC5lbmRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBCaXRhcFNlYXJjaDogcmVxdWlyZSgnLi9iaXRhcC1zZWFyY2gnKSxcbiAgRXh0ZW5kZWRTZWFyY2g6IHJlcXVpcmUoJy4vZXh0ZW5kZWQtc2VhcmNoJyksXG4gIE5HcmFtU2VhcmNoOiByZXF1aXJlKCcuL25ncmFtLXNlYXJjaCcpXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHVuaW9uOiByZXF1aXJlKCcuL3VuaW9uJyksXG4gIGludGVyc2VjdGlvbjogcmVxdWlyZSgnLi9pbnRlcnNlY3Rpb24nKVxufSIsIi8vIEFzc3VtZXMgYXJyYXlzIGFyZSBzb3J0ZWRcbm1vZHVsZS5leHBvcnRzID0gKGFycjEsIGFycjIpID0+IHtcbiAgbGV0IHJlc3VsdCA9IFtdXG4gIGxldCBpID0gMFxuICBsZXQgaiA9IDBcblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoICYmIGogPCBhcnIyLmxlbmd0aCkge1xuICAgIGxldCBpdGVtMSA9IGFycjFbaV1cbiAgICBsZXQgaXRlbTIgPSBhcnIyW2pdXG5cbiAgICBpZiAoaXRlbTEgPT0gaXRlbTIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0xKVxuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0xIDwgaXRlbTIpIHtcbiAgICAgIGkgKz0gMVxuICAgIH0gZWxzZSBpZiAoaXRlbTEgPiBpdGVtMikge1xuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIGkgKz0gMVxuICAgICAgaiArPSAxXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCIvLyBBc3N1bWVzIGFycmF5cyBhcmUgc29ydGVkXG5tb2R1bGUuZXhwb3J0cyA9IChhcnIxLCBhcnIyKSA9PiB7XG4gIGxldCByZXN1bHQgPSBbXVxuICBsZXQgaSA9IDBcbiAgbGV0IGogPSAwXG5cbiAgd2hpbGUgKGkgPCBhcnIxLmxlbmd0aCAmJiBqIDwgYXJyMi5sZW5ndGgpIHtcbiAgICBsZXQgaXRlbTEgPSBhcnIxW2ldXG4gICAgbGV0IGl0ZW0yID0gYXJyMltqXVxuXG4gICAgaWYgKGl0ZW0xIDwgaXRlbTIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0xKVxuICAgICAgaSArPSAxXG4gICAgfSBlbHNlIGlmIChpdGVtMiA8IGl0ZW0xKSB7XG4gICAgICByZXN1bHQucHVzaChpdGVtMilcbiAgICAgIGogKz0gMVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChpdGVtMilcbiAgICAgIGkgKz0gMVxuICAgICAgaiArPSAxXG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKGkgPCBhcnIxLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKGFycjFbaV0pXG4gICAgaSArPSAxXG4gIH1cblxuICB3aGlsZSAoaiA8IGFycjIubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnB1c2goYXJyMltqXSlcbiAgICBqICs9IDFcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgamFjY2FyZERpc3RhbmNlOiByZXF1aXJlKCcuL2phY2NhcmQtZGlzdGFuY2UnKVxufSIsImNvbnN0IHsgdW5pb24sIGludGVyc2VjdGlvbiB9ID0gcmVxdWlyZSgnLi4vYXJyYXktdXRpbHMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChuR3JhbTEsIG5HcmFtMikgPT4ge1xuICBsZXQgbkdyYW1VbmlvbiA9IHVuaW9uKG5HcmFtMSwgbkdyYW0yKVxuICBsZXQgbkdyYW1JbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3Rpb24obkdyYW0xLCBuR3JhbTIpXG5cbiAgcmV0dXJuIDEgLSBuR3JhbUludGVyc2VjdGlvbi5sZW5ndGggLyBuR3JhbVVuaW9uLmxlbmd0aFxufSIsImNvbnN0IG5ncmFtID0gcmVxdWlyZSgnLi9uZ3JhbScpXG5jb25zdCB7IGphY2NhcmREaXN0YW5jZSB9ID0gcmVxdWlyZSgnLi9kaXN0YW5jZScpXG5cbmNsYXNzIE5HcmFtU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwgb3B0aW9ucyA9IHsgdGhyZXNob2xkOiAwLjYgfSkge1xuICAgIC8vIENyZWF0ZSB0aGUgbmdyYW0sIGFuZCBzb3J0IGl0XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMucGF0dGVybk5ncmFtID0gbmdyYW0ocGF0dGVybiwgeyBzb3J0OiB0cnVlIH0pXG4gIH1cbiAgc2VhcmNoSW4odmFsdWUpIHtcbiAgICBsZXQgdGV4dE5ncmFtID0gdmFsdWUubmdcbiAgICBpZiAoIXRleHROZ3JhbSkge1xuICAgICAgdGV4dE5ncmFtID0gbmdyYW0odmFsdWUuJCwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICB2YWx1ZS5uZyA9IHRleHROZ3JhbVxuICAgIH1cblxuICAgIGxldCBqYWNhcmRSZXN1bHQgPSBqYWNjYXJkRGlzdGFuY2UodGhpcy5wYXR0ZXJuTmdyYW0sIHRleHROZ3JhbSlcblxuICAgIGNvbnN0IGlzTWF0Y2ggPSBqYWNhcmRSZXN1bHQgPCB0aGlzLm9wdGlvbnMudGhyZXNob2xkXG5cbiAgICByZXR1cm4ge1xuICAgICAgc2NvcmU6IGlzTWF0Y2ggPyBqYWNhcmRSZXN1bHQgOiAxLFxuICAgICAgaXNNYXRjaFxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5HcmFtU2VhcmNoIiwiY29uc3QgTkdSQU1fTEVOID0gM1xuXG5tb2R1bGUuZXhwb3J0cyA9ICh0ZXh0LCB7IG4gPSBOR1JBTV9MRU4sIHBhZCA9IHRydWUsIHNvcnQgPSBmYWxzZSB9KSA9PiB7XG4gIGxldCBuR3JhbXMgPSBbXVxuXG4gIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBuR3JhbXNcbiAgfVxuXG4gIHRleHQgPSB0ZXh0LnRvTG93ZXJDYXNlKClcbiAgaWYgKHBhZCkge1xuICAgIHRleHQgPSBgICR7dGV4dH0gYFxuICB9XG5cbiAgbGV0IGluZGV4ID0gdGV4dC5sZW5ndGggLSBuICsgMVxuICBpZiAoaW5kZXggPCAxKSB7XG4gICAgcmV0dXJuIG5HcmFtc1xuICB9XG5cbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICBuR3JhbXNbaW5kZXhdID0gdGV4dC5zdWJzdHIoaW5kZXgsIG4pXG4gIH1cblxuICBpZiAoc29ydCkge1xuICAgIG5HcmFtcy5zb3J0KChhLCBiKSA9PiBhID09IGIgPyAwIDogYSA8IGIgPyAtMSA6IDEpXG4gIH1cblxuICByZXR1cm4gbkdyYW1zXG59IiwiY29uc3QgeyBpc0FycmF5LCBpc0RlZmluZWQsIGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuY29uc3QgZ2V0ID0gcmVxdWlyZSgnLi4vaGVscGVycy9nZXQnKVxuY29uc3QgbmdyYW0gPSByZXF1aXJlKCcuLi9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtJylcblxubW9kdWxlLmV4cG9ydHMgPSAoa2V5cywgbGlzdCwgeyBnZXRGbiA9IGdldCwgbmdyYW1zID0gZmFsc2UgfSA9IHt9KSA9PiB7XG4gIGxldCBpbmRleGVkTGlzdCA9IFtdXG5cbiAgLy8gTGlzdCBpcyBBcnJheTxTdHJpbmc+XG4gIGlmIChpc1N0cmluZyhsaXN0WzBdKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBzdHJpbmcgaW4gdGhlIGxpc3RcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBsaXN0W2ldXG5cbiAgICAgIGlmIChpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgIC8vIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgIC8vICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC8vIH1cblxuICAgICAgICBsZXQgcmVjb3JkID0ge1xuICAgICAgICAgICQ6IHZhbHVlLFxuICAgICAgICAgIGlkeDogaVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ncmFtcykge1xuICAgICAgICAgIHJlY29yZC5uZyA9IG5ncmFtKHZhbHVlLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4ZWRMaXN0LnB1c2gocmVjb3JkKVxuICAgICAgfVxuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIC8vIExpc3QgaXMgQXJyYXk8T2JqZWN0PlxuICAgIGNvbnN0IGtleXNMZW4gPSBrZXlzLmxlbmd0aFxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGxldCBpdGVtID0gbGlzdFtpXVxuXG4gICAgICBsZXQgcmVjb3JkID0geyBpZHg6IGksICQ6IHt9IH1cblxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IGtleSAoaS5lLCBwYXRoKSwgYW5kIGZldGNoIHRoZSB2YWx1ZSBhdCB0aGF0IGtleVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzTGVuOyBqICs9IDEpIHtcbiAgICAgICAgbGV0IGtleSA9IGtleXNbal1cbiAgICAgICAgbGV0IHZhbHVlID0gZ2V0Rm4oaXRlbSwga2V5KVxuXG4gICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgc3ViUmVjb3JkcyA9IFtdXG4gICAgICAgICAgY29uc3Qgc3RhY2sgPSBbeyBhcnJheUluZGV4OiAtMSwgdmFsdWUgfV1cblxuICAgICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgYXJyYXlJbmRleCwgdmFsdWUgfSA9IHN0YWNrLnBvcCgpXG5cbiAgICAgICAgICAgIGlmICghaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG5cbiAgICAgICAgICAgICAgLy8gaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgICAgICAgLy8gICB2ID0gdi50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICBsZXQgc3ViUmVjb3JkID0geyAkOiB2YWx1ZSwgaWR4OiBhcnJheUluZGV4IH1cblxuICAgICAgICAgICAgICBpZiAobmdyYW1zKSB7XG4gICAgICAgICAgICAgICAgc3ViUmVjb3JkLm5nID0gbmdyYW0odmFsdWUsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc3ViUmVjb3Jkcy5wdXNoKHN1YlJlY29yZClcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgYXJyTGVuID0gdmFsdWUubGVuZ3RoOyBrIDwgYXJyTGVuOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIGFycmF5SW5kZXg6IGssXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVba10sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZWNvcmQuJFtrZXldID0gc3ViUmVjb3Jkc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgICAgLy8gICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICBsZXQgc3ViUmVjb3JkID0geyAkOiB2YWx1ZSB9XG5cbiAgICAgICAgICBpZiAobmdyYW1zKSB7XG4gICAgICAgICAgICBzdWJSZWNvcmQubmcgPSBuZ3JhbSh2YWx1ZSwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVjb3JkLiRba2V5XSA9IHN1YlJlY29yZFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluZGV4ZWRMaXN0LnB1c2gocmVjb3JkKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRleGVkTGlzdFxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVJbmRleDogcmVxdWlyZSgnLi9jcmVhdGUtaW5kZXgnKSxcbiAgS2V5U3RvcmU6IHJlcXVpcmUoJy4va2V5LXN0b3JlJylcbn0iLCJjb25zdCB7IGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG5jbGFzcyBLZXlTdG9yZSB7XG4gIGNvbnN0cnVjdG9yKGtleXMpIHtcbiAgICB0aGlzLl9rZXlzID0ge31cbiAgICB0aGlzLl9rZXlOYW1lcyA9IFtdXG4gICAgdGhpcy5fbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICB0aGlzLl9oYXNXZWlnaHRzID0gZmFsc2VcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXlcbiAgICBpZiAoa2V5cy5sZW5ndGggJiYgaXNTdHJpbmcoa2V5c1swXSkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgICAgICB0aGlzLl9rZXlzW2tleV0gPSB7XG4gICAgICAgICAgd2VpZ2h0OiAxXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fa2V5TmFtZXMucHVzaChrZXkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBrZXlXZWlnaHRzVG90YWwgPSAwXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCduYW1lJykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJuYW1lXCIgcHJvcGVydHkgaW4ga2V5IG9iamVjdCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXlOYW1lID0ga2V5Lm5hbWVcbiAgICAgICAgdGhpcy5fa2V5TmFtZXMucHVzaChrZXlOYW1lKVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCd3ZWlnaHQnKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBcIndlaWdodFwiIHByb3BlcnR5IGluIGtleSBvYmplY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0ga2V5LndlaWdodFxuXG4gICAgICAgIGlmIChrZXlXZWlnaHQgPD0gMCB8fCBrZXlXZWlnaHQgPj0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgbXVzdCBiZWluIHRoZSByYW5nZSBvZiAoMCwgMSknKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2V5c1trZXlOYW1lXSA9IHtcbiAgICAgICAgICB3ZWlnaHQ6IGtleVdlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAga2V5V2VpZ2h0c1RvdGFsICs9IGtleVdlaWdodFxuXG4gICAgICAgIHRoaXMuX2hhc1dlaWdodHMgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlXZWlnaHRzVG90YWwgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVG90YWwgb2Yga2V5V2VpZ2h0cyBjYW5ub3QgZXhjZWVkIDEnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQoa2V5LCBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleXNba2V5XSA/IHRoaXMuX2tleXNba2V5XVtuYW1lXSA6IG51bGxcbiAgfVxuICBrZXlzKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlOYW1lc1xuICB9XG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9sZW5ndGhcbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuX2tleXMpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlTdG9yZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0cmFuc2Zvcm1NYXRjaGVzOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1tYXRjaGVzJyksXG4gIHRyYW5zZm9ybVNjb3JlOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1zY29yZScpXG59IiwiY29uc3QgeyBpc0FycmF5LCBpc0RlZmluZWQsIGlzU3RyaW5nLCBpc051bWJlciwgaXNPYmplY3QgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlc3VsdCwgZGF0YSkgPT4ge1xuICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgZGF0YS5tYXRjaGVzID0gW11cblxuICBpZiAoIWlzRGVmaW5lZChtYXRjaGVzKSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1hdGNoZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBsZXQgbWF0Y2ggPSBtYXRjaGVzW2ldXG5cbiAgICBpZiAoIWlzRGVmaW5lZChtYXRjaC5pbmRpY2VzKSB8fCBtYXRjaC5pbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBsZXQgb2JqID0ge1xuICAgICAgaW5kaWNlczogbWF0Y2guaW5kaWNlcyxcbiAgICAgIHZhbHVlOiBtYXRjaC52YWx1ZVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5rZXkpIHtcbiAgICAgIG9iai5rZXkgPSBtYXRjaC5rZXlcbiAgICB9XG5cbiAgICBpZiAobWF0Y2guaWR4ID4gLTEpIHtcbiAgICAgIG9iai5yZWZJbmRleCA9IG1hdGNoLmlkeFxuICAgIH1cblxuICAgIGRhdGEubWF0Y2hlcy5wdXNoKG9iailcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAocmVzdWx0LCBkYXRhKSA9PiB7XG4gIGRhdGEuc2NvcmUgPSByZXN1bHQuc2NvcmVcbn0iXSwic291cmNlUm9vdCI6IiJ9