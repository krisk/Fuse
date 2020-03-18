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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9GdXNlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Z1c2UvLi9zcmMvaGVscGVycy9nZXQuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9oZWxwZXJzL3R5cGUtY2hlY2tlcnMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtbWF0Y2hlZC1pbmRpY2VzLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1wYXR0ZXJuLWFscGhhYmV0LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9iaXRhcC1zY29yZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9iaXRhcC1zZWFyY2gvYml0YXAtc2VhcmNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvYml0YXAtc2VhcmNoL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvZXh0ZW5kZWQtc2VhcmNoL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9pbnZlcnNlLXN1ZmZpeC1leGFjdC1tYXRjaC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9leHRlbmRlZC1zZWFyY2gvcHJlZml4LWV4YWN0LW1hdGNoLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL2V4dGVuZGVkLXNlYXJjaC9zdWZmaXgtZXhhY3QtbWF0Y2guanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL2luZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9hcnJheS11dGlscy9pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL2FycmF5LXV0aWxzL3VuaW9uLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvc2VhcmNoL25ncmFtLXNlYXJjaC9kaXN0YW5jZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvZGlzdGFuY2UvamFjY2FyZC1kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly9GdXNlLy4vc3JjL3NlYXJjaC9uZ3JhbS1zZWFyY2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy9zZWFyY2gvbmdyYW0tc2VhcmNoL25ncmFtLmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvY3JlYXRlLWluZGV4LmpzIiwid2VicGFjazovL0Z1c2UvLi9zcmMvdG9vbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90b29scy9rZXktc3RvcmUuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLW1hdGNoZXMuanMiLCJ3ZWJwYWNrOi8vRnVzZS8uL3NyYy90cmFuc2Zvcm0vdHJhbnNmb3JtLXNjb3JlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJpc0RlZmluZWQiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNBcnJheSIsInRvU3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIm9iaiIsInBhdGgiLCJsaXN0IiwiYXJyIiwiX2dldCIsInB1c2giLCJkb3RJbmRleCIsImluZGV4T2YiLCJrZXkiLCJyZW1haW5pbmciLCJzbGljZSIsInZhbHVlIiwiaSIsImxlbiIsImxlbmd0aCIsIklORklOSVRZIiwiQXJyYXkiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJjYWxsIiwiYmFzZVRvU3RyaW5nIiwicmVzdWx0IiwiaXNPYmplY3QiLCJ1bmRlZmluZWQiLCJCaXRhcFNlYXJjaCIsIkV4dGVuZGVkU2VhcmNoIiwiTkdyYW1TZWFyY2giLCJnZXQiLCJjcmVhdGVJbmRleCIsIktleVN0b3JlIiwidHJhbnNmb3JtTWF0Y2hlcyIsInRyYW5zZm9ybVNjb3JlIiwiTUFYX0JJVFMiLCJGdXNlT3B0aW9ucyIsImlzQ2FzZVNlbnNpdGl2ZSIsImRpc3RhbmNlIiwiZmluZEFsbE1hdGNoZXMiLCJnZXRGbiIsImluY2x1ZGVNYXRjaGVzIiwiaW5jbHVkZVNjb3JlIiwia2V5cyIsImxvY2F0aW9uIiwibWluTWF0Y2hDaGFyTGVuZ3RoIiwic2hvdWxkU29ydCIsInNvcnRGbiIsImEiLCJiIiwic2NvcmUiLCJ0aHJlc2hvbGQiLCJ1c2VFeHRlbmRlZFNlYXJjaCIsIkZ1c2UiLCJvcHRpb25zIiwiaW5kZXgiLCJjYXNlU2Vuc2l0aXZlIiwiX3Byb2Nlc3NLZXlzIiwic2V0Q29sbGVjdGlvbiIsImxpc3RJc1N0cmluZ0FycmF5Iiwic2V0SW5kZXgiLCJfY3JlYXRlSW5kZXgiLCJsaXN0SW5kZXgiLCJfaW5kZXhlZExpc3QiLCJfa2V5U3RvcmUiLCJ2ZXJib3NlIiwicGF0dGVybiIsIm9wdHMiLCJsaW1pdCIsInNlYXJjaGVyIiwicmVzdWx0cyIsIl9zZWFyY2hVc2luZyIsIl9jb21wdXRlU2NvcmUiLCJfc29ydCIsIl9mb3JtYXQiLCJ0ZXh0IiwiJCIsImlkeCIsInNlYXJjaFJlc3VsdCIsInNlYXJjaEluIiwiaXNNYXRjaCIsIm1hdGNoIiwiaW5kaWNlcyIsIm1hdGNoZWRJbmRpY2VzIiwiaXRlbSIsIm1hdGNoZXMiLCJrZXlOYW1lcyIsImtleXNMZW4iLCJjb3VudCIsImoiLCJrIiwiYXJySXRlbSIsInNjb3JlTGVuIiwidG90YWxXZWlnaHRlZFNjb3JlIiwia2V5V2VpZ2h0Iiwid2VpZ2h0IiwiTnVtYmVyIiwiRVBTSUxPTiIsIk1hdGgiLCJwb3ciLCJzb3J0IiwiZmluYWxPdXRwdXQiLCJ0cmFuc2Zvcm1lcnMiLCJkYXRhIiwicmVmSW5kZXgiLCJtYXRjaG1hc2siLCJzdGFydCIsImVuZCIsIm1hc2siLCJjaGFyQXQiLCJlcnJvcnMiLCJjdXJyZW50TG9jYXRpb24iLCJleHBlY3RlZExvY2F0aW9uIiwiYWNjdXJhY3kiLCJwcm94aW1pdHkiLCJhYnMiLCJiaXRhcFNjb3JlIiwicGF0dGVybkFscGhhYmV0IiwicGF0dGVybkxlbiIsInRleHRMZW4iLCJtYXgiLCJtaW4iLCJjdXJyZW50VGhyZXNob2xkIiwiYmVzdExvY2F0aW9uIiwibWF0Y2hNYXNrIiwibGFzdEluZGV4T2YiLCJsYXN0Qml0QXJyIiwiZmluYWxTY29yZSIsImJpbk1heCIsImJpbk1pbiIsImJpbk1pZCIsImZsb29yIiwiZmluaXNoIiwiYml0QXJyIiwiY2hhck1hdGNoIiwiYml0YXBTZWFyY2giLCJFcnJvciIsInRvTG93ZXJDYXNlIiwiaXNGb3JQYXR0ZXJuIiwic2FuaXRpemUiLCJzdWJzdHIiLCJzYW5pdGl6ZWRQYXR0ZXJuIiwiZXhhY3RNYXRjaCIsImludmVyc2VFeGFjdE1hdGNoIiwicHJlZml4RXhhY3RNYXRjaCIsImludmVyc2VQcmVmaXhFeGFjdE1hdGNoIiwic3VmZml4RXhhY3RNYXRjaCIsImludmVyc2VTdWZmaXhFeGFjdE1hdGNoIiwicXVlcnlmeSIsInNwbGl0IiwibWFwIiwidHJpbSIsInF1ZXJ5IiwiX2Z1enp5Q2FjaGUiLCJtYXRjaEZvdW5kIiwicUxlbiIsInBhcnRzIiwicExlbiIsInRva2VuIiwiX3NlYXJjaCIsInNlYXJjaCIsInN0YXJ0c1dpdGgiLCJzdWJzdHJpbmciLCJlbmRzV2l0aCIsInVuaW9uIiwiaW50ZXJzZWN0aW9uIiwiYXJyMSIsImFycjIiLCJpdGVtMSIsIml0ZW0yIiwiamFjY2FyZERpc3RhbmNlIiwibkdyYW0xIiwibkdyYW0yIiwibkdyYW1VbmlvbiIsIm5HcmFtSW50ZXJzZWN0aW9uIiwibmdyYW0iLCJwYXR0ZXJuTmdyYW0iLCJ0ZXh0TmdyYW0iLCJuZyIsImphY2FyZFJlc3VsdCIsIk5HUkFNX0xFTiIsIm4iLCJwYWQiLCJuR3JhbXMiLCJuZ3JhbXMiLCJpbmRleGVkTGlzdCIsInJlY29yZCIsInN1YlJlY29yZHMiLCJzdGFjayIsImFycmF5SW5kZXgiLCJwb3AiLCJzdWJSZWNvcmQiLCJhcnJMZW4iLCJfa2V5cyIsIl9rZXlOYW1lcyIsIl9sZW5ndGgiLCJ0b3RhbFdlaWdodCIsImhhc093blByb3BlcnR5Iiwia2V5TmFtZSIsIm5hbWUiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO1FDVkE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFF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QUFMLEdBQWExQixNQUFNLENBQUMwQixLQUFwQjtBQUNELENBRkQsQyIsImZpbGUiOiJmdXNlLmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRnVzZVwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJGdXNlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkZ1c2VcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImNvbnN0IHtcbiAgaXNEZWZpbmVkLFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzQXJyYXksXG4gIHRvU3RyaW5nXG59ID0gcmVxdWlyZSgnLi90eXBlLWNoZWNrZXJzJylcblxubW9kdWxlLmV4cG9ydHMgPSAob2JqLCBwYXRoKSA9PiB7XG4gIGxldCBsaXN0ID0gW11cbiAgbGV0IGFyciA9IGZhbHNlXG5cbiAgY29uc3QgX2dldCA9IChvYmosIHBhdGgpID0+IHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gcGF0aCBsZWZ0LCB3ZSd2ZSBnb3R0ZW4gdG8gdGhlIG9iamVjdCB3ZSBjYXJlIGFib3V0LlxuICAgICAgbGlzdC5wdXNoKG9iailcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZG90SW5kZXggPSBwYXRoLmluZGV4T2YoJy4nKVxuXG4gICAgICBsZXQga2V5ID0gcGF0aFxuICAgICAgbGV0IHJlbWFpbmluZyA9IG51bGxcblxuICAgICAgaWYgKGRvdEluZGV4ICE9PSAtMSkge1xuICAgICAgICBrZXkgPSBwYXRoLnNsaWNlKDAsIGRvdEluZGV4KVxuICAgICAgICByZW1haW5pbmcgPSBwYXRoLnNsaWNlKGRvdEluZGV4ICsgMSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XVxuXG4gICAgICBpZiAoaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICBpZiAoIXJlbWFpbmluZyAmJiAoaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSkpIHtcbiAgICAgICAgICBsaXN0LnB1c2godG9TdHJpbmcodmFsdWUpKVxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgYXJyID0gdHJ1ZVxuICAgICAgICAgIC8vIFNlYXJjaCBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5LlxuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgX2dldCh2YWx1ZVtpXSwgcmVtYWluaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZW1haW5pbmcpIHtcbiAgICAgICAgICAvLyBBbiBvYmplY3QuIFJlY3Vyc2UgZnVydGhlci5cbiAgICAgICAgICBfZ2V0KHZhbHVlLCByZW1haW5pbmcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZ2V0KG9iaiwgcGF0aClcblxuICBpZiAoYXJyKSB7XG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIHJldHVybiBsaXN0WzBdXG59IiwiY29uc3QgSU5GSU5JVFkgPSAxIC8gMFxuXG5jb25zdCBpc0FycmF5ID0gdmFsdWUgPT4gIUFycmF5LmlzQXJyYXlcbiAgPyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nXG4gIDogQXJyYXkuaXNBcnJheSh2YWx1ZSlcblxuLy8gQWRhcHRlZCBmcm9tOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi9mNGNhMzk2YTc5NjQzNTQyMmJkNGZkNDFmYWRiZDIyNWVkZGRmMTc1Ly5pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanNcbmNvbnN0IGJhc2VUb1N0cmluZyA9IHZhbHVlID0+IHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBsZXQgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbmNvbnN0IHRvU3RyaW5nID0gdmFsdWUgPT4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcblxuY29uc3QgaXNTdHJpbmcgPSB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG5cbmNvbnN0IGlzTnVtYmVyID0gdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJ1xuXG5jb25zdCBpc09iamVjdCA9IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcblxuY29uc3QgaXNEZWZpbmVkID0gdmFsdWUgPT4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNEZWZpbmVkLFxuICBpc0FycmF5LFxuICBpc1N0cmluZyxcbiAgaXNOdW1iZXIsXG4gIGlzT2JqZWN0LFxuICB0b1N0cmluZ1xufVxuIiwiXG5jb25zdCB7IEJpdGFwU2VhcmNoLCBFeHRlbmRlZFNlYXJjaCwgTkdyYW1TZWFyY2ggfSA9IHJlcXVpcmUoJy4vc2VhcmNoJylcbmNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzT2JqZWN0IH0gPSByZXF1aXJlKCcuL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuL2hlbHBlcnMvZ2V0JylcbmNvbnN0IHsgY3JlYXRlSW5kZXgsIEtleVN0b3JlIH0gPSByZXF1aXJlKCcuL3Rvb2xzJylcbmNvbnN0IHsgdHJhbnNmb3JtTWF0Y2hlcywgdHJhbnNmb3JtU2NvcmUgfSA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtJylcbmNvbnN0IHsgTUFYX0JJVFMgfSA9IHJlcXVpcmUoJy4vc2VhcmNoL2JpdGFwLXNlYXJjaC9jb25zdGFudHMnKVxuXG4vLyAvLyBXaWxsIHByaW50IHRvIHRoZSBjb25zb2xlLiBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbi8vIGZ1bmN0aW9uIGRlYnVnKCkge1xuLy8gICBpZiAoRnVzZS52ZXJib3NlKSB7XG4vLyAgICAgY29uc29sZS5sb2coLi4uYXJndW1lbnRzKVxuLy8gICAgIC8vIGNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbi8vICAgICAvLyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QoLi4uYXJndW1lbnRzLCBmYWxzZSwgbnVsbCwgdHJ1ZSAvKiBlbmFibGUgY29sb3JzICovKSlcbi8vICAgfVxuLy8gfVxuXG4vLyBmdW5jdGlvbiBkZWJ1Z1RpbWUodmFsdWUpIHtcbi8vICAgaWYgKEZ1c2UudmVyYm9zZVRpbWUpIHtcbi8vICAgICBjb25zb2xlLnRpbWUodmFsdWUpXG4vLyAgIH1cbi8vIH1cblxuLy8gZnVuY3Rpb24gZGVidWdUaW1lRW5kKHZhbHVlKSB7XG4vLyAgIGlmIChGdXNlLnZlcmJvc2VUaW1lKSB7XG4vLyAgICAgY29uc29sZS50aW1lRW5kKHZhbHVlKVxuLy8gICB9XG4vLyB9XG5cbmxldCBGdXNlT3B0aW9ucyA9IHtcbiAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgLy8gbWF0Y2ggaXMgZm91bmQgYmVmb3JlIHRoZSBlbmQgb2YgdGhlIHNhbWUgaW5wdXQuXG4gIGlzQ2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgLy8gQW4gZXhhY3QgbGV0dGVyIG1hdGNoIHdoaWNoIGlzICdkaXN0YW5jZScgY2hhcmFjdGVycyBhd2F5IGZyb20gdGhlIGZ1enp5IGxvY2F0aW9uXG4gIC8vIHdvdWxkIHNjb3JlIGFzIGEgY29tcGxldGUgbWlzbWF0Y2guIEEgZGlzdGFuY2Ugb2YgJzAnIHJlcXVpcmVzIHRoZSBtYXRjaCBiZSBhdFxuICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgLy8gdG8gYmUgd2l0aGluIDgwMCBjaGFyYWN0ZXJzIG9mIHRoZSBmdXp6eSBsb2NhdGlvbiB0byBiZSBmb3VuZCB1c2luZyBhIDAuOCB0aHJlc2hvbGQuXG4gIGRpc3RhbmNlOiAxMDAsXG4gIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICBmaW5kQWxsTWF0Y2hlczogZmFsc2UsXG4gIC8vIFRoZSBnZXQgZnVuY3Rpb24gdG8gdXNlIHdoZW4gZmV0Y2hpbmcgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gVGhlIGRlZmF1bHQgd2lsbCBzZWFyY2ggbmVzdGVkIHBhdGhzICppZSBmb28uYmFyLmJheipcbiAgZ2V0Rm46IGdldCxcbiAgaW5jbHVkZU1hdGNoZXM6IGZhbHNlLFxuICBpbmNsdWRlU2NvcmU6IGZhbHNlLFxuICAvLyBMaXN0IG9mIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHNlYXJjaGVkLiBUaGlzIGFsc28gc3VwcG9ydHMgbmVzdGVkIHByb3BlcnRpZXMuXG4gIGtleXM6IFtdLFxuICAvLyBBcHByb3hpbWF0ZWx5IHdoZXJlIGluIHRoZSB0ZXh0IGlzIHRoZSBwYXR0ZXJuIGV4cGVjdGVkIHRvIGJlIGZvdW5kP1xuICBsb2NhdGlvbjogMCxcbiAgLy8gTWluaW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyB0aGF0IG11c3QgYmUgbWF0Y2hlZCBiZWZvcmUgYSByZXN1bHQgaXMgY29uc2lkZXJlZCBhIG1hdGNoXG4gIG1pbk1hdGNoQ2hhckxlbmd0aDogMSxcbiAgLy8gV2hldGhlciB0byBzb3J0IHRoZSByZXN1bHQgbGlzdCwgYnkgc2NvcmVcbiAgc2hvdWxkU29ydDogdHJ1ZSxcbiAgLy8gRGVmYXVsdCBzb3J0IGZ1bmN0aW9uXG4gIHNvcnRGbjogKGEsIGIpID0+IChhLnNjb3JlIC0gYi5zY29yZSksXG4gIC8vIEF0IHdoYXQgcG9pbnQgZG9lcyB0aGUgbWF0Y2ggYWxnb3JpdGhtIGdpdmUgdXAuIEEgdGhyZXNob2xkIG9mICcwLjAnIHJlcXVpcmVzIGEgcGVyZmVjdCBtYXRjaFxuICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICB0aHJlc2hvbGQ6IDAuNixcbiAgLy8gRW5hYmxlZCBleHRlbmRlZC1zZWFyY2hpbmdcbiAgdXNlRXh0ZW5kZWRTZWFyY2g6IGZhbHNlXG59XG5cbmNsYXNzIEZ1c2Uge1xuICBjb25zdHJ1Y3RvcihsaXN0LCBvcHRpb25zID0gRnVzZU9wdGlvbnMsIGluZGV4ID0gbnVsbCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHsgLi4uRnVzZU9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuICAgIC8vIGBjYXNlU2Vuc2l0aXZlYCBpcyBkZXByZWNhdGVkLCB1c2UgYGlzQ2FzZVNlbnNpdGl2ZWAgaW5zdGVhZFxuICAgIHRoaXMub3B0aW9ucy5pc0Nhc2VTZW5zaXRpdmUgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmVcbiAgICBkZWxldGUgdGhpcy5vcHRpb25zLmNhc2VTZW5zaXRpdmVcblxuICAgIC8vIGRlYnVnVGltZSgnQ29uc3RydWN0aW5nJylcbiAgICB0aGlzLl9wcm9jZXNzS2V5cyh0aGlzLm9wdGlvbnMua2V5cylcbiAgICB0aGlzLnNldENvbGxlY3Rpb24obGlzdCwgaW5kZXgpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb25zdHJ1Y3RpbmcnKVxuICB9XG5cbiAgc2V0Q29sbGVjdGlvbihsaXN0LCBpbmRleCA9IG51bGwpIHtcbiAgICB0aGlzLmxpc3QgPSBsaXN0XG4gICAgdGhpcy5saXN0SXNTdHJpbmdBcnJheSA9IGlzU3RyaW5nKGxpc3RbMF0pXG5cbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlYnVnVGltZSgnUHJvY2VzcyBpbmRleCcpXG4gICAgICB0aGlzLnNldEluZGV4KHRoaXMuX2NyZWF0ZUluZGV4KCkpXG4gICAgICAvLyBkZWJ1Z1RpbWVFbmQoJ1Byb2Nlc3MgaW5kZXgnKVxuICAgIH1cbiAgfVxuXG4gIHNldEluZGV4KGxpc3RJbmRleCkge1xuICAgIHRoaXMuX2luZGV4ZWRMaXN0ID0gbGlzdEluZGV4XG4gICAgLy8gZGVidWcobGlzdEluZGV4KVxuICB9XG5cbiAgX3Byb2Nlc3NLZXlzKGtleXMpIHtcbiAgICB0aGlzLl9rZXlTdG9yZSA9IG5ldyBLZXlTdG9yZShrZXlzKVxuXG4gICAgLy8gZGVidWcoJ1Byb2Nlc3MgS2V5cycpXG4gICAgaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgICAgLy8gZGVidWcodGhpcy5fa2V5U3RvcmUudG9KU09OKCkpXG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZUluZGV4KCkge1xuICAgIHJldHVybiBjcmVhdGVJbmRleCh0aGlzLl9rZXlTdG9yZS5rZXlzKCksIHRoaXMubGlzdCwge1xuICAgICAgZ2V0Rm46IHRoaXMub3B0aW9ucy5nZXRGblxuICAgIH0pXG4gIH1cblxuICBzZWFyY2gocGF0dGVybiwgb3B0cyA9IHsgbGltaXQ6IGZhbHNlIH0pIHtcbiAgICAvLyBkZWJ1ZyhgLS0tLS0tLS0tIFNlYXJjaCBwYXR0ZXJuOiBcIiR7cGF0dGVybn1cImApXG4gICAgY29uc3QgeyB1c2VFeHRlbmRlZFNlYXJjaCwgc2hvdWxkU29ydCB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBsZXQgc2VhcmNoZXIgPSBudWxsXG5cbiAgICBpZiAodXNlRXh0ZW5kZWRTZWFyY2gpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IEV4dGVuZGVkU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2UgaWYgKHBhdHRlcm4ubGVuZ3RoID4gTUFYX0JJVFMpIHtcbiAgICAgIHNlYXJjaGVyID0gbmV3IE5HcmFtU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoZXIgPSBuZXcgQml0YXBTZWFyY2gocGF0dGVybiwgdGhpcy5vcHRpb25zKVxuICAgIH1cblxuICAgIC8vIGRlYnVnVGltZSgnU2VhcmNoIHRpbWUnKTtcbiAgICBsZXQgcmVzdWx0cyA9IHRoaXMuX3NlYXJjaFVzaW5nKHNlYXJjaGVyKVxuICAgIC8vIGRlYnVnVGltZUVuZCgnU2VhcmNoIHRpbWUnKTtcblxuICAgIC8vIGRlYnVnVGltZSgnQ29tcHV0ZSBzY29yZSB0aW1lJyk7XG4gICAgdGhpcy5fY29tcHV0ZVNjb3JlKHJlc3VsdHMpXG4gICAgLy8gZGVidWdUaW1lRW5kKCdDb21wdXRlIHNjb3JlIHRpbWUnKTtcblxuICAgIGlmIChzaG91bGRTb3J0KSB7XG4gICAgICB0aGlzLl9zb3J0KHJlc3VsdHMpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMubGltaXQgJiYgaXNOdW1iZXIob3B0cy5saW1pdCkpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNsaWNlKDAsIG9wdHMubGltaXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdChyZXN1bHRzKVxuICB9XG5cbiAgX3NlYXJjaFVzaW5nKHNlYXJjaGVyKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2luZGV4ZWRMaXN0XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdXG4gICAgY29uc3QgeyBpbmNsdWRlTWF0Y2hlcyB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICAvLyBMaXN0IGlzIEFycmF5PFN0cmluZz5cbiAgICBpZiAodGhpcy5saXN0SXNTdHJpbmdBcnJheSkge1xuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgbGlzdFxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbGlzdFtpXVxuICAgICAgICBsZXQgeyAkOiB0ZXh0LCBpZHggfSA9IHZhbHVlXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQodGV4dCkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgIGNvbnN0IHsgaXNNYXRjaCwgc2NvcmUgfSA9IHNlYXJjaFJlc3VsdFxuXG4gICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCB2YWx1ZTogdGV4dCB9XG5cbiAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgbWF0Y2guaW5kaWNlcyA9IHNlYXJjaFJlc3VsdC5tYXRjaGVkSW5kaWNlc1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgICAgICBpdGVtOiB0ZXh0LFxuICAgICAgICAgIGlkeCxcbiAgICAgICAgICBtYXRjaGVzOiBbbWF0Y2hdXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgICBjb25zdCBrZXlOYW1lcyA9IHRoaXMuX2tleVN0b3JlLmtleXMoKVxuICAgICAgY29uc3Qga2V5c0xlbiA9IHRoaXMuX2tleVN0b3JlLmNvdW50KClcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgbGV0IHsgJDogaXRlbSwgaWR4IH0gPSBsaXN0W2ldXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoZXMgPSBbXVxuXG4gICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBldmVyeSBrZXkgKGkuZSwgcGF0aCksIGFuZCBmZXRjaCB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBrZXlzTGVuOyBqICs9IDEpIHtcbiAgICAgICAgICBsZXQga2V5ID0ga2V5TmFtZXNbal1cbiAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtW2tleV1cblxuICAgICAgICAgIC8vIGRlYnVnKGAgS2V5OiAke2tleSA9PT0gJycgPyAnLS0nIDoga2V5fWApXG5cbiAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBrIDwgbGVuOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGFyckl0ZW0gPSB2YWx1ZVtrXVxuICAgICAgICAgICAgICBsZXQgdGV4dCA9IGFyckl0ZW0uJFxuICAgICAgICAgICAgICBsZXQgaWR4ID0gYXJySXRlbS5pZHhcblxuICAgICAgICAgICAgICBpZiAoIWlzRGVmaW5lZCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgc2VhcmNoUmVzdWx0ID0gc2VhcmNoZXIuc2VhcmNoSW4oYXJySXRlbSlcblxuICAgICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgICAvLyBkZWJ1ZyhgRnVsbCB0ZXh0OiBcIiR7dGV4dH1cIiwgc2NvcmU6ICR7c2NvcmV9YClcblxuICAgICAgICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGV0IG1hdGNoID0geyBzY29yZSwga2V5LCB2YWx1ZTogdGV4dCwgaWR4IH1cblxuICAgICAgICAgICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBtYXRjaC5pbmRpY2VzID0gc2VhcmNoUmVzdWx0Lm1hdGNoZWRJbmRpY2VzXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuICAgICAgICAgICAgbGV0IHNlYXJjaFJlc3VsdCA9IHNlYXJjaGVyLnNlYXJjaEluKHZhbHVlKVxuXG4gICAgICAgICAgICBjb25zdCB7IGlzTWF0Y2gsIHNjb3JlIH0gPSBzZWFyY2hSZXN1bHRcblxuICAgICAgICAgICAgLy8gZGVidWcoYEZ1bGwgdGV4dDogXCIke3RleHR9XCIsIHNjb3JlOiAke3Njb3JlfWApXG5cbiAgICAgICAgICAgIGlmICghaXNNYXRjaCkge1xuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB7IHNjb3JlLCBrZXksIHZhbHVlOiB0ZXh0IH1cblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVNYXRjaGVzKSB7XG4gICAgICAgICAgICAgIG1hdGNoLmluZGljZXMgPSBzZWFyY2hSZXN1bHQubWF0Y2hlZEluZGljZXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKG1hdGNoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICBpZHgsXG4gICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgbWF0Y2hlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLSBSRVNVTFRTIC0tLS0tLS0tLS0tXCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgX2NvbXB1dGVTY29yZShyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ0NvbXB1dGluZyBzY29yZTogJylcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSByZXN1bHRzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2ldXG4gICAgICBjb25zdCBtYXRjaGVzID0gcmVzdWx0Lm1hdGNoZXNcbiAgICAgIGNvbnN0IHNjb3JlTGVuID0gbWF0Y2hlcy5sZW5ndGhcblxuICAgICAgbGV0IHRvdGFsV2VpZ2h0ZWRTY29yZSA9IDFcbiAgICAgIC8vIGxldCBiZXN0U2NvcmUgPSAtMVxuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNjb3JlTGVuOyBqICs9IDEpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IG1hdGNoZXNbal1cbiAgICAgICAgY29uc3Qga2V5ID0gaXRlbS5rZXlcbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0gdGhpcy5fa2V5U3RvcmUuZ2V0KGtleSwgJ3dlaWdodCcpXG4gICAgICAgIGNvbnN0IHdlaWdodCA9IGtleVdlaWdodCA+IC0xID8ga2V5V2VpZ2h0IDogMVxuICAgICAgICBjb25zdCBzY29yZSA9IGl0ZW0uc2NvcmUgPT09IDAgJiYga2V5V2VpZ2h0ID4gLTFcbiAgICAgICAgICA/IE51bWJlci5FUFNJTE9OXG4gICAgICAgICAgOiBpdGVtLnNjb3JlXG5cbiAgICAgICAgdG90YWxXZWlnaHRlZFNjb3JlICo9IE1hdGgucG93KHNjb3JlLCB3ZWlnaHQpXG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgYmVzdCBzY29yZS4uIGp1c3QgaW4gY2FzZVxuICAgICAgICAvLyBBY3R1YWxseSwgd2UncmUgbm90IHJlYWxseSB1c2luZyBpdC4uIGJ1dCBuZWVkIHRvIHRoaW5rIG9mIGEgd2F5IHRvIGluY29ycG9yYXRlIHRoaXNcbiAgICAgICAgLy8gYmVzdFNjb3JlID0gYmVzdFNjb3JlID09IC0xID8gaXRlbS5zY29yZSA6IE1hdGgubWluKGJlc3RTY29yZSwgaXRlbS5zY29yZSlcbiAgICAgIH1cblxuICAgICAgcmVzdWx0LnNjb3JlID0gdG90YWxXZWlnaHRlZFNjb3JlXG4gICAgICAvLyByZXN1bHQuJHNjb3JlID0gYmVzdFNjb3JlXG5cbiAgICAgIC8vIGRlYnVnKHJlc3VsdClcbiAgICB9XG4gIH1cblxuICBfc29ydChyZXN1bHRzKSB7XG4gICAgLy8gZGVidWcoJ1NvcnRpbmcuLi4uJylcbiAgICByZXN1bHRzLnNvcnQodGhpcy5vcHRpb25zLnNvcnRGbilcbiAgfVxuXG4gIF9mb3JtYXQocmVzdWx0cykge1xuICAgIGNvbnN0IGZpbmFsT3V0cHV0ID0gW11cblxuICAgIGNvbnN0IHsgaW5jbHVkZU1hdGNoZXMsIGluY2x1ZGVTY29yZSwgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgLy8gaWYgKEZ1c2UudmVyYm9zZSkge1xuICAgIC8vICAgbGV0IGNhY2hlID0gW11cbiAgICAvLyAgIGRlYnVnKCdPdXRwdXQ6JywgSlNPTi5zdHJpbmdpZnkocmVzdWx0cywgKGtleSwgdmFsdWUpID0+IHtcbiAgICAvLyAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgLy8gICAgICAgaWYgKGNhY2hlLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgIC8vICAgICAgICAgLy8gQ2lyY3VsYXIgcmVmZXJlbmNlIGZvdW5kLCBkaXNjYXJkIGtleVxuICAgIC8vICAgICAgICAgcmV0dXJuXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIC8vIFN0b3JlIHZhbHVlIGluIG91ciBjb2xsZWN0aW9uXG4gICAgLy8gICAgICAgY2FjaGUucHVzaCh2YWx1ZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gdmFsdWVcbiAgICAvLyAgIH0sIDIpKVxuICAgIC8vICAgY2FjaGUgPSBudWxsXG4gICAgLy8gfVxuXG4gICAgbGV0IHRyYW5zZm9ybWVycyA9IFtdXG5cbiAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHRyYW5zZm9ybWVycy5wdXNoKHRyYW5zZm9ybU1hdGNoZXMpXG4gICAgaWYgKGluY2x1ZGVTY29yZSkgdHJhbnNmb3JtZXJzLnB1c2godHJhbnNmb3JtU2NvcmUpXG5cbiAgICAvLyBkZWJ1ZyhcIj09PT09IFJFU1VMVFMgPT09PT09XCIpXG4gICAgLy8gZGVidWcocmVzdWx0cylcbiAgICAvLyBkZWJ1ZyhcIj09PT09PT09PT09PT09PT09PT09XCIpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmVzdWx0cy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXVxuXG4gICAgICAvLyBkZWJ1ZygncmVzdWx0JywgcmVzdWx0KVxuXG4gICAgICBjb25zdCB7IGlkeCB9ID0gcmVzdWx0XG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGl0ZW06IHRoaXMubGlzdFtpZHhdLFxuICAgICAgICByZWZJbmRleDogaWR4XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSB0cmFuc2Zvcm1lcnMubGVuZ3RoOyBqIDwgbGVuOyBqICs9IDEpIHtcbiAgICAgICAgICB0cmFuc2Zvcm1lcnNbal0ocmVzdWx0LCBkYXRhKVxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgZmluYWxPdXRwdXQucHVzaChkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiBmaW5hbE91dHB1dFxuICB9XG59XG5cbkZ1c2UuY3JlYXRlSW5kZXggPSBjcmVhdGVJbmRleFxuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1c2VcbiIsIm1vZHVsZS5leHBvcnRzID0gKG1hdGNobWFzayA9IFtdLCBtaW5NYXRjaENoYXJMZW5ndGggPSAxKSA9PiB7XG4gIGxldCBtYXRjaGVkSW5kaWNlcyA9IFtdXG4gIGxldCBzdGFydCA9IC0xXG4gIGxldCBlbmQgPSAtMVxuICBsZXQgaSA9IDBcblxuICBmb3IgKGxldCBsZW4gPSBtYXRjaG1hc2subGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICBsZXQgbWF0Y2ggPSBtYXRjaG1hc2tbaV1cbiAgICBpZiAobWF0Y2ggJiYgc3RhcnQgPT09IC0xKSB7XG4gICAgICBzdGFydCA9IGlcbiAgICB9IGVsc2UgaWYgKCFtYXRjaCAmJiBzdGFydCAhPT0gLTEpIHtcbiAgICAgIGVuZCA9IGkgLSAxXG4gICAgICBpZiAoKGVuZCAtIHN0YXJ0KSArIDEgPj0gbWluTWF0Y2hDaGFyTGVuZ3RoKSB7XG4gICAgICAgIG1hdGNoZWRJbmRpY2VzLnB1c2goW3N0YXJ0LCBlbmRdKVxuICAgICAgfVxuICAgICAgc3RhcnQgPSAtMVxuICAgIH1cbiAgfVxuXG4gIC8vIChpLTEgLSBzdGFydCkgKyAxID0+IGkgLSBzdGFydFxuICBpZiAobWF0Y2htYXNrW2kgLSAxXSAmJiAoaSAtIHN0YXJ0KSA+PSBtaW5NYXRjaENoYXJMZW5ndGgpIHtcbiAgICBtYXRjaGVkSW5kaWNlcy5wdXNoKFtzdGFydCwgaSAtIDFdKTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVkSW5kaWNlc1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBwYXR0ZXJuID0+IHtcbiAgbGV0IG1hc2sgPSB7fVxuICBsZXQgbGVuID0gcGF0dGVybi5sZW5ndGhcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbWFza1twYXR0ZXJuLmNoYXJBdChpKV0gPSAwXG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbWFza1twYXR0ZXJuLmNoYXJBdChpKV0gfD0gMSA8PCAobGVuIC0gaSAtIDEpXG4gIH1cblxuICByZXR1cm4gbWFza1xufSIsIm1vZHVsZS5leHBvcnRzID0gKHBhdHRlcm4sIHsgZXJyb3JzID0gMCwgY3VycmVudExvY2F0aW9uID0gMCwgZXhwZWN0ZWRMb2NhdGlvbiA9IDAsIGRpc3RhbmNlID0gMTAwIH0pID0+IHtcbiAgY29uc3QgYWNjdXJhY3kgPSBlcnJvcnMgLyBwYXR0ZXJuLmxlbmd0aFxuICBjb25zdCBwcm94aW1pdHkgPSBNYXRoLmFicyhleHBlY3RlZExvY2F0aW9uIC0gY3VycmVudExvY2F0aW9uKVxuXG4gIGlmICghZGlzdGFuY2UpIHtcbiAgICAvLyBEb2RnZSBkaXZpZGUgYnkgemVybyBlcnJvci5cbiAgICByZXR1cm4gcHJveGltaXR5ID8gMS4wIDogYWNjdXJhY3lcbiAgfVxuXG4gIHJldHVybiBhY2N1cmFjeSArIChwcm94aW1pdHkgLyBkaXN0YW5jZSlcbn1cbiIsImNvbnN0IGJpdGFwU2NvcmUgPSByZXF1aXJlKCcuL2JpdGFwLXNjb3JlJylcbmNvbnN0IG1hdGNoZWRJbmRpY2VzID0gcmVxdWlyZSgnLi9iaXRhcC1tYXRjaGVkLWluZGljZXMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICh0ZXh0LCBwYXR0ZXJuLCBwYXR0ZXJuQWxwaGFiZXQsIHsgbG9jYXRpb24gPSAwLCBkaXN0YW5jZSA9IDEwMCwgdGhyZXNob2xkID0gMC42LCBmaW5kQWxsTWF0Y2hlcyA9IGZhbHNlLCBtaW5NYXRjaENoYXJMZW5ndGggPSAxLCBpbmNsdWRlTWF0Y2hlcyA9IGZhbHNlIH0pID0+IHtcbiAgY29uc3QgcGF0dGVybkxlbiA9IHBhdHRlcm4ubGVuZ3RoXG4gIC8vIFNldCBzdGFydGluZyBsb2NhdGlvbiBhdCBiZWdpbm5pbmcgdGV4dCBhbmQgaW5pdGlhbGl6ZSB0aGUgYWxwaGFiZXQuXG4gIGNvbnN0IHRleHRMZW4gPSB0ZXh0Lmxlbmd0aFxuICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBsb2NhdGlvbiA+IHRleHQubGVuZ3RoXG4gIGNvbnN0IGV4cGVjdGVkTG9jYXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsb2NhdGlvbiwgdGV4dExlbikpXG4gIC8vIEhpZ2hlc3Qgc2NvcmUgYmV5b25kIHdoaWNoIHdlIGdpdmUgdXAuXG4gIGxldCBjdXJyZW50VGhyZXNob2xkID0gdGhyZXNob2xkXG4gIC8vIElzIHRoZXJlIGEgbmVhcmJ5IGV4YWN0IG1hdGNoPyAoc3BlZWR1cClcbiAgbGV0IGJlc3RMb2NhdGlvbiA9IHRleHQuaW5kZXhPZihwYXR0ZXJuLCBleHBlY3RlZExvY2F0aW9uKVxuXG4gIC8vIGEgbWFzayBvZiB0aGUgbWF0Y2hlc1xuICBjb25zdCBtYXRjaE1hc2sgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRMZW47IGkgKz0gMSkge1xuICAgIG1hdGNoTWFza1tpXSA9IDBcbiAgfVxuXG4gIGlmIChiZXN0TG9jYXRpb24gIT09IC0xKSB7XG4gICAgbGV0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICBlcnJvcnM6IDAsXG4gICAgICBjdXJyZW50TG9jYXRpb246IGJlc3RMb2NhdGlvbixcbiAgICAgIGV4cGVjdGVkTG9jYXRpb24sXG4gICAgICBkaXN0YW5jZVxuICAgIH0pXG4gICAgY3VycmVudFRocmVzaG9sZCA9IE1hdGgubWluKHNjb3JlLCBjdXJyZW50VGhyZXNob2xkKVxuXG4gICAgLy8gV2hhdCBhYm91dCBpbiB0aGUgb3RoZXIgZGlyZWN0aW9uPyAoc3BlZWQgdXApXG4gICAgYmVzdExvY2F0aW9uID0gdGV4dC5sYXN0SW5kZXhPZihwYXR0ZXJuLCBleHBlY3RlZExvY2F0aW9uICsgcGF0dGVybkxlbilcblxuICAgIGlmIChiZXN0TG9jYXRpb24gIT09IC0xKSB7XG4gICAgICBsZXQgc2NvcmUgPSBiaXRhcFNjb3JlKHBhdHRlcm4sIHtcbiAgICAgICAgZXJyb3JzOiAwLFxuICAgICAgICBjdXJyZW50TG9jYXRpb246IGJlc3RMb2NhdGlvbixcbiAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgZGlzdGFuY2VcbiAgICAgIH0pXG4gICAgICBjdXJyZW50VGhyZXNob2xkID0gTWF0aC5taW4oc2NvcmUsIGN1cnJlbnRUaHJlc2hvbGQpXG4gICAgfVxuICB9XG5cbiAgLy8gUmVzZXQgdGhlIGJlc3QgbG9jYXRpb25cbiAgYmVzdExvY2F0aW9uID0gLTFcblxuICBsZXQgbGFzdEJpdEFyciA9IFtdXG4gIGxldCBmaW5hbFNjb3JlID0gMVxuICBsZXQgYmluTWF4ID0gcGF0dGVybkxlbiArIHRleHRMZW5cblxuICBjb25zdCBtYXNrID0gMSA8PCAocGF0dGVybkxlbiA8PSAzMSA/IHBhdHRlcm5MZW4gLSAxIDogMzApXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXR0ZXJuTGVuOyBpICs9IDEpIHtcbiAgICAvLyBTY2FuIGZvciB0aGUgYmVzdCBtYXRjaDsgZWFjaCBpdGVyYXRpb24gYWxsb3dzIGZvciBvbmUgbW9yZSBlcnJvci5cbiAgICAvLyBSdW4gYSBiaW5hcnkgc2VhcmNoIHRvIGRldGVybWluZSBob3cgZmFyIGZyb20gdGhlIG1hdGNoIGxvY2F0aW9uIHdlIGNhbiBzdHJheVxuICAgIC8vIGF0IHRoaXMgZXJyb3IgbGV2ZWwuXG4gICAgbGV0IGJpbk1pbiA9IDBcbiAgICBsZXQgYmluTWlkID0gYmluTWF4XG5cbiAgICB3aGlsZSAoYmluTWluIDwgYmluTWlkKSB7XG4gICAgICBjb25zdCBzY29yZSA9IGJpdGFwU2NvcmUocGF0dGVybiwge1xuICAgICAgICBlcnJvcnM6IGksXG4gICAgICAgIGN1cnJlbnRMb2NhdGlvbjogZXhwZWN0ZWRMb2NhdGlvbiArIGJpbk1pZCxcbiAgICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgICAgZGlzdGFuY2VcbiAgICAgIH0pXG5cbiAgICAgIGlmIChzY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgIGJpbk1pbiA9IGJpbk1pZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluTWF4ID0gYmluTWlkXG4gICAgICB9XG5cbiAgICAgIGJpbk1pZCA9IE1hdGguZmxvb3IoKGJpbk1heCAtIGJpbk1pbikgLyAyICsgYmluTWluKVxuICAgIH1cblxuICAgIC8vIFVzZSB0aGUgcmVzdWx0IGZyb20gdGhpcyBpdGVyYXRpb24gYXMgdGhlIG1heGltdW0gZm9yIHRoZSBuZXh0LlxuICAgIGJpbk1heCA9IGJpbk1pZFxuXG4gICAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMSwgZXhwZWN0ZWRMb2NhdGlvbiAtIGJpbk1pZCArIDEpXG4gICAgbGV0IGZpbmlzaCA9IGZpbmRBbGxNYXRjaGVzID8gdGV4dExlbiA6IE1hdGgubWluKGV4cGVjdGVkTG9jYXRpb24gKyBiaW5NaWQsIHRleHRMZW4pICsgcGF0dGVybkxlblxuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgYml0IGFycmF5XG4gICAgbGV0IGJpdEFyciA9IEFycmF5KGZpbmlzaCArIDIpXG5cbiAgICBiaXRBcnJbZmluaXNoICsgMV0gPSAoMSA8PCBpKSAtIDFcblxuICAgIGZvciAobGV0IGogPSBmaW5pc2g7IGogPj0gc3RhcnQ7IGogLT0gMSkge1xuICAgICAgbGV0IGN1cnJlbnRMb2NhdGlvbiA9IGogLSAxXG4gICAgICBsZXQgY2hhck1hdGNoID0gcGF0dGVybkFscGhhYmV0W3RleHQuY2hhckF0KGN1cnJlbnRMb2NhdGlvbildXG5cbiAgICAgIGlmIChjaGFyTWF0Y2gpIHtcbiAgICAgICAgbWF0Y2hNYXNrW2N1cnJlbnRMb2NhdGlvbl0gPSAxXG4gICAgICB9XG5cbiAgICAgIC8vIEZpcnN0IHBhc3M6IGV4YWN0IG1hdGNoXG4gICAgICBiaXRBcnJbal0gPSAoKGJpdEFycltqICsgMV0gPDwgMSkgfCAxKSAmIGNoYXJNYXRjaFxuXG4gICAgICAvLyBTdWJzZXF1ZW50IHBhc3NlczogZnV6enkgbWF0Y2hcbiAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgIGJpdEFycltqXSB8PSAoKChsYXN0Qml0QXJyW2ogKyAxXSB8IGxhc3RCaXRBcnJbal0pIDw8IDEpIHwgMSkgfCBsYXN0Qml0QXJyW2ogKyAxXVxuICAgICAgfVxuXG4gICAgICBpZiAoYml0QXJyW2pdICYgbWFzaykge1xuICAgICAgICBmaW5hbFNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICAgICAgZXJyb3JzOiBpLFxuICAgICAgICAgIGN1cnJlbnRMb2NhdGlvbixcbiAgICAgICAgICBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgICAgIGRpc3RhbmNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gVGhpcyBtYXRjaCB3aWxsIGFsbW9zdCBjZXJ0YWlubHkgYmUgYmV0dGVyIHRoYW4gYW55IGV4aXN0aW5nIG1hdGNoLlxuICAgICAgICAvLyBCdXQgY2hlY2sgYW55d2F5LlxuICAgICAgICBpZiAoZmluYWxTY29yZSA8PSBjdXJyZW50VGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gSW5kZWVkIGl0IGlzXG4gICAgICAgICAgY3VycmVudFRocmVzaG9sZCA9IGZpbmFsU2NvcmVcbiAgICAgICAgICBiZXN0TG9jYXRpb24gPSBjdXJyZW50TG9jYXRpb25cblxuICAgICAgICAgIC8vIEFscmVhZHkgcGFzc2VkIGBsb2NgLCBkb3duaGlsbCBmcm9tIGhlcmUgb24gaW4uXG4gICAgICAgICAgaWYgKGJlc3RMb2NhdGlvbiA8PSBleHBlY3RlZExvY2F0aW9uKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFdoZW4gcGFzc2luZyBgYmVzdExvY2F0aW9uYCwgZG9uJ3QgZXhjZWVkIG91ciBjdXJyZW50IGRpc3RhbmNlIGZyb20gYGV4cGVjdGVkTG9jYXRpb25gLlxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoMSwgMiAqIGV4cGVjdGVkTG9jYXRpb24gLSBiZXN0TG9jYXRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBObyBob3BlIGZvciBhIChiZXR0ZXIpIG1hdGNoIGF0IGdyZWF0ZXIgZXJyb3IgbGV2ZWxzLlxuICAgIGNvbnN0IHNjb3JlID0gYml0YXBTY29yZShwYXR0ZXJuLCB7XG4gICAgICBlcnJvcnM6IGkgKyAxLFxuICAgICAgY3VycmVudExvY2F0aW9uOiBleHBlY3RlZExvY2F0aW9uLFxuICAgICAgZXhwZWN0ZWRMb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlXG4gICAgfSlcblxuICAgIGlmIChzY29yZSA+IGN1cnJlbnRUaHJlc2hvbGQpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgbGFzdEJpdEFyciA9IGJpdEFyclxuICB9XG5cbiAgbGV0IHJlc3VsdCA9IHtcbiAgICBpc01hdGNoOiBiZXN0TG9jYXRpb24gPj0gMCxcbiAgICAvLyBDb3VudCBleGFjdCBtYXRjaGVzICh0aG9zZSB3aXRoIGEgc2NvcmUgb2YgMCkgdG8gYmUgXCJhbG1vc3RcIiBleGFjdFxuICAgIHNjb3JlOiAhZmluYWxTY29yZSA/IDAuMDAxIDogZmluYWxTY29yZSxcbiAgfVxuXG4gIGlmIChpbmNsdWRlTWF0Y2hlcykge1xuICAgIHJlc3VsdC5tYXRjaGVkSW5kaWNlcyA9IG1hdGNoZWRJbmRpY2VzKG1hdGNoTWFzaywgbWluTWF0Y2hDaGFyTGVuZ3RoKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuIiwiLy8gTWFjaGluZSB3b3JkIHNpemVcbm1vZHVsZS5leHBvcnRzLk1BWF9CSVRTID0gMzIiLCJjb25zdCBiaXRhcFNlYXJjaCA9IHJlcXVpcmUoJy4vYml0YXAtc2VhcmNoJylcbmNvbnN0IHBhdHRlcm5BbHBoYWJldCA9IHJlcXVpcmUoJy4vYml0YXAtcGF0dGVybi1hbHBoYWJldCcpXG5jb25zdCB7IE1BWF9CSVRTIH0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG5cbmNsYXNzIEJpdGFwU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwge1xuICAgIC8vIEFwcHJveGltYXRlbHkgd2hlcmUgaW4gdGhlIHRleHQgaXMgdGhlIHBhdHRlcm4gZXhwZWN0ZWQgdG8gYmUgZm91bmQ/XG4gICAgbG9jYXRpb24gPSAwLFxuICAgIC8vIERldGVybWluZXMgaG93IGNsb3NlIHRoZSBtYXRjaCBtdXN0IGJlIHRvIHRoZSBmdXp6eSBsb2NhdGlvbiAoc3BlY2lmaWVkIGFib3ZlKS5cbiAgICAvLyBBbiBleGFjdCBsZXR0ZXIgbWF0Y2ggd2hpY2ggaXMgJ2Rpc3RhbmNlJyBjaGFyYWN0ZXJzIGF3YXkgZnJvbSB0aGUgZnV6enkgbG9jYXRpb25cbiAgICAvLyB3b3VsZCBzY29yZSBhcyBhIGNvbXBsZXRlIG1pc21hdGNoLiBBIGRpc3RhbmNlIG9mICcwJyByZXF1aXJlcyB0aGUgbWF0Y2ggYmUgYXRcbiAgICAvLyB0aGUgZXhhY3QgbG9jYXRpb24gc3BlY2lmaWVkLCBhIHRocmVzaG9sZCBvZiAnMTAwMCcgd291bGQgcmVxdWlyZSBhIHBlcmZlY3QgbWF0Y2hcbiAgICAvLyB0byBiZSB3aXRoaW4gODAwIGNoYXJhY3RlcnMgb2YgdGhlIGZ1enp5IGxvY2F0aW9uIHRvIGJlIGZvdW5kIHVzaW5nIGEgMC44IHRocmVzaG9sZC5cbiAgICBkaXN0YW5jZSA9IDEwMCxcbiAgICAvLyBBdCB3aGF0IHBvaW50IGRvZXMgdGhlIG1hdGNoIGFsZ29yaXRobSBnaXZlIHVwLiBBIHRocmVzaG9sZCBvZiAnMC4wJyByZXF1aXJlcyBhIHBlcmZlY3QgbWF0Y2hcbiAgICAvLyAob2YgYm90aCBsZXR0ZXJzIGFuZCBsb2NhdGlvbiksIGEgdGhyZXNob2xkIG9mICcxLjAnIHdvdWxkIG1hdGNoIGFueXRoaW5nLlxuICAgIHRocmVzaG9sZCA9IDAuNixcbiAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciBjb21wYXJpc29ucyBzaG91bGQgYmUgY2FzZSBzZW5zaXRpdmUuXG4gICAgaXNDYXNlU2Vuc2l0aXZlID0gZmFsc2UsXG4gICAgLy8gV2hlbiB0cnVlLCB0aGUgYWxnb3JpdGhtIGNvbnRpbnVlcyBzZWFyY2hpbmcgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQgZXZlbiBpZiBhIHBlcmZlY3RcbiAgICAvLyBtYXRjaCBpcyBmb3VuZCBiZWZvcmUgdGhlIGVuZCBvZiB0aGUgc2FtZSBpbnB1dC5cbiAgICBmaW5kQWxsTWF0Y2hlcyA9IGZhbHNlLFxuICAgIC8vIE1pbmltdW0gbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBtdXN0IGJlIG1hdGNoZWQgYmVmb3JlIGEgcmVzdWx0IGlzIGNvbnNpZGVyZWQgYSBtYXRjaFxuICAgIG1pbk1hdGNoQ2hhckxlbmd0aCA9IDEsXG5cbiAgICBpbmNsdWRlTWF0Y2hlcyA9IGZhbHNlXG4gIH0pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBsb2NhdGlvbixcbiAgICAgIGRpc3RhbmNlLFxuICAgICAgdGhyZXNob2xkLFxuICAgICAgaXNDYXNlU2Vuc2l0aXZlLFxuICAgICAgZmluZEFsbE1hdGNoZXMsXG4gICAgICBpbmNsdWRlTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aFxuICAgIH1cblxuICAgIGlmIChwYXR0ZXJuLmxlbmd0aCA+IE1BWF9CSVRTKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhdHRlcm4gbGVuZ3RoIGV4Y2VlZHMgbWF4IG9mICR7TUFYX0JJVFN9LmApO1xuICAgIH1cblxuICAgIHRoaXMucGF0dGVybiA9IGlzQ2FzZVNlbnNpdGl2ZSA/IHBhdHRlcm4gOiBwYXR0ZXJuLnRvTG93ZXJDYXNlKClcbiAgICB0aGlzLnBhdHRlcm5BbHBoYWJldCA9IHBhdHRlcm5BbHBoYWJldCh0aGlzLnBhdHRlcm4pXG4gIH1cblxuICBzZWFyY2hJbih2YWx1ZSkge1xuICAgIGxldCB0ZXh0ID0gdmFsdWUuJFxuXG4gICAgY29uc3QgeyBpc0Nhc2VTZW5zaXRpdmUsIGluY2x1ZGVNYXRjaGVzIH0gPSB0aGlzLm9wdGlvbnNcblxuICAgIGlmICghaXNDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpXG4gICAgfVxuXG4gICAgLy8gRXhhY3QgbWF0Y2hcbiAgICBpZiAodGhpcy5wYXR0ZXJuID09PSB0ZXh0KSB7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICBpc01hdGNoOiB0cnVlLFxuICAgICAgICBzY29yZTogMFxuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZU1hdGNoZXMpIHtcbiAgICAgICAgcmVzdWx0Lm1hdGNoZWRJbmRpY2VzID0gW1swLCB0ZXh0Lmxlbmd0aCAtIDFdXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCB1c2UgQml0YXAgYWxnb3JpdGhtXG4gICAgY29uc3QgeyBsb2NhdGlvbiwgZGlzdGFuY2UsIHRocmVzaG9sZCwgZmluZEFsbE1hdGNoZXMsIG1pbk1hdGNoQ2hhckxlbmd0aCB9ID0gdGhpcy5vcHRpb25zXG4gICAgcmV0dXJuIGJpdGFwU2VhcmNoKHRleHQsIHRoaXMucGF0dGVybiwgdGhpcy5wYXR0ZXJuQWxwaGFiZXQsIHtcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgZGlzdGFuY2UsXG4gICAgICB0aHJlc2hvbGQsXG4gICAgICBmaW5kQWxsTWF0Y2hlcyxcbiAgICAgIG1pbk1hdGNoQ2hhckxlbmd0aCxcbiAgICAgIGluY2x1ZGVNYXRjaGVzXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJpdGFwU2VhcmNoXG4iLCIvLyBUb2tlbjogJ2ZpbGVcbi8vIE1hdGNoIHR5cGU6IGV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBpbmNsdWRlIGBmaWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09IFwiJ1wiXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigxKVxuXG5jb25zdCBtYXRjaCA9IChwYXR0ZXJuLCB0ZXh0KSA9PiB7XG4gIGNvbnN0IHNhbml0aXplZFBhdHRlcm4gPSBzYW5pdGl6ZShwYXR0ZXJuKVxuICBjb25zdCBpbmRleCA9IHRleHQuaW5kZXhPZihzYW5pdGl6ZWRQYXR0ZXJuKVxuICBjb25zdCBpc01hdGNoID0gaW5kZXggPiAtMVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMCxcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCJjb25zdCBleGFjdE1hdGNoID0gcmVxdWlyZSgnLi9leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlRXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1leGFjdC1tYXRjaCcpXG5jb25zdCBwcmVmaXhFeGFjdE1hdGNoID0gcmVxdWlyZSgnLi9wcmVmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgaW52ZXJzZVByZWZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL2ludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoJylcbmNvbnN0IHN1ZmZpeEV4YWN0TWF0Y2ggPSByZXF1aXJlKCcuL3N1ZmZpeC1leGFjdC1tYXRjaCcpXG5jb25zdCBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaCA9IHJlcXVpcmUoJy4vaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2gnKVxuY29uc3QgQml0YXBTZWFyY2ggPSByZXF1aXJlKCcuLi9iaXRhcC1zZWFyY2gnKVxuXG5jb25zdCB7IGlzU3RyaW5nIH0gPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG4vLyBSZXR1cm4gYSAyRCBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcXVlcnksIGZvciBzaW1wbGVyIHBhcnNpbmcuXG4vLyBFeGFtcGxlOlxuLy8gXCJeY29yZSBnbyQgfCByYiQgfCBweSQgeHkkXCIgPT4gW1tcIl5jb3JlXCIsIFwiZ28kXCJdLCBbXCJyYiRcIl0sIFtcInB5JFwiLCBcInh5JFwiXV1cbmNvbnN0IHF1ZXJ5ZnkgPSAocGF0dGVybikgPT4gcGF0dGVybi5zcGxpdCgnfCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpLnNwbGl0KC8gKy9nKSlcblxuLyoqXG4gKiBDb21tYW5kLWxpa2Ugc2VhcmNoaW5nXG4gKiA9PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogR2l2ZW4gbXVsdGlwbGUgc2VhcmNoIHRlcm1zIGRlbGltaXRlZCBieSBzcGFjZXMuZS5nLiBgXmpzY3JpcHQgLnB5dGhvbiQgcnVieSAhamF2YWAsXG4gKiBzZWFyY2ggaW4gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIFNlYXJjaCBzeW50YXg6XG4gKlxuICogfCBUb2tlbiAgICAgICB8IE1hdGNoIHR5cGUgICAgICAgICAgICAgICAgIHwgRGVzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAtLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBganNjcmlwdGAgICB8IGZ1enp5LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBtYXRjaCBganNjcmlwdGAgICAgICAgICAgICAgfFxuICogfCBgJ3B5dGhvbmAgICB8IGV4YWN0LW1hdGNoICAgICAgICAgICAgICAgIHwgSXRlbXMgdGhhdCBpbmNsdWRlIGBweXRob25gICAgICAgICAgICAgfFxuICogfCBgIXJ1YnlgICAgICB8IGludmVyc2UtZXhhY3QtbWF0Y2ggICAgICAgIHwgSXRlbXMgdGhhdCBkbyBub3QgaW5jbHVkZSBgcnVieWAgICAgICAgfFxuICogfCBgXmphdmFgICAgICB8IHByZWZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBqYXZhYCAgICAgICAgICAgfFxuICogfCBgIV5lYXJsYW5nYCB8IGludmVyc2UtcHJlZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3Qgc3RhcnQgd2l0aCBgZWFybGFuZ2AgfFxuICogfCBgLmpzJGAgICAgICB8IHN1ZmZpeC1leGFjdC1tYXRjaCAgICAgICAgIHwgSXRlbXMgdGhhdCBlbmQgd2l0aCBgLmpzYCAgICAgICAgICAgICAgfFxuICogfCBgIS5nbyRgICAgICB8IGludmVyc2Utc3VmZml4LWV4YWN0LW1hdGNoIHwgSXRlbXMgdGhhdCBkbyBub3QgZW5kIHdpdGggYC5nb2AgICAgICAgfFxuICpcbiAqIEEgc2luZ2xlIHBpcGUgY2hhcmFjdGVyIGFjdHMgYXMgYW4gT1Igb3BlcmF0b3IuIEZvciBleGFtcGxlLCB0aGUgZm9sbG93aW5nXG4gKiBxdWVyeSBtYXRjaGVzIGVudHJpZXMgdGhhdCBzdGFydCB3aXRoIGBjb3JlYCBhbmQgZW5kIHdpdGggZWl0aGVyYGdvYCwgYHJiYCxcbiAqIG9yYHB5YC5cbiAqXG4gKiBgYGBcbiAqIF5jb3JlIGdvJCB8IHJiJCB8IHB5JFxuICogYGBgXG4gKi9cbmNsYXNzIEV4dGVuZGVkU2VhcmNoIHtcbiAgY29uc3RydWN0b3IocGF0dGVybiwgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgaXNDYXNlU2Vuc2l0aXZlIH0gPSBvcHRpb25zXG4gICAgdGhpcy5xdWVyeSA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgLy8gQSA8cGF0dGVybj46PEJpdGFwU2VhcmNoPiBrZXktdmFsdWUgcGFpciBmb3Igb3B0aW1pemluZyBzZWFyY2hpbmdcbiAgICB0aGlzLl9mdXp6eUNhY2hlID0ge31cblxuICAgIGlmIChpc1N0cmluZyhwYXR0ZXJuKSAmJiBwYXR0ZXJuLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnBhdHRlcm4gPSBpc0Nhc2VTZW5zaXRpdmUgPyBwYXR0ZXJuIDogcGF0dGVybi50b0xvd2VyQ2FzZSgpXG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlmeSh0aGlzLnBhdHRlcm4pXG4gICAgfVxuICB9XG5cbiAgc2VhcmNoSW4odmFsdWUpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMucXVlcnlcblxuICAgIGlmICghdGhpcy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNNYXRjaDogZmFsc2UsXG4gICAgICAgIHNjb3JlOiAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRleHQgPSB2YWx1ZS4kXG5cbiAgICB0ZXh0ID0gdGhpcy5vcHRpb25zLmlzQ2FzZVNlbnNpdGl2ZSA/IHRleHQgOiB0ZXh0LnRvTG93ZXJDYXNlKClcblxuICAgIGxldCBtYXRjaEZvdW5kID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAwLCBxTGVuID0gcXVlcnkubGVuZ3RoOyBpIDwgcUxlbjsgaSArPSAxKSB7XG5cbiAgICAgIGNvbnN0IHBhcnRzID0gcXVlcnlbaV1cbiAgICAgIGxldCByZXN1bHQgPSBudWxsXG4gICAgICBtYXRjaEZvdW5kID0gdHJ1ZVxuXG4gICAgICBmb3IgKGxldCBqID0gMCwgcExlbiA9IHBhcnRzLmxlbmd0aDsgaiA8IHBMZW47IGogKz0gMSkge1xuICAgICAgICBsZXQgdG9rZW4gPSBwYXJ0c1tqXVxuICAgICAgICByZXN1bHQgPSB0aGlzLl9zZWFyY2godG9rZW4sIHRleHQpXG4gICAgICAgIGlmICghcmVzdWx0LmlzTWF0Y2gpIHtcbiAgICAgICAgICAvLyBBTkQgY29uZGl0aW9uLCBzaG9ydC1jaXJjdWl0IGFuZCBtb3ZlIG9uIHRvIG5leHQgcGFydFxuICAgICAgICAgIG1hdGNoRm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT1IgY29uZGl0aW9uLCBzbyBpZiBUUlVFLCByZXR1cm5cbiAgICAgIGlmIChtYXRjaEZvdW5kKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3RoaW5nIHdhcyBtYXRjaGVkXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzTWF0Y2g6IGZhbHNlLFxuICAgICAgc2NvcmU6IDFcbiAgICB9XG4gIH1cblxuICBfc2VhcmNoKHBhdHRlcm4sIHRleHQpIHtcbiAgICBpZiAoZXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBleGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChwcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIHByZWZpeEV4YWN0TWF0Y2gubWF0Y2gocGF0dGVybiwgdGV4dClcbiAgICB9IGVsc2UgaWYgKGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLmlzRm9yUGF0dGVybihwYXR0ZXJuKSkge1xuICAgICAgcmV0dXJuIGludmVyc2VQcmVmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlU3VmZml4RXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSBpZiAoc3VmZml4RXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBzdWZmaXhFeGFjdE1hdGNoLm1hdGNoKHBhdHRlcm4sIHRleHQpXG4gICAgfSBlbHNlIGlmIChpbnZlcnNlRXhhY3RNYXRjaC5pc0ZvclBhdHRlcm4ocGF0dGVybikpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlRXhhY3RNYXRjaC5tYXRjaChwYXR0ZXJuLCB0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VhcmNoZXIgPSB0aGlzLl9mdXp6eUNhY2hlW3BhdHRlcm5dXG4gICAgICBpZiAoIXNlYXJjaGVyKSB7XG4gICAgICAgIHNlYXJjaGVyID0gbmV3IEJpdGFwU2VhcmNoKHBhdHRlcm4sIHRoaXMub3B0aW9ucylcbiAgICAgICAgdGhpcy5fZnV6enlDYWNoZVtwYXR0ZXJuXSA9IHNlYXJjaGVyXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VhcmNoZXIuc2VhcmNoKHRleHQpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXh0ZW5kZWRTZWFyY2giLCIvLyBUb2tlbjogIWZpcmVcbi8vIE1hdGNoIHR5cGU6IGludmVyc2UtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGRvIG5vdCBpbmNsdWRlIGBmaXJlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICchJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuaW5kZXhPZihzYW5pdGl6ZWRQYXR0ZXJuKSA9PT0gLTFcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCIvLyBUb2tlbjogIV5maXJlXG4vLyBNYXRjaCB0eXBlOiBpbnZlcnNlLXByZWZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZG8gbm90IHN0YXJ0IHdpdGggYGZpcmVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnICYmIHBhdHRlcm4uY2hhckF0KDEpID09ICdeJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMilcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9ICF0ZXh0LnN0YXJ0c1dpdGgoc2FuaXRpemVkUGF0dGVybilcblxuICByZXR1cm4ge1xuICAgIGlzTWF0Y2gsXG4gICAgc2NvcmU6IDBcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNGb3JQYXR0ZXJuLFxuICBzYW5pdGl6ZSxcbiAgbWF0Y2hcbn0iLCIvLyBUb2tlbjogIS5maWxlJFxuLy8gTWF0Y2ggdHlwZTogaW52ZXJzZS1zdWZmaXgtZXhhY3QtbWF0Y2hcbi8vIERlc2NyaXB0aW9uOiBJdGVtcyB0aGF0IGRvIG5vdCBlbmQgd2l0aCBgLmZpbGVgXG5cbmNvbnN0IGlzRm9yUGF0dGVybiA9IHBhdHRlcm4gPT4gcGF0dGVybi5jaGFyQXQoMCkgPT0gJyEnICYmIHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgPT0gJyQnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cmluZygxLCBwYXR0ZXJuLmxlbmd0aCAtIDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSAhdGV4dC5lbmRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiBeZmlsZVxuLy8gTWF0Y2ggdHlwZTogcHJlZml4LWV4YWN0LW1hdGNoXG4vLyBEZXNjcmlwdGlvbjogSXRlbXMgdGhhdCBzdGFydCB3aXRoIGBmaWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KDApID09ICdeJ1xuXG5jb25zdCBzYW5pdGl6ZSA9IHBhdHRlcm4gPT4gcGF0dGVybi5zdWJzdHIoMSlcblxuY29uc3QgbWF0Y2ggPSAocGF0dGVybiwgdGV4dCkgPT4ge1xuICBjb25zdCBzYW5pdGl6ZWRQYXR0ZXJuID0gc2FuaXRpemUocGF0dGVybilcbiAgY29uc3QgaXNNYXRjaCA9IHRleHQuc3RhcnRzV2l0aChzYW5pdGl6ZWRQYXR0ZXJuKVxuXG4gIHJldHVybiB7XG4gICAgaXNNYXRjaCxcbiAgICBzY29yZTogMFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0ZvclBhdHRlcm4sXG4gIHNhbml0aXplLFxuICBtYXRjaFxufSIsIi8vIFRva2VuOiAuZmlsZSRcbi8vIE1hdGNoIHR5cGU6IHN1ZmZpeC1leGFjdC1tYXRjaFxuLy8gRGVzY3JpcHRpb246IEl0ZW1zIHRoYXQgZW5kIHdpdGggYC5maWxlYFxuXG5jb25zdCBpc0ZvclBhdHRlcm4gPSBwYXR0ZXJuID0+IHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgPT0gJyQnXG5cbmNvbnN0IHNhbml0aXplID0gcGF0dGVybiA9PiBwYXR0ZXJuLnN1YnN0cigwLCBwYXR0ZXJuLmxlbmd0aCAtIDEpXG5cbmNvbnN0IG1hdGNoID0gKHBhdHRlcm4sIHRleHQpID0+IHtcbiAgY29uc3Qgc2FuaXRpemVkUGF0dGVybiA9IHNhbml0aXplKHBhdHRlcm4pXG4gIGNvbnN0IGlzTWF0Y2ggPSB0ZXh0LmVuZHNXaXRoKHNhbml0aXplZFBhdHRlcm4pXG5cbiAgcmV0dXJuIHtcbiAgICBpc01hdGNoLFxuICAgIHNjb3JlOiAwXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzRm9yUGF0dGVybixcbiAgc2FuaXRpemUsXG4gIG1hdGNoXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJpdGFwU2VhcmNoOiByZXF1aXJlKCcuL2JpdGFwLXNlYXJjaCcpLFxuICBFeHRlbmRlZFNlYXJjaDogcmVxdWlyZSgnLi9leHRlbmRlZC1zZWFyY2gnKSxcbiAgTkdyYW1TZWFyY2g6IHJlcXVpcmUoJy4vbmdyYW0tc2VhcmNoJylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdW5pb246IHJlcXVpcmUoJy4vdW5pb24nKSxcbiAgaW50ZXJzZWN0aW9uOiByZXF1aXJlKCcuL2ludGVyc2VjdGlvbicpXG59IiwiLy8gQXNzdW1lcyBhcnJheXMgYXJlIHNvcnRlZFxubW9kdWxlLmV4cG9ydHMgPSAoYXJyMSwgYXJyMikgPT4ge1xuICBsZXQgcmVzdWx0ID0gW11cbiAgbGV0IGkgPSAwXG4gIGxldCBqID0gMFxuXG4gIHdoaWxlIChpIDwgYXJyMS5sZW5ndGggJiYgaiA8IGFycjIubGVuZ3RoKSB7XG4gICAgbGV0IGl0ZW0xID0gYXJyMVtpXVxuICAgIGxldCBpdGVtMiA9IGFycjJbal1cblxuICAgIGlmIChpdGVtMSA9PSBpdGVtMikge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTEpXG4gICAgICBpICs9IDFcbiAgICAgIGogKz0gMVxuICAgIH0gZWxzZSBpZiAoaXRlbTEgPCBpdGVtMikge1xuICAgICAgaSArPSAxXG4gICAgfSBlbHNlIGlmIChpdGVtMSA+IGl0ZW0yKSB7XG4gICAgICBqICs9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSIsIi8vIEFzc3VtZXMgYXJyYXlzIGFyZSBzb3J0ZWRcbm1vZHVsZS5leHBvcnRzID0gKGFycjEsIGFycjIpID0+IHtcbiAgbGV0IHJlc3VsdCA9IFtdXG4gIGxldCBpID0gMFxuICBsZXQgaiA9IDBcblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoICYmIGogPCBhcnIyLmxlbmd0aCkge1xuICAgIGxldCBpdGVtMSA9IGFycjFbaV1cbiAgICBsZXQgaXRlbTIgPSBhcnIyW2pdXG5cbiAgICBpZiAoaXRlbTEgPCBpdGVtMikge1xuICAgICAgcmVzdWx0LnB1c2goaXRlbTEpXG4gICAgICBpICs9IDFcbiAgICB9IGVsc2UgaWYgKGl0ZW0yIDwgaXRlbTEpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0yKVxuICAgICAgaiArPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0yKVxuICAgICAgaSArPSAxXG4gICAgICBqICs9IDFcbiAgICB9XG4gIH1cblxuICB3aGlsZSAoaSA8IGFycjEubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnB1c2goYXJyMVtpXSlcbiAgICBpICs9IDFcbiAgfVxuXG4gIHdoaWxlIChqIDwgYXJyMi5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaChhcnIyW2pdKVxuICAgIGogKz0gMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBqYWNjYXJkRGlzdGFuY2U6IHJlcXVpcmUoJy4vamFjY2FyZC1kaXN0YW5jZScpXG59IiwiY29uc3QgeyB1bmlvbiwgaW50ZXJzZWN0aW9uIH0gPSByZXF1aXJlKCcuLi9hcnJheS11dGlscycpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5HcmFtMSwgbkdyYW0yKSA9PiB7XG4gIGxldCBuR3JhbVVuaW9uID0gdW5pb24obkdyYW0xLCBuR3JhbTIpXG4gIGxldCBuR3JhbUludGVyc2VjdGlvbiA9IGludGVyc2VjdGlvbihuR3JhbTEsIG5HcmFtMilcblxuICByZXR1cm4gMSAtIG5HcmFtSW50ZXJzZWN0aW9uLmxlbmd0aCAvIG5HcmFtVW5pb24ubGVuZ3RoXG59IiwiY29uc3QgbmdyYW0gPSByZXF1aXJlKCcuL25ncmFtJylcbmNvbnN0IHsgamFjY2FyZERpc3RhbmNlIH0gPSByZXF1aXJlKCcuL2Rpc3RhbmNlJylcblxuY2xhc3MgTkdyYW1TZWFyY2gge1xuICBjb25zdHJ1Y3RvcihwYXR0ZXJuLCBvcHRpb25zID0geyB0aHJlc2hvbGQ6IDAuNiB9KSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBuZ3JhbSwgYW5kIHNvcnQgaXRcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5wYXR0ZXJuTmdyYW0gPSBuZ3JhbShwYXR0ZXJuLCB7IHNvcnQ6IHRydWUgfSlcbiAgfVxuICBzZWFyY2hJbih2YWx1ZSkge1xuICAgIGxldCB0ZXh0TmdyYW0gPSB2YWx1ZS5uZ1xuICAgIGlmICghdGV4dE5ncmFtKSB7XG4gICAgICB0ZXh0TmdyYW0gPSBuZ3JhbSh2YWx1ZS4kLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgIHZhbHVlLm5nID0gdGV4dE5ncmFtXG4gICAgfVxuXG4gICAgbGV0IGphY2FyZFJlc3VsdCA9IGphY2NhcmREaXN0YW5jZSh0aGlzLnBhdHRlcm5OZ3JhbSwgdGV4dE5ncmFtKVxuXG4gICAgY29uc3QgaXNNYXRjaCA9IGphY2FyZFJlc3VsdCA8IHRoaXMub3B0aW9ucy50aHJlc2hvbGRcblxuICAgIHJldHVybiB7XG4gICAgICBzY29yZTogaXNNYXRjaCA/IGphY2FyZFJlc3VsdCA6IDEsXG4gICAgICBpc01hdGNoXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTkdyYW1TZWFyY2giLCJjb25zdCBOR1JBTV9MRU4gPSAzXG5cbm1vZHVsZS5leHBvcnRzID0gKHRleHQsIHsgbiA9IE5HUkFNX0xFTiwgcGFkID0gdHJ1ZSwgc29ydCA9IGZhbHNlIH0pID0+IHtcbiAgbGV0IG5HcmFtcyA9IFtdXG5cbiAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG5HcmFtc1xuICB9XG5cbiAgdGV4dCA9IHRleHQudG9Mb3dlckNhc2UoKVxuICBpZiAocGFkKSB7XG4gICAgdGV4dCA9IGAgJHt0ZXh0fSBgXG4gIH1cblxuICBsZXQgaW5kZXggPSB0ZXh0Lmxlbmd0aCAtIG4gKyAxXG4gIGlmIChpbmRleCA8IDEpIHtcbiAgICByZXR1cm4gbkdyYW1zXG4gIH1cblxuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIG5HcmFtc1tpbmRleF0gPSB0ZXh0LnN1YnN0cihpbmRleCwgbilcbiAgfVxuXG4gIGlmIChzb3J0KSB7XG4gICAgbkdyYW1zLnNvcnQoKGEsIGIpID0+IGEgPT0gYiA/IDAgOiBhIDwgYiA/IC0xIDogMSlcbiAgfVxuXG4gIHJldHVybiBuR3JhbXNcbn0iLCJjb25zdCB7IGlzQXJyYXksIGlzRGVmaW5lZCwgaXNTdHJpbmcgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5jb25zdCBnZXQgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2dldCcpXG5jb25zdCBuZ3JhbSA9IHJlcXVpcmUoJy4uL3NlYXJjaC9uZ3JhbS1zZWFyY2gvbmdyYW0nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChrZXlzLCBsaXN0LCB7IGdldEZuID0gZ2V0LCBuZ3JhbXMgPSBmYWxzZSB9ID0ge30pID0+IHtcbiAgbGV0IGluZGV4ZWRMaXN0ID0gW11cblxuICAvLyBMaXN0IGlzIEFycmF5PFN0cmluZz5cbiAgaWYgKGlzU3RyaW5nKGxpc3RbMF0pKSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IHN0cmluZyBpbiB0aGUgbGlzdFxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGxpc3RbaV1cblxuICAgICAgaWYgKGlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgLy8gaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgLy8gICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGxldCByZWNvcmQgPSB7XG4gICAgICAgICAgJDogdmFsdWUsXG4gICAgICAgICAgaWR4OiBpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmdyYW1zKSB7XG4gICAgICAgICAgcmVjb3JkLm5nID0gbmdyYW0odmFsdWUsIHsgc29ydDogdHJ1ZSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXhlZExpc3QucHVzaChyZWNvcmQpXG4gICAgICB9XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgLy8gTGlzdCBpcyBBcnJheTxPYmplY3Q+XG4gICAgY29uc3Qga2V5c0xlbiA9IGtleXMubGVuZ3RoXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgbGV0IGl0ZW0gPSBsaXN0W2ldXG5cbiAgICAgIGxldCByZWNvcmQgPSB7IGlkeDogaSwgJDoge30gfVxuXG4gICAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkga2V5IChpLmUsIHBhdGgpLCBhbmQgZmV0Y2ggdGhlIHZhbHVlIGF0IHRoYXQga2V5XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleXNMZW47IGogKz0gMSkge1xuICAgICAgICBsZXQga2V5ID0ga2V5c1tqXVxuICAgICAgICBsZXQgdmFsdWUgPSBnZXRGbihpdGVtLCBrZXkpXG5cbiAgICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGxldCBzdWJSZWNvcmRzID0gW11cbiAgICAgICAgICBjb25zdCBzdGFjayA9IFt7IGFycmF5SW5kZXg6IC0xLCB2YWx1ZSB9XVxuXG4gICAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgeyBhcnJheUluZGV4LCB2YWx1ZSB9ID0gc3RhY2sucG9wKClcblxuICAgICAgICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcblxuICAgICAgICAgICAgICAvLyBpZiAoIWlzQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICAgICAgICAvLyAgIHYgPSB2LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgIGxldCBzdWJSZWNvcmQgPSB7ICQ6IHZhbHVlLCBpZHg6IGFycmF5SW5kZXggfVxuXG4gICAgICAgICAgICAgIGlmIChuZ3JhbXMpIHtcbiAgICAgICAgICAgICAgICBzdWJSZWNvcmQubmcgPSBuZ3JhbSh2YWx1ZSwgeyBzb3J0OiB0cnVlIH0pXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzdWJSZWNvcmRzLnB1c2goc3ViUmVjb3JkKVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwLCBhcnJMZW4gPSB2YWx1ZS5sZW5ndGg7IGsgPCBhcnJMZW47IGsgKz0gMSkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgYXJyYXlJbmRleDogayxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVtrXSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlY29yZC4kW2tleV0gPSBzdWJSZWNvcmRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaWYgKCFpc0Nhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgICAvLyAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIC8vIH1cblxuICAgICAgICAgIGxldCBzdWJSZWNvcmQgPSB7ICQ6IHZhbHVlIH1cblxuICAgICAgICAgIGlmIChuZ3JhbXMpIHtcbiAgICAgICAgICAgIHN1YlJlY29yZC5uZyA9IG5ncmFtKHZhbHVlLCB7IHNvcnQ6IHRydWUgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWNvcmQuJFtrZXldID0gc3ViUmVjb3JkXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5kZXhlZExpc3QucHVzaChyZWNvcmQpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZGV4ZWRMaXN0XG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZUluZGV4OiByZXF1aXJlKCcuL2NyZWF0ZS1pbmRleCcpLFxuICBLZXlTdG9yZTogcmVxdWlyZSgnLi9rZXktc3RvcmUnKVxufSIsImNvbnN0IHsgaXNTdHJpbmcgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdHlwZS1jaGVja2VycycpXG5cbmNsYXNzIEtleVN0b3JlIHtcbiAgY29uc3RydWN0b3Ioa2V5cykge1xuICAgIHRoaXMuX2tleXMgPSB7fVxuICAgIHRoaXMuX2tleU5hbWVzID0gW11cbiAgICB0aGlzLl9sZW5ndGggPSBrZXlzLmxlbmd0aFxuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IGtleVxuICAgIGlmIChrZXlzLmxlbmd0aCAmJiBpc1N0cmluZyhrZXlzWzBdKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldXG4gICAgICAgIHRoaXMuX2tleXNba2V5XSA9IHtcbiAgICAgICAgICB3ZWlnaHQ6IDFcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9rZXlOYW1lcy5wdXNoKGtleSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHRvdGFsV2VpZ2h0ID0gMFxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cblxuICAgICAgICBpZiAoIWtleS5oYXNPd25Qcm9wZXJ0eSgnbmFtZScpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIFwibmFtZVwiIHByb3BlcnR5IGluIGtleSBvYmplY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qga2V5TmFtZSA9IGtleS5uYW1lXG4gICAgICAgIHRoaXMuX2tleU5hbWVzLnB1c2goa2V5TmFtZSlcblxuICAgICAgICBpZiAoIWtleS5oYXNPd25Qcm9wZXJ0eSgnd2VpZ2h0JykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgXCJ3ZWlnaHRcIiBwcm9wZXJ0eSBpbiBrZXkgb2JqZWN0JylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHdlaWdodCA9IGtleS53ZWlnaHRcblxuICAgICAgICBpZiAod2VpZ2h0IDw9IDAgfHwgd2VpZ2h0ID49IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wid2VpZ2h0XCIgcHJvcGVydHkgaW4ga2V5IG11c3QgYmVpbiB0aGUgcmFuZ2Ugb2YgKDAsIDEpJylcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2tleXNba2V5TmFtZV0gPSB7XG4gICAgICAgICAgd2VpZ2h0XG4gICAgICAgIH1cblxuICAgICAgICB0b3RhbFdlaWdodCArPSB3ZWlnaHRcbiAgICAgIH1cblxuICAgICAgLy8gTm9ybWFsaXplIHdlaWdodHMgc28gdGhhdCB0aGVpciBzdW0gaXMgZXF1YWwgdG8gMVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBrZXlOYW1lID0gdGhpcy5fa2V5TmFtZXNbaV1cbiAgICAgICAgY29uc3Qga2V5V2VpZ2h0ID0gdGhpcy5fa2V5c1trZXlOYW1lXS53ZWlnaHRcbiAgICAgICAgdGhpcy5fa2V5c1trZXlOYW1lXS53ZWlnaHQgPSBrZXlXZWlnaHQgLyB0b3RhbFdlaWdodFxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQoa2V5LCBuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleXNba2V5XSA/IHRoaXMuX2tleXNba2V5XVtuYW1lXSA6IC0xXG4gIH1cbiAga2V5cygpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5TmFtZXNcbiAgfVxuICBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGVuZ3RoXG4gIH1cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLl9rZXlzKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5U3RvcmUiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJhbnNmb3JtTWF0Y2hlczogcmVxdWlyZSgnLi90cmFuc2Zvcm0tbWF0Y2hlcycpLFxuICB0cmFuc2Zvcm1TY29yZTogcmVxdWlyZSgnLi90cmFuc2Zvcm0tc2NvcmUnKVxufSIsImNvbnN0IHsgaXNBcnJheSwgaXNEZWZpbmVkLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzT2JqZWN0IH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3R5cGUtY2hlY2tlcnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXN1bHQsIGRhdGEpID0+IHtcbiAgY29uc3QgbWF0Y2hlcyA9IHJlc3VsdC5tYXRjaGVzXG4gIGRhdGEubWF0Y2hlcyA9IFtdXG5cbiAgaWYgKCFpc0RlZmluZWQobWF0Y2hlcykpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgbGV0IG1hdGNoID0gbWF0Y2hlc1tpXVxuXG4gICAgaWYgKCFpc0RlZmluZWQobWF0Y2guaW5kaWNlcykgfHwgbWF0Y2guaW5kaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgbGV0IG9iaiA9IHtcbiAgICAgIGluZGljZXM6IG1hdGNoLmluZGljZXMsXG4gICAgICB2YWx1ZTogbWF0Y2gudmFsdWVcbiAgICB9XG5cbiAgICBpZiAobWF0Y2gua2V5KSB7XG4gICAgICBvYmoua2V5ID0gbWF0Y2gua2V5XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoLmlkeCA+IC0xKSB7XG4gICAgICBvYmoucmVmSW5kZXggPSBtYXRjaC5pZHhcbiAgICB9XG5cbiAgICBkYXRhLm1hdGNoZXMucHVzaChvYmopXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKHJlc3VsdCwgZGF0YSkgPT4ge1xuICBkYXRhLnNjb3JlID0gcmVzdWx0LnNjb3JlXG59Il0sInNvdXJjZVJvb3QiOiIifQ==