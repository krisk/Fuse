/*!
 * Fuse.js v3.3.1 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
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
})(window, function() {
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

/***/ "./src/bitap/bitap_matched_indices.js":
/*!********************************************!*\
  !*** ./src/bitap/bitap_matched_indices.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function () {\n  var matchmask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n  var minMatchCharLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;\n\n  var matchedIndices = [];\n  var start = -1;\n  var end = -1;\n  var i = 0;\n\n  for (var len = matchmask.length; i < len; i += 1) {\n    var match = matchmask[i];\n    if (match && start === -1) {\n      start = i;\n    } else if (!match && start !== -1) {\n      end = i - 1;\n      if (end - start + 1 >= minMatchCharLength) {\n        matchedIndices.push([start, end]);\n      }\n      start = -1;\n    }\n  }\n\n  // (i-1 - start) + 1 => i - start\n  if (matchmask[i - 1] && i - start >= minMatchCharLength) {\n    matchedIndices.push([start, i - 1]);\n  }\n\n  return matchedIndices;\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_matched_indices.js?");

/***/ }),

/***/ "./src/bitap/bitap_pattern_alphabet.js":
/*!*********************************************!*\
  !*** ./src/bitap/bitap_pattern_alphabet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (pattern) {\n  var mask = {};\n  var len = pattern.length;\n\n  for (var i = 0; i < len; i += 1) {\n    mask[pattern.charAt(i)] = 0;\n  }\n\n  for (var _i = 0; _i < len; _i += 1) {\n    mask[pattern.charAt(_i)] |= 1 << len - _i - 1;\n  }\n\n  return mask;\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_pattern_alphabet.js?");

/***/ }),

/***/ "./src/bitap/bitap_regex_search.js":
/*!*****************************************!*\
  !*** ./src/bitap/bitap_regex_search.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar SPECIAL_CHARS_REGEX = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g;\n\nmodule.exports = function (text, pattern) {\n  var tokenSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : / +/g;\n\n  var regex = new RegExp(pattern.replace(SPECIAL_CHARS_REGEX, '\\\\$&').replace(tokenSeparator, '|'));\n  var matches = text.match(regex);\n  var isMatch = !!matches;\n  var matchedIndices = [];\n\n  if (isMatch) {\n    for (var i = 0, matchesLen = matches.length; i < matchesLen; i += 1) {\n      var match = matches[i];\n      matchedIndices.push([text.indexOf(match), match.length - 1]);\n    }\n  }\n\n  return {\n    // TODO: revisit this score\n    score: isMatch ? 0.5 : 1,\n    isMatch: isMatch,\n    matchedIndices: matchedIndices\n  };\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_regex_search.js?");

/***/ }),

/***/ "./src/bitap/bitap_score.js":
/*!**********************************!*\
  !*** ./src/bitap/bitap_score.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (pattern, _ref) {\n  var _ref$errors = _ref.errors,\n      errors = _ref$errors === undefined ? 0 : _ref$errors,\n      _ref$currentLocation = _ref.currentLocation,\n      currentLocation = _ref$currentLocation === undefined ? 0 : _ref$currentLocation,\n      _ref$expectedLocation = _ref.expectedLocation,\n      expectedLocation = _ref$expectedLocation === undefined ? 0 : _ref$expectedLocation,\n      _ref$distance = _ref.distance,\n      distance = _ref$distance === undefined ? 100 : _ref$distance;\n\n  var accuracy = errors / pattern.length;\n  var proximity = Math.abs(expectedLocation - currentLocation);\n\n  if (!distance) {\n    // Dodge divide by zero error.\n    return proximity ? 1.0 : accuracy;\n  }\n\n  return accuracy + proximity / distance;\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_score.js?");

/***/ }),

/***/ "./src/bitap/bitap_search.js":
/*!***********************************!*\
  !*** ./src/bitap/bitap_search.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar bitapScore = __webpack_require__(/*! ./bitap_score */ \"./src/bitap/bitap_score.js\");\nvar matchedIndices = __webpack_require__(/*! ./bitap_matched_indices */ \"./src/bitap/bitap_matched_indices.js\");\n\nmodule.exports = function (text, pattern, patternAlphabet, _ref) {\n  var _ref$location = _ref.location,\n      location = _ref$location === undefined ? 0 : _ref$location,\n      _ref$distance = _ref.distance,\n      distance = _ref$distance === undefined ? 100 : _ref$distance,\n      _ref$threshold = _ref.threshold,\n      threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,\n      _ref$findAllMatches = _ref.findAllMatches,\n      findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,\n      _ref$minMatchCharLeng = _ref.minMatchCharLength,\n      minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng;\n\n  var expectedLocation = location;\n  // Set starting location at beginning text and initialize the alphabet.\n  var textLen = text.length;\n  // Highest score beyond which we give up.\n  var currentThreshold = threshold;\n  // Is there a nearby exact match? (speedup)\n  var bestLocation = text.indexOf(pattern, expectedLocation);\n\n  var patternLen = pattern.length;\n\n  // a mask of the matches\n  var matchMask = [];\n  for (var i = 0; i < textLen; i += 1) {\n    matchMask[i] = 0;\n  }\n\n  if (bestLocation !== -1) {\n    var score = bitapScore(pattern, {\n      errors: 0,\n      currentLocation: bestLocation,\n      expectedLocation: expectedLocation,\n      distance: distance\n    });\n    currentThreshold = Math.min(score, currentThreshold);\n\n    // What about in the other direction? (speed up)\n    bestLocation = text.lastIndexOf(pattern, expectedLocation + patternLen);\n\n    if (bestLocation !== -1) {\n      var _score = bitapScore(pattern, {\n        errors: 0,\n        currentLocation: bestLocation,\n        expectedLocation: expectedLocation,\n        distance: distance\n      });\n      currentThreshold = Math.min(_score, currentThreshold);\n    }\n  }\n\n  // Reset the best location\n  bestLocation = -1;\n\n  var lastBitArr = [];\n  var finalScore = 1;\n  var binMax = patternLen + textLen;\n\n  var mask = 1 << patternLen - 1;\n\n  for (var _i = 0; _i < patternLen; _i += 1) {\n    // Scan for the best match; each iteration allows for one more error.\n    // Run a binary search to determine how far from the match location we can stray\n    // at this error level.\n    var binMin = 0;\n    var binMid = binMax;\n\n    while (binMin < binMid) {\n      var _score3 = bitapScore(pattern, {\n        errors: _i,\n        currentLocation: expectedLocation + binMid,\n        expectedLocation: expectedLocation,\n        distance: distance\n      });\n\n      if (_score3 <= currentThreshold) {\n        binMin = binMid;\n      } else {\n        binMax = binMid;\n      }\n\n      binMid = Math.floor((binMax - binMin) / 2 + binMin);\n    }\n\n    // Use the result from this iteration as the maximum for the next.\n    binMax = binMid;\n\n    var start = Math.max(1, expectedLocation - binMid + 1);\n    var finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;\n\n    // Initialize the bit array\n    var bitArr = Array(finish + 2);\n\n    bitArr[finish + 1] = (1 << _i) - 1;\n\n    for (var j = finish; j >= start; j -= 1) {\n      var currentLocation = j - 1;\n      var charMatch = patternAlphabet[text.charAt(currentLocation)];\n\n      if (charMatch) {\n        matchMask[currentLocation] = 1;\n      }\n\n      // First pass: exact match\n      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;\n\n      // Subsequent passes: fuzzy match\n      if (_i !== 0) {\n        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];\n      }\n\n      if (bitArr[j] & mask) {\n        finalScore = bitapScore(pattern, {\n          errors: _i,\n          currentLocation: currentLocation,\n          expectedLocation: expectedLocation,\n          distance: distance\n        });\n\n        // This match will almost certainly be better than any existing match.\n        // But check anyway.\n        if (finalScore <= currentThreshold) {\n          // Indeed it is\n          currentThreshold = finalScore;\n          bestLocation = currentLocation;\n\n          // Already passed `loc`, downhill from here on in.\n          if (bestLocation <= expectedLocation) {\n            break;\n          }\n\n          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.\n          start = Math.max(1, 2 * expectedLocation - bestLocation);\n        }\n      }\n    }\n\n    // No hope for a (better) match at greater error levels.\n    var _score2 = bitapScore(pattern, {\n      errors: _i + 1,\n      currentLocation: expectedLocation,\n      expectedLocation: expectedLocation,\n      distance: distance\n    });\n\n    // console.log('score', score, finalScore)\n\n    if (_score2 > currentThreshold) {\n      break;\n    }\n\n    lastBitArr = bitArr;\n  }\n\n  // console.log('FINAL SCORE', finalScore)\n\n  // Count exact matches (those with a score of 0) to be \"almost\" exact\n  return {\n    isMatch: bestLocation >= 0,\n    score: finalScore === 0 ? 0.001 : finalScore,\n    matchedIndices: matchedIndices(matchMask, minMatchCharLength)\n  };\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_search.js?");

/***/ }),

/***/ "./src/bitap/index.js":
/*!****************************!*\
  !*** ./src/bitap/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar bitapRegexSearch = __webpack_require__(/*! ./bitap_regex_search */ \"./src/bitap/bitap_regex_search.js\");\nvar bitapSearch = __webpack_require__(/*! ./bitap_search */ \"./src/bitap/bitap_search.js\");\nvar patternAlphabet = __webpack_require__(/*! ./bitap_pattern_alphabet */ \"./src/bitap/bitap_pattern_alphabet.js\");\n\nvar Bitap = function () {\n  function Bitap(pattern, _ref) {\n    var _ref$location = _ref.location,\n        location = _ref$location === undefined ? 0 : _ref$location,\n        _ref$distance = _ref.distance,\n        distance = _ref$distance === undefined ? 100 : _ref$distance,\n        _ref$threshold = _ref.threshold,\n        threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,\n        _ref$maxPatternLength = _ref.maxPatternLength,\n        maxPatternLength = _ref$maxPatternLength === undefined ? 32 : _ref$maxPatternLength,\n        _ref$isCaseSensitive = _ref.isCaseSensitive,\n        isCaseSensitive = _ref$isCaseSensitive === undefined ? false : _ref$isCaseSensitive,\n        _ref$tokenSeparator = _ref.tokenSeparator,\n        tokenSeparator = _ref$tokenSeparator === undefined ? / +/g : _ref$tokenSeparator,\n        _ref$findAllMatches = _ref.findAllMatches,\n        findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,\n        _ref$minMatchCharLeng = _ref.minMatchCharLength,\n        minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng;\n\n    _classCallCheck(this, Bitap);\n\n    this.options = {\n      location: location,\n      distance: distance,\n      threshold: threshold,\n      maxPatternLength: maxPatternLength,\n      isCaseSensitive: isCaseSensitive,\n      tokenSeparator: tokenSeparator,\n      findAllMatches: findAllMatches,\n      minMatchCharLength: minMatchCharLength\n    };\n\n    this.pattern = this.options.isCaseSensitive ? pattern : pattern.toLowerCase();\n\n    if (this.pattern.length <= maxPatternLength) {\n      this.patternAlphabet = patternAlphabet(this.pattern);\n    }\n  }\n\n  _createClass(Bitap, [{\n    key: 'search',\n    value: function search(text) {\n      if (!this.options.isCaseSensitive) {\n        text = text.toLowerCase();\n      }\n\n      // Exact match\n      if (this.pattern === text) {\n        return {\n          isMatch: true,\n          score: 0,\n          matchedIndices: [[0, text.length - 1]]\n        };\n      }\n\n      // When pattern length is greater than the machine word length, just do a a regex comparison\n      var _options = this.options,\n          maxPatternLength = _options.maxPatternLength,\n          tokenSeparator = _options.tokenSeparator;\n\n      if (this.pattern.length > maxPatternLength) {\n        return bitapRegexSearch(text, this.pattern, tokenSeparator);\n      }\n\n      // Otherwise, use Bitap algorithm\n      var _options2 = this.options,\n          location = _options2.location,\n          distance = _options2.distance,\n          threshold = _options2.threshold,\n          findAllMatches = _options2.findAllMatches,\n          minMatchCharLength = _options2.minMatchCharLength;\n\n      return bitapSearch(text, this.pattern, this.patternAlphabet, {\n        location: location,\n        distance: distance,\n        threshold: threshold,\n        findAllMatches: findAllMatches,\n        minMatchCharLength: minMatchCharLength\n      });\n    }\n  }]);\n\n  return Bitap;\n}();\n\n// let x = new Bitap(\"od mn war\", {})\n// let result = x.search(\"Old Man's War\")\n// console.log(result)\n\nmodule.exports = Bitap;\n\n//# sourceURL=webpack://Fuse/./src/bitap/index.js?");

/***/ }),

/***/ "./src/helpers/deep_value.js":
/*!***********************************!*\
  !*** ./src/helpers/deep_value.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isArray = __webpack_require__(/*! ./is_array */ \"./src/helpers/is_array.js\");\n\nvar deepValue = function deepValue(obj, path, list) {\n  if (!path) {\n    // If there's no path left, we've gotten to the object we care about.\n    list.push(obj);\n  } else {\n    var dotIndex = path.indexOf('.');\n    var firstSegment = path;\n    var remaining = null;\n\n    if (dotIndex !== -1) {\n      firstSegment = path.slice(0, dotIndex);\n      remaining = path.slice(dotIndex + 1);\n    }\n\n    var value = obj[firstSegment];\n\n    if (value !== null && value !== undefined) {\n      if (!remaining && (typeof value === 'string' || typeof value === 'number')) {\n        list.push(value.toString());\n      } else if (isArray(value)) {\n        // Search each item in the array.\n        for (var i = 0, len = value.length; i < len; i += 1) {\n          deepValue(value[i], remaining, list);\n        }\n      } else if (remaining) {\n        // An object. Recurse further.\n        deepValue(value, remaining, list);\n      }\n    }\n  }\n\n  return list;\n};\n\nmodule.exports = function (obj, path) {\n  return deepValue(obj, path, []);\n};\n\n//# sourceURL=webpack://Fuse/./src/helpers/deep_value.js?");

/***/ }),

/***/ "./src/helpers/is_array.js":
/*!*********************************!*\
  !*** ./src/helpers/is_array.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (obj) {\n  return !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj);\n};\n\n//# sourceURL=webpack://Fuse/./src/helpers/is_array.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Bitap = __webpack_require__(/*! ./bitap */ \"./src/bitap/index.js\");\nvar deepValue = __webpack_require__(/*! ./helpers/deep_value */ \"./src/helpers/deep_value.js\");\nvar isArray = __webpack_require__(/*! ./helpers/is_array */ \"./src/helpers/is_array.js\");\n\nvar Fuse = function () {\n  function Fuse(list, _ref) {\n    var _ref$location = _ref.location,\n        location = _ref$location === undefined ? 0 : _ref$location,\n        _ref$distance = _ref.distance,\n        distance = _ref$distance === undefined ? 100 : _ref$distance,\n        _ref$threshold = _ref.threshold,\n        threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,\n        _ref$maxPatternLength = _ref.maxPatternLength,\n        maxPatternLength = _ref$maxPatternLength === undefined ? 32 : _ref$maxPatternLength,\n        _ref$caseSensitive = _ref.caseSensitive,\n        caseSensitive = _ref$caseSensitive === undefined ? false : _ref$caseSensitive,\n        _ref$tokenSeparator = _ref.tokenSeparator,\n        tokenSeparator = _ref$tokenSeparator === undefined ? / +/g : _ref$tokenSeparator,\n        _ref$findAllMatches = _ref.findAllMatches,\n        findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,\n        _ref$minMatchCharLeng = _ref.minMatchCharLength,\n        minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng,\n        _ref$id = _ref.id,\n        id = _ref$id === undefined ? null : _ref$id,\n        _ref$keys = _ref.keys,\n        keys = _ref$keys === undefined ? [] : _ref$keys,\n        _ref$shouldSort = _ref.shouldSort,\n        shouldSort = _ref$shouldSort === undefined ? true : _ref$shouldSort,\n        _ref$getFn = _ref.getFn,\n        getFn = _ref$getFn === undefined ? deepValue : _ref$getFn,\n        _ref$sortFn = _ref.sortFn,\n        sortFn = _ref$sortFn === undefined ? function (a, b) {\n      return a.score - b.score;\n    } : _ref$sortFn,\n        _ref$tokenize = _ref.tokenize,\n        tokenize = _ref$tokenize === undefined ? false : _ref$tokenize,\n        _ref$matchAllTokens = _ref.matchAllTokens,\n        matchAllTokens = _ref$matchAllTokens === undefined ? false : _ref$matchAllTokens,\n        _ref$includeMatches = _ref.includeMatches,\n        includeMatches = _ref$includeMatches === undefined ? false : _ref$includeMatches,\n        _ref$includeScore = _ref.includeScore,\n        includeScore = _ref$includeScore === undefined ? false : _ref$includeScore,\n        _ref$verbose = _ref.verbose,\n        verbose = _ref$verbose === undefined ? false : _ref$verbose;\n\n    _classCallCheck(this, Fuse);\n\n    this.options = {\n      location: location,\n      distance: distance,\n      threshold: threshold,\n      maxPatternLength: maxPatternLength,\n      isCaseSensitive: caseSensitive,\n      tokenSeparator: tokenSeparator,\n      findAllMatches: findAllMatches,\n      minMatchCharLength: minMatchCharLength,\n      id: id,\n      keys: keys,\n      includeMatches: includeMatches,\n      includeScore: includeScore,\n      shouldSort: shouldSort,\n      getFn: getFn,\n      sortFn: sortFn,\n      verbose: verbose,\n      tokenize: tokenize,\n      matchAllTokens: matchAllTokens\n    };\n\n    this.setCollection(list);\n  }\n\n  _createClass(Fuse, [{\n    key: 'setCollection',\n    value: function setCollection(list) {\n      this.list = list;\n      return list;\n    }\n  }, {\n    key: 'search',\n    value: function search(pattern) {\n      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { limit: false };\n\n      this._log('---------\\nSearch pattern: \"' + pattern + '\"');\n\n      var _prepareSearchers2 = this._prepareSearchers(pattern),\n          tokenSearchers = _prepareSearchers2.tokenSearchers,\n          fullSearcher = _prepareSearchers2.fullSearcher;\n\n      var _search2 = this._search(tokenSearchers, fullSearcher),\n          weights = _search2.weights,\n          results = _search2.results;\n\n      this._computeScore(weights, results);\n\n      if (this.options.shouldSort) {\n        this._sort(results);\n      }\n\n      if (opts.limit && typeof opts.limit === 'number') {\n        results = results.slice(0, opts.limit);\n      }\n\n      return this._format(results);\n    }\n  }, {\n    key: '_prepareSearchers',\n    value: function _prepareSearchers() {\n      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';\n\n      var tokenSearchers = [];\n\n      if (this.options.tokenize) {\n        // Tokenize on the separator\n        var tokens = pattern.split(this.options.tokenSeparator);\n        for (var i = 0, len = tokens.length; i < len; i += 1) {\n          tokenSearchers.push(new Bitap(tokens[i], this.options));\n        }\n      }\n\n      var fullSearcher = new Bitap(pattern, this.options);\n\n      return { tokenSearchers: tokenSearchers, fullSearcher: fullSearcher };\n    }\n  }, {\n    key: '_search',\n    value: function _search() {\n      var tokenSearchers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n      var fullSearcher = arguments[1];\n\n      var list = this.list;\n      var resultMap = {};\n      var results = [];\n\n      // Check the first item in the list, if it's a string, then we assume\n      // that every item in the list is also a string, and thus it's a flattened array.\n      if (typeof list[0] === 'string') {\n        // Iterate over every item\n        for (var i = 0, len = list.length; i < len; i += 1) {\n          this._analyze({\n            key: '',\n            value: list[i],\n            record: i,\n            index: i\n          }, {\n            resultMap: resultMap,\n            results: results,\n            tokenSearchers: tokenSearchers,\n            fullSearcher: fullSearcher\n          });\n        }\n\n        return { weights: null, results: results };\n      }\n\n      // Otherwise, the first item is an Object (hopefully), and thus the searching\n      // is done on the values of the keys of each item.\n      var weights = {};\n      for (var _i = 0, _len = list.length; _i < _len; _i += 1) {\n        var item = list[_i];\n        // Iterate over every key\n        for (var j = 0, keysLen = this.options.keys.length; j < keysLen; j += 1) {\n          var key = this.options.keys[j];\n          if (typeof key !== 'string') {\n            weights[key.name] = {\n              weight: 1 - key.weight || 1\n            };\n            if (key.weight <= 0 || key.weight > 1) {\n              throw new Error('Key weight has to be > 0 and <= 1');\n            }\n            key = key.name;\n          } else {\n            weights[key] = {\n              weight: 1\n            };\n          }\n\n          this._analyze({\n            key: key,\n            value: this.options.getFn(item, key),\n            record: item,\n            index: _i\n          }, {\n            resultMap: resultMap,\n            results: results,\n            tokenSearchers: tokenSearchers,\n            fullSearcher: fullSearcher\n          });\n        }\n      }\n\n      return { weights: weights, results: results };\n    }\n  }, {\n    key: '_analyze',\n    value: function _analyze(_ref2, _ref3) {\n      var key = _ref2.key,\n          _ref2$arrayIndex = _ref2.arrayIndex,\n          arrayIndex = _ref2$arrayIndex === undefined ? -1 : _ref2$arrayIndex,\n          value = _ref2.value,\n          record = _ref2.record,\n          index = _ref2.index;\n      var _ref3$tokenSearchers = _ref3.tokenSearchers,\n          tokenSearchers = _ref3$tokenSearchers === undefined ? [] : _ref3$tokenSearchers,\n          _ref3$fullSearcher = _ref3.fullSearcher,\n          fullSearcher = _ref3$fullSearcher === undefined ? [] : _ref3$fullSearcher,\n          _ref3$resultMap = _ref3.resultMap,\n          resultMap = _ref3$resultMap === undefined ? {} : _ref3$resultMap,\n          _ref3$results = _ref3.results,\n          results = _ref3$results === undefined ? [] : _ref3$results;\n\n      // Check if the texvaluet can be searched\n      if (value === undefined || value === null) {\n        return;\n      }\n\n      var exists = false;\n      var averageScore = -1;\n      var numTextMatches = 0;\n\n      if (typeof value === 'string') {\n        this._log('\\nKey: ' + (key === '' ? '-' : key));\n\n        var mainSearchResult = fullSearcher.search(value);\n        this._log('Full text: \"' + value + '\", score: ' + mainSearchResult.score);\n\n        if (this.options.tokenize) {\n          var words = value.split(this.options.tokenSeparator);\n          var scores = [];\n\n          for (var i = 0; i < tokenSearchers.length; i += 1) {\n            var tokenSearcher = tokenSearchers[i];\n\n            this._log('\\nPattern: \"' + tokenSearcher.pattern + '\"');\n\n            // let tokenScores = []\n            var hasMatchInText = false;\n\n            for (var j = 0; j < words.length; j += 1) {\n              var word = words[j];\n              var tokenSearchResult = tokenSearcher.search(word);\n              var obj = {};\n              if (tokenSearchResult.isMatch) {\n                obj[word] = tokenSearchResult.score;\n                exists = true;\n                hasMatchInText = true;\n                scores.push(tokenSearchResult.score);\n              } else {\n                obj[word] = 1;\n                if (!this.options.matchAllTokens) {\n                  scores.push(1);\n                }\n              }\n              this._log('Token: \"' + word + '\", score: ' + obj[word]);\n              // tokenScores.push(obj)\n            }\n\n            if (hasMatchInText) {\n              numTextMatches += 1;\n            }\n          }\n\n          averageScore = scores[0];\n          var scoresLen = scores.length;\n          for (var _i2 = 1; _i2 < scoresLen; _i2 += 1) {\n            averageScore += scores[_i2];\n          }\n          averageScore = averageScore / scoresLen;\n\n          this._log('Token score average:', averageScore);\n        }\n\n        var finalScore = mainSearchResult.score;\n        if (averageScore > -1) {\n          finalScore = (finalScore + averageScore) / 2;\n        }\n\n        this._log('Score average:', finalScore);\n\n        var checkTextMatches = this.options.tokenize && this.options.matchAllTokens ? numTextMatches >= tokenSearchers.length : true;\n\n        this._log('\\nCheck Matches: ' + checkTextMatches);\n\n        // If a match is found, add the item to <rawResults>, including its score\n        if ((exists || mainSearchResult.isMatch) && checkTextMatches) {\n          // Check if the item already exists in our results\n          var existingResult = resultMap[index];\n          if (existingResult) {\n            // Use the lowest score\n            // existingResult.score, bitapResult.score\n            existingResult.output.push({\n              key: key,\n              arrayIndex: arrayIndex,\n              value: value,\n              score: finalScore,\n              matchedIndices: mainSearchResult.matchedIndices\n            });\n          } else {\n            // Add it to the raw result list\n            resultMap[index] = {\n              item: record,\n              output: [{\n                key: key,\n                arrayIndex: arrayIndex,\n                value: value,\n                score: finalScore,\n                matchedIndices: mainSearchResult.matchedIndices\n              }]\n            };\n\n            results.push(resultMap[index]);\n          }\n        }\n      } else if (isArray(value)) {\n        for (var _i3 = 0, len = value.length; _i3 < len; _i3 += 1) {\n          this._analyze({\n            key: key,\n            arrayIndex: _i3,\n            value: value[_i3],\n            record: record,\n            index: index\n          }, {\n            resultMap: resultMap,\n            results: results,\n            tokenSearchers: tokenSearchers,\n            fullSearcher: fullSearcher\n          });\n        }\n      }\n    }\n  }, {\n    key: '_computeScore',\n    value: function _computeScore(weights, results) {\n      this._log('\\n\\nComputing score:\\n');\n\n      for (var i = 0, len = results.length; i < len; i += 1) {\n        var output = results[i].output;\n        var scoreLen = output.length;\n\n        var currScore = 1;\n        var bestScore = 1;\n\n        for (var j = 0; j < scoreLen; j += 1) {\n          var weight = weights ? weights[output[j].key].weight : 1;\n          var score = weight === 1 ? output[j].score : output[j].score || 0.001;\n          var nScore = score * weight;\n\n          if (weight !== 1) {\n            bestScore = Math.min(bestScore, nScore);\n          } else {\n            output[j].nScore = nScore;\n            currScore *= nScore;\n          }\n        }\n\n        results[i].score = bestScore === 1 ? currScore : bestScore;\n\n        this._log(results[i]);\n      }\n    }\n  }, {\n    key: '_sort',\n    value: function _sort(results) {\n      this._log('\\n\\nSorting....');\n      results.sort(this.options.sortFn);\n    }\n  }, {\n    key: '_format',\n    value: function _format(results) {\n      var finalOutput = [];\n\n      if (this.options.verbose) {\n        var cache = [];\n        this._log('\\n\\nOutput:\\n\\n', JSON.stringify(results, function (key, value) {\n          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {\n            if (cache.indexOf(value) !== -1) {\n              // Circular reference found, discard key\n              return;\n            }\n            // Store value in our collection\n            cache.push(value);\n          }\n          return value;\n        }));\n        cache = null;\n      }\n\n      var transformers = [];\n\n      if (this.options.includeMatches) {\n        transformers.push(function (result, data) {\n          var output = result.output;\n          data.matches = [];\n\n          for (var i = 0, len = output.length; i < len; i += 1) {\n            var item = output[i];\n\n            if (item.matchedIndices.length === 0) {\n              continue;\n            }\n\n            var obj = {\n              indices: item.matchedIndices,\n              value: item.value\n            };\n            if (item.key) {\n              obj.key = item.key;\n            }\n            if (item.hasOwnProperty('arrayIndex') && item.arrayIndex > -1) {\n              obj.arrayIndex = item.arrayIndex;\n            }\n            data.matches.push(obj);\n          }\n        });\n      }\n\n      if (this.options.includeScore) {\n        transformers.push(function (result, data) {\n          data.score = result.score;\n        });\n      }\n\n      for (var i = 0, len = results.length; i < len; i += 1) {\n        var result = results[i];\n\n        if (this.options.id) {\n          result.item = this.options.getFn(result.item, this.options.id)[0];\n        }\n\n        if (!transformers.length) {\n          finalOutput.push(result.item);\n          continue;\n        }\n\n        var data = {\n          item: result.item\n        };\n\n        for (var j = 0, _len2 = transformers.length; j < _len2; j += 1) {\n          transformers[j](result, data);\n        }\n\n        finalOutput.push(data);\n      }\n\n      return finalOutput;\n    }\n  }, {\n    key: '_log',\n    value: function _log() {\n      if (this.options.verbose) {\n        var _console;\n\n        (_console = console).log.apply(_console, arguments);\n      }\n    }\n  }]);\n\n  return Fuse;\n}();\n\nmodule.exports = Fuse;\n\n//# sourceURL=webpack://Fuse/./src/index.js?");

/***/ })

/******/ });
});