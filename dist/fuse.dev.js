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

        return searcher.searchInString(text);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Z1c2UvLi9zcmMvaGVscGVycy9nZXQuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9oZWxwZXJzL3R5cGUtY2hlY2tlcnMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtbWF0Y2hlZC1pbmRpY2VzLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1zY29yZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtc2VhcmNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9pbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9zdWZmaXgtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9hcnJheS11dGlscy9pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL3VuaW9uLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9kaXN0YW5jZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvZGlzdGFuY2UvamFjY2FyZC1kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvY3JlYXRlLWluZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90b29scy9rZXktc3RvcmUuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLW1hdGNoZXMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLXNjb3JlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJpc0RlZmluZWQiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNBcnJheSIsInRvU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIm9iaiIsInBhdGgiLCJsaXN0IiwiYXJyIiwiX2dldCIsInB1c2giLCJkb3RJbmRleCIsImluZGV4T2YiLCJrZXkiLCJyZW1haW5pbmciLCJzbGljZSIsInZhbHVlIiwiaSIsImxlbiIsImxlbmd0aCIsIklORklOSVRZIiwiQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJjYWxsIiwiYmFzZVRvU3RyaW5nIiwicmVzdWx0IiwiaXNPYmplY3QiLCJ1bmRlZmluZWQiLCJCaXRhcFNlYXJjaCIsIkV4dGVuZGVkU2VhcmNoIiwiTkdyYW1TZWFyY2giLCJnZXQiLCJjcmVhdGVJbmRleCIsIktleVN0b3JlIiwidHJhbnNmb3JtTWF0Y2hlcyIsInRyYW5zZm9ybVNjb3JlIiwiTUFYX0JJVFMiLCJGdXNlT3B0aW9ucyIsImlzQ2FzZVNlbnNpdGl2ZSIsImRpc3RhbmNlIiwiZmluZEFsbE1hdGNoZXMiLCJnZXRGbiIsImluY2x1ZGVNYXRjaGVzIiwiaW5jbHVkZVNjb3JlIiwia2V5cyIsImxvY2F0aW9uIiwibWluTWF0Y2hDaGFyTGVuZ3RoIiwic2hvdWxkU29ydCIsInNvcnRGbiIsImEiLCJiIiwic2NvcmUiLCJ0aHJlc2hvbGQiLCJ1c2VFeHRlbmRlZFNlYXJjaCIsIkZ1c2UiLCJvcHRpb25zIiwiaW5kZXgiLCJjYXNlU2Vuc2l0aXZlIiwiX3Byb2Nlc3NLZXlzIiwic2V0Q29sbGVjdGlvbiIsImxpc3RJc1N0cmluZ0FycmF5Iiwic2V0SW5kZXgiLCJfY3JlYXRlSW5kZXgiLCJsaXN0SW5kZXgiLCJfaW5kZXhlZExpc3QiLCJfa2V5U3RvcmUiLCJ2ZXJib3NlIiwicGF0dGVybiIsIm9wdHMiLCJsaW1pdCIsInNlYXJjaGVyIiwicmVzdWx0cyIsIl9zZWFyY2hVc2luZyIsIl9jb21wdXRlU2NvcmUiLCJfc29ydCIsIl9mb3JtYXQiLCJ0ZXh0IiwiJCIsImlkeCIsInNlYXJjaFJlc3VsdCIsInNlYXJjaEluIiwiaXNNYXRjaCIsIm1hdGNoIiwiaW5kaWNlcyIsIm1hdGNoZWRJbmRpY2VzIiwiaXRlbSIsIm1hdGNoZXMiLCJrZXlOYW1lcyIsImtleXNMZW4iLCJjb3VudCIsImoiLCJrIiwiYXJySXRlbSIsInNjb3JlTGVuIiwidG90YWxXZWlnaHRlZFNjb3JlIiwia2V5V2VpZ2h0Iiwid2VpZ2h0IiwiTnVtYmVyIiwiRVBTSUxPTiIsIk1hdGgiLCJwb3ciLCJzb3J0IiwiZmluYWxPdXRwdXQiLCJ0cmFuc2Zvcm1lcnMiLCJkYXRhIiwicmVmSW5kZXgiLCJtYXRjaG1hc2siLCJzdGFydCIsImVuZCIsIm1hc2siLCJjaGFyQXQiLCJlcnJvcnMiLCJjdXJyZW50TG9jYXRpb24iLCJleHBlY3RlZExvY2F0aW9uIiwiYWNjdXJhY3kiLCJwcm94aW1pdHkiLCJhYnMiLCJiaXRhcFNjb3JlIiwicGF0dGVybkFscGhhYmV0IiwicGF0dGVybkxlbiIsInRleHRMZW4iLCJtYXgiLCJtaW4iLCJjdXJyZW50VGhyZXNob2xkIiwiYmVzdExvY2F0aW9uIiwibWF0Y2hNYXNrIiwibGFzdEluZGV4T2YiLCJsYXN0Qml0QXJyIiwiZmluYWxTY29yZSIsImJpbk1heCIsImJpbk1pbiIsImJpbk1pZCIsImZsb29yIiwiZmluaXNoIiwiYml0QXJyIiwiY2hhck1hdGNoIiwiYml0YXBTZWFyY2giLCJFcnJvciIsInRvTG93ZXJDYXNlIiwic2VhcmNoSW5TdHJpbmciLCJpc0ZvclBhdHRlcm4iLCJzYW5pdGl6ZSIsInN1YnN0ciIsInNhbml0aXplZFBhdHRlcm4iLCJleGFjdE1hdGNoIiwiaW52ZXJzZUV4YWN0TWF0Y2giLCJwcmVmaXhFeGFjdE1hdGNoIiwiaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2giLCJzdWZmaXhFeGFjdE1hdGNoIiwiaW52ZXJzZVN1ZmZpeEV4YWN0TWF0Y2giLCJxdWVyeWZ5Iiwic3BsaXQiLCJtYXAiLCJ0cmltIiwicXVlcnkiLCJfZnV6enlDYWNoZSIsIm1hdGNoRm91bmQiLCJxTGVuIiwicGFydHMiLCJwTGVuIiwidG9rZW4iLCJfc2VhcmNoIiwic3RhcnRzV2l0aCIsInN1YnN0cmluZyIsImVuZHNXaXRoIiwidW5pb24iLCJpbnRlcnNlY3Rpb24iLCJhcnIxIiwiYXJyMiIsIml0ZW0xIiwiaXRlbTIiLCJqYWNjYXJkRGlzdGFuY2UiLCJuR3JhbTEiLCJuR3JhbTIiLCJuR3JhbVVuaW9uIiwibkdyYW1JbnRlcnNlY3Rpb24iLCJuZ3JhbSIsInBhdHRlcm5OZ3JhbSIsInRleHROZ3JhbSIsIm5nIiwiamFjYXJkUmVzdWx0IiwiTkdSQU1fTEVOIiwibiIsInBhZCIsIm5HcmFtcyIsIm5ncmFtcyIsImluZGV4ZWRMaXN0IiwicmVjb3JkIiwic3ViUmVjb3JkcyIsInN0YWNrIiwiYXJyYXlJbmRleCIsInBvcCIsInN1YlJlY29yZCIsImFyckxlbiIsIl9rZXlzIiwiX2tleU5hbWVzIiwiX2xlbmd0aCIsInRvdGFsV2VpZ2h0IiwiaGFzT3duUHJvcGVydHkiLCJrZXlOYW1lIiwibmFtZSIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87UUNWQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztlQzVFSUEsbUJBQU8sQ0FBQyx1REFBRCxDO0lBTFRDLFMsWUFBQUEsUztJQUNBQyxRLFlBQUFBLFE7SUFDQUMsUSxZQUFBQSxRO0lBQ0FDLE8sWUFBQUEsTztJQUNBQyxRLFlBQUFBLFE7O0FBR0ZDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFDQyxHQUFELEVBQU1DLElBQU4sRUFBZTtBQUM5QixNQUFJQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUlDLEdBQUcsR0FBRyxLQUFWOztBQUVBLE1BQU1DLElBQUksR0FBRyxTQUFQQSxJQUFPLENBQUNKLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQzFCLFFBQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1Q7QUFDQUMsVUFBSSxDQUFDRyxJQUFMLENBQVVMLEdBQVY7QUFDRCxLQUhELE1BR087QUFDTCxVQUFNTSxRQUFRLEdBQUdMLElBQUksQ0FBQ00sT0FBTCxDQUFhLEdBQWIsQ0FBakI7QUFFQSxVQUFJQyxHQUFHLEdBQUdQLElBQVY7QUFDQSxVQUFJUSxTQUFTLEdBQUcsSUFBaEI7O0FBRUEsVUFBSUgsUUFBUSxLQUFLLENBQUMsQ0FBbEIsRUFBcUI7QUFDbkJFLFdBQUcsR0FBR1AsSUFBSSxDQUFDUyxLQUFMLENBQVcsQ0FBWCxFQUFjSixRQUFkLENBQU47QUFDQUcsaUJBQVMsR0FBR1IsSUFBSSxDQUFDUyxLQUFMLENBQVdKLFFBQVEsR0FBRyxDQUF0QixDQUFaO0FBQ0Q7O0FBRUQsVUFBTUssS0FBSyxHQUFHWCxHQUFHLENBQUNRLEdBQUQsQ0FBakI7O0FBRUEsVUFBSWYsU0FBUyxDQUFDa0IsS0FBRCxDQUFiLEVBQXNCO0FBQ3BCLFlBQUksQ0FBQ0YsU0FBRCxLQUFlZixRQUFRLENBQUNpQixLQUFELENBQVIsSUFBbUJoQixRQUFRLENBQUNnQixLQUFELENBQTFDLENBQUosRUFBd0Q7QUFDdERULGNBQUksQ0FBQ0csSUFBTCxDQUFVUixRQUFRLENBQUNjLEtBQUQsQ0FBbEI7QUFDRCxTQUZELE1BRU8sSUFBSWYsT0FBTyxDQUFDZSxLQUFELENBQVgsRUFBb0I7QUFDekJSLGFBQUcsR0FBRyxJQUFOLENBRHlCLENBRXpCOztBQUNBLGVBQUssSUFBSVMsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHRixLQUFLLENBQUNHLE1BQTVCLEVBQW9DRixDQUFDLEdBQUdDLEdBQXhDLEVBQTZDRCxDQUFDLElBQUksQ0FBbEQsRUFBcUQ7QUFDbkRSLGdCQUFJLENBQUNPLEtBQUssQ0FBQ0MsQ0FBRCxDQUFOLEVBQVdILFNBQVgsQ0FBSjtBQUNEO0FBQ0YsU0FOTSxNQU1BLElBQUlBLFNBQUosRUFBZTtBQUNwQjtBQUNBTCxjQUFJLENBQUNPLEtBQUQsRUFBUUYsU0FBUixDQUFKO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsR0FoQ0Q7O0FBa0NBTCxNQUFJLENBQUNKLEdBQUQsRUFBTUMsSUFBTixDQUFKOztBQUVBLE1BQUlFLEdBQUosRUFBUztBQUNQLFdBQU9ELElBQVA7QUFDRDs7QUFFRCxTQUFPQSxJQUFJLENBQUMsQ0FBRCxDQUFYO0FBQ0QsQ0E3Q0QsQzs7Ozs7Ozs7Ozs7OztBQ1JBLElBQU1hLFFBQVEsR0FBRyxJQUFJLENBQXJCOztBQUVBLElBQU1uQixPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFBZSxLQUFLO0FBQUEsU0FBSSxDQUFDSyxLQUFLLENBQUNwQixPQUFQLEdBQ3JCcUIsTUFBTSxDQUFDQyxTQUFQLENBQWlCckIsUUFBakIsQ0FBMEJzQixJQUExQixDQUErQlIsS0FBL0IsTUFBMEMsZ0JBRHJCLEdBRXJCSyxLQUFLLENBQUNwQixPQUFOLENBQWNlLEtBQWQsQ0FGaUI7QUFBQSxDQUFyQixDLENBSUE7QUFDQTs7O0FBQ0EsSUFBTVMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQVQsS0FBSyxFQUFJO0FBQzVCO0FBQ0EsTUFBSSxPQUFPQSxLQUFQLElBQWdCLFFBQXBCLEVBQThCO0FBQzVCLFdBQU9BLEtBQVA7QUFDRDs7QUFDRCxNQUFJVSxNQUFNLEdBQUlWLEtBQUssR0FBRyxFQUF0QjtBQUNBLFNBQVFVLE1BQU0sSUFBSSxHQUFWLElBQWtCLElBQUlWLEtBQUwsSUFBZSxDQUFDSSxRQUFsQyxHQUE4QyxJQUE5QyxHQUFxRE0sTUFBNUQ7QUFDRCxDQVBEOztBQVNBLElBQU14QixRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBYyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxJQUFJLElBQVQsR0FBZ0IsRUFBaEIsR0FBcUJTLFlBQVksQ0FBQ1QsS0FBRCxDQUFyQztBQUFBLENBQXRCOztBQUVBLElBQU1qQixRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBaUIsS0FBSztBQUFBLFNBQUksT0FBT0EsS0FBUCxLQUFpQixRQUFyQjtBQUFBLENBQXRCOztBQUVBLElBQU1oQixRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBZ0IsS0FBSztBQUFBLFNBQUksT0FBT0EsS0FBUCxLQUFpQixRQUFyQjtBQUFBLENBQXRCOztBQUVBLElBQU1XLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUFYLEtBQUs7QUFBQSxTQUFJLFFBQU9BLEtBQVAsTUFBaUIsUUFBckI7QUFBQSxDQUF0Qjs7QUFFQSxJQUFNbEIsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQWtCLEtBQUs7QUFBQSxTQUFJQSxLQUFLLEtBQUtZLFNBQVYsSUFBdUJaLEtBQUssS0FBSyxJQUFyQztBQUFBLENBQXZCOztBQUVBYixNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZk4sV0FBUyxFQUFUQSxTQURlO0FBRWZHLFNBQU8sRUFBUEEsT0FGZTtBQUdmRixVQUFRLEVBQVJBLFFBSGU7QUFJZkMsVUFBUSxFQUFSQSxRQUplO0FBS2YyQixVQUFRLEVBQVJBLFFBTGU7QUFNZnpCLFVBQVEsRUFBUkE7QUFOZSxDQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQzFCcURMLG1CQUFPLENBQUMsdUNBQUQsQztJQUFwRGdDLFcsWUFBQUEsVztJQUFhQyxjLFlBQUFBLGM7SUFBZ0JDLFcsWUFBQUEsVzs7Z0JBQ3dCbEMsbUJBQU8sQ0FBQywrREFBRCxDO0lBQTVESSxPLGFBQUFBLE87SUFBU0gsUyxhQUFBQSxTO0lBQVdDLFEsYUFBQUEsUTtJQUFVQyxRLGFBQUFBLFE7SUFBVTJCLFEsYUFBQUEsUTs7QUFDaEQsSUFBTUssR0FBRyxHQUFHbkMsbUJBQU8sQ0FBQywyQ0FBRCxDQUFuQjs7Z0JBQ2tDQSxtQkFBTyxDQUFDLHFDQUFELEM7SUFBakNvQyxXLGFBQUFBLFc7SUFBYUMsUSxhQUFBQSxROztnQkFDd0JyQyxtQkFBTyxDQUFDLDZDQUFELEM7SUFBNUNzQyxnQixhQUFBQSxnQjtJQUFrQkMsYyxhQUFBQSxjOztnQkFDTHZDLG1CQUFPLENBQUMsK0VBQUQsQztJQUFwQndDLFEsYUFBQUEsUSxFQUVSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUEsSUFBSUMsV0FBVyxHQUFHO0FBQ2hCO0FBQ0E7QUFDQUMsaUJBQWUsRUFBRSxLQUhEO0FBSWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsVUFBUSxFQUFFLEdBVE07QUFVaEI7QUFDQUMsZ0JBQWMsRUFBRSxLQVhBO0FBWWhCO0FBQ0E7QUFDQUMsT0FBSyxFQUFFVixHQWRTO0FBZWhCVyxnQkFBYyxFQUFFLEtBZkE7QUFnQmhCQyxjQUFZLEVBQUUsS0FoQkU7QUFpQmhCO0FBQ0FDLE1BQUksRUFBRSxFQWxCVTtBQW1CaEI7QUFDQUMsVUFBUSxFQUFFLENBcEJNO0FBcUJoQjtBQUNBQyxvQkFBa0IsRUFBRSxDQXRCSjtBQXVCaEI7QUFDQUMsWUFBVSxFQUFFLElBeEJJO0FBeUJoQjtBQUNBQyxRQUFNLEVBQUUsZ0JBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVdELENBQUMsQ0FBQ0UsS0FBRixHQUFVRCxDQUFDLENBQUNDLEtBQXZCO0FBQUEsR0ExQlE7QUEyQmhCO0FBQ0E7QUFDQUMsV0FBUyxFQUFFLEdBN0JLO0FBOEJoQjtBQUNBQyxtQkFBaUIsRUFBRTtBQS9CSCxDQUFsQjs7SUFrQ01DLEk7QUFDSixnQkFBWWhELElBQVosRUFBdUQ7QUFBQSxRQUFyQ2lELE9BQXFDLHVFQUEzQmxCLFdBQTJCO0FBQUEsUUFBZG1CLEtBQWMsdUVBQU4sSUFBTTs7QUFBQTs7QUFDckQsU0FBS0QsT0FBTCxxQkFBb0JsQixXQUFwQixNQUFvQ2tCLE9BQXBDLEVBRHFELENBRXJEOztBQUNBLFNBQUtBLE9BQUwsQ0FBYWpCLGVBQWIsR0FBK0JpQixPQUFPLENBQUNFLGFBQXZDO0FBQ0EsV0FBTyxLQUFLRixPQUFMLENBQWFFLGFBQXBCLENBSnFELENBTXJEOztBQUNBLFNBQUtDLFlBQUwsQ0FBa0IsS0FBS0gsT0FBTCxDQUFhWCxJQUEvQjs7QUFDQSxTQUFLZSxhQUFMLENBQW1CckQsSUFBbkIsRUFBeUJrRCxLQUF6QixFQVJxRCxDQVNyRDtBQUNEOzs7O2tDQUVhbEQsSSxFQUFvQjtBQUFBLFVBQWRrRCxLQUFjLHVFQUFOLElBQU07QUFDaEMsV0FBS2xELElBQUwsR0FBWUEsSUFBWjtBQUNBLFdBQUtzRCxpQkFBTCxHQUF5QjlELFFBQVEsQ0FBQ1EsSUFBSSxDQUFDLENBQUQsQ0FBTCxDQUFqQzs7QUFFQSxVQUFJa0QsS0FBSixFQUFXO0FBQ1QsYUFBS0ssUUFBTCxDQUFjTCxLQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0w7QUFDQSxhQUFLSyxRQUFMLENBQWMsS0FBS0MsWUFBTCxFQUFkLEVBRkssQ0FHTDtBQUNEO0FBQ0Y7Ozs2QkFFUUMsUyxFQUFXO0FBQ2xCLFdBQUtDLFlBQUwsR0FBb0JELFNBQXBCLENBRGtCLENBRWxCO0FBQ0Q7OztpQ0FFWW5CLEksRUFBTTtBQUNqQixXQUFLcUIsU0FBTCxHQUFpQixJQUFJaEMsUUFBSixDQUFhVyxJQUFiLENBQWpCLENBRGlCLENBR2pCOztBQUNBLFVBQUlVLElBQUksQ0FBQ1ksT0FBVCxFQUFrQixDQUNoQjtBQUNEO0FBQ0Y7OzttQ0FFYztBQUNiLGFBQU9sQyxXQUFXLENBQUMsS0FBS2lDLFNBQUwsQ0FBZXJCLElBQWYsRUFBRCxFQUF3QixLQUFLdEMsSUFBN0IsRUFBbUM7QUFDbkRtQyxhQUFLLEVBQUUsS0FBS2MsT0FBTCxDQUFhZDtBQUQrQixPQUFuQyxDQUFsQjtBQUdEOzs7MkJBRU0wQixPLEVBQWtDO0FBQUEsVUFBekJDLElBQXlCLHVFQUFsQjtBQUFFQyxhQUFLLEVBQUU7QUFBVCxPQUFrQjtBQUN2QztBQUR1QywwQkFFRyxLQUFLZCxPQUZSO0FBQUEsVUFFL0JGLGlCQUYrQixpQkFFL0JBLGlCQUYrQjtBQUFBLFVBRVpOLFVBRlksaUJBRVpBLFVBRlk7QUFJdkMsVUFBSXVCLFFBQVEsR0FBRyxJQUFmOztBQUVBLFVBQUlqQixpQkFBSixFQUF1QjtBQUNyQmlCLGdCQUFRLEdBQUcsSUFBSXpDLGNBQUosQ0FBbUJzQyxPQUFuQixFQUE0QixLQUFLWixPQUFqQyxDQUFYO0FBQ0QsT0FGRCxNQUVPLElBQUlZLE9BQU8sQ0FBQ2pELE1BQVIsR0FBaUJrQixRQUFyQixFQUErQjtBQUNwQ2tDLGdCQUFRLEdBQUcsSUFBSXhDLFdBQUosQ0FBZ0JxQyxPQUFoQixFQUF5QixLQUFLWixPQUE5QixDQUFYO0FBQ0QsT0FGTSxNQUVBO0FBQ0xlLGdCQUFRLEdBQUcsSUFBSTFDLFdBQUosQ0FBZ0J1QyxPQUFoQixFQUF5QixLQUFLWixPQUE5QixDQUFYO0FBQ0QsT0Fac0MsQ0FjdkM7OztBQUNBLFVBQUlnQixPQUFPLEdBQUcsS0FBS0MsWUFBTCxDQUFrQkYsUUFBbEIsQ0FBZCxDQWZ1QyxDQWdCdkM7QUFFQTs7O0FBQ0EsV0FBS0csYUFBTCxDQUFtQkYsT0FBbkIsRUFuQnVDLENBb0J2Qzs7O0FBRUEsVUFBSXhCLFVBQUosRUFBZ0I7QUFDZCxhQUFLMkIsS0FBTCxDQUFXSCxPQUFYO0FBQ0Q7O0FBRUQsVUFBSUgsSUFBSSxDQUFDQyxLQUFMLElBQWN0RSxRQUFRLENBQUNxRSxJQUFJLENBQUNDLEtBQU4sQ0FBMUIsRUFBd0M7QUFDdENFLGVBQU8sR0FBR0EsT0FBTyxDQUFDekQsS0FBUixDQUFjLENBQWQsRUFBaUJzRCxJQUFJLENBQUNDLEtBQXRCLENBQVY7QUFDRDs7QUFFRCxhQUFPLEtBQUtNLE9BQUwsQ0FBYUosT0FBYixDQUFQO0FBQ0Q7OztpQ0FFWUQsUSxFQUFVO0FBQ3JCLFVBQU1oRSxJQUFJLEdBQUcsS0FBSzBELFlBQWxCO0FBQ0EsVUFBTU8sT0FBTyxHQUFHLEVBQWhCO0FBRnFCLFVBR2I3QixjQUhhLEdBR00sS0FBS2EsT0FIWCxDQUdiYixjQUhhLEVBS3JCOztBQUNBLFVBQUksS0FBS2tCLGlCQUFULEVBQTRCO0FBQzFCO0FBQ0EsYUFBSyxJQUFJNUMsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHWCxJQUFJLENBQUNZLE1BQTNCLEVBQW1DRixDQUFDLEdBQUdDLEdBQXZDLEVBQTRDRCxDQUFDLElBQUksQ0FBakQsRUFBb0Q7QUFDbEQsY0FBSUQsS0FBSyxHQUFHVCxJQUFJLENBQUNVLENBQUQsQ0FBaEI7QUFEa0QsY0FFekM0RCxJQUZ5QyxHQUUzQjdELEtBRjJCLENBRTVDOEQsQ0FGNEM7QUFBQSxjQUVuQ0MsR0FGbUMsR0FFM0IvRCxLQUYyQixDQUVuQytELEdBRm1DOztBQUlsRCxjQUFJLENBQUNqRixTQUFTLENBQUMrRSxJQUFELENBQWQsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxjQUFJRyxZQUFZLEdBQUdULFFBQVEsQ0FBQ1UsUUFBVCxDQUFrQmpFLEtBQWxCLENBQW5CO0FBUmtELGNBVTFDa0UsT0FWMEMsR0FVdkJGLFlBVnVCLENBVTFDRSxPQVYwQztBQUFBLGNBVWpDOUIsS0FWaUMsR0FVdkI0QixZQVZ1QixDQVVqQzVCLEtBVmlDOztBQVlsRCxjQUFJLENBQUM4QixPQUFMLEVBQWM7QUFDWjtBQUNEOztBQUVELGNBQUlDLEtBQUssR0FBRztBQUFFL0IsaUJBQUssRUFBTEEsS0FBRjtBQUFTcEMsaUJBQUssRUFBRTZEO0FBQWhCLFdBQVo7O0FBRUEsY0FBSWxDLGNBQUosRUFBb0I7QUFDbEJ3QyxpQkFBSyxDQUFDQyxPQUFOLEdBQWdCSixZQUFZLENBQUNLLGNBQTdCO0FBQ0Q7O0FBRURiLGlCQUFPLENBQUM5RCxJQUFSLENBQWE7QUFDWDRFLGdCQUFJLEVBQUVULElBREs7QUFFWEUsZUFBRyxFQUFIQSxHQUZXO0FBR1hRLG1CQUFPLEVBQUUsQ0FBQ0osS0FBRDtBQUhFLFdBQWI7QUFLRDtBQUVGLE9BL0JELE1BK0JPO0FBQ0w7QUFDQSxZQUFNSyxRQUFRLEdBQUcsS0FBS3RCLFNBQUwsQ0FBZXJCLElBQWYsRUFBakI7O0FBQ0EsWUFBTTRDLE9BQU8sR0FBRyxLQUFLdkIsU0FBTCxDQUFld0IsS0FBZixFQUFoQjs7QUFFQSxhQUFLLElBQUl6RSxFQUFDLEdBQUcsQ0FBUixFQUFXQyxJQUFHLEdBQUdYLElBQUksQ0FBQ1ksTUFBM0IsRUFBbUNGLEVBQUMsR0FBR0MsSUFBdkMsRUFBNENELEVBQUMsSUFBSSxDQUFqRCxFQUFvRDtBQUFBLHlCQUMzQlYsSUFBSSxDQUFDVSxFQUFELENBRHVCO0FBQUEsY0FDekNxRSxJQUR5QyxZQUM1Q1IsQ0FENEM7QUFBQSxjQUNuQ0MsSUFEbUMsWUFDbkNBLEdBRG1DOztBQUdsRCxjQUFJLENBQUNqRixTQUFTLENBQUN3RixJQUFELENBQWQsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxjQUFJQyxPQUFPLEdBQUcsRUFBZCxDQVBrRCxDQVNsRDs7QUFDQSxlQUFLLElBQUlJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLE9BQXBCLEVBQTZCRSxDQUFDLElBQUksQ0FBbEMsRUFBcUM7QUFDbkMsZ0JBQUk5RSxHQUFHLEdBQUcyRSxRQUFRLENBQUNHLENBQUQsQ0FBbEI7QUFDQSxnQkFBSTNFLE1BQUssR0FBR3NFLElBQUksQ0FBQ3pFLEdBQUQsQ0FBaEIsQ0FGbUMsQ0FJbkM7O0FBRUEsZ0JBQUksQ0FBQ2YsU0FBUyxDQUFDa0IsTUFBRCxDQUFkLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsZ0JBQUlmLE9BQU8sQ0FBQ2UsTUFBRCxDQUFYLEVBQW9CO0FBQ2xCLG1CQUFLLElBQUk0RSxDQUFDLEdBQUcsQ0FBUixFQUFXMUUsS0FBRyxHQUFHRixNQUFLLENBQUNHLE1BQTVCLEVBQW9DeUUsQ0FBQyxHQUFHMUUsS0FBeEMsRUFBNkMwRSxDQUFDLElBQUksQ0FBbEQsRUFBcUQ7QUFDbkQsb0JBQUlDLE9BQU8sR0FBRzdFLE1BQUssQ0FBQzRFLENBQUQsQ0FBbkI7QUFDQSxvQkFBSWYsS0FBSSxHQUFHZ0IsT0FBTyxDQUFDZixDQUFuQjtBQUNBLG9CQUFJQyxLQUFHLEdBQUdjLE9BQU8sQ0FBQ2QsR0FBbEI7O0FBRUEsb0JBQUksQ0FBQ2pGLFNBQVMsQ0FBQytFLEtBQUQsQ0FBZCxFQUFzQjtBQUNwQjtBQUNEOztBQUVELG9CQUFJRyxhQUFZLEdBQUdULFFBQVEsQ0FBQ1UsUUFBVCxDQUFrQlksT0FBbEIsQ0FBbkI7O0FBVG1ELG9CQVczQ1gsUUFYMkMsR0FXeEJGLGFBWHdCLENBVzNDRSxPQVgyQztBQUFBLG9CQVdsQzlCLE1BWGtDLEdBV3hCNEIsYUFYd0IsQ0FXbEM1QixLQVhrQyxFQWFuRDs7QUFFQSxvQkFBSSxDQUFDOEIsUUFBTCxFQUFjO0FBQ1o7QUFDRDs7QUFFRCxvQkFBSUMsTUFBSyxHQUFHO0FBQUUvQix1QkFBSyxFQUFMQSxNQUFGO0FBQVN2QyxxQkFBRyxFQUFIQSxHQUFUO0FBQWNHLHVCQUFLLEVBQUU2RCxLQUFyQjtBQUEyQkUscUJBQUcsRUFBSEE7QUFBM0IsaUJBQVo7O0FBRUEsb0JBQUlwQyxjQUFKLEVBQW9CO0FBQ2xCd0Msd0JBQUssQ0FBQ0MsT0FBTixHQUFnQkosYUFBWSxDQUFDSyxjQUE3QjtBQUNEOztBQUVERSx1QkFBTyxDQUFDN0UsSUFBUixDQUFheUUsTUFBYjtBQUNEO0FBQ0YsYUE1QkQsTUE0Qk87QUFDTCxrQkFBSU4sTUFBSSxHQUFHN0QsTUFBSyxDQUFDOEQsQ0FBakI7O0FBQ0Esa0JBQUlFLGNBQVksR0FBR1QsUUFBUSxDQUFDVSxRQUFULENBQWtCakUsTUFBbEIsQ0FBbkI7O0FBRkssa0JBSUdrRSxTQUpILEdBSXNCRixjQUp0QixDQUlHRSxPQUpIO0FBQUEsa0JBSVk5QixPQUpaLEdBSXNCNEIsY0FKdEIsQ0FJWTVCLEtBSlosRUFNTDs7QUFFQSxrQkFBSSxDQUFDOEIsU0FBTCxFQUFjO0FBQ1o7QUFDRDs7QUFFRCxrQkFBSUMsT0FBSyxHQUFHO0FBQUUvQixxQkFBSyxFQUFMQSxPQUFGO0FBQVN2QyxtQkFBRyxFQUFIQSxHQUFUO0FBQWNHLHFCQUFLLEVBQUU2RDtBQUFyQixlQUFaOztBQUVBLGtCQUFJbEMsY0FBSixFQUFvQjtBQUNsQndDLHVCQUFLLENBQUNDLE9BQU4sR0FBZ0JKLGNBQVksQ0FBQ0ssY0FBN0I7QUFDRDs7QUFFREUscUJBQU8sQ0FBQzdFLElBQVIsQ0FBYXlFLE9BQWI7QUFDRDtBQUNGOztBQUVELGNBQUlJLE9BQU8sQ0FBQ3BFLE1BQVosRUFBb0I7QUFDbEJxRCxtQkFBTyxDQUFDOUQsSUFBUixDQUFhO0FBQ1hxRSxpQkFBRyxFQUFIQSxJQURXO0FBRVhPLGtCQUFJLEVBQUpBLElBRlc7QUFHWEMscUJBQU8sRUFBUEE7QUFIVyxhQUFiO0FBS0Q7QUFDRjtBQUNGLE9BeEhvQixDQTBIckI7QUFDQTtBQUNBOzs7QUFFQSxhQUFPZixPQUFQO0FBQ0Q7OztrQ0FFYUEsTyxFQUFTO0FBQ3JCO0FBRUEsV0FBSyxJQUFJdkQsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHc0QsT0FBTyxDQUFDckQsTUFBOUIsRUFBc0NGLENBQUMsR0FBR0MsR0FBMUMsRUFBK0NELENBQUMsSUFBSSxDQUFwRCxFQUF1RDtBQUNyRCxZQUFNUyxNQUFNLEdBQUc4QyxPQUFPLENBQUN2RCxDQUFELENBQXRCO0FBQ0EsWUFBTXNFLE9BQU8sR0FBRzdELE1BQU0sQ0FBQzZELE9BQXZCO0FBQ0EsWUFBTU8sUUFBUSxHQUFHUCxPQUFPLENBQUNwRSxNQUF6QjtBQUVBLFlBQUk0RSxrQkFBa0IsR0FBRyxDQUF6QixDQUxxRCxDQU1yRDs7QUFFQSxhQUFLLElBQUlKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdHLFFBQXBCLEVBQThCSCxDQUFDLElBQUksQ0FBbkMsRUFBc0M7QUFDcEMsY0FBTUwsSUFBSSxHQUFHQyxPQUFPLENBQUNJLENBQUQsQ0FBcEI7QUFDQSxjQUFNOUUsR0FBRyxHQUFHeUUsSUFBSSxDQUFDekUsR0FBakI7O0FBQ0EsY0FBTW1GLFNBQVMsR0FBRyxLQUFLOUIsU0FBTCxDQUFlbEMsR0FBZixDQUFtQm5CLEdBQW5CLEVBQXdCLFFBQXhCLENBQWxCOztBQUNBLGNBQU1vRixNQUFNLEdBQUdELFNBQVMsR0FBRyxDQUFDLENBQWIsR0FBaUJBLFNBQWpCLEdBQTZCLENBQTVDO0FBQ0EsY0FBTTVDLEtBQUssR0FBR2tDLElBQUksQ0FBQ2xDLEtBQUwsS0FBZSxDQUFmLElBQW9CNEMsU0FBUyxHQUFHLENBQUMsQ0FBakMsR0FDVkUsTUFBTSxDQUFDQyxPQURHLEdBRVZiLElBQUksQ0FBQ2xDLEtBRlQ7QUFJQTJDLDRCQUFrQixJQUFJSyxJQUFJLENBQUNDLEdBQUwsQ0FBU2pELEtBQVQsRUFBZ0I2QyxNQUFoQixDQUF0QixDQVRvQyxDQVdwQztBQUNBO0FBQ0E7QUFDRDs7QUFFRHZFLGNBQU0sQ0FBQzBCLEtBQVAsR0FBZTJDLGtCQUFmLENBeEJxRCxDQXlCckQ7QUFFQTtBQUNEO0FBQ0Y7OzswQkFFS3ZCLE8sRUFBUztBQUNiO0FBQ0FBLGFBQU8sQ0FBQzhCLElBQVIsQ0FBYSxLQUFLOUMsT0FBTCxDQUFhUCxNQUExQjtBQUNEOzs7NEJBRU91QixPLEVBQVM7QUFDZixVQUFNK0IsV0FBVyxHQUFHLEVBQXBCO0FBRGUsMkJBRzJCLEtBQUsvQyxPQUhoQztBQUFBLFVBR1BiLGNBSE8sa0JBR1BBLGNBSE87QUFBQSxVQUdTQyxZQUhULGtCQUdTQSxZQUhULEVBS2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQUk0RCxZQUFZLEdBQUcsRUFBbkI7QUFFQSxVQUFJN0QsY0FBSixFQUFvQjZELFlBQVksQ0FBQzlGLElBQWIsQ0FBa0J5QixnQkFBbEI7QUFDcEIsVUFBSVMsWUFBSixFQUFrQjRELFlBQVksQ0FBQzlGLElBQWIsQ0FBa0IwQixjQUFsQixFQXhCSCxDQTBCZjtBQUNBO0FBQ0E7O0FBRUEsV0FBSyxJQUFJbkIsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHc0QsT0FBTyxDQUFDckQsTUFBOUIsRUFBc0NGLENBQUMsR0FBR0MsR0FBMUMsRUFBK0NELENBQUMsSUFBSSxDQUFwRCxFQUF1RDtBQUNyRCxZQUFNUyxNQUFNLEdBQUc4QyxPQUFPLENBQUN2RCxDQUFELENBQXRCLENBRHFELENBR3JEOztBQUhxRCxZQUs3QzhELEdBTDZDLEdBS3JDckQsTUFMcUMsQ0FLN0NxRCxHQUw2QztBQU9yRCxZQUFNMEIsSUFBSSxHQUFHO0FBQ1huQixjQUFJLEVBQUUsS0FBSy9FLElBQUwsQ0FBVXdFLEdBQVYsQ0FESztBQUVYMkIsa0JBQVEsRUFBRTNCO0FBRkMsU0FBYjs7QUFLQSxZQUFJeUIsWUFBWSxDQUFDckYsTUFBakIsRUFBeUI7QUFDdkIsZUFBSyxJQUFJd0UsQ0FBQyxHQUFHLENBQVIsRUFBV3pFLEtBQUcsR0FBR3NGLFlBQVksQ0FBQ3JGLE1BQW5DLEVBQTJDd0UsQ0FBQyxHQUFHekUsS0FBL0MsRUFBb0R5RSxDQUFDLElBQUksQ0FBekQsRUFBNEQ7QUFDMURhLHdCQUFZLENBQUNiLENBQUQsQ0FBWixDQUFnQmpFLE1BQWhCLEVBQXdCK0UsSUFBeEI7QUFDRDtBQUNGOztBQUdERixtQkFBVyxDQUFDN0YsSUFBWixDQUFpQitGLElBQWpCO0FBQ0Q7O0FBRUQsYUFBT0YsV0FBUDtBQUNEOzs7Ozs7QUFHSGhELElBQUksQ0FBQ3RCLFdBQUwsR0FBbUJBLFdBQW5CO0FBRUE5QixNQUFNLENBQUNDLE9BQVAsR0FBaUJtRCxJQUFqQixDOzs7Ozs7Ozs7OztBQ2hYQXBELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixZQUE0QztBQUFBLE1BQTNDdUcsU0FBMkMsdUVBQS9CLEVBQStCO0FBQUEsTUFBM0I1RCxrQkFBMkIsdUVBQU4sQ0FBTTtBQUMzRCxNQUFJc0MsY0FBYyxHQUFHLEVBQXJCO0FBQ0EsTUFBSXVCLEtBQUssR0FBRyxDQUFDLENBQWI7QUFDQSxNQUFJQyxHQUFHLEdBQUcsQ0FBQyxDQUFYO0FBQ0EsTUFBSTVGLENBQUMsR0FBRyxDQUFSOztBQUVBLE9BQUssSUFBSUMsR0FBRyxHQUFHeUYsU0FBUyxDQUFDeEYsTUFBekIsRUFBaUNGLENBQUMsR0FBR0MsR0FBckMsRUFBMENELENBQUMsSUFBSSxDQUEvQyxFQUFrRDtBQUNoRCxRQUFJa0UsS0FBSyxHQUFHd0IsU0FBUyxDQUFDMUYsQ0FBRCxDQUFyQjs7QUFDQSxRQUFJa0UsS0FBSyxJQUFJeUIsS0FBSyxLQUFLLENBQUMsQ0FBeEIsRUFBMkI7QUFDekJBLFdBQUssR0FBRzNGLENBQVI7QUFDRCxLQUZELE1BRU8sSUFBSSxDQUFDa0UsS0FBRCxJQUFVeUIsS0FBSyxLQUFLLENBQUMsQ0FBekIsRUFBNEI7QUFDakNDLFNBQUcsR0FBRzVGLENBQUMsR0FBRyxDQUFWOztBQUNBLFVBQUs0RixHQUFHLEdBQUdELEtBQVAsR0FBZ0IsQ0FBaEIsSUFBcUI3RCxrQkFBekIsRUFBNkM7QUFDM0NzQyxzQkFBYyxDQUFDM0UsSUFBZixDQUFvQixDQUFDa0csS0FBRCxFQUFRQyxHQUFSLENBQXBCO0FBQ0Q7O0FBQ0RELFdBQUssR0FBRyxDQUFDLENBQVQ7QUFDRDtBQUNGLEdBakIwRCxDQW1CM0Q7OztBQUNBLE1BQUlELFNBQVMsQ0FBQzFGLENBQUMsR0FBRyxDQUFMLENBQVQsSUFBcUJBLENBQUMsR0FBRzJGLEtBQUwsSUFBZTdELGtCQUF2QyxFQUEyRDtBQUN6RHNDLGtCQUFjLENBQUMzRSxJQUFmLENBQW9CLENBQUNrRyxLQUFELEVBQVEzRixDQUFDLEdBQUcsQ0FBWixDQUFwQjtBQUNEOztBQUVELFNBQU9vRSxjQUFQO0FBQ0QsQ0F6QkQsQzs7Ozs7Ozs7Ozs7QUNBQWxGLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixVQUFBZ0UsT0FBTyxFQUFJO0FBQzFCLE1BQUkwQyxJQUFJLEdBQUcsRUFBWDtBQUNBLE1BQUk1RixHQUFHLEdBQUdrRCxPQUFPLENBQUNqRCxNQUFsQjs7QUFFQSxPQUFLLElBQUlGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdDLEdBQXBCLEVBQXlCRCxDQUFDLElBQUksQ0FBOUIsRUFBaUM7QUFDL0I2RixRQUFJLENBQUMxQyxPQUFPLENBQUMyQyxNQUFSLENBQWU5RixDQUFmLENBQUQsQ0FBSixHQUEwQixDQUExQjtBQUNEOztBQUVELE9BQUssSUFBSUEsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBR0MsR0FBcEIsRUFBeUJELEVBQUMsSUFBSSxDQUE5QixFQUFpQztBQUMvQjZGLFFBQUksQ0FBQzFDLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZTlGLEVBQWYsQ0FBRCxDQUFKLElBQTJCLEtBQU1DLEdBQUcsR0FBR0QsRUFBTixHQUFVLENBQTNDO0FBQ0Q7O0FBRUQsU0FBTzZGLElBQVA7QUFDRCxDQWJELEM7Ozs7Ozs7Ozs7O0FDQUEzRyxNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQ2dFLE9BQUQsUUFBd0Y7QUFBQSx5QkFBNUU0QyxNQUE0RTtBQUFBLE1BQTVFQSxNQUE0RSw0QkFBbkUsQ0FBbUU7QUFBQSxrQ0FBaEVDLGVBQWdFO0FBQUEsTUFBaEVBLGVBQWdFLHFDQUE5QyxDQUE4QztBQUFBLG1DQUEzQ0MsZ0JBQTJDO0FBQUEsTUFBM0NBLGdCQUEyQyxzQ0FBeEIsQ0FBd0I7QUFBQSwyQkFBckIxRSxRQUFxQjtBQUFBLE1BQXJCQSxRQUFxQiw4QkFBVixHQUFVO0FBQ3ZHLE1BQU0yRSxRQUFRLEdBQUdILE1BQU0sR0FBRzVDLE9BQU8sQ0FBQ2pELE1BQWxDO0FBQ0EsTUFBTWlHLFNBQVMsR0FBR2hCLElBQUksQ0FBQ2lCLEdBQUwsQ0FBU0gsZ0JBQWdCLEdBQUdELGVBQTVCLENBQWxCOztBQUVBLE1BQUksQ0FBQ3pFLFFBQUwsRUFBZTtBQUNiO0FBQ0EsV0FBTzRFLFNBQVMsR0FBRyxHQUFILEdBQVNELFFBQXpCO0FBQ0Q7O0FBRUQsU0FBT0EsUUFBUSxHQUFJQyxTQUFTLEdBQUc1RSxRQUEvQjtBQUNELENBVkQsQzs7Ozs7Ozs7Ozs7QUNBQSxJQUFNOEUsVUFBVSxHQUFHekgsbUJBQU8sQ0FBQywrREFBRCxDQUExQjs7QUFDQSxJQUFNd0YsY0FBYyxHQUFHeEYsbUJBQU8sQ0FBQyxtRkFBRCxDQUE5Qjs7QUFFQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5RSxJQUFELEVBQU9ULE9BQVAsRUFBZ0JtRCxlQUFoQixRQUErSjtBQUFBLDJCQUE1SHpFLFFBQTRIO0FBQUEsTUFBNUhBLFFBQTRILDhCQUFqSCxDQUFpSDtBQUFBLDJCQUE5R04sUUFBOEc7QUFBQSxNQUE5R0EsUUFBOEcsOEJBQW5HLEdBQW1HO0FBQUEsNEJBQTlGYSxTQUE4RjtBQUFBLE1BQTlGQSxTQUE4RiwrQkFBbEYsR0FBa0Y7QUFBQSxpQ0FBN0VaLGNBQTZFO0FBQUEsTUFBN0VBLGNBQTZFLG9DQUE1RCxLQUE0RDtBQUFBLG1DQUFyRE0sa0JBQXFEO0FBQUEsTUFBckRBLGtCQUFxRCxzQ0FBaEMsQ0FBZ0M7QUFBQSxpQ0FBN0JKLGNBQTZCO0FBQUEsTUFBN0JBLGNBQTZCLG9DQUFaLEtBQVk7QUFDOUssTUFBTTZFLFVBQVUsR0FBR3BELE9BQU8sQ0FBQ2pELE1BQTNCLENBRDhLLENBRTlLOztBQUNBLE1BQU1zRyxPQUFPLEdBQUc1QyxJQUFJLENBQUMxRCxNQUFyQixDQUg4SyxDQUk5Szs7QUFDQSxNQUFNK0YsZ0JBQWdCLEdBQUdkLElBQUksQ0FBQ3NCLEdBQUwsQ0FBUyxDQUFULEVBQVl0QixJQUFJLENBQUN1QixHQUFMLENBQVM3RSxRQUFULEVBQW1CMkUsT0FBbkIsQ0FBWixDQUF6QixDQUw4SyxDQU05Szs7QUFDQSxNQUFJRyxnQkFBZ0IsR0FBR3ZFLFNBQXZCLENBUDhLLENBUTlLOztBQUNBLE1BQUl3RSxZQUFZLEdBQUdoRCxJQUFJLENBQUNqRSxPQUFMLENBQWF3RCxPQUFiLEVBQXNCOEMsZ0JBQXRCLENBQW5CLENBVDhLLENBVzlLOztBQUNBLE1BQU1ZLFNBQVMsR0FBRyxFQUFsQjs7QUFDQSxPQUFLLElBQUk3RyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHd0csT0FBcEIsRUFBNkJ4RyxDQUFDLElBQUksQ0FBbEMsRUFBcUM7QUFDbkM2RyxhQUFTLENBQUM3RyxDQUFELENBQVQsR0FBZSxDQUFmO0FBQ0Q7O0FBRUQsTUFBSTRHLFlBQVksS0FBSyxDQUFDLENBQXRCLEVBQXlCO0FBQ3ZCLFFBQUl6RSxLQUFLLEdBQUdrRSxVQUFVLENBQUNsRCxPQUFELEVBQVU7QUFDOUI0QyxZQUFNLEVBQUUsQ0FEc0I7QUFFOUJDLHFCQUFlLEVBQUVZLFlBRmE7QUFHOUJYLHNCQUFnQixFQUFoQkEsZ0JBSDhCO0FBSTlCMUUsY0FBUSxFQUFSQTtBQUo4QixLQUFWLENBQXRCO0FBTUFvRixvQkFBZ0IsR0FBR3hCLElBQUksQ0FBQ3VCLEdBQUwsQ0FBU3ZFLEtBQVQsRUFBZ0J3RSxnQkFBaEIsQ0FBbkIsQ0FQdUIsQ0FTdkI7O0FBQ0FDLGdCQUFZLEdBQUdoRCxJQUFJLENBQUNrRCxXQUFMLENBQWlCM0QsT0FBakIsRUFBMEI4QyxnQkFBZ0IsR0FBR00sVUFBN0MsQ0FBZjs7QUFFQSxRQUFJSyxZQUFZLEtBQUssQ0FBQyxDQUF0QixFQUF5QjtBQUN2QixVQUFJekUsTUFBSyxHQUFHa0UsVUFBVSxDQUFDbEQsT0FBRCxFQUFVO0FBQzlCNEMsY0FBTSxFQUFFLENBRHNCO0FBRTlCQyx1QkFBZSxFQUFFWSxZQUZhO0FBRzlCWCx3QkFBZ0IsRUFBaEJBLGdCQUg4QjtBQUk5QjFFLGdCQUFRLEVBQVJBO0FBSjhCLE9BQVYsQ0FBdEI7O0FBTUFvRixzQkFBZ0IsR0FBR3hCLElBQUksQ0FBQ3VCLEdBQUwsQ0FBU3ZFLE1BQVQsRUFBZ0J3RSxnQkFBaEIsQ0FBbkI7QUFDRDtBQUNGLEdBdEM2SyxDQXdDOUs7OztBQUNBQyxjQUFZLEdBQUcsQ0FBQyxDQUFoQjtBQUVBLE1BQUlHLFVBQVUsR0FBRyxFQUFqQjtBQUNBLE1BQUlDLFVBQVUsR0FBRyxDQUFqQjtBQUNBLE1BQUlDLE1BQU0sR0FBR1YsVUFBVSxHQUFHQyxPQUExQjtBQUVBLE1BQU1YLElBQUksR0FBRyxNQUFNVSxVQUFVLElBQUksRUFBZCxHQUFtQkEsVUFBVSxHQUFHLENBQWhDLEdBQW9DLEVBQTFDLENBQWI7O0FBRUEsT0FBSyxJQUFJdkcsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBR3VHLFVBQXBCLEVBQWdDdkcsRUFBQyxJQUFJLENBQXJDLEVBQXdDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLFFBQUlrSCxNQUFNLEdBQUcsQ0FBYjtBQUNBLFFBQUlDLE1BQU0sR0FBR0YsTUFBYjs7QUFFQSxXQUFPQyxNQUFNLEdBQUdDLE1BQWhCLEVBQXdCO0FBQ3RCLFVBQU1oRixPQUFLLEdBQUdrRSxVQUFVLENBQUNsRCxPQUFELEVBQVU7QUFDaEM0QyxjQUFNLEVBQUUvRixFQUR3QjtBQUVoQ2dHLHVCQUFlLEVBQUVDLGdCQUFnQixHQUFHa0IsTUFGSjtBQUdoQ2xCLHdCQUFnQixFQUFoQkEsZ0JBSGdDO0FBSWhDMUUsZ0JBQVEsRUFBUkE7QUFKZ0MsT0FBVixDQUF4Qjs7QUFPQSxVQUFJWSxPQUFLLElBQUl3RSxnQkFBYixFQUErQjtBQUM3Qk8sY0FBTSxHQUFHQyxNQUFUO0FBQ0QsT0FGRCxNQUVPO0FBQ0xGLGNBQU0sR0FBR0UsTUFBVDtBQUNEOztBQUVEQSxZQUFNLEdBQUdoQyxJQUFJLENBQUNpQyxLQUFMLENBQVcsQ0FBQ0gsTUFBTSxHQUFHQyxNQUFWLElBQW9CLENBQXBCLEdBQXdCQSxNQUFuQyxDQUFUO0FBQ0QsS0F0QnFDLENBd0J0Qzs7O0FBQ0FELFVBQU0sR0FBR0UsTUFBVDtBQUVBLFFBQUl4QixLQUFLLEdBQUdSLElBQUksQ0FBQ3NCLEdBQUwsQ0FBUyxDQUFULEVBQVlSLGdCQUFnQixHQUFHa0IsTUFBbkIsR0FBNEIsQ0FBeEMsQ0FBWjtBQUNBLFFBQUlFLE1BQU0sR0FBRzdGLGNBQWMsR0FBR2dGLE9BQUgsR0FBYXJCLElBQUksQ0FBQ3VCLEdBQUwsQ0FBU1QsZ0JBQWdCLEdBQUdrQixNQUE1QixFQUFvQ1gsT0FBcEMsSUFBK0NELFVBQXZGLENBNUJzQyxDQThCdEM7O0FBQ0EsUUFBSWUsTUFBTSxHQUFHbEgsS0FBSyxDQUFDaUgsTUFBTSxHQUFHLENBQVYsQ0FBbEI7QUFFQUMsVUFBTSxDQUFDRCxNQUFNLEdBQUcsQ0FBVixDQUFOLEdBQXFCLENBQUMsS0FBS3JILEVBQU4sSUFBVyxDQUFoQzs7QUFFQSxTQUFLLElBQUkwRSxDQUFDLEdBQUcyQyxNQUFiLEVBQXFCM0MsQ0FBQyxJQUFJaUIsS0FBMUIsRUFBaUNqQixDQUFDLElBQUksQ0FBdEMsRUFBeUM7QUFDdkMsVUFBSXNCLGVBQWUsR0FBR3RCLENBQUMsR0FBRyxDQUExQjtBQUNBLFVBQUk2QyxTQUFTLEdBQUdqQixlQUFlLENBQUMxQyxJQUFJLENBQUNrQyxNQUFMLENBQVlFLGVBQVosQ0FBRCxDQUEvQjs7QUFFQSxVQUFJdUIsU0FBSixFQUFlO0FBQ2JWLGlCQUFTLENBQUNiLGVBQUQsQ0FBVCxHQUE2QixDQUE3QjtBQUNELE9BTnNDLENBUXZDOzs7QUFDQXNCLFlBQU0sQ0FBQzVDLENBQUQsQ0FBTixHQUFZLENBQUU0QyxNQUFNLENBQUM1QyxDQUFDLEdBQUcsQ0FBTCxDQUFOLElBQWlCLENBQWxCLEdBQXVCLENBQXhCLElBQTZCNkMsU0FBekMsQ0FUdUMsQ0FXdkM7O0FBQ0EsVUFBSXZILEVBQUMsS0FBSyxDQUFWLEVBQWE7QUFDWHNILGNBQU0sQ0FBQzVDLENBQUQsQ0FBTixJQUFlLENBQUNxQyxVQUFVLENBQUNyQyxDQUFDLEdBQUcsQ0FBTCxDQUFWLEdBQW9CcUMsVUFBVSxDQUFDckMsQ0FBRCxDQUEvQixLQUF1QyxDQUF4QyxHQUE2QyxDQUE5QyxHQUFtRHFDLFVBQVUsQ0FBQ3JDLENBQUMsR0FBRyxDQUFMLENBQTFFO0FBQ0Q7O0FBRUQsVUFBSTRDLE1BQU0sQ0FBQzVDLENBQUQsQ0FBTixHQUFZbUIsSUFBaEIsRUFBc0I7QUFDcEJtQixrQkFBVSxHQUFHWCxVQUFVLENBQUNsRCxPQUFELEVBQVU7QUFDL0I0QyxnQkFBTSxFQUFFL0YsRUFEdUI7QUFFL0JnRyx5QkFBZSxFQUFmQSxlQUYrQjtBQUcvQkMsMEJBQWdCLEVBQWhCQSxnQkFIK0I7QUFJL0IxRSxrQkFBUSxFQUFSQTtBQUorQixTQUFWLENBQXZCLENBRG9CLENBUXBCO0FBQ0E7O0FBQ0EsWUFBSXlGLFVBQVUsSUFBSUwsZ0JBQWxCLEVBQW9DO0FBQ2xDO0FBQ0FBLDBCQUFnQixHQUFHSyxVQUFuQjtBQUNBSixzQkFBWSxHQUFHWixlQUFmLENBSGtDLENBS2xDOztBQUNBLGNBQUlZLFlBQVksSUFBSVgsZ0JBQXBCLEVBQXNDO0FBQ3BDO0FBQ0QsV0FSaUMsQ0FVbEM7OztBQUNBTixlQUFLLEdBQUdSLElBQUksQ0FBQ3NCLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSVIsZ0JBQUosR0FBdUJXLFlBQW5DLENBQVI7QUFDRDtBQUNGO0FBQ0YsS0EzRXFDLENBNkV0Qzs7O0FBQ0EsUUFBTXpFLE9BQUssR0FBR2tFLFVBQVUsQ0FBQ2xELE9BQUQsRUFBVTtBQUNoQzRDLFlBQU0sRUFBRS9GLEVBQUMsR0FBRyxDQURvQjtBQUVoQ2dHLHFCQUFlLEVBQUVDLGdCQUZlO0FBR2hDQSxzQkFBZ0IsRUFBaEJBLGdCQUhnQztBQUloQzFFLGNBQVEsRUFBUkE7QUFKZ0MsS0FBVixDQUF4Qjs7QUFPQSxRQUFJWSxPQUFLLEdBQUd3RSxnQkFBWixFQUE4QjtBQUM1QjtBQUNEOztBQUVESSxjQUFVLEdBQUdPLE1BQWI7QUFDRDs7QUFFRCxNQUFJN0csTUFBTSxHQUFHO0FBQ1h3RCxXQUFPLEVBQUUyQyxZQUFZLElBQUksQ0FEZDtBQUVYO0FBQ0F6RSxTQUFLLEVBQUUsQ0FBQzZFLFVBQUQsR0FBYyxLQUFkLEdBQXNCQTtBQUhsQixHQUFiOztBQU1BLE1BQUl0RixjQUFKLEVBQW9CO0FBQ2xCakIsVUFBTSxDQUFDMkQsY0FBUCxHQUF3QkEsY0FBYyxDQUFDeUMsU0FBRCxFQUFZL0Usa0JBQVosQ0FBdEM7QUFDRDs7QUFFRCxTQUFPckIsTUFBUDtBQUNELENBeEpELEM7Ozs7Ozs7Ozs7O0FDSEE7QUFDQXZCLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlaUMsUUFBZixHQUEwQixFQUExQixDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0RBLElBQU1vRyxXQUFXLEdBQUc1SSxtQkFBTyxDQUFDLGlFQUFELENBQTNCOztBQUNBLElBQU0wSCxlQUFlLEdBQUcxSCxtQkFBTyxDQUFDLHFGQUFELENBQS9COztlQUNxQkEsbUJBQU8sQ0FBQywyREFBRCxDO0lBQXBCd0MsUSxZQUFBQSxROztJQUVGUixXO0FBQ0osdUJBQVl1QyxPQUFaLFFBcUJHO0FBQUEsNkJBbkJEdEIsUUFtQkM7QUFBQSxRQW5CREEsUUFtQkMsOEJBbkJVLENBbUJWO0FBQUEsNkJBYkROLFFBYUM7QUFBQSxRQWJEQSxRQWFDLDhCQWJVLEdBYVY7QUFBQSw4QkFWRGEsU0FVQztBQUFBLFFBVkRBLFNBVUMsK0JBVlcsR0FVWDtBQUFBLG9DQVJEZCxlQVFDO0FBQUEsUUFSREEsZUFRQyxxQ0FSaUIsS0FRakI7QUFBQSxtQ0FMREUsY0FLQztBQUFBLFFBTERBLGNBS0Msb0NBTGdCLEtBS2hCO0FBQUEscUNBSERNLGtCQUdDO0FBQUEsUUFIREEsa0JBR0Msc0NBSG9CLENBR3BCO0FBQUEsbUNBRERKLGNBQ0M7QUFBQSxRQUREQSxjQUNDLG9DQURnQixLQUNoQjs7QUFBQTs7QUFDRCxTQUFLYSxPQUFMLEdBQWU7QUFDYlYsY0FBUSxFQUFSQSxRQURhO0FBRWJOLGNBQVEsRUFBUkEsUUFGYTtBQUdiYSxlQUFTLEVBQVRBLFNBSGE7QUFJYmQscUJBQWUsRUFBZkEsZUFKYTtBQUtiRSxvQkFBYyxFQUFkQSxjQUxhO0FBTWJFLG9CQUFjLEVBQWRBLGNBTmE7QUFPYkksd0JBQWtCLEVBQWxCQTtBQVBhLEtBQWY7O0FBVUEsUUFBSXFCLE9BQU8sQ0FBQ2pELE1BQVIsR0FBaUJrQixRQUFyQixFQUErQjtBQUM3QixZQUFNLElBQUlxRyxLQUFKLHlDQUEyQ3JHLFFBQTNDLE9BQU47QUFDRDs7QUFFRCxTQUFLK0IsT0FBTCxHQUFlN0IsZUFBZSxHQUFHNkIsT0FBSCxHQUFhQSxPQUFPLENBQUN1RSxXQUFSLEVBQTNDO0FBQ0EsU0FBS3BCLGVBQUwsR0FBdUJBLGVBQWUsQ0FBQyxLQUFLbkQsT0FBTixDQUF0QztBQUNEOzs7OzZCQUVRcEQsSyxFQUFPO0FBQ2QsVUFBSTZELElBQUksR0FBRzdELEtBQUssQ0FBQzhELENBQWpCO0FBQ0EsYUFBTyxLQUFLOEQsY0FBTCxDQUFvQi9ELElBQXBCLENBQVA7QUFDRDs7O21DQUVjQSxJLEVBQU07QUFBQSwwQkFDeUIsS0FBS3JCLE9BRDlCO0FBQUEsVUFDWGpCLGVBRFcsaUJBQ1hBLGVBRFc7QUFBQSxVQUNNSSxjQUROLGlCQUNNQSxjQUROOztBQUduQixVQUFJLENBQUNKLGVBQUwsRUFBc0I7QUFDcEJzQyxZQUFJLEdBQUdBLElBQUksQ0FBQzhELFdBQUwsRUFBUDtBQUNELE9BTGtCLENBT25COzs7QUFDQSxVQUFJLEtBQUt2RSxPQUFMLEtBQWlCUyxJQUFyQixFQUEyQjtBQUN6QixZQUFJbkQsTUFBTSxHQUFHO0FBQ1h3RCxpQkFBTyxFQUFFLElBREU7QUFFWDlCLGVBQUssRUFBRTtBQUZJLFNBQWI7O0FBS0EsWUFBSVQsY0FBSixFQUFvQjtBQUNsQmpCLGdCQUFNLENBQUMyRCxjQUFQLEdBQXdCLENBQUMsQ0FBQyxDQUFELEVBQUlSLElBQUksQ0FBQzFELE1BQUwsR0FBYyxDQUFsQixDQUFELENBQXhCO0FBQ0Q7O0FBRUQsZUFBT08sTUFBUDtBQUNELE9BbkJrQixDQXFCbkI7OztBQXJCbUIsMkJBc0IyRCxLQUFLOEIsT0F0QmhFO0FBQUEsVUFzQlhWLFFBdEJXLGtCQXNCWEEsUUF0Qlc7QUFBQSxVQXNCRE4sUUF0QkMsa0JBc0JEQSxRQXRCQztBQUFBLFVBc0JTYSxTQXRCVCxrQkFzQlNBLFNBdEJUO0FBQUEsVUFzQm9CWixjQXRCcEIsa0JBc0JvQkEsY0F0QnBCO0FBQUEsVUFzQm9DTSxrQkF0QnBDLGtCQXNCb0NBLGtCQXRCcEM7QUF1Qm5CLGFBQU8wRixXQUFXLENBQUM1RCxJQUFELEVBQU8sS0FBS1QsT0FBWixFQUFxQixLQUFLbUQsZUFBMUIsRUFBMkM7QUFDM0R6RSxnQkFBUSxFQUFSQSxRQUQyRDtBQUUzRE4sZ0JBQVEsRUFBUkEsUUFGMkQ7QUFHM0RhLGlCQUFTLEVBQVRBLFNBSDJEO0FBSTNEWixzQkFBYyxFQUFkQSxjQUoyRDtBQUszRE0sMEJBQWtCLEVBQWxCQSxrQkFMMkQ7QUFNM0RKLHNCQUFjLEVBQWRBO0FBTjJELE9BQTNDLENBQWxCO0FBUUQ7Ozs7OztBQUdIeEMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCeUIsV0FBakIsQzs7Ozs7Ozs7Ozs7QUNwRkE7QUFDQTtBQUNBO0FBRUEsSUFBTWdILFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUF6RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMkMsTUFBUixDQUFlLENBQWYsS0FBcUIsR0FBekI7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNK0IsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQTFFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMyRSxNQUFSLENBQWUsQ0FBZixDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTTVELEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNbUUsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQzFFLE9BQUQsQ0FBakM7QUFDQSxNQUFNWCxLQUFLLEdBQUdvQixJQUFJLENBQUNqRSxPQUFMLENBQWFvSSxnQkFBYixDQUFkO0FBQ0EsTUFBTTlELE9BQU8sR0FBR3pCLEtBQUssR0FBRyxDQUFDLENBQXpCO0FBRUEsU0FBTztBQUNMeUIsV0FBTyxFQUFQQSxPQURLO0FBRUw5QixTQUFLLEVBQUU7QUFGRixHQUFQO0FBSUQsQ0FURDs7QUFXQWpELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmeUksY0FBWSxFQUFaQSxZQURlO0FBRWZDLFVBQVEsRUFBUkEsUUFGZTtBQUdmM0QsT0FBSyxFQUFMQTtBQUhlLENBQWpCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkJBLElBQU04RCxVQUFVLEdBQUdwSixtQkFBTyxDQUFDLGtFQUFELENBQTFCOztBQUNBLElBQU1xSixpQkFBaUIsR0FBR3JKLG1CQUFPLENBQUMsa0ZBQUQsQ0FBakM7O0FBQ0EsSUFBTXNKLGdCQUFnQixHQUFHdEosbUJBQU8sQ0FBQyxnRkFBRCxDQUFoQzs7QUFDQSxJQUFNdUosdUJBQXVCLEdBQUd2SixtQkFBTyxDQUFDLGdHQUFELENBQXZDOztBQUNBLElBQU13SixnQkFBZ0IsR0FBR3hKLG1CQUFPLENBQUMsZ0ZBQUQsQ0FBaEM7O0FBQ0EsSUFBTXlKLHVCQUF1QixHQUFHekosbUJBQU8sQ0FBQyxnR0FBRCxDQUF2Qzs7QUFDQSxJQUFNZ0MsV0FBVyxHQUFHaEMsbUJBQU8sQ0FBQywyREFBRCxDQUEzQjs7ZUFFcUJBLG1CQUFPLENBQUMsbUVBQUQsQztJQUFwQkUsUSxZQUFBQSxRLEVBRVI7QUFDQTtBQUNBOzs7QUFDQSxJQUFNd0osT0FBTyxHQUFHLFNBQVZBLE9BQVUsQ0FBQ25GLE9BQUQ7QUFBQSxTQUFhQSxPQUFPLENBQUNvRixLQUFSLENBQWMsR0FBZCxFQUFtQkMsR0FBbkIsQ0FBdUIsVUFBQW5FLElBQUk7QUFBQSxXQUFJQSxJQUFJLENBQUNvRSxJQUFMLEdBQVlGLEtBQVosQ0FBa0IsS0FBbEIsQ0FBSjtBQUFBLEdBQTNCLENBQWI7QUFBQSxDQUFoQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCTTFILGM7QUFDSiwwQkFBWXNDLE9BQVosRUFBcUJaLE9BQXJCLEVBQThCO0FBQUE7O0FBQUEsUUFDcEJqQixlQURvQixHQUNBaUIsT0FEQSxDQUNwQmpCLGVBRG9CO0FBRTVCLFNBQUtvSCxLQUFMLEdBQWEsSUFBYjtBQUNBLFNBQUtuRyxPQUFMLEdBQWVBLE9BQWYsQ0FINEIsQ0FJNUI7O0FBQ0EsU0FBS29HLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsUUFBSTdKLFFBQVEsQ0FBQ3FFLE9BQUQsQ0FBUixJQUFxQkEsT0FBTyxDQUFDc0YsSUFBUixHQUFldkksTUFBZixHQUF3QixDQUFqRCxFQUFvRDtBQUNsRCxXQUFLaUQsT0FBTCxHQUFlN0IsZUFBZSxHQUFHNkIsT0FBSCxHQUFhQSxPQUFPLENBQUN1RSxXQUFSLEVBQTNDO0FBQ0EsV0FBS2dCLEtBQUwsR0FBYUosT0FBTyxDQUFDLEtBQUtuRixPQUFOLENBQXBCO0FBQ0Q7QUFDRjs7Ozs2QkFFUXBELEssRUFBTztBQUNkLFVBQU0ySSxLQUFLLEdBQUcsS0FBS0EsS0FBbkI7O0FBRUEsVUFBSSxDQUFDLEtBQUtBLEtBQVYsRUFBaUI7QUFDZixlQUFPO0FBQ0x6RSxpQkFBTyxFQUFFLEtBREo7QUFFTDlCLGVBQUssRUFBRTtBQUZGLFNBQVA7QUFJRDs7QUFFRCxVQUFJeUIsSUFBSSxHQUFHN0QsS0FBSyxDQUFDOEQsQ0FBakI7QUFFQUQsVUFBSSxHQUFHLEtBQUtyQixPQUFMLENBQWFqQixlQUFiLEdBQStCc0MsSUFBL0IsR0FBc0NBLElBQUksQ0FBQzhELFdBQUwsRUFBN0M7QUFFQSxVQUFJa0IsVUFBVSxHQUFHLEtBQWpCOztBQUVBLFdBQUssSUFBSTVJLENBQUMsR0FBRyxDQUFSLEVBQVc2SSxJQUFJLEdBQUdILEtBQUssQ0FBQ3hJLE1BQTdCLEVBQXFDRixDQUFDLEdBQUc2SSxJQUF6QyxFQUErQzdJLENBQUMsSUFBSSxDQUFwRCxFQUF1RDtBQUVyRCxZQUFNOEksS0FBSyxHQUFHSixLQUFLLENBQUMxSSxDQUFELENBQW5CO0FBQ0EsWUFBSVMsTUFBTSxHQUFHLElBQWI7QUFDQW1JLGtCQUFVLEdBQUcsSUFBYjs7QUFFQSxhQUFLLElBQUlsRSxDQUFDLEdBQUcsQ0FBUixFQUFXcUUsSUFBSSxHQUFHRCxLQUFLLENBQUM1SSxNQUE3QixFQUFxQ3dFLENBQUMsR0FBR3FFLElBQXpDLEVBQStDckUsQ0FBQyxJQUFJLENBQXBELEVBQXVEO0FBQ3JELGNBQUlzRSxLQUFLLEdBQUdGLEtBQUssQ0FBQ3BFLENBQUQsQ0FBakI7QUFDQWpFLGdCQUFNLEdBQUcsS0FBS3dJLE9BQUwsQ0FBYUQsS0FBYixFQUFvQnBGLElBQXBCLENBQVQ7O0FBQ0EsY0FBSSxDQUFDbkQsTUFBTSxDQUFDd0QsT0FBWixFQUFxQjtBQUNuQjtBQUNBMkUsc0JBQVUsR0FBRyxLQUFiO0FBQ0E7QUFDRDtBQUNGLFNBZG9ELENBZ0JyRDs7O0FBQ0EsWUFBSUEsVUFBSixFQUFnQjtBQUNkLGlCQUFPbkksTUFBUDtBQUNEO0FBQ0YsT0FwQ2EsQ0FzQ2Q7OztBQUNBLGFBQU87QUFDTHdELGVBQU8sRUFBRSxLQURKO0FBRUw5QixhQUFLLEVBQUU7QUFGRixPQUFQO0FBSUQ7Ozs0QkFFT2dCLE8sRUFBU1MsSSxFQUFNO0FBQ3JCLFVBQUlvRSxVQUFVLENBQUNKLFlBQVgsQ0FBd0J6RSxPQUF4QixDQUFKLEVBQXNDO0FBQ3BDLGVBQU82RSxVQUFVLENBQUM5RCxLQUFYLENBQWlCZixPQUFqQixFQUEwQlMsSUFBMUIsQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJc0UsZ0JBQWdCLENBQUNOLFlBQWpCLENBQThCekUsT0FBOUIsQ0FBSixFQUE0QztBQUNqRCxlQUFPK0UsZ0JBQWdCLENBQUNoRSxLQUFqQixDQUF1QmYsT0FBdkIsRUFBZ0NTLElBQWhDLENBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSXVFLHVCQUF1QixDQUFDUCxZQUF4QixDQUFxQ3pFLE9BQXJDLENBQUosRUFBbUQ7QUFDeEQsZUFBT2dGLHVCQUF1QixDQUFDakUsS0FBeEIsQ0FBOEJmLE9BQTlCLEVBQXVDUyxJQUF2QyxDQUFQO0FBQ0QsT0FGTSxNQUVBLElBQUl5RSx1QkFBdUIsQ0FBQ1QsWUFBeEIsQ0FBcUN6RSxPQUFyQyxDQUFKLEVBQW1EO0FBQ3hELGVBQU9rRix1QkFBdUIsQ0FBQ25FLEtBQXhCLENBQThCZixPQUE5QixFQUF1Q1MsSUFBdkMsQ0FBUDtBQUNELE9BRk0sTUFFQSxJQUFJd0UsZ0JBQWdCLENBQUNSLFlBQWpCLENBQThCekUsT0FBOUIsQ0FBSixFQUE0QztBQUNqRCxlQUFPaUYsZ0JBQWdCLENBQUNsRSxLQUFqQixDQUF1QmYsT0FBdkIsRUFBZ0NTLElBQWhDLENBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSXFFLGlCQUFpQixDQUFDTCxZQUFsQixDQUErQnpFLE9BQS9CLENBQUosRUFBNkM7QUFDbEQsZUFBTzhFLGlCQUFpQixDQUFDL0QsS0FBbEIsQ0FBd0JmLE9BQXhCLEVBQWlDUyxJQUFqQyxDQUFQO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsWUFBSU4sUUFBUSxHQUFHLEtBQUtxRixXQUFMLENBQWlCeEYsT0FBakIsQ0FBZjs7QUFDQSxZQUFJLENBQUNHLFFBQUwsRUFBZTtBQUNiQSxrQkFBUSxHQUFHLElBQUkxQyxXQUFKLENBQWdCdUMsT0FBaEIsRUFBeUIsS0FBS1osT0FBOUIsQ0FBWDtBQUNBLGVBQUtvRyxXQUFMLENBQWlCeEYsT0FBakIsSUFBNEJHLFFBQTVCO0FBQ0Q7O0FBQ0QsZUFBT0EsUUFBUSxDQUFDcUUsY0FBVCxDQUF3Qi9ELElBQXhCLENBQVA7QUFDRDtBQUNGOzs7Ozs7QUFHSDFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjBCLGNBQWpCLEM7Ozs7Ozs7Ozs7O0FDN0hBO0FBQ0E7QUFDQTtBQUVBLElBQU0rRyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBekUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZSxDQUFmLEtBQXFCLEdBQXpCO0FBQUEsQ0FBNUI7O0FBRUEsSUFBTStCLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUExRSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMkUsTUFBUixDQUFlLENBQWYsQ0FBSjtBQUFBLENBQXhCOztBQUVBLElBQU01RCxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFDZixPQUFELEVBQVVTLElBQVYsRUFBbUI7QUFDL0IsTUFBTW1FLGdCQUFnQixHQUFHRixRQUFRLENBQUMxRSxPQUFELENBQWpDO0FBQ0EsTUFBTWMsT0FBTyxHQUFHTCxJQUFJLENBQUNqRSxPQUFMLENBQWFvSSxnQkFBYixNQUFtQyxDQUFDLENBQXBEO0FBRUEsU0FBTztBQUNMOUQsV0FBTyxFQUFQQSxPQURLO0FBRUw5QixTQUFLLEVBQUU7QUFGRixHQUFQO0FBSUQsQ0FSRDs7QUFVQWpELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmeUksY0FBWSxFQUFaQSxZQURlO0FBRWZDLFVBQVEsRUFBUkEsUUFGZTtBQUdmM0QsT0FBSyxFQUFMQTtBQUhlLENBQWpCLEM7Ozs7Ozs7Ozs7O0FDbEJBO0FBQ0E7QUFDQTtBQUVBLElBQU0wRCxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBekUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZSxDQUFmLEtBQXFCLEdBQXJCLElBQTRCM0MsT0FBTyxDQUFDMkMsTUFBUixDQUFlLENBQWYsS0FBcUIsR0FBckQ7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNK0IsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQTFFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMyRSxNQUFSLENBQWUsQ0FBZixDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTTVELEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNbUUsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQzFFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUcsQ0FBQ0wsSUFBSSxDQUFDc0YsVUFBTCxDQUFnQm5CLGdCQUFoQixDQUFqQjtBQUVBLFNBQU87QUFDTDlELFdBQU8sRUFBUEEsT0FESztBQUVMOUIsU0FBSyxFQUFFO0FBRkYsR0FBUDtBQUlELENBUkQ7O0FBVUFqRCxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZnlJLGNBQVksRUFBWkEsWUFEZTtBQUVmQyxVQUFRLEVBQVJBLFFBRmU7QUFHZjNELE9BQUssRUFBTEE7QUFIZSxDQUFqQixDOzs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFFQSxJQUFNMEQsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQXpFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMyQyxNQUFSLENBQWUsQ0FBZixLQUFxQixHQUFyQixJQUE0QjNDLE9BQU8sQ0FBQzJDLE1BQVIsQ0FBZTNDLE9BQU8sQ0FBQ2pELE1BQVIsR0FBaUIsQ0FBaEMsS0FBc0MsR0FBdEU7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNMkgsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQTFFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUNnRyxTQUFSLENBQWtCLENBQWxCLEVBQXFCaEcsT0FBTyxDQUFDakQsTUFBUixHQUFpQixDQUF0QyxDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTWdFLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNbUUsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQzFFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUcsQ0FBQ0wsSUFBSSxDQUFDd0YsUUFBTCxDQUFjckIsZ0JBQWQsQ0FBakI7QUFFQSxTQUFPO0FBQ0w5RCxXQUFPLEVBQVBBLE9BREs7QUFFTDlCLFNBQUssRUFBRTtBQUZGLEdBQVA7QUFJRCxDQVJEOztBQVVBakQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z5SSxjQUFZLEVBQVpBLFlBRGU7QUFFZkMsVUFBUSxFQUFSQSxRQUZlO0FBR2YzRCxPQUFLLEVBQUxBO0FBSGUsQ0FBakIsQzs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBRUEsSUFBTTBELFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUF6RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMkMsTUFBUixDQUFlLENBQWYsS0FBcUIsR0FBekI7QUFBQSxDQUE1Qjs7QUFFQSxJQUFNK0IsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQTFFLE9BQU87QUFBQSxTQUFJQSxPQUFPLENBQUMyRSxNQUFSLENBQWUsQ0FBZixDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTTVELEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNbUUsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQzFFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUdMLElBQUksQ0FBQ3NGLFVBQUwsQ0FBZ0JuQixnQkFBaEIsQ0FBaEI7QUFFQSxTQUFPO0FBQ0w5RCxXQUFPLEVBQVBBLE9BREs7QUFFTDlCLFNBQUssRUFBRTtBQUZGLEdBQVA7QUFJRCxDQVJEOztBQVVBakQsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z5SSxjQUFZLEVBQVpBLFlBRGU7QUFFZkMsVUFBUSxFQUFSQSxRQUZlO0FBR2YzRCxPQUFLLEVBQUxBO0FBSGUsQ0FBakIsQzs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBRUEsSUFBTTBELFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQUF6RSxPQUFPO0FBQUEsU0FBSUEsT0FBTyxDQUFDMkMsTUFBUixDQUFlM0MsT0FBTyxDQUFDakQsTUFBUixHQUFpQixDQUFoQyxLQUFzQyxHQUExQztBQUFBLENBQTVCOztBQUVBLElBQU0ySCxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFBMUUsT0FBTztBQUFBLFNBQUlBLE9BQU8sQ0FBQzJFLE1BQVIsQ0FBZSxDQUFmLEVBQWtCM0UsT0FBTyxDQUFDakQsTUFBUixHQUFpQixDQUFuQyxDQUFKO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTWdFLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNmLE9BQUQsRUFBVVMsSUFBVixFQUFtQjtBQUMvQixNQUFNbUUsZ0JBQWdCLEdBQUdGLFFBQVEsQ0FBQzFFLE9BQUQsQ0FBakM7QUFDQSxNQUFNYyxPQUFPLEdBQUdMLElBQUksQ0FBQ3dGLFFBQUwsQ0FBY3JCLGdCQUFkLENBQWhCO0FBRUEsU0FBTztBQUNMOUQsV0FBTyxFQUFQQSxPQURLO0FBRUw5QixTQUFLLEVBQUU7QUFGRixHQUFQO0FBSUQsQ0FSRDs7QUFVQWpELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmeUksY0FBWSxFQUFaQSxZQURlO0FBRWZDLFVBQVEsRUFBUkEsUUFGZTtBQUdmM0QsT0FBSyxFQUFMQTtBQUhlLENBQWpCLEM7Ozs7Ozs7Ozs7O0FDbEJBaEYsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z5QixhQUFXLEVBQUVoQyxtQkFBTyxDQUFDLDBEQUFELENBREw7QUFFZmlDLGdCQUFjLEVBQUVqQyxtQkFBTyxDQUFDLGdFQUFELENBRlI7QUFHZmtDLGFBQVcsRUFBRWxDLG1CQUFPLENBQUMsMERBQUQ7QUFITCxDQUFqQixDOzs7Ozs7Ozs7OztBQ0FBTSxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZmtLLE9BQUssRUFBRXpLLG1CQUFPLENBQUMsK0RBQUQsQ0FEQztBQUVmMEssY0FBWSxFQUFFMUssbUJBQU8sQ0FBQyw2RUFBRDtBQUZOLENBQWpCLEM7Ozs7Ozs7Ozs7O0FDQUE7QUFDQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUNvSyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDL0IsTUFBSS9JLE1BQU0sR0FBRyxFQUFiO0FBQ0EsTUFBSVQsQ0FBQyxHQUFHLENBQVI7QUFDQSxNQUFJMEUsQ0FBQyxHQUFHLENBQVI7O0FBRUEsU0FBTzFFLENBQUMsR0FBR3VKLElBQUksQ0FBQ3JKLE1BQVQsSUFBbUJ3RSxDQUFDLEdBQUc4RSxJQUFJLENBQUN0SixNQUFuQyxFQUEyQztBQUN6QyxRQUFJdUosS0FBSyxHQUFHRixJQUFJLENBQUN2SixDQUFELENBQWhCO0FBQ0EsUUFBSTBKLEtBQUssR0FBR0YsSUFBSSxDQUFDOUUsQ0FBRCxDQUFoQjs7QUFFQSxRQUFJK0UsS0FBSyxJQUFJQyxLQUFiLEVBQW9CO0FBQ2xCakosWUFBTSxDQUFDaEIsSUFBUCxDQUFZZ0ssS0FBWjtBQUNBekosT0FBQyxJQUFJLENBQUw7QUFDQTBFLE9BQUMsSUFBSSxDQUFMO0FBQ0QsS0FKRCxNQUlPLElBQUkrRSxLQUFLLEdBQUdDLEtBQVosRUFBbUI7QUFDeEIxSixPQUFDLElBQUksQ0FBTDtBQUNELEtBRk0sTUFFQSxJQUFJeUosS0FBSyxHQUFHQyxLQUFaLEVBQW1CO0FBQ3hCaEYsT0FBQyxJQUFJLENBQUw7QUFDRCxLQUZNLE1BRUE7QUFDTDFFLE9BQUMsSUFBSSxDQUFMO0FBQ0EwRSxPQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7O0FBRUQsU0FBT2pFLE1BQVA7QUFDRCxDQXhCRCxDOzs7Ozs7Ozs7OztBQ0RBO0FBQ0F2QixNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQ29LLElBQUQsRUFBT0MsSUFBUCxFQUFnQjtBQUMvQixNQUFJL0ksTUFBTSxHQUFHLEVBQWI7QUFDQSxNQUFJVCxDQUFDLEdBQUcsQ0FBUjtBQUNBLE1BQUkwRSxDQUFDLEdBQUcsQ0FBUjs7QUFFQSxTQUFPMUUsQ0FBQyxHQUFHdUosSUFBSSxDQUFDckosTUFBVCxJQUFtQndFLENBQUMsR0FBRzhFLElBQUksQ0FBQ3RKLE1BQW5DLEVBQTJDO0FBQ3pDLFFBQUl1SixLQUFLLEdBQUdGLElBQUksQ0FBQ3ZKLENBQUQsQ0FBaEI7QUFDQSxRQUFJMEosS0FBSyxHQUFHRixJQUFJLENBQUM5RSxDQUFELENBQWhCOztBQUVBLFFBQUkrRSxLQUFLLEdBQUdDLEtBQVosRUFBbUI7QUFDakJqSixZQUFNLENBQUNoQixJQUFQLENBQVlnSyxLQUFaO0FBQ0F6SixPQUFDLElBQUksQ0FBTDtBQUNELEtBSEQsTUFHTyxJQUFJMEosS0FBSyxHQUFHRCxLQUFaLEVBQW1CO0FBQ3hCaEosWUFBTSxDQUFDaEIsSUFBUCxDQUFZaUssS0FBWjtBQUNBaEYsT0FBQyxJQUFJLENBQUw7QUFDRCxLQUhNLE1BR0E7QUFDTGpFLFlBQU0sQ0FBQ2hCLElBQVAsQ0FBWWlLLEtBQVo7QUFDQTFKLE9BQUMsSUFBSSxDQUFMO0FBQ0EwRSxPQUFDLElBQUksQ0FBTDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTzFFLENBQUMsR0FBR3VKLElBQUksQ0FBQ3JKLE1BQWhCLEVBQXdCO0FBQ3RCTyxVQUFNLENBQUNoQixJQUFQLENBQVk4SixJQUFJLENBQUN2SixDQUFELENBQWhCO0FBQ0FBLEtBQUMsSUFBSSxDQUFMO0FBQ0Q7O0FBRUQsU0FBTzBFLENBQUMsR0FBRzhFLElBQUksQ0FBQ3RKLE1BQWhCLEVBQXdCO0FBQ3RCTyxVQUFNLENBQUNoQixJQUFQLENBQVkrSixJQUFJLENBQUM5RSxDQUFELENBQWhCO0FBQ0FBLEtBQUMsSUFBSSxDQUFMO0FBQ0Q7O0FBRUQsU0FBT2pFLE1BQVA7QUFDRCxDQWpDRCxDOzs7Ozs7Ozs7OztBQ0RBdkIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Z3SyxpQkFBZSxFQUFFL0ssbUJBQU8sQ0FBQyxrRkFBRDtBQURULENBQWpCLEM7Ozs7Ozs7Ozs7O2VDQWdDQSxtQkFBTyxDQUFDLHNFQUFELEM7SUFBL0J5SyxLLFlBQUFBLEs7SUFBT0MsWSxZQUFBQSxZOztBQUVmcEssTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5SyxNQUFELEVBQVNDLE1BQVQsRUFBb0I7QUFDbkMsTUFBSUMsVUFBVSxHQUFHVCxLQUFLLENBQUNPLE1BQUQsRUFBU0MsTUFBVCxDQUF0QjtBQUNBLE1BQUlFLGlCQUFpQixHQUFHVCxZQUFZLENBQUNNLE1BQUQsRUFBU0MsTUFBVCxDQUFwQztBQUVBLFNBQU8sSUFBSUUsaUJBQWlCLENBQUM3SixNQUFsQixHQUEyQjRKLFVBQVUsQ0FBQzVKLE1BQWpEO0FBQ0QsQ0FMRCxDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBLElBQU04SixLQUFLLEdBQUdwTCxtQkFBTyxDQUFDLG1EQUFELENBQXJCOztlQUM0QkEsbUJBQU8sQ0FBQywrREFBRCxDO0lBQTNCK0ssZSxZQUFBQSxlOztJQUVGN0ksVztBQUNKLHVCQUFZcUMsT0FBWixFQUFtRDtBQUFBLFFBQTlCWixPQUE4Qix1RUFBcEI7QUFBRUgsZUFBUyxFQUFFO0FBQWIsS0FBb0I7O0FBQUE7O0FBQ2pEO0FBQ0EsU0FBS0csT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBSzBILFlBQUwsR0FBb0JELEtBQUssQ0FBQzdHLE9BQUQsRUFBVTtBQUFFa0MsVUFBSSxFQUFFO0FBQVIsS0FBVixDQUF6QjtBQUNEOzs7OzZCQUNRdEYsSyxFQUFPO0FBQ2QsVUFBSW1LLFNBQVMsR0FBR25LLEtBQUssQ0FBQ29LLEVBQXRCOztBQUNBLFVBQUksQ0FBQ0QsU0FBTCxFQUFnQjtBQUNkQSxpQkFBUyxHQUFHRixLQUFLLENBQUNqSyxLQUFLLENBQUM4RCxDQUFQLEVBQVU7QUFBRXdCLGNBQUksRUFBRTtBQUFSLFNBQVYsQ0FBakI7QUFDQXRGLGFBQUssQ0FBQ29LLEVBQU4sR0FBV0QsU0FBWDtBQUNEOztBQUVELFVBQUlFLFlBQVksR0FBR1QsZUFBZSxDQUFDLEtBQUtNLFlBQU4sRUFBb0JDLFNBQXBCLENBQWxDO0FBRUEsVUFBTWpHLE9BQU8sR0FBR21HLFlBQVksR0FBRyxLQUFLN0gsT0FBTCxDQUFhSCxTQUE1QztBQUVBLGFBQU87QUFDTEQsYUFBSyxFQUFFOEIsT0FBTyxHQUFHbUcsWUFBSCxHQUFrQixDQUQzQjtBQUVMbkcsZUFBTyxFQUFQQTtBQUZLLE9BQVA7QUFJRDs7Ozs7O0FBR0gvRSxNQUFNLENBQUNDLE9BQVAsR0FBaUIyQixXQUFqQixDOzs7Ozs7Ozs7OztBQzNCQSxJQUFNdUosU0FBUyxHQUFHLENBQWxCOztBQUVBbkwsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5RSxJQUFELFFBQXVEO0FBQUEsb0JBQTlDMEcsQ0FBOEM7QUFBQSxNQUE5Q0EsQ0FBOEMsdUJBQTFDRCxTQUEwQztBQUFBLHNCQUEvQkUsR0FBK0I7QUFBQSxNQUEvQkEsR0FBK0IseUJBQXpCLElBQXlCO0FBQUEsdUJBQW5CbEYsSUFBbUI7QUFBQSxNQUFuQkEsSUFBbUIsMEJBQVosS0FBWTtBQUN0RSxNQUFJbUYsTUFBTSxHQUFHLEVBQWI7O0FBRUEsTUFBSTVHLElBQUksS0FBSyxJQUFULElBQWlCQSxJQUFJLEtBQUtqRCxTQUE5QixFQUF5QztBQUN2QyxXQUFPNkosTUFBUDtBQUNEOztBQUVENUcsTUFBSSxHQUFHQSxJQUFJLENBQUM4RCxXQUFMLEVBQVA7O0FBQ0EsTUFBSTZDLEdBQUosRUFBUztBQUNQM0csUUFBSSxjQUFPQSxJQUFQLE1BQUo7QUFDRDs7QUFFRCxNQUFJcEIsS0FBSyxHQUFHb0IsSUFBSSxDQUFDMUQsTUFBTCxHQUFjb0ssQ0FBZCxHQUFrQixDQUE5Qjs7QUFDQSxNQUFJOUgsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiLFdBQU9nSSxNQUFQO0FBQ0Q7O0FBRUQsU0FBT2hJLEtBQUssRUFBWixFQUFnQjtBQUNkZ0ksVUFBTSxDQUFDaEksS0FBRCxDQUFOLEdBQWdCb0IsSUFBSSxDQUFDa0UsTUFBTCxDQUFZdEYsS0FBWixFQUFtQjhILENBQW5CLENBQWhCO0FBQ0Q7O0FBRUQsTUFBSWpGLElBQUosRUFBVTtBQUNSbUYsVUFBTSxDQUFDbkYsSUFBUCxDQUFZLFVBQUNwRCxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUFVRCxDQUFDLElBQUlDLENBQUwsR0FBUyxDQUFULEdBQWFELENBQUMsR0FBR0MsQ0FBSixHQUFRLENBQUMsQ0FBVCxHQUFhLENBQXBDO0FBQUEsS0FBWjtBQUNEOztBQUVELFNBQU9zSSxNQUFQO0FBQ0QsQ0ExQkQsQzs7Ozs7Ozs7Ozs7ZUNGeUM1TCxtQkFBTyxDQUFDLGdFQUFELEM7SUFBeENJLE8sWUFBQUEsTztJQUFTSCxTLFlBQUFBLFM7SUFBV0MsUSxZQUFBQSxROztBQUM1QixJQUFNaUMsR0FBRyxHQUFHbkMsbUJBQU8sQ0FBQyw0Q0FBRCxDQUFuQjs7QUFDQSxJQUFNb0wsS0FBSyxHQUFHcEwsbUJBQU8sQ0FBQyx3RUFBRCxDQUFyQjs7QUFFQU0sTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUN5QyxJQUFELEVBQU90QyxJQUFQLEVBQXNEO0FBQUEsaUZBQVAsRUFBTztBQUFBLHdCQUF2Q21DLEtBQXVDO0FBQUEsTUFBdkNBLEtBQXVDLDJCQUEvQlYsR0FBK0I7QUFBQSx5QkFBMUIwSixNQUEwQjtBQUFBLE1BQTFCQSxNQUEwQiw0QkFBakIsS0FBaUI7O0FBQ3JFLE1BQUlDLFdBQVcsR0FBRyxFQUFsQixDQURxRSxDQUdyRTs7QUFDQSxNQUFJNUwsUUFBUSxDQUFDUSxJQUFJLENBQUMsQ0FBRCxDQUFMLENBQVosRUFBdUI7QUFDckI7QUFDQSxTQUFLLElBQUlVLENBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUcsR0FBR1gsSUFBSSxDQUFDWSxNQUEzQixFQUFtQ0YsQ0FBQyxHQUFHQyxHQUF2QyxFQUE0Q0QsQ0FBQyxJQUFJLENBQWpELEVBQW9EO0FBQ2xELFVBQU1ELEtBQUssR0FBR1QsSUFBSSxDQUFDVSxDQUFELENBQWxCOztBQUVBLFVBQUluQixTQUFTLENBQUNrQixLQUFELENBQWIsRUFBc0I7QUFDcEI7QUFDQTtBQUNBO0FBRUEsWUFBSTRLLE1BQU0sR0FBRztBQUNYOUcsV0FBQyxFQUFFOUQsS0FEUTtBQUVYK0QsYUFBRyxFQUFFOUQ7QUFGTSxTQUFiOztBQUtBLFlBQUl5SyxNQUFKLEVBQVk7QUFDVkUsZ0JBQU0sQ0FBQ1IsRUFBUCxHQUFZSCxLQUFLLENBQUNqSyxLQUFELEVBQVE7QUFBRXNGLGdCQUFJLEVBQUU7QUFBUixXQUFSLENBQWpCO0FBQ0Q7O0FBRURxRixtQkFBVyxDQUFDakwsSUFBWixDQUFpQmtMLE1BQWpCO0FBQ0Q7QUFDRjtBQUVGLEdBdkJELE1BdUJPO0FBQ0w7QUFDQSxRQUFNbkcsT0FBTyxHQUFHNUMsSUFBSSxDQUFDMUIsTUFBckI7O0FBRUEsU0FBSyxJQUFJRixFQUFDLEdBQUcsQ0FBUixFQUFXQyxJQUFHLEdBQUdYLElBQUksQ0FBQ1ksTUFBM0IsRUFBbUNGLEVBQUMsR0FBR0MsSUFBdkMsRUFBNENELEVBQUMsSUFBSSxDQUFqRCxFQUFvRDtBQUNsRCxVQUFJcUUsSUFBSSxHQUFHL0UsSUFBSSxDQUFDVSxFQUFELENBQWY7QUFFQSxVQUFJMkssT0FBTSxHQUFHO0FBQUU3RyxXQUFHLEVBQUU5RCxFQUFQO0FBQVU2RCxTQUFDLEVBQUU7QUFBYixPQUFiLENBSGtELENBS2xEOztBQUNBLFdBQUssSUFBSWEsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsT0FBcEIsRUFBNkJFLENBQUMsSUFBSSxDQUFsQyxFQUFxQztBQUNuQyxZQUFJOUUsR0FBRyxHQUFHZ0MsSUFBSSxDQUFDOEMsQ0FBRCxDQUFkOztBQUNBLFlBQUkzRSxNQUFLLEdBQUcwQixLQUFLLENBQUM0QyxJQUFELEVBQU96RSxHQUFQLENBQWpCOztBQUVBLFlBQUksQ0FBQ2YsU0FBUyxDQUFDa0IsTUFBRCxDQUFkLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsWUFBSWYsT0FBTyxDQUFDZSxNQUFELENBQVgsRUFBb0I7QUFDbEIsY0FBSTZLLFVBQVUsR0FBRyxFQUFqQjtBQUNBLGNBQU1DLEtBQUssR0FBRyxDQUFDO0FBQUVDLHNCQUFVLEVBQUUsQ0FBQyxDQUFmO0FBQWtCL0ssaUJBQUssRUFBTEE7QUFBbEIsV0FBRCxDQUFkOztBQUVBLGlCQUFPOEssS0FBSyxDQUFDM0ssTUFBYixFQUFxQjtBQUFBLDZCQUNXMkssS0FBSyxDQUFDRSxHQUFOLEVBRFg7QUFBQSxnQkFDWEQsVUFEVyxjQUNYQSxVQURXO0FBQUEsZ0JBQ0MvSyxPQURELGNBQ0NBLEtBREQ7O0FBR25CLGdCQUFJLENBQUNsQixTQUFTLENBQUNrQixPQUFELENBQWQsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxnQkFBSWpCLFFBQVEsQ0FBQ2lCLE9BQUQsQ0FBWixFQUFxQjtBQUVuQjtBQUNBO0FBQ0E7QUFFQSxrQkFBSWlMLFNBQVMsR0FBRztBQUFFbkgsaUJBQUMsRUFBRTlELE9BQUw7QUFBWStELG1CQUFHLEVBQUVnSDtBQUFqQixlQUFoQjs7QUFFQSxrQkFBSUwsTUFBSixFQUFZO0FBQ1ZPLHlCQUFTLENBQUNiLEVBQVYsR0FBZUgsS0FBSyxDQUFDakssT0FBRCxFQUFRO0FBQUVzRixzQkFBSSxFQUFFO0FBQVIsaUJBQVIsQ0FBcEI7QUFDRDs7QUFFRHVGLHdCQUFVLENBQUNuTCxJQUFYLENBQWdCdUwsU0FBaEI7QUFFRCxhQWRELE1BY08sSUFBSWhNLE9BQU8sQ0FBQ2UsT0FBRCxDQUFYLEVBQW9CO0FBQ3pCLG1CQUFLLElBQUk0RSxDQUFDLEdBQUcsQ0FBUixFQUFXc0csTUFBTSxHQUFHbEwsT0FBSyxDQUFDRyxNQUEvQixFQUF1Q3lFLENBQUMsR0FBR3NHLE1BQTNDLEVBQW1EdEcsQ0FBQyxJQUFJLENBQXhELEVBQTJEO0FBQ3pEa0cscUJBQUssQ0FBQ3BMLElBQU4sQ0FBVztBQUNUcUwsNEJBQVUsRUFBRW5HLENBREg7QUFFVDVFLHVCQUFLLEVBQUVBLE9BQUssQ0FBQzRFLENBQUQ7QUFGSCxpQkFBWDtBQUlEO0FBQ0Y7QUFDRjs7QUFDRGdHLGlCQUFNLENBQUM5RyxDQUFQLENBQVNqRSxHQUFULElBQWdCZ0wsVUFBaEI7QUFDRCxTQW5DRCxNQW1DTztBQUNMO0FBQ0E7QUFDQTtBQUVBLGNBQUlJLFVBQVMsR0FBRztBQUFFbkgsYUFBQyxFQUFFOUQ7QUFBTCxXQUFoQjs7QUFFQSxjQUFJMEssTUFBSixFQUFZO0FBQ1ZPLHNCQUFTLENBQUNiLEVBQVYsR0FBZUgsS0FBSyxDQUFDakssTUFBRCxFQUFRO0FBQUVzRixrQkFBSSxFQUFFO0FBQVIsYUFBUixDQUFwQjtBQUNEOztBQUVEc0YsaUJBQU0sQ0FBQzlHLENBQVAsQ0FBU2pFLEdBQVQsSUFBZ0JvTCxVQUFoQjtBQUNEO0FBQ0Y7O0FBRUROLGlCQUFXLENBQUNqTCxJQUFaLENBQWlCa0wsT0FBakI7QUFDRDtBQUNGOztBQUVELFNBQU9ELFdBQVA7QUFDRCxDQXBHRCxDOzs7Ozs7Ozs7OztBQ0pBeEwsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2Y2QixhQUFXLEVBQUVwQyxtQkFBTyxDQUFDLG1EQUFELENBREw7QUFFZnFDLFVBQVEsRUFBRXJDLG1CQUFPLENBQUMsNkNBQUQ7QUFGRixDQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7OztlQ0FxQkEsbUJBQU8sQ0FBQyxnRUFBRCxDO0lBQXBCRSxRLFlBQUFBLFE7O0lBRUZtQyxRO0FBQ0osb0JBQVlXLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsU0FBS3NKLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUtDLE9BQUwsR0FBZXhKLElBQUksQ0FBQzFCLE1BQXBCLENBSGdCLENBS2hCOztBQUNBLFFBQUkwQixJQUFJLENBQUMxQixNQUFMLElBQWVwQixRQUFRLENBQUM4QyxJQUFJLENBQUMsQ0FBRCxDQUFMLENBQTNCLEVBQXNDO0FBQ3BDLFdBQUssSUFBSTVCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS29MLE9BQXpCLEVBQWtDcEwsQ0FBQyxJQUFJLENBQXZDLEVBQTBDO0FBQ3hDLFlBQU1KLEdBQUcsR0FBR2dDLElBQUksQ0FBQzVCLENBQUQsQ0FBaEI7QUFDQSxhQUFLa0wsS0FBTCxDQUFXdEwsR0FBWCxJQUFrQjtBQUNoQm9GLGdCQUFNLEVBQUU7QUFEUSxTQUFsQjs7QUFHQSxhQUFLbUcsU0FBTCxDQUFlMUwsSUFBZixDQUFvQkcsR0FBcEI7QUFDRDtBQUNGLEtBUkQsTUFRTztBQUNMLFVBQUl5TCxXQUFXLEdBQUcsQ0FBbEI7O0FBRUEsV0FBSyxJQUFJckwsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBRyxLQUFLb0wsT0FBekIsRUFBa0NwTCxFQUFDLElBQUksQ0FBdkMsRUFBMEM7QUFDeEMsWUFBTUosSUFBRyxHQUFHZ0MsSUFBSSxDQUFDNUIsRUFBRCxDQUFoQjs7QUFFQSxZQUFJLENBQUNKLElBQUcsQ0FBQzBMLGNBQUosQ0FBbUIsTUFBbkIsQ0FBTCxFQUFpQztBQUMvQixnQkFBTSxJQUFJN0QsS0FBSixDQUFVLHVDQUFWLENBQU47QUFDRDs7QUFFRCxZQUFNOEQsT0FBTyxHQUFHM0wsSUFBRyxDQUFDNEwsSUFBcEI7O0FBQ0EsYUFBS0wsU0FBTCxDQUFlMUwsSUFBZixDQUFvQjhMLE9BQXBCOztBQUVBLFlBQUksQ0FBQzNMLElBQUcsQ0FBQzBMLGNBQUosQ0FBbUIsUUFBbkIsQ0FBTCxFQUFtQztBQUNqQyxnQkFBTSxJQUFJN0QsS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxZQUFNekMsTUFBTSxHQUFHcEYsSUFBRyxDQUFDb0YsTUFBbkI7O0FBRUEsWUFBSUEsTUFBTSxJQUFJLENBQVYsSUFBZUEsTUFBTSxJQUFJLENBQTdCLEVBQWdDO0FBQzlCLGdCQUFNLElBQUl5QyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtBQUNEOztBQUVELGFBQUt5RCxLQUFMLENBQVdLLE9BQVgsSUFBc0I7QUFDcEJ2RyxnQkFBTSxFQUFOQTtBQURvQixTQUF0QjtBQUlBcUcsbUJBQVcsSUFBSXJHLE1BQWY7QUFDRCxPQTVCSSxDQThCTDs7O0FBQ0EsV0FBSyxJQUFJaEYsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBRyxLQUFLb0wsT0FBekIsRUFBa0NwTCxHQUFDLElBQUksQ0FBdkMsRUFBMEM7QUFDeEMsWUFBTXVMLFFBQU8sR0FBRyxLQUFLSixTQUFMLENBQWVuTCxHQUFmLENBQWhCO0FBQ0EsWUFBTStFLFNBQVMsR0FBRyxLQUFLbUcsS0FBTCxDQUFXSyxRQUFYLEVBQW9CdkcsTUFBdEM7QUFDQSxhQUFLa0csS0FBTCxDQUFXSyxRQUFYLEVBQW9CdkcsTUFBcEIsR0FBNkJELFNBQVMsR0FBR3NHLFdBQXpDO0FBQ0Q7QUFDRjtBQUNGOzs7O3dCQUNHekwsRyxFQUFLNEwsSSxFQUFNO0FBQ2IsYUFBTyxLQUFLTixLQUFMLENBQVd0TCxHQUFYLElBQWtCLEtBQUtzTCxLQUFMLENBQVd0TCxHQUFYLEVBQWdCNEwsSUFBaEIsQ0FBbEIsR0FBMEMsQ0FBQyxDQUFsRDtBQUNEOzs7MkJBQ007QUFDTCxhQUFPLEtBQUtMLFNBQVo7QUFDRDs7OzRCQUNPO0FBQ04sYUFBTyxLQUFLQyxPQUFaO0FBQ0Q7Ozs2QkFDUTtBQUNQLGFBQU9LLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUtSLEtBQXBCLENBQVA7QUFDRDs7Ozs7O0FBR0hoTSxNQUFNLENBQUNDLE9BQVAsR0FBaUI4QixRQUFqQixDOzs7Ozs7Ozs7OztBQ3JFQS9CLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmK0Isa0JBQWdCLEVBQUV0QyxtQkFBTyxDQUFDLGlFQUFELENBRFY7QUFFZnVDLGdCQUFjLEVBQUV2QyxtQkFBTyxDQUFDLDZEQUFEO0FBRlIsQ0FBakIsQzs7Ozs7Ozs7Ozs7ZUNBNkRBLG1CQUFPLENBQUMsZ0VBQUQsQztJQUE1REksTyxZQUFBQSxPO0lBQVNILFMsWUFBQUEsUztJQUFXQyxRLFlBQUFBLFE7SUFBVUMsUSxZQUFBQSxRO0lBQVUyQixRLFlBQUFBLFE7O0FBRWhEeEIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUNzQixNQUFELEVBQVMrRSxJQUFULEVBQWtCO0FBQ2pDLE1BQU1sQixPQUFPLEdBQUc3RCxNQUFNLENBQUM2RCxPQUF2QjtBQUNBa0IsTUFBSSxDQUFDbEIsT0FBTCxHQUFlLEVBQWY7O0FBRUEsTUFBSSxDQUFDekYsU0FBUyxDQUFDeUYsT0FBRCxDQUFkLEVBQXlCO0FBQ3ZCO0FBQ0Q7O0FBRUQsT0FBSyxJQUFJdEUsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHcUUsT0FBTyxDQUFDcEUsTUFBOUIsRUFBc0NGLENBQUMsR0FBR0MsR0FBMUMsRUFBK0NELENBQUMsSUFBSSxDQUFwRCxFQUF1RDtBQUNyRCxRQUFJa0UsS0FBSyxHQUFHSSxPQUFPLENBQUN0RSxDQUFELENBQW5COztBQUVBLFFBQUksQ0FBQ25CLFNBQVMsQ0FBQ3FGLEtBQUssQ0FBQ0MsT0FBUCxDQUFWLElBQTZCRCxLQUFLLENBQUNDLE9BQU4sQ0FBY2pFLE1BQWQsS0FBeUIsQ0FBMUQsRUFBNkQ7QUFDM0Q7QUFDRDs7QUFFRCxRQUFJZCxHQUFHLEdBQUc7QUFDUitFLGFBQU8sRUFBRUQsS0FBSyxDQUFDQyxPQURQO0FBRVJwRSxXQUFLLEVBQUVtRSxLQUFLLENBQUNuRTtBQUZMLEtBQVY7O0FBS0EsUUFBSW1FLEtBQUssQ0FBQ3RFLEdBQVYsRUFBZTtBQUNiUixTQUFHLENBQUNRLEdBQUosR0FBVXNFLEtBQUssQ0FBQ3RFLEdBQWhCO0FBQ0Q7O0FBRUQsUUFBSXNFLEtBQUssQ0FBQ0osR0FBTixHQUFZLENBQUMsQ0FBakIsRUFBb0I7QUFDbEIxRSxTQUFHLENBQUNxRyxRQUFKLEdBQWV2QixLQUFLLENBQUNKLEdBQXJCO0FBQ0Q7O0FBRUQwQixRQUFJLENBQUNsQixPQUFMLENBQWE3RSxJQUFiLENBQWtCTCxHQUFsQjtBQUNEO0FBQ0YsQ0E5QkQsQzs7Ozs7Ozs7Ozs7QUNGQUYsTUFBTSxDQUFDQyxPQUFQLEdBQWlCLFVBQUNzQixNQUFELEVBQVMrRSxJQUFULEVBQWtCO0FBQ2pDQSxNQUFJLENBQUNyRCxLQUFMLEdBQWExQixNQUFNLENBQUMwQixLQUFwQjtBQUNELENBRkQsQyIsImZpbGUiOiJmdXNlLmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRnVzZVwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJGdXNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkZ1c2VcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImNvbnN0IHtcbiAgaXNEZWZpbmVkLFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzQXJyYXksXG4gIHRvU3RyaW5nXG59ID0gcmVxdWlyZSgnLi90eXBlLWNoZWNrZXJzJylcblxubW9kdWxlLmV4cG9ydHMgPSAob2JqLCBwYXRoKSA9PiB7XG4gIGxldCBsaXN0ID0gW11cbiAgbGV0IGFyciA9IGZhbHNlXG5cbiAgY29uc3QgX2dldCA9IChvYmosIHBhdGgpID0+IHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gcGF0aCBsZWZ0LCB3ZSd2ZSBnb3R0ZW4gdG8gdGhlIG9iamVjdCB3ZSBjYXJlIGFib3V0LlxuICAgICAgbGlzdC5wdXNoKG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZG90SW5kZXggPSBwYXRoLmluZGV4T2YoJy4nKVxuXG4gICAgICBsZXQga2V5ID0gcGF0aFxuICAgICAgbGV0IHJlbWFpbmluZyA9IG51bGxcblxuICAgICAgaWYgKGRvdEluZGV4ICE9PSAtMSkge1xuICAgICAgICBrZXkgPSBwYXRoLnNsaWNlKDAsIGRvdEluZGV4KVxuICAgICAgICByZW1haW5pbmcgPSBwYXRoLnNsaWNlKGRvdEluZGV4ICsgMSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuXG4gICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICBpZiAoIXJlbWFpbmluZyAmJiAoaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSkpIHtcbiAgICAgICAgICBsaXN0LnB1c2godG9TdHJpbmcodmFsdWUpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgYXJyID0gdHJ1ZVxuICAgICAgICAgIC8vIFNlYXJjaCBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5LlxuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgX2dldCh2YWx1ZVtpXSwgcmVtYWluaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZW1haW5pbmcpIHtcbiAgICAgICAgICAvLyBBbiBvYmplY3QuIFJlY3Vyc2UgZnVydGhlci5cbiAgICAgICAgICBfZ2V0KHZhbHVlLCByZW1haW5pbmcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZ2V0KG9iaiwgcGF0aClcblxuICBpZiAoYXJyKSB7XG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIHJldHVybiBsaXN0WzBdXG59IiwiY29uc3QgSU5GSU5JVFkgPSAxIC8gMFxuXG5jb25zdCBpc0FycmF5ID0gdmFsdWUgPT4gIUFycmF5LmlzQXJyYXlcbiAgPyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nXG4gIDogQXJyYXkuaXNBcnJheSh2YWx1ZSlcblxuLy8gQWRhcHRlZCBmcm9tOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi9mNGNhMzk2YTc5NjQzNTQyMmJkNGZkNDFmYWRiZDIyNWVkZGRmMTc1Ly5pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanNcbmNvbnN0IGJhc2VUb1N0cmluZyA9IHZhbHVlID0+IHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBsZXQgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbmNvbnN0IHRvU3RyaW5nID0gdmFsdWUgPT4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcblxuY29uc3QgaXNTdHJpbmcgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG5cbmNvbnN0IGlzTnVtYmVyID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xuXG5jb25zdCBpc09iamVjdCA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblxuY29uc3QgaXNEZWZpbmVkID0gdmFsdWUgPT4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNEZWZpbmVkLFxuICBpc0FycmF5LFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzT2JqZWN0LFxuICB0b1N0cmluZ1xufVxuIiwiXG5jb25zdCB7IEJpdGFwU2VhcmNoLCBFeHRlbmRlZFNlYXJjaCwgTkdyYW1TZWFyY2ggfSA9IHJlcXVpcmUoJy4vc2VhcmNoJylcbmNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzT2JqZWN0IH0gPSByZXF1aXJlKCcuL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2hlbHBlcnMvZ2V0JylcbmNvbnN0IHsgY3JlYXRlSW5kZXgsIEtleVN0b3JlIH0gPSByZXF1aXJlKCcuL3Rvb2xzJylcbmNvbnN0IHsgdHJhbnNmb3JtTWF0Y2hlcywgdHJhbnNmb3JtU2NvcmUgfSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtJylcbmNvbnN0IHsgTUFYX0JJVFMgfSA9IHJlcXVpcmUoJy4vc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMnKVxuXG4vLyAvLyBXaWxsIHByaW50IHRvIHRoZSBjb25zb2xlLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbi8vIGZ1bmN0aW9uIGRlYnVnKCkge1xuLy8gICBpZiAoRnVzZS52ZXJib3NlKSB7XG4vLyAgICAgY29uc29sZS5sb2coLi4uYXJndW1lbnRzKVxuLy8gICAgIC8vIGNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbi8vICAgICAvLyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoLi4uYXJndW1lbnRzLCBmYWxzZSwgbnVsbCwgdHJ1ZSAvKiBlbmFibGUgY29sb3JzICovKSlcbi8vICAgfVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBkZWJ1Z1RpbWUodmFsdWUpIHtcbi8vICAgaWYgKEZ1c2UudmVyYm9zZVRpbWUpIHtcbi8vICAgICBjb25zb2xlLnRpbWUodmFsdWUpXG4vLyAgIH1cbi8vIH1cblxuLy8gZnVuY3Rpb24gZGVidWdUaW1lRW5kKHZhbHVlKSB7XG4vLyAgIGlmIChGdXNlLnZlcmJvc2VUaW1lKSB7XG4vLyAgICAgY29uc29sZS50aW1lRW5kKHZhbHVlKVxuLy8gICB9XG4vLyB9XG5cbmxldCBGdXNlT3B0aW9ucyA9IHtcbiAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgLy8gbWF0Y2ggaXMgZm91bmQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHNhbWUgaW5wdXQuXG4gIGlzQ2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgLy8gQW4gZXhhY3QgbGV0dGVyIG1hdGNoIHdoaWNoIGlzICdkaXN0YW5jZScgY2hhcmFjdGVycyBhd2F5IGZyb20gdGhlIGZ1enp5IGxvY2F0aW9uXG4gIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gdG8gYmUgd2l0aGluIDgwMCBjaGFyYWN0ZXJzIG9mIHRoZSBmdXp6eSBsb2NhdGlvbiB0byBiZSBmb3VuZCB1c2luZyBhIDAuOCB0aHJlc2hvbGQuXG4gIGRpc3RhbmNlOiAxMDAsXG4gIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICBmaW5kQWxsTWF0Y2hlczogZmFsc2UsXG4gIC8vIFRoZSBnZXQgZnVuY3Rpb24gdG8gdXNlIHdoZW4gZmV0Y2hpbmcgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gVGhlIGRlZmF1bHQgd2lsbCBzZWFyY2ggbmVzdGVkIHBhdGhzICppZSBmb28uYmFyLmJheipcbiAgZ2V0Rm46IGdldCxcbiAgaW5jbHVkZU1hdGNoZXM6IGZhbHNlLFxuICBpbmNsdWRlU2NvcmU6IGZhbHNlLFxuICAvLyBMaXN0IG9mIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHNlYXJjaGVkLiBUaGlzIGFsc28gc3VwcG9ydHMgbmVzdGVkIHByb3BlcnRpZXMuXG4gIGtleXM6IFtdLFxuICAvLyBBcHByb3hpbWF0ZWx5IHdoZXJlIGluIHRoZSB0ZXh0IGlzIHRoZSBwYXR0ZXJuIGV4cGVjdGVkIHRvIGJlIGZvdW5kP1xuICBsb2NhdGlvbjogMCxcbiAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gIG1pbk1hdGNoQ2hhckxlbmd0aDogMSxcbiAgLy8gV2hldGhlciB0byBzb3J0IHRoZSByZXN1bHQgbGlzdCwgYnkgc2NvcmVcbiAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgLy8gRGVmYXVsdCBzb3J0IGZ1bmN0aW9uXG4gIHNvcnRGbjogKGEsIGIpID0+IChhLnNjb3JlIC0gYi5zY29yZSksXG4gIC8vIEF0IHdoYXQgcG9pbnQgZG9lcyB0aGUgbWF0Y2ggYWxnb3JpdGhtIGdpdmUgdXAuIEEgdGhyZXNob2xkIG9mICcwLjAnIHJlcXVpcmVzIGEgcGVyZmVjdCBtYXRjaFxuICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICB0aHJlc2hvbGQ6IDAuNixcbiAgLy8gRW5hYmxlZCBleHRlbmRlZC1zZWFyY2hpbmdcbiAgdXNlRXh0ZW5kZWRTZWFyY2g6IGZhbHNlXG59XG5cbmNsYXNzIEZ1c2Uge1xuICBjb25zdHJ1Y3RvcihsaXN0LCBvcHRpb25zID0gRnVzZU9wdGlvbnMsIGluZGV4ID0gbnVsbCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRnVzZU9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuICAgIC8vIGBjYXNlU2Vuc2l0aXZlYCBpcyBkZXByZWNhdGVkLCB1c2UgYGlzQ2FzZVNlbnNpdGl2ZWAgaW5zdGVhZFxuICAgIHRoaXMub3B0aW9ucy5pc0Nhc2VTZW5zaXRpdmUgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmVcbiAgICBkZWxldGUgdGhpcy5vcHRpb25zLmNhc2VTZW5zaXRpdmVcblxuICAgIC8vIGRlYnVnVGltZSgnQ29uc3RydWN0aW5nJylcbiAgICB0aGlzLl9wcm9jZXNzS2V5cyh0aGlzLm9wdGlvbnMua2V5cylcbiAgICB0aGlzLnNldENvbGxlY3Rpb24obGlzdCwgaW5kZXgpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb25zdHJ1Y3RpbmcnKVxuICB9XG5cbiAgc2V0Q29sbGVjdGlvbihsaXN0LCBpbmRleCA9IG51bGwpIHtcbiAgICB0aGlzLmxpc3QgPSBsaXN0XG4gICAgdGhpcy5saXN0SXNTdHJpbmdBcnJheSA9IGlzU3RyaW5nKGxpc3RbMF0pXG5cbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlYnVnVGltZSgnUHJvY2VzcyBpbmRleCcpXG4gICAgICB0aGlzLnNldEluZGV4KHRoaXMuX2NyZWF0ZUluZGV4KCkpXG4gICAgICAvLyBkZWJ1Z1RpbWVFbmQoJ1Byb2Nlc3MgaW5kZXgnKVxuICAgIH1cbiAgfVxuXG4gIHNldEluZGV4KGxpc3RJbmRleCkge1xuICAgIHRoaXMuX2luZGV4ZWRMaXN0ID0gbGlzdEluZGV4XG4gICAgLy8gZGVidWcobGlzdEluZGV4KVxuICB9XG5cbiAgX3Byb2Nlc3NLZXlzKGtleXMpIHtcbiAgICB0aGlzLl9rZXlTdG9yZSA9IG5ldyBLZXlTdG9yZShrZXlzKVxuXG4gICAgLy8gZGVidWcoJ1Byb2Nlc3MgS2V5cycpXG4gICAgaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgICAgLy8gZGVidWcodGhpcy5fa2V5U3RvcmUudG9KU09OKCkpXG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUluZGV4KCkge1xuICAgIHJldHVybiBjcmVhdGVJbmRleCh0aGlzLl9rZXlTdG9yZS5rZXlzKCksIHRoaXMubGlzdCwge1xuICAgICAgZ2V0Rm46IHRoaXMub3B0aW9ucy5nZXRGblxuICAgIH0pXG4gIH1cblxuICBzZWFyY2gocGF0dGVybiwgb3B0cyA9IHsgbGltaXQ6IGZhbHNlIH0pIHtcbiAgICAvLyBkZWJ1ZyhgLS0tLS0tLS0tIFNlYXJjaCBwYXR0ZXJuOiBcIiR7cGF0dGVybn1cImApXG4gICAgY29uc3QgeyB1c2VFeHRlbmRlZFNlYXJjaCwgc2hvdWxkU29ydCB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBsZXQgc2VhcmNoZXIgPSBudWxsXG5cbiAgICBpZiAodXNlRXh0ZW5kZWRTZWFyY2gpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IEV4dGVuZGVkU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2UgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IE5HcmFtU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoZXIgPSBuZXcgQml0YXBTZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIC8vIGRlYnVnVGltZSgnU2VhcmNoIHRpbWUnKTtcbiAgICBsZXQgcmVzdWx0cyA9IHRoaXMuX3NlYXJjaFVzaW5nKHNlYXJjaGVyKVxuICAgIC8vIGRlYnVnVGltZUVuZCgnU2VhcmNoIHRpbWUnKTtcblxuICAgIC8vIGRlYnVnVGltZSgnQ29tcHV0ZSBzY29yZSB0aW1lJyk7XG4gICAgdGhpcy5fY29tcHV0ZVNjb3JlKHJlc3VsdHMpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb21wdXRlIHNjb3JlIHRpbWUnKTtcblxuICAgIGlmIChzaG91bGRTb3J0KSB7XG4gICAgICB0aGlzLl9zb3J0KHJlc3VsdHMpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMubGltaXQgJiYgaXNOdW1iZXIob3B0cy5saW1pdCkpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIG9wdHMubGltaXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdChyZXN1bHRzKVxuICB9XG5cbiAgX3NlYXJjaFVzaW5nKHNlYXJjaGVyKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2luZGV4ZWRMaXN0XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdXG4gICAgY29uc3QgeyBpbmNsdWRlTWF0Y2hlcyB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICAvLyBMaXN0IGlzIEFycmF5PFN0cmluZz5cbiAgICBpZiAodGhpcy5saXN0SXNTdHJpbmdBcnJheSkge1xuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgbGlzdFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbGlzdFtpXVxuICAgICAgICBsZXQgeyAkOiB0ZXh0LCBpZHggfSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQodGV4dCkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgIGNvbnN0IHsgaXNNYXRjaCwgc2NvcmUgfSA9IHNlYXJjaFJlc3VsdFxuXG4gICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCB2YWx1ZTogdGV4dCB9XG5cbiAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgbWF0Y2guaW5kaWNlcyA9IHNlYXJjaFJlc3VsdC5tYXRjaGVkSW5kaWNlc1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICBpdGVtOiB0ZXh0LFxuICAgICAgICAgIGlkeCxcbiAgICAgICAgICBtYXRjaGVzOiBbbWF0Y2hdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgICBjb25zdCBrZXlOYW1lcyA9IHRoaXMuX2tleVN0b3JlLmtleXMoKVxuICAgICAgY29uc3Qga2V5c0xlbiA9IHRoaXMuX2tleVN0b3JlLmNvdW50KClcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHsgJDogaXRlbSwgaWR4IH0gPSBsaXN0W2ldXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoZXMgPSBbXVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzTGVuOyBqICs9IDEpIHtcbiAgICAgICAgICBsZXQga2V5ID0ga2V5TmFtZXNbal1cbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV1cblxuICAgICAgICAgIC8vIGRlYnVnKGAgS2V5OiAke2tleSA9PT0gJycgPyAnLS0nIDoga2V5fWApXG5cbiAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBrIDwgbGVuOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGFyckl0ZW0gPSB2YWx1ZVtrXVxuICAgICAgICAgICAgICBsZXQgdGV4dCA9IGFyckl0ZW0uJFxuICAgICAgICAgICAgICBsZXQgaWR4ID0gYXJySXRlbS5pZHhcblxuICAgICAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gc2VhcmNoZXIuc2VhcmNoSW4oYXJySXRlbSlcblxuICAgICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgICAvLyBkZWJ1ZyhgRnVsbCB0ZXh0OiBcIiR7dGV4dH1cIiwgc2NvcmU6ICR7c2NvcmV9YClcblxuICAgICAgICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IG1hdGNoID0geyBzY29yZSwga2V5LCB2YWx1ZTogdGV4dCwgaWR4IH1cblxuICAgICAgICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBtYXRjaC5pbmRpY2VzID0gc2VhcmNoUmVzdWx0Lm1hdGNoZWRJbmRpY2VzXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgLy8gZGVidWcoYEZ1bGwgdGV4dDogXCIke3RleHR9XCIsIHNjb3JlOiAke3Njb3JlfWApXG5cbiAgICAgICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCBrZXksIHZhbHVlOiB0ZXh0IH1cblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgICAgIG1hdGNoLmluZGljZXMgPSBzZWFyY2hSZXN1bHQubWF0Y2hlZEluZGljZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG1hdGNoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBpZHgsXG4gICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgbWF0Y2hlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLSBSRVNVTFRTIC0tLS0tLS0tLS0tXCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgX2NvbXB1dGVTY29yZShyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ0NvbXB1dGluZyBzY29yZTogJylcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZXN1bHRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2ldXG4gICAgICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgICAgIGNvbnN0IHNjb3JlTGVuID0gbWF0Y2hlcy5sZW5ndGhcblxuICAgICAgbGV0IHRvdGFsV2VpZ2h0ZWRTY29yZSA9IDFcbiAgICAgIC8vIGxldCBiZXN0U2NvcmUgPSAtMVxuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNjb3JlTGVuOyBqICs9IDEpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG1hdGNoZXNbal1cbiAgICAgICAgY29uc3Qga2V5ID0gaXRlbS5rZXlcbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0gdGhpcy5fa2V5U3RvcmUuZ2V0KGtleSwgJ3dlaWdodCcpXG4gICAgICAgIGNvbnN0IHdlaWdodCA9IGtleVdlaWdodCA+IC0xID8ga2V5V2VpZ2h0IDogMVxuICAgICAgICBjb25zdCBzY29yZSA9IGl0ZW0uc2NvcmUgPT09IDAgJiYga2V5V2VpZ2h0ID4gLTFcbiAgICAgICAgICA/IE51bWJlci5FUFNJTE9OXG4gICAgICAgICAgOiBpdGVtLnNjb3JlXG5cbiAgICAgICAgdG90YWxXZWlnaHRlZFNjb3JlICo9IE1hdGgucG93KHNjb3JlLCB3ZWlnaHQpXG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgYmVzdCBzY29yZS4uIGp1c3QgaW4gY2FzZVxuICAgICAgICAvLyBBY3R1YWxseSwgd2UncmUgbm90IHJlYWxseSB1c2luZyBpdC4uIGJ1dCBuZWVkIHRvIHRoaW5rIG9mIGEgd2F5IHRvIGluY29ycG9yYXRlIHRoaXNcbiAgICAgICAgLy8gYmVzdFNjb3JlID0gYmVzdFNjb3JlID09IC0xID8gaXRlbS5zY29yZSA6IE1hdGgubWluKGJlc3RTY29yZSwgaXRlbS5zY29yZSlcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnNjb3JlID0gdG90YWxXZWlnaHRlZFNjb3JlXG4gICAgICAvLyByZXN1bHQuJHNjb3JlID0gYmVzdFNjb3JlXG5cbiAgICAgIC8vIGRlYnVnKHJlc3VsdClcbiAgICB9XG4gIH1cblxuICBfc29ydChyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ1NvcnRpbmcuLi4uJylcbiAgICByZXN1bHRzLnNvcnQodGhpcy5vcHRpb25zLnNvcnRGbilcbiAgfVxuXG4gIF9mb3JtYXQocmVzdWx0cykge1xuICAgIGNvbnN0IGZpbmFsT3V0cHV0ID0gW11cblxuICAgIGNvbnN0IHsgaW5jbHVkZU1hdGNoZXMsIGluY2x1ZGVTY29yZSwgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgLy8gaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgIC8vICAgbGV0IGNhY2hlID0gW11cbiAgICAvLyAgIGRlYnVnKCdPdXRwdXQ6JywgSlNPTi5zdHJpbmdpZnkocmVzdWx0cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAvLyAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgLy8gICAgICAgaWYgKGNhY2hlLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgIC8vICAgICAgICAgLy8gQ2lyY3VsYXIgcmVmZXJlbmNlIGZvdW5kLCBkaXNjYXJkIGtleVxuICAgIC8vICAgICAgICAgcmV0dXJuXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIC8vIFN0b3JlIHZhbHVlIGluIG91ciBjb2xsZWN0aW9uXG4gICAgLy8gICAgICAgY2FjaGUucHVzaCh2YWx1ZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gdmFsdWVcbiAgICAvLyAgIH0sIDIpKVxuICAgIC8vICAgY2FjaGUgPSBudWxsXG4gICAgLy8gfVxuXG4gICAgbGV0IHRyYW5zZm9ybWVycyA9IFtdXG5cbiAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHRyYW5zZm9ybWVycy5wdXNoKHRyYW5zZm9ybU1hdGNoZXMpXG4gICAgaWYgKGluY2x1ZGVTY29yZSkgdHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtU2NvcmUpXG5cbiAgICAvLyBkZWJ1ZyhcIj09PT09IFJFU1VMVFMgPT09PT09XCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIj09PT09PT09PT09PT09PT09PT09XCIpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXVxuXG4gICAgICAvLyBkZWJ1ZygncmVzdWx0JywgcmVzdWx0KVxuXG4gICAgICBjb25zdCB7IGlkeCB9ID0gcmVzdWx0XG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGl0ZW06IHRoaXMubGlzdFtpZHhdLFxuICAgICAgICByZWZJbmRleDogaWR4XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0cmFuc2Zvcm1lcnMubGVuZ3RoOyBqIDwgbGVuOyBqICs9IDEpIHtcbiAgICAgICAgICB0cmFuc2Zvcm1lcnNbal0ocmVzdWx0LCBkYXRhKVxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgZmluYWxPdXRwdXQucHVzaChkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBmaW5hbE91dHB1dFxuICB9XG59XG5cbkZ1c2UuY3JlYXRlSW5kZXggPSBjcmVhdGVJbmRleFxuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1c2VcbiIsIm1vZHVsZS5leHBvcnRzID0gKG1hdGNobWFzayA9IFtdLCBtaW5NYXRjaENoYXJMZW5ndGggPSAxKSA9PiB7XG4gIGxldCBtYXRjaGVkSW5kaWNlcyA9IFtdXG4gIGxldCBzdGFydCA9IC0xXG4gIGxldCBlbmQgPSAtMVxuICBsZXQgaSA9IDBcblxuICBmb3IgKGxldCBsZW4gPSBtYXRjaG1hc2subGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBsZXQgbWF0Y2ggPSBtYXRjaG1hc2tbaV1cbiAgICBpZiAobWF0Y2ggJiYgc3RhcnQgPT09IC0xKSB7XG4gICAgICBzdGFydCA9IGlcbiAgICB9IGVsc2UgaWYgKCFtYXRjaCAmJiBzdGFydCAhPT0gLTEpIHtcbiAgICAgIGVuZCA9IGkgLSAxXG4gICAgICBpZiAoKGVuZCAtIHN0YXJ0KSArIDEgPj0gbWluTWF0Y2hDaGFyTGVuZ3RoKSB7XG4gICAgICAgIG1hdGNoZWRJbmRpY2VzLnB1c2goW3N0YXJ0LCBlbmRdKVxuICAgICAgfVxuICAgICAgc3RhcnQgPSAtMVxuICAgIH1cbiAgfVxuXG4gIC8vIChpLTEgLSBzdGFydCkgKyAxID0+IGkgLSBzdGFydFxuICBpZiAobWF0Y2htYXNrW2kgLSAxXSAmJiAoaSAtIHN0YXJ0KSA+PSBtaW5NYXRjaENoYXJMZW5ndGgpIHtcbiAgICBtYXRjaGVkSW5kaWNlcy5wdXNoKFtzdGFydCwgaSAtIDFdKTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVkSW5kaWNlc1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBwYXR0ZXJuID0+IHtcbiAgbGV0IG1hc2sgPSB7fVxuICBsZXQgbGVuID0gcGF0dGVybi5sZW5ndGhcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbWFza1twYXR0ZXJuLmNoYXJBdChpKV0gPSAwXG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbWFza1twYXR0ZXJuLmNoYXJBdChpKV0gfD0gMSA8PCAobGVuIC0gaSAtIDEpXG4gIH1cblxuICByZXR1cm4gbWFza1xufSIsIm1vZHVsZS5leHBvcnRzID0gKHBhdHRlcm4sIHsgZXJyb3JzID0gMCwgY3VycmVudExvY2F0aW9uID0gMCwgZXhwZWN0ZWRMb2NhdGlvbiA9IDAsIGRpc3RhbmNlID0gMTAwIH0pID0+IHtcbiAgY29uc3QgYWNjdXJhY3kgPSBlcnJvcnMgLyBwYXR0ZXJuLmxlbmd0aFxuICBjb25zdCBwcm94aW1pdHkgPSBNYXRoLmFicyhleHBlY3RlZExvY2F0aW9uIC0gY3VycmVudExvY2F0aW9uKVxuXG4gIGlmICghZGlzdGFuY2UpIHtcbiAgICAvLyBEb2RnZSBkaXZpZGUgYnkgemVybyBlcnJvci5cbiAgICByZXR1cm4gcHJveGltaXR5ID8gMS4wIDogYWNjdXJhY3lcbiAgfVxuXG4gIHJldHVybiBhY2N1cmFjeSArIChwcm94aW1pdHkgLyBkaXN0YW5jZSlcbn1cbiIsImNvbnN0IGJpdGFwU2NvcmUgPSByZXF1aXJlKCcuL2JpdGFwLXNjb3JlJylcbmNvbnN0IG1hdGNoZWRJbmRpY2VzID0gcmVxdWlyZSgnLi9iaXRhcC1tYXRjaGVkLWluZGljZXMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICh0ZXh0LCBwYXR0ZXJuLCBwYXR0ZXJuQWxwaGFiZXQsIHsgbG9jYXRpb24gPSAwLCBkaXN0YW5jZSA9IDEwMCwgdGhyZXNob2xkID0gMC42LCBmaW5kQWxsTWF0Y2hlcyA9IGZhbHNlLCBtaW5NYXRjaENoYXJMZW5ndGggPSAxLCBpbmNsdWRlTWF0Y2hlcyA9IGZhbHNlIH0pID0+IHtcbiAgY29uc3QgcGF0dGVybkxlbiA9IHBhdHRlcm4ubGVuZ3RoXG4gIC8vIFNldCBzdGFydGluZyBsb2NhdGlvbiBhdCBiZWdpbm5pbmcgdGV4dCBhbmQgaW5pdGlhbGl6ZSB0aGUgYWxwaGFiZXQuXG4gIGNvbnN0IHRleHRMZW4gPSB0ZXh0Lmxlbmd0aFxuICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBsb2NhdGlvbiA+IHRleHQubGVuZ3RoXG4gIGNvbnN0IGV4cGVjdGVkTG9jYXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsb2NhdGlvbiwgdGV4dExlbikpXG4gIC8vIEhpZ2hlc3Qgc2NvcmUgYmV5b25kIHdoaWNoIHdlIGdpdmUgdXAuXG4gIGxldCBjdXJyZW50VGhyZXNob2xkID0gdGhyZXNob2xkXG4gIC8vIElzIHRoZXJlIGEgbmVhcmJ5IGV4YWN0IG1hdGNoPyAoc3BlZWR1cClcbiAgbGV0IGJlc3RMb2NhdGlvbiA9IHRleHQuaW5kZXhPZihwYXR0ZXJuLCBleHBlY3RlZExvY2F0aW9uKVxuXG4gIC8vIGEgbWFzayBvZiB0aGUgbWF0Y2hlc1xuICBjb25zdCBtYXRjaE1hc2sgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRMZW47IGkgKz0gMSkge1xuICAgIG1hdGNoTWFza1tpXSA9IDBcbiAgfVxuXG4gIGlmIChiZXN0TG9jYXRpb24gIT09IC0xKSB7XG4gICAgbGV0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICBlcnJvcnM6IDAsXG4gICAgICBjdXJyZW50TG9jYXRpb246IGJlc3RMb2NhdGlvbixcbiAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBkaXN0YW5jZVxuICAgIH0pXG4gICAgY3VycmVudFRocmVzaG9sZCA9IE1hdGgubWluKHNjb3JlLCBjdXJyZW50VGhyZXNob2xkKVxuXG4gICAgLy8gV2hhdCBhYm91dCBpbiB0aGUgb3RoZXIgZGlyZWN0aW9uPyAoc3BlZWQgdXApXG4gICAgYmVzdExvY2F0aW9uID0gdGV4dC5sYXN0SW5kZXhPZihwYXR0ZXJuLCBleHBlY3RlZExvY2F0aW9uICsgcGF0dGVybkxlbilcblxuICAgIGlmIChiZXN0TG9jYXRpb24gIT09IC0xKSB7XG4gICAgICBsZXQgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgICAgZXJyb3JzOiAwLFxuICAgICAgICBjdXJyZW50TG9jYXRpb246IGJlc3RMb2NhdGlvbixcbiAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgZGlzdGFuY2VcbiAgICAgIH0pXG4gICAgICBjdXJyZW50VGhyZXNob2xkID0gTWF0aC5taW4oc2NvcmUsIGN1cnJlbnRUaHJlc2hvbGQpXG4gICAgfVxuICB9XG5cbiAgLy8gUmVzZXQgdGhlIGJlc3QgbG9jYXRpb25cbiAgYmVzdExvY2F0aW9uID0gLTFcblxuICBsZXQgbGFzdEJpdEFyciA9IFtdXG4gIGxldCBmaW5hbFNjb3JlID0gMVxuICBsZXQgYmluTWF4ID0gcGF0dGVybkxlbiArIHRleHRMZW5cblxuICBjb25zdCBtYXNrID0gMSA8PCAocGF0dGVybkxlbiA8PSAzMSA/IHBhdHRlcm5MZW4gLSAxIDogMzApXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuTGVuOyBpICs9IDEpIHtcbiAgICAvLyBTY2FuIGZvciB0aGUgYmVzdCBtYXRjaDsgZWFjaCBpdGVyYXRpb24gYWxsb3dzIGZvciBvbmUgbW9yZSBlcnJvci5cbiAgICAvLyBSdW4gYSBiaW5hcnkgc2VhcmNoIHRvIGRldGVybWluZSBob3cgZmFyIGZyb20gdGhlIG1hdGNoIGxvY2F0aW9uIHdlIGNhbiBzdHJheVxuICAgIC8vIGF0IHRoaXMgZXJyb3IgbGV2ZWwuXG4gICAgbGV0IGJpbk1pbiA9IDBcbiAgICBsZXQgYmluTWlkID0gYmluTWF4XG5cbiAgICB3aGlsZSAoYmluTWluIDwgYmluTWlkKSB7XG4gICAgICBjb25zdCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgICBlcnJvcnM6IGksXG4gICAgICAgIGN1cnJlbnRMb2NhdGlvbjogZXhwZWN0ZWRMb2NhdGlvbiArIGJpbk1pZCxcbiAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgZGlzdGFuY2VcbiAgICAgIH0pXG5cbiAgICAgIGlmIChzY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgIGJpbk1pbiA9IGJpbk1pZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluTWF4ID0gYmluTWlkXG4gICAgICB9XG5cbiAgICAgIGJpbk1pZCA9IE1hdGguZmxvb3IoKGJpbk1heCAtIGJpbk1pbikgLyAyICsgYmluTWluKVxuICAgIH1cblxuICAgIC8vIFVzZSB0aGUgcmVzdWx0IGZyb20gdGhpcyBpdGVyYXRpb24gYXMgdGhlIG1heGltdW0gZm9yIHRoZSBuZXh0LlxuICAgIGJpbk1heCA9IGJpbk1pZFxuXG4gICAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMSwgZXhwZWN0ZWRMb2NhdGlvbiAtIGJpbk1pZCArIDEpXG4gICAgbGV0IGZpbmlzaCA9IGZpbmRBbGxNYXRjaGVzID8gdGV4dExlbiA6IE1hdGgubWluKGV4cGVjdGVkTG9jYXRpb24gKyBiaW5NaWQsIHRleHRMZW4pICsgcGF0dGVybkxlblxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgYml0IGFycmF5XG4gICAgbGV0IGJpdEFyciA9IEFycmF5KGZpbmlzaCArIDIpXG5cbiAgICBiaXRBcnJbZmluaXNoICsgMV0gPSAoMSA8PCBpKSAtIDFcblxuICAgIGZvciAobGV0IGogPSBmaW5pc2g7IGogPj0gc3RhcnQ7IGogLT0gMSkge1xuICAgICAgbGV0IGN1cnJlbnRMb2NhdGlvbiA9IGogLSAxXG4gICAgICBsZXQgY2hhck1hdGNoID0gcGF0dGVybkFscGhhYmV0W3RleHQuY2hhckF0KGN1cnJlbnRMb2NhdGlvbildXG5cbiAgICAgIGlmIChjaGFyTWF0Y2gpIHtcbiAgICAgICAgbWF0Y2hNYXNrW2N1cnJlbnRMb2NhdGlvbl0gPSAxXG4gICAgICB9XG5cbiAgICAgIC8vIEZpcnN0IHBhc3M6IGV4YWN0IG1hdGNoXG4gICAgICBiaXRBcnJbal0gPSAoKGJpdEFycltqICsgMV0gPDwgMSkgfCAxKSAmIGNoYXJNYXRjaFxuXG4gICAgICAvLyBTdWJzZXF1ZW50IHBhc3NlczogZnV6enkgbWF0Y2hcbiAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgIGJpdEFycltqXSB8PSAoKChsYXN0Qml0QXJyW2ogKyAxXSB8IGxhc3RCaXRBcnJbal0pIDw8IDEpIHwgMSkgfCBsYXN0Qml0QXJyW2ogKyAxXVxuICAgICAgfVxuXG4gICAgICBpZiAoYml0QXJyW2pdICYgbWFzaykge1xuICAgICAgICBmaW5hbFNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICAgICAgZXJyb3JzOiBpLFxuICAgICAgICAgIGN1cnJlbnRMb2NhdGlvbixcbiAgICAgICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgICAgIGRpc3RhbmNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gVGhpcyBtYXRjaCB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmUgYmV0dGVyIHRoYW4gYW55IGV4aXN0aW5nIG1hdGNoLlxuICAgICAgICAvLyBCdXQgY2hlY2sgYW55d2F5LlxuICAgICAgICBpZiAoZmluYWxTY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gSW5kZWVkIGl0IGlzXG4gICAgICAgICAgY3VycmVudFRocmVzaG9sZCA9IGZpbmFsU2NvcmVcbiAgICAgICAgICBiZXN0TG9jYXRpb24gPSBjdXJyZW50TG9jYXRpb25cblxuICAgICAgICAgIC8vIEFscmVhZHkgcGFzc2VkIGBsb2NgLCBkb3duaGlsbCBmcm9tIGhlcmUgb24gaW4uXG4gICAgICAgICAgaWYgKGJlc3RMb2NhdGlvbiA8PSBleHBlY3RlZExvY2F0aW9uKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFdoZW4gcGFzc2luZyBgYmVzdExvY2F0aW9uYCwgZG9uJ3QgZXhjZWVkIG91ciBjdXJyZW50IGRpc3RhbmNlIGZyb20gYGV4cGVjdGVkTG9jYXRpb25gLlxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoMSwgMiAqIGV4cGVjdGVkTG9jYXRpb24gLSBiZXN0TG9jYXRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBObyBob3BlIGZvciBhIChiZXR0ZXIpIG1hdGNoIGF0IGdyZWF0ZXIgZXJyb3IgbGV2ZWxzLlxuICAgIGNvbnN0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICBlcnJvcnM6IGkgKyAxLFxuICAgICAgY3VycmVudExvY2F0aW9uOiBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlXG4gICAgfSlcblxuICAgIGlmIChzY29yZSA+IGN1cnJlbnRUaHJlc2hvbGQpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgbGFzdEJpdEFyciA9IGJpdEFyclxuICB9XG5cbiAgbGV0IHJlc3VsdCA9IHtcbiAgICBpc01hdGNoOiBiZXN0TG9jYXRpb24gPj0gMCxcbiAgICAvLyBDb3VudCBleGFjdCBtYXRjaGVzICh0aG9zZSB3aXRoIGEgc2NvcmUgb2YgMCkgdG8gYmUgXCJhbG1vc3RcIiBleGFjdFxuICAgIHNjb3JlOiAhZmluYWxTY29yZSA/IDAuMDAxIDogZmluYWxTY29yZSxcbiAgfVxuXG4gIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgIHJlc3VsdC5tYXRjaGVkSW5kaWNlcyA9IG1hdGNoZWRJbmRpY2VzKG1hdGNoTWFzaywgbWluTWF0Y2hDaGFyTGVuZ3RoKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuIiwiLy8gTWFjaGluZSB3b3JkIHNpemVcbm1vZHVsZS5leHBvcnRzLk1BWF9CSVRTID0gMzIiLCJjb25zdCBiaXRhcFNlYXJjaCA9IHJlcXVpcmUoJy4vYml0YXAtc2VhcmNoJylcbmNvbnN0IHBhdHRlcm5BbHBoYWJldCA9IHJlcXVpcmUoJy4vYml0YXAtcGF0dGVybi1hbHBoYWJldCcpXG5jb25zdCB7IE1BWF9CSVRTIH0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG5cbmNsYXNzIEJpdGFwU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwge1xuICAgIC8vIEFwcHJveGltYXRlbHkgd2hlcmUgaW4gdGhlIHRleHQgaXMgdGhlIHBhdHRlcm4gZXhwZWN0ZWQgdG8gYmUgZm91bmQ/XG4gICAgbG9jYXRpb24gPSAwLFxuICAgIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgICAvLyBBbiBleGFjdCBsZXR0ZXIgbWF0Y2ggd2hpY2ggaXMgJ2Rpc3RhbmNlJyBjaGFyYWN0ZXJzIGF3YXkgZnJvbSB0aGUgZnV6enkgbG9jYXRpb25cbiAgICAvLyB3b3VsZCBzY29yZSBhcyBhIGNvbXBsZXRlIG1pc21hdGNoLiBBIGRpc3RhbmNlIG9mICcwJyByZXF1aXJlcyB0aGUgbWF0Y2ggYmUgYXRcbiAgICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgICAvLyB0byBiZSB3aXRoaW4gODAwIGNoYXJhY3RlcnMgb2YgdGhlIGZ1enp5IGxvY2F0aW9uIHRvIGJlIGZvdW5kIHVzaW5nIGEgMC44IHRocmVzaG9sZC5cbiAgICBkaXN0YW5jZSA9IDEwMCxcbiAgICAvLyBBdCB3aGF0IHBvaW50IGRvZXMgdGhlIG1hdGNoIGFsZ29yaXRobSBnaXZlIHVwLiBBIHRocmVzaG9sZCBvZiAnMC4wJyByZXF1aXJlcyBhIHBlcmZlY3QgbWF0Y2hcbiAgICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICAgIHRocmVzaG9sZCA9IDAuNixcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciBjb21wYXJpc29ucyBzaG91bGQgYmUgY2FzZSBzZW5zaXRpdmUuXG4gICAgaXNDYXNlU2Vuc2l0aXZlID0gZmFsc2UsXG4gICAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgICAvLyBtYXRjaCBpcyBmb3VuZCBiZWZvcmUgdGhlIGVuZCBvZiB0aGUgc2FtZSBpbnB1dC5cbiAgICBmaW5kQWxsTWF0Y2hlcyA9IGZhbHNlLFxuICAgIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICAgIG1pbk1hdGNoQ2hhckxlbmd0aCA9IDEsXG5cbiAgICBpbmNsdWRlTWF0Y2hlcyA9IGZhbHNlXG4gIH0pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlLFxuICAgICAgdGhyZXNob2xkLFxuICAgICAgaXNDYXNlU2Vuc2l0aXZlLFxuICAgICAgZmluZEFsbE1hdGNoZXMsXG4gICAgICBpbmNsdWRlTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aFxuICAgIH1cblxuICAgIGlmIChwYXR0ZXJuLmxlbmd0aCA+IE1BWF9CSVRTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhdHRlcm4gbGVuZ3RoIGV4Y2VlZHMgbWF4IG9mICR7TUFYX0JJVFN9LmApO1xuICAgIH1cblxuICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcbiAgICB0aGlzLnBhdHRlcm5BbHBoYWJldCA9IHBhdHRlcm5BbHBoYWJldCh0aGlzLnBhdHRlcm4pXG4gIH1cblxuICBzZWFyY2hJbih2YWx1ZSkge1xuICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuICAgIHJldHVybiB0aGlzLnNlYXJjaEluU3RyaW5nKHRleHQpXG4gIH1cblxuICBzZWFyY2hJblN0cmluZyh0ZXh0KSB7XG4gICAgY29uc3QgeyBpc0Nhc2VTZW5zaXRpdmUsIGluY2x1ZGVNYXRjaGVzIH0gPSB0aGlzLm9wdGlvbnNcblxuICAgIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfVxuXG4gICAgLy8gRXhhY3QgbWF0Y2hcbiAgICBpZiAodGhpcy5wYXR0ZXJuID09PSB0ZXh0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICBpc01hdGNoOiB0cnVlLFxuICAgICAgICBzY29yZTogMFxuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgcmVzdWx0Lm1hdGNoZWRJbmRpY2VzID0gW1swLCB0ZXh0Lmxlbmd0aCAtIDFdXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCB1c2UgQml0YXAgYWxnb3JpdGhtXG4gICAgY29uc3QgeyBsb2NhdGlvbiwgZGlzdGFuY2UsIHRocmVzaG9sZCwgZmluZEFsbE1hdGNoZXMsIG1pbk1hdGNoQ2hhckxlbmd0aCB9ID0gdGhpcy5vcHRpb25zXG4gICAgcmV0dXJuIGJpdGFwU2VhcmNoKHRleHQsIHRoaXMucGF0dGVybiwgdGhpcy5wYXR0ZXJuQWxwaGFiZXQsIHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgZGlzdGFuY2UsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGluY2x1ZGVNYXRjaGVzXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJpdGFwU2VhcmNoXG4iLCIvLyBUb2tlbjogJ2ZpbGVcbi8vIE1hdGNoIHR5cGU6IGV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBpbmNsdWRlIGBmaWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09IFwiJ1wiXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpbmRleCA9IHRleHQuaW5kZXhPZihzYW5pdGl6ZWRQYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gaW5kZXggPiAtMVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMCxcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCJjb25zdCBleGFjdE1hdGNoID0gcmVxdWlyZSgnLi9leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlRXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1leGFjdC1tYXRjaCcpXG5jb25zdCBwcmVmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9wcmVmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IHN1ZmZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL3N1ZmZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgQml0YXBTZWFyY2ggPSByZXF1aXJlKCcuLi9iaXRhcC1zZWFyY2gnKVxuXG5jb25zdCB7IGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG4vLyBSZXR1cm4gYSAyRCBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVlcnksIGZvciBzaW1wbGVyIHBhcnNpbmcuXG4vLyBFeGFtcGxlOlxuLy8gXCJeY29yZSBnbyQgfCByYiQgfCBweSQgeHkkXCIgPT4gW1tcIl5jb3JlXCIsIFwiZ28kXCJdLCBbXCJyYiRcIl0sIFtcInB5JFwiLCBcInh5JFwiXV1cbmNvbnN0IHF1ZXJ5ZnkgPSAocGF0dGVybikgPT4gcGF0dGVybi5zcGxpdCgnfCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpLnNwbGl0KC8gKy9nKSlcblxuLyoqXG4gKiBDb21tYW5kLWxpa2Ugc2VhcmNoaW5nXG4gKiA9PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogR2l2ZW4gbXVsdGlwbGUgc2VhcmNoIHRlcm1zIGRlbGltaXRlZCBieSBzcGFjZXMuZS5nLiBgXmpzY3JpcHQgLnB5dGhvbiQgcnVieSAhamF2YWAsXG4gKiBzZWFyY2ggaW4gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIFNlYXJjaCBzeW50YXg6XG4gKlxuICogfCBUb2tlbiAgICAgICB8IE1hdGNoIHR5cGUgICAgICAgICAgICAgICAgIHwgRGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAtLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBganNjcmlwdGAgICB8IGZ1enp5LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBtYXRjaCBganNjcmlwdGAgICAgICAgICAgICAgfFxuICogfCBgJ3B5dGhvbmAgICB8IGV4YWN0LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBpbmNsdWRlIGBweXRob25gICAgICAgICAgICAgfFxuICogfCBgIXJ1YnlgICAgICB8IGludmVyc2UtZXhhY3QtbWF0Y2ggICAgICAgIHwgSXRlbXMgdGhhdCBkbyBub3QgaW5jbHVkZSBgcnVieWAgICAgICAgfFxuICogfCBgXmphdmFgICAgICB8IHByZWZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBqYXZhYCAgICAgICAgICAgfFxuICogfCBgIV5lYXJsYW5nYCB8IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZWFybGFuZ2AgfFxuICogfCBgLmpzJGAgICAgICB8IHN1ZmZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBlbmQgd2l0aCBgLmpzYCAgICAgICAgICAgICAgfFxuICogfCBgIS5nbyRgICAgICB8IGludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3QgZW5kIHdpdGggYC5nb2AgICAgICAgfFxuICpcbiAqIEEgc2luZ2xlIHBpcGUgY2hhcmFjdGVyIGFjdHMgYXMgYW4gT1Igb3BlcmF0b3IuIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nXG4gKiBxdWVyeSBtYXRjaGVzIGVudHJpZXMgdGhhdCBzdGFydCB3aXRoIGBjb3JlYCBhbmQgZW5kIHdpdGggZWl0aGVyYGdvYCwgYHJiYCxcbiAqIG9yYHB5YC5cbiAqXG4gKiBgYGBcbiAqIF5jb3JlIGdvJCB8IHJiJCB8IHB5JFxuICogYGBgXG4gKi9cbmNsYXNzIEV4dGVuZGVkU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgaXNDYXNlU2Vuc2l0aXZlIH0gPSBvcHRpb25zXG4gICAgdGhpcy5xdWVyeSA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgLy8gQSA8cGF0dGVybj46PEJpdGFwU2VhcmNoPiBrZXktdmFsdWUgcGFpciBmb3Igb3B0aW1pemluZyBzZWFyY2hpbmdcbiAgICB0aGlzLl9mdXp6eUNhY2hlID0ge31cblxuICAgIGlmIChpc1N0cmluZyhwYXR0ZXJuKSAmJiBwYXR0ZXJuLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhdHRlcm4gPSBpc0Nhc2VTZW5zaXRpdmUgPyBwYXR0ZXJuIDogcGF0dGVybi50b0xvd2VyQ2FzZSgpXG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlmeSh0aGlzLnBhdHRlcm4pXG4gICAgfVxuICB9XG5cbiAgc2VhcmNoSW4odmFsdWUpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucXVlcnlcblxuICAgIGlmICghdGhpcy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNNYXRjaDogZmFsc2UsXG4gICAgICAgIHNjb3JlOiAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRleHQgPSB2YWx1ZS4kXG5cbiAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmlzQ2FzZVNlbnNpdGl2ZSA/IHRleHQgOiB0ZXh0LnRvTG93ZXJDYXNlKClcblxuICAgIGxldCBtYXRjaEZvdW5kID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAwLCBxTGVuID0gcXVlcnkubGVuZ3RoOyBpIDwgcUxlbjsgaSArPSAxKSB7XG5cbiAgICAgIGNvbnN0IHBhcnRzID0gcXVlcnlbaV1cbiAgICAgIGxldCByZXN1bHQgPSBudWxsXG4gICAgICBtYXRjaEZvdW5kID0gdHJ1ZVxuXG4gICAgICBmb3IgKGxldCBqID0gMCwgcExlbiA9IHBhcnRzLmxlbmd0aDsgaiA8IHBMZW47IGogKz0gMSkge1xuICAgICAgICBsZXQgdG9rZW4gPSBwYXJ0c1tqXVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9zZWFyY2godG9rZW4sIHRleHQpXG4gICAgICAgIGlmICghcmVzdWx0LmlzTWF0Y2gpIHtcbiAgICAgICAgICAvLyBBTkQgY29uZGl0aW9uLCBzaG9ydC1jaXJjdWl0IGFuZCBtb3ZlIG9uIHRvIG5leHQgcGFydFxuICAgICAgICAgIG1hdGNoRm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT1IgY29uZGl0aW9uLCBzbyBpZiBUUlVFLCByZXR1cm5cbiAgICAgIGlmIChtYXRjaEZvdW5kKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3RoaW5nIHdhcyBtYXRjaGVkXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2g6IGZhbHNlLFxuICAgICAgc2NvcmU6IDFcbiAgICB9XG4gIH1cblxuICBfc2VhcmNoKHBhdHRlcm4sIHRleHQpIHtcbiAgICBpZiAoZXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBleGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChwcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIHByZWZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoc3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBzdWZmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlRXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlRXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VhcmNoZXIgPSB0aGlzLl9mdXp6eUNhY2hlW3BhdHRlcm5dXG4gICAgICBpZiAoIXNlYXJjaGVyKSB7XG4gICAgICAgIHNlYXJjaGVyID0gbmV3IEJpdGFwU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICAgICAgdGhpcy5fZnV6enlDYWNoZVtwYXR0ZXJuXSA9IHNlYXJjaGVyXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VhcmNoZXIuc2VhcmNoSW5TdHJpbmcodGV4dClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbmRlZFNlYXJjaCIsIi8vIFRva2VuOiAhZmlyZVxuLy8gTWF0Y2ggdHlwZTogaW52ZXJzZS1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IGluY2x1ZGUgYGZpcmVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gdGV4dC5pbmRleE9mKHNhbml0aXplZFBhdHRlcm4pID09PSAtMVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAhXmZpcmVcbi8vIE1hdGNoIHR5cGU6IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZmlyZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnIScgJiYgcGF0dGVybi5jaGFyQXQoMSkgPT0gJ14nXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigyKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gIXRleHQuc3RhcnRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAhLmZpbGUkXG4vLyBNYXRjaCB0eXBlOiBpbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IGVuZCB3aXRoIGAuZmlsZWBcblxuY29uc3QgaXNGb3JQYXR0ZXJuID0gcGF0dGVybiA9PiBwYXR0ZXJuLmNoYXJBdCgwKSA9PSAnIScgJiYgcGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSA9PSAnJCdcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyaW5nKDEsIHBhdHRlcm4ubGVuZ3RoIC0gMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9ICF0ZXh0LmVuZHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46IF5maWxlXG4vLyBNYXRjaCB0eXBlOiBwcmVmaXgtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IHN0YXJ0IHdpdGggYGZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJ14nXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gdGV4dC5zdGFydHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwiLy8gVG9rZW46IC5maWxlJFxuLy8gTWF0Y2ggdHlwZTogc3VmZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBlbmQgd2l0aCBgLmZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSA9PSAnJCdcblxuY29uc3Qgc2FuaXRpemUgPSBwYXR0ZXJuID0+IHBhdHRlcm4uc3Vic3RyKDAsIHBhdHRlcm4ubGVuZ3RoIC0gMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuZW5kc1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgQml0YXBTZWFyY2g6IHJlcXVpcmUoJy4vYml0YXAtc2VhcmNoJyksXG4gIEV4dGVuZGVkU2VhcmNoOiByZXF1aXJlKCcuL2V4dGVuZGVkLXNlYXJjaCcpLFxuICBOR3JhbVNlYXJjaDogcmVxdWlyZSgnLi9uZ3JhbS1zZWFyY2gnKVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB1bmlvbjogcmVxdWlyZSgnLi91bmlvbicpLFxuICBpbnRlcnNlY3Rpb246IHJlcXVpcmUoJy4vaW50ZXJzZWN0aW9uJylcbn0iLCIvLyBBc3N1bWVzIGFycmF5cyBhcmUgc29ydGVkXG5tb2R1bGUuZXhwb3J0cyA9IChhcnIxLCBhcnIyKSA9PiB7XG4gIGxldCByZXN1bHQgPSBbXVxuICBsZXQgaSA9IDBcbiAgbGV0IGogPSAwXG5cbiAgd2hpbGUgKGkgPCBhcnIxLmxlbmd0aCAmJiBqIDwgYXJyMi5sZW5ndGgpIHtcbiAgICBsZXQgaXRlbTEgPSBhcnIxW2ldXG4gICAgbGV0IGl0ZW0yID0gYXJyMltqXVxuXG4gICAgaWYgKGl0ZW0xID09IGl0ZW0yKSB7XG4gICAgICByZXN1bHQucHVzaChpdGVtMSlcbiAgICAgIGkgKz0gMVxuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIGlmIChpdGVtMSA8IGl0ZW0yKSB7XG4gICAgICBpICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0xID4gaXRlbTIpIHtcbiAgICAgIGogKz0gMVxuICAgIH0gZWxzZSB7XG4gICAgICBpICs9IDFcbiAgICAgIGogKz0gMVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiLy8gQXNzdW1lcyBhcnJheXMgYXJlIHNvcnRlZFxubW9kdWxlLmV4cG9ydHMgPSAoYXJyMSwgYXJyMikgPT4ge1xuICBsZXQgcmVzdWx0ID0gW11cbiAgbGV0IGkgPSAwXG4gIGxldCBqID0gMFxuXG4gIHdoaWxlIChpIDwgYXJyMS5sZW5ndGggJiYgaiA8IGFycjIubGVuZ3RoKSB7XG4gICAgbGV0IGl0ZW0xID0gYXJyMVtpXVxuICAgIGxldCBpdGVtMiA9IGFycjJbal1cblxuICAgIGlmIChpdGVtMSA8IGl0ZW0yKSB7XG4gICAgICByZXN1bHQucHVzaChpdGVtMSlcbiAgICAgIGkgKz0gMVxuICAgIH0gZWxzZSBpZiAoaXRlbTIgPCBpdGVtMSkge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTIpXG4gICAgICBqICs9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTIpXG4gICAgICBpICs9IDFcbiAgICAgIGogKz0gMVxuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChpIDwgYXJyMS5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaChhcnIxW2ldKVxuICAgIGkgKz0gMVxuICB9XG5cbiAgd2hpbGUgKGogPCBhcnIyLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKGFycjJbal0pXG4gICAgaiArPSAxXG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGphY2NhcmREaXN0YW5jZTogcmVxdWlyZSgnLi9qYWNjYXJkLWRpc3RhbmNlJylcbn0iLCJjb25zdCB7IHVuaW9uLCBpbnRlcnNlY3Rpb24gfSA9IHJlcXVpcmUoJy4uL2FycmF5LXV0aWxzJylcblxubW9kdWxlLmV4cG9ydHMgPSAobkdyYW0xLCBuR3JhbTIpID0+IHtcbiAgbGV0IG5HcmFtVW5pb24gPSB1bmlvbihuR3JhbTEsIG5HcmFtMilcbiAgbGV0IG5HcmFtSW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0aW9uKG5HcmFtMSwgbkdyYW0yKVxuXG4gIHJldHVybiAxIC0gbkdyYW1JbnRlcnNlY3Rpb24ubGVuZ3RoIC8gbkdyYW1Vbmlvbi5sZW5ndGhcbn0iLCJjb25zdCBuZ3JhbSA9IHJlcXVpcmUoJy4vbmdyYW0nKVxuY29uc3QgeyBqYWNjYXJkRGlzdGFuY2UgfSA9IHJlcXVpcmUoJy4vZGlzdGFuY2UnKVxuXG5jbGFzcyBOR3JhbVNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKHBhdHRlcm4sIG9wdGlvbnMgPSB7IHRocmVzaG9sZDogMC42IH0pIHtcbiAgICAvLyBDcmVhdGUgdGhlIG5ncmFtLCBhbmQgc29ydCBpdFxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdHRlcm5OZ3JhbSA9IG5ncmFtKHBhdHRlcm4sIHsgc29ydDogdHJ1ZSB9KVxuICB9XG4gIHNlYXJjaEluKHZhbHVlKSB7XG4gICAgbGV0IHRleHROZ3JhbSA9IHZhbHVlLm5nXG4gICAgaWYgKCF0ZXh0TmdyYW0pIHtcbiAgICAgIHRleHROZ3JhbSA9IG5ncmFtKHZhbHVlLiQsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgdmFsdWUubmcgPSB0ZXh0TmdyYW1cbiAgICB9XG5cbiAgICBsZXQgamFjYXJkUmVzdWx0ID0gamFjY2FyZERpc3RhbmNlKHRoaXMucGF0dGVybk5ncmFtLCB0ZXh0TmdyYW0pXG5cbiAgICBjb25zdCBpc01hdGNoID0gamFjYXJkUmVzdWx0IDwgdGhpcy5vcHRpb25zLnRocmVzaG9sZFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3JlOiBpc01hdGNoID8gamFjYXJkUmVzdWx0IDogMSxcbiAgICAgIGlzTWF0Y2hcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOR3JhbVNlYXJjaCIsImNvbnN0IE5HUkFNX0xFTiA9IDNcblxubW9kdWxlLmV4cG9ydHMgPSAodGV4dCwgeyBuID0gTkdSQU1fTEVOLCBwYWQgPSB0cnVlLCBzb3J0ID0gZmFsc2UgfSkgPT4ge1xuICBsZXQgbkdyYW1zID0gW11cblxuICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbkdyYW1zXG4gIH1cblxuICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpXG4gIGlmIChwYWQpIHtcbiAgICB0ZXh0ID0gYCAke3RleHR9IGBcbiAgfVxuXG4gIGxldCBpbmRleCA9IHRleHQubGVuZ3RoIC0gbiArIDFcbiAgaWYgKGluZGV4IDwgMSkge1xuICAgIHJldHVybiBuR3JhbXNcbiAgfVxuXG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgbkdyYW1zW2luZGV4XSA9IHRleHQuc3Vic3RyKGluZGV4LCBuKVxuICB9XG5cbiAgaWYgKHNvcnQpIHtcbiAgICBuR3JhbXMuc29ydCgoYSwgYikgPT4gYSA9PSBiID8gMCA6IGEgPCBiID8gLTEgOiAxKVxuICB9XG5cbiAgcmV0dXJuIG5HcmFtc1xufSIsImNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcbmNvbnN0IGdldCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvZ2V0JylcbmNvbnN0IG5ncmFtID0gcmVxdWlyZSgnLi4vc2VhcmNoL25ncmFtLXNlYXJjaC9uZ3JhbScpXG5cbm1vZHVsZS5leHBvcnRzID0gKGtleXMsIGxpc3QsIHsgZ2V0Rm4gPSBnZXQsIG5ncmFtcyA9IGZhbHNlIH0gPSB7fSkgPT4ge1xuICBsZXQgaW5kZXhlZExpc3QgPSBbXVxuXG4gIC8vIExpc3QgaXMgQXJyYXk8U3RyaW5nPlxuICBpZiAoaXNTdHJpbmcobGlzdFswXSkpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkgc3RyaW5nIGluIHRoZSBsaXN0XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gbGlzdFtpXVxuXG4gICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAvLyBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICAvLyAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgbGV0IHJlY29yZCA9IHtcbiAgICAgICAgICAkOiB2YWx1ZSxcbiAgICAgICAgICBpZHg6IGlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZ3JhbXMpIHtcbiAgICAgICAgICByZWNvcmQubmcgPSBuZ3JhbSh2YWx1ZSwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpbmRleGVkTGlzdC5wdXNoKHJlY29yZClcbiAgICAgIH1cbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICAvLyBMaXN0IGlzIEFycmF5PE9iamVjdD5cbiAgICBjb25zdCBrZXlzTGVuID0ga2V5cy5sZW5ndGhcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsZXQgaXRlbSA9IGxpc3RbaV1cblxuICAgICAgbGV0IHJlY29yZCA9IHsgaWR4OiBpLCAkOiB7fSB9XG5cbiAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwga2V5c0xlbjsgaiArPSAxKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlzW2pdXG4gICAgICAgIGxldCB2YWx1ZSA9IGdldEZuKGl0ZW0sIGtleSlcblxuICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgbGV0IHN1YlJlY29yZHMgPSBbXVxuICAgICAgICAgIGNvbnN0IHN0YWNrID0gW3sgYXJyYXlJbmRleDogLTEsIHZhbHVlIH1dXG5cbiAgICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB7IGFycmF5SW5kZXgsIHZhbHVlIH0gPSBzdGFjay5wb3AoKVxuXG4gICAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuXG4gICAgICAgICAgICAgIC8vIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgICAgICAgIC8vICAgdiA9IHYudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgbGV0IHN1YlJlY29yZCA9IHsgJDogdmFsdWUsIGlkeDogYXJyYXlJbmRleCB9XG5cbiAgICAgICAgICAgICAgaWYgKG5ncmFtcykge1xuICAgICAgICAgICAgICAgIHN1YlJlY29yZC5uZyA9IG5ncmFtKHZhbHVlLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHN1YlJlY29yZHMucHVzaChzdWJSZWNvcmQpXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDAsIGFyckxlbiA9IHZhbHVlLmxlbmd0aDsgayA8IGFyckxlbjsgayArPSAxKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICBhcnJheUluZGV4OiBrLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlW2tdLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVjb3JkLiRba2V5XSA9IHN1YlJlY29yZHNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICAgIC8vICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgbGV0IHN1YlJlY29yZCA9IHsgJDogdmFsdWUgfVxuXG4gICAgICAgICAgaWYgKG5ncmFtcykge1xuICAgICAgICAgICAgc3ViUmVjb3JkLm5nID0gbmdyYW0odmFsdWUsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlY29yZC4kW2tleV0gPSBzdWJSZWNvcmRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbmRleGVkTGlzdC5wdXNoKHJlY29yZClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZXhlZExpc3Rcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlSW5kZXg6IHJlcXVpcmUoJy4vY3JlYXRlLWluZGV4JyksXG4gIEtleVN0b3JlOiByZXF1aXJlKCcuL2tleS1zdG9yZScpXG59IiwiY29uc3QgeyBpc1N0cmluZyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy90eXBlLWNoZWNrZXJzJylcblxuY2xhc3MgS2V5U3RvcmUge1xuICBjb25zdHJ1Y3RvcihrZXlzKSB7XG4gICAgdGhpcy5fa2V5cyA9IHt9XG4gICAgdGhpcy5fa2V5TmFtZXMgPSBbXVxuICAgIHRoaXMuX2xlbmd0aCA9IGtleXMubGVuZ3RoXG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkga2V5XG4gICAgaWYgKGtleXMubGVuZ3RoICYmIGlzU3RyaW5nKGtleXNbMF0pKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cbiAgICAgICAgdGhpcy5fa2V5c1trZXldID0ge1xuICAgICAgICAgIHdlaWdodDogMVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2tleU5hbWVzLnB1c2goa2V5KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdG90YWxXZWlnaHQgPSAwXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCduYW1lJykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJuYW1lXCIgcHJvcGVydHkgaW4ga2V5IG9iamVjdCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBrZXlOYW1lID0ga2V5Lm5hbWVcbiAgICAgICAgdGhpcy5fa2V5TmFtZXMucHVzaChrZXlOYW1lKVxuXG4gICAgICAgIGlmICgha2V5Lmhhc093blByb3BlcnR5KCd3ZWlnaHQnKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBcIndlaWdodFwiIHByb3BlcnR5IGluIGtleSBvYmplY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd2VpZ2h0ID0ga2V5LndlaWdodFxuXG4gICAgICAgIGlmICh3ZWlnaHQgPD0gMCB8fCB3ZWlnaHQgPj0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgbXVzdCBiZWluIHRoZSByYW5nZSBvZiAoMCwgMSknKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2V5c1trZXlOYW1lXSA9IHtcbiAgICAgICAgICB3ZWlnaHRcbiAgICAgICAgfVxuXG4gICAgICAgIHRvdGFsV2VpZ2h0ICs9IHdlaWdodFxuICAgICAgfVxuXG4gICAgICAvLyBOb3JtYWxpemUgd2VpZ2h0cyBzbyB0aGF0IHRoZWlyIHN1bSBpcyBlcXVhbCB0byAxXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleU5hbWUgPSB0aGlzLl9rZXlOYW1lc1tpXVxuICAgICAgICBjb25zdCBrZXlXZWlnaHQgPSB0aGlzLl9rZXlzW2tleU5hbWVdLndlaWdodFxuICAgICAgICB0aGlzLl9rZXlzW2tleU5hbWVdLndlaWdodCA9IGtleVdlaWdodCAvIHRvdGFsV2VpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldChrZXksIG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5c1trZXldID8gdGhpcy5fa2V5c1trZXldW25hbWVdIDogLTFcbiAgfVxuICBrZXlzKCkge1xuICAgIHJldHVybiB0aGlzLl9rZXlOYW1lc1xuICB9XG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9sZW5ndGhcbiAgfVxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuX2tleXMpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlTdG9yZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0cmFuc2Zvcm1NYXRjaGVzOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1tYXRjaGVzJyksXG4gIHRyYW5zZm9ybVNjb3JlOiByZXF1aXJlKCcuL3RyYW5zZm9ybS1zY29yZScpXG59IiwiY29uc3QgeyBpc0FycmF5LCBpc0RlZmluZWQsIGlzU3RyaW5nLCBpc051bWJlciwgaXNPYmplY3QgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlc3VsdCwgZGF0YSkgPT4ge1xuICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgZGF0YS5tYXRjaGVzID0gW11cblxuICBpZiAoIWlzRGVmaW5lZChtYXRjaGVzKSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG1hdGNoZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBsZXQgbWF0Y2ggPSBtYXRjaGVzW2ldXG5cbiAgICBpZiAoIWlzRGVmaW5lZChtYXRjaC5pbmRpY2VzKSB8fCBtYXRjaC5pbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBsZXQgb2JqID0ge1xuICAgICAgaW5kaWNlczogbWF0Y2guaW5kaWNlcyxcbiAgICAgIHZhbHVlOiBtYXRjaC52YWx1ZVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5rZXkpIHtcbiAgICAgIG9iai5rZXkgPSBtYXRjaC5rZXlcbiAgICB9XG5cbiAgICBpZiAobWF0Y2guaWR4ID4gLTEpIHtcbiAgICAgIG9iai5yZWZJbmRleCA9IG1hdGNoLmlkeFxuICAgIH1cblxuICAgIGRhdGEubWF0Y2hlcy5wdXNoKG9iailcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAocmVzdWx0LCBkYXRhKSA9PiB7XG4gIGRhdGEuc2NvcmUgPSByZXN1bHQuc2NvcmVcbn0iXSwic291cmNlUm9vdCI6IiJ9