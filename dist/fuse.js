/*!
 * Fuse.js v3.4.0 - Lightweight fuzzy-search (http://fusejs.io)
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

/***/ "./src/bitap/bitap_matched_indices.js":
/*!********************************************!*\
  !*** ./src/bitap/bitap_matched_indices.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = (matchmask = [], minMatchCharLength = 1) => {\n  let matchedIndices = [];\n  let start = -1;\n  let end = -1;\n  let i = 0;\n\n  for (let len = matchmask.length; i < len; i += 1) {\n    let match = matchmask[i];\n\n    if (match && start === -1) {\n      start = i;\n    } else if (!match && start !== -1) {\n      end = i - 1;\n\n      if (end - start + 1 >= minMatchCharLength) {\n        matchedIndices.push([start, end]);\n      }\n\n      start = -1;\n    }\n  } // (i-1 - start) + 1 => i - start\n\n\n  if (matchmask[i - 1] && i - start >= minMatchCharLength) {\n    matchedIndices.push([start, i - 1]);\n  }\n\n  return matchedIndices;\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_matched_indices.js?");

/***/ }),

/***/ "./src/bitap/bitap_pattern_alphabet.js":
/*!*********************************************!*\
  !*** ./src/bitap/bitap_pattern_alphabet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = pattern => {\n  let mask = {};\n  let len = pattern.length;\n\n  for (let i = 0; i < len; i += 1) {\n    mask[pattern.charAt(i)] = 0;\n  }\n\n  for (let i = 0; i < len; i += 1) {\n    mask[pattern.charAt(i)] |= 1 << len - i - 1;\n  }\n\n  return mask;\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_pattern_alphabet.js?");

/***/ }),

/***/ "./src/bitap/bitap_regex_search.js":
/*!*****************************************!*\
  !*** ./src/bitap/bitap_regex_search.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const SPECIAL_CHARS_REGEX = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g;\n\nmodule.exports = (text, pattern, tokenSeparator = / +/g) => {\n  let regex = new RegExp(pattern.replace(SPECIAL_CHARS_REGEX, '\\\\$&').replace(tokenSeparator, '|'));\n  let matches = text.match(regex);\n  let isMatch = !!matches;\n  let matchedIndices = [];\n\n  if (isMatch) {\n    for (let i = 0, matchesLen = matches.length; i < matchesLen; i += 1) {\n      let match = matches[i];\n      matchedIndices.push([text.indexOf(match), match.length - 1]);\n    }\n  }\n\n  return {\n    // TODO: revisit this score\n    score: isMatch ? 0.5 : 1,\n    isMatch,\n    matchedIndices\n  };\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_regex_search.js?");

/***/ }),

/***/ "./src/bitap/bitap_score.js":
/*!**********************************!*\
  !*** ./src/bitap/bitap_score.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = (pattern, {\n  errors = 0,\n  currentLocation = 0,\n  expectedLocation = 0,\n  distance = 100\n}) => {\n  const accuracy = errors / pattern.length;\n  const proximity = Math.abs(expectedLocation - currentLocation);\n\n  if (!distance) {\n    // Dodge divide by zero error.\n    return proximity ? 1.0 : accuracy;\n  }\n\n  return accuracy + proximity / distance;\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_score.js?");

/***/ }),

/***/ "./src/bitap/bitap_search.js":
/*!***********************************!*\
  !*** ./src/bitap/bitap_search.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const bitapScore = __webpack_require__(/*! ./bitap_score */ \"./src/bitap/bitap_score.js\");\n\nconst matchedIndices = __webpack_require__(/*! ./bitap_matched_indices */ \"./src/bitap/bitap_matched_indices.js\");\n\nmodule.exports = (text, pattern, patternAlphabet, {\n  location = 0,\n  distance = 100,\n  threshold = 0.6,\n  findAllMatches = false,\n  minMatchCharLength = 1\n}) => {\n  const expectedLocation = location; // Set starting location at beginning text and initialize the alphabet.\n\n  const textLen = text.length; // Highest score beyond which we give up.\n\n  let currentThreshold = threshold; // Is there a nearby exact match? (speedup)\n\n  let bestLocation = text.indexOf(pattern, expectedLocation);\n  const patternLen = pattern.length; // a mask of the matches\n\n  const matchMask = [];\n\n  for (let i = 0; i < textLen; i += 1) {\n    matchMask[i] = 0;\n  }\n\n  if (bestLocation !== -1) {\n    let score = bitapScore(pattern, {\n      errors: 0,\n      currentLocation: bestLocation,\n      expectedLocation,\n      distance\n    });\n    currentThreshold = Math.min(score, currentThreshold); // What about in the other direction? (speed up)\n\n    bestLocation = text.lastIndexOf(pattern, expectedLocation + patternLen);\n\n    if (bestLocation !== -1) {\n      let score = bitapScore(pattern, {\n        errors: 0,\n        currentLocation: bestLocation,\n        expectedLocation,\n        distance\n      });\n      currentThreshold = Math.min(score, currentThreshold);\n    }\n  } // Reset the best location\n\n\n  bestLocation = -1;\n  let lastBitArr = [];\n  let finalScore = 1;\n  let binMax = patternLen + textLen;\n  const mask = 1 << patternLen - 1;\n\n  for (let i = 0; i < patternLen; i += 1) {\n    // Scan for the best match; each iteration allows for one more error.\n    // Run a binary search to determine how far from the match location we can stray\n    // at this error level.\n    let binMin = 0;\n    let binMid = binMax;\n\n    while (binMin < binMid) {\n      const score = bitapScore(pattern, {\n        errors: i,\n        currentLocation: expectedLocation + binMid,\n        expectedLocation,\n        distance\n      });\n\n      if (score <= currentThreshold) {\n        binMin = binMid;\n      } else {\n        binMax = binMid;\n      }\n\n      binMid = Math.floor((binMax - binMin) / 2 + binMin);\n    } // Use the result from this iteration as the maximum for the next.\n\n\n    binMax = binMid;\n    let start = Math.max(1, expectedLocation - binMid + 1);\n    let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen; // Initialize the bit array\n\n    let bitArr = Array(finish + 2);\n    bitArr[finish + 1] = (1 << i) - 1;\n\n    for (let j = finish; j >= start; j -= 1) {\n      let currentLocation = j - 1;\n      let charMatch = patternAlphabet[text.charAt(currentLocation)];\n\n      if (charMatch) {\n        matchMask[currentLocation] = 1;\n      } // First pass: exact match\n\n\n      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch; // Subsequent passes: fuzzy match\n\n      if (i !== 0) {\n        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];\n      }\n\n      if (bitArr[j] & mask) {\n        finalScore = bitapScore(pattern, {\n          errors: i,\n          currentLocation,\n          expectedLocation,\n          distance\n        }); // This match will almost certainly be better than any existing match.\n        // But check anyway.\n\n        if (finalScore <= currentThreshold) {\n          // Indeed it is\n          currentThreshold = finalScore;\n          bestLocation = currentLocation; // Already passed `loc`, downhill from here on in.\n\n          if (bestLocation <= expectedLocation) {\n            break;\n          } // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.\n\n\n          start = Math.max(1, 2 * expectedLocation - bestLocation);\n        }\n      }\n    } // No hope for a (better) match at greater error levels.\n\n\n    const score = bitapScore(pattern, {\n      errors: i + 1,\n      currentLocation: expectedLocation,\n      expectedLocation,\n      distance\n    }); // console.log('score', score, finalScore)\n\n    if (score > currentThreshold) {\n      break;\n    }\n\n    lastBitArr = bitArr;\n  } // console.log('FINAL SCORE', finalScore)\n  // Count exact matches (those with a score of 0) to be \"almost\" exact\n\n\n  return {\n    isMatch: bestLocation >= 0,\n    score: finalScore === 0 ? 0.001 : finalScore,\n    matchedIndices: matchedIndices(matchMask, minMatchCharLength)\n  };\n};\n\n//# sourceURL=webpack://Fuse/./src/bitap/bitap_search.js?");

/***/ }),

/***/ "./src/bitap/index.js":
/*!****************************!*\
  !*** ./src/bitap/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const bitapRegexSearch = __webpack_require__(/*! ./bitap_regex_search */ \"./src/bitap/bitap_regex_search.js\");\n\nconst bitapSearch = __webpack_require__(/*! ./bitap_search */ \"./src/bitap/bitap_search.js\");\n\nconst patternAlphabet = __webpack_require__(/*! ./bitap_pattern_alphabet */ \"./src/bitap/bitap_pattern_alphabet.js\");\n\nclass Bitap {\n  constructor(pattern, {\n    // Approximately where in the text is the pattern expected to be found?\n    location = 0,\n    // Determines how close the match must be to the fuzzy location (specified above).\n    // An exact letter match which is 'distance' characters away from the fuzzy location\n    // would score as a complete mismatch. A distance of '0' requires the match be at\n    // the exact location specified, a threshold of '1000' would require a perfect match\n    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.\n    distance = 100,\n    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match\n    // (of both letters and location), a threshold of '1.0' would match anything.\n    threshold = 0.6,\n    // Machine word size\n    maxPatternLength = 32,\n    // Indicates whether comparisons should be case sensitive.\n    isCaseSensitive = false,\n    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.\n    tokenSeparator = / +/g,\n    // When true, the algorithm continues searching to the end of the input even if a perfect\n    // match is found before the end of the same input.\n    findAllMatches = false,\n    // Minimum number of characters that must be matched before a result is considered a match\n    minMatchCharLength = 1\n  }) {\n    this.options = {\n      location,\n      distance,\n      threshold,\n      maxPatternLength,\n      isCaseSensitive,\n      tokenSeparator,\n      findAllMatches,\n      minMatchCharLength\n    };\n    this.pattern = this.options.isCaseSensitive ? pattern : pattern.toLowerCase();\n\n    if (this.pattern.length <= maxPatternLength) {\n      this.patternAlphabet = patternAlphabet(this.pattern);\n    }\n  }\n\n  search(text) {\n    if (!this.options.isCaseSensitive) {\n      text = text.toLowerCase();\n    } // Exact match\n\n\n    if (this.pattern === text) {\n      return {\n        isMatch: true,\n        score: 0,\n        matchedIndices: [[0, text.length - 1]]\n      };\n    } // When pattern length is greater than the machine word length, just do a a regex comparison\n\n\n    const {\n      maxPatternLength,\n      tokenSeparator\n    } = this.options;\n\n    if (this.pattern.length > maxPatternLength) {\n      return bitapRegexSearch(text, this.pattern, tokenSeparator);\n    } // Otherwise, use Bitap algorithm\n\n\n    const {\n      location,\n      distance,\n      threshold,\n      findAllMatches,\n      minMatchCharLength\n    } = this.options;\n    return bitapSearch(text, this.pattern, this.patternAlphabet, {\n      location,\n      distance,\n      threshold,\n      findAllMatches,\n      minMatchCharLength\n    });\n  }\n\n} // let x = new Bitap(\"od mn war\", {})\n// let result = x.search(\"Old Man's War\")\n// console.log(result)\n\n\nmodule.exports = Bitap;\n\n//# sourceURL=webpack://Fuse/./src/bitap/index.js?");

/***/ }),

/***/ "./src/helpers/deep_value.js":
/*!***********************************!*\
  !*** ./src/helpers/deep_value.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const isArray = __webpack_require__(/*! ./is_array */ \"./src/helpers/is_array.js\");\n\nconst deepValue = (obj, path, list) => {\n  if (!path) {\n    // If there's no path left, we've gotten to the object we care about.\n    list.push(obj);\n  } else {\n    const dotIndex = path.indexOf('.');\n    let firstSegment = path;\n    let remaining = null;\n\n    if (dotIndex !== -1) {\n      firstSegment = path.slice(0, dotIndex);\n      remaining = path.slice(dotIndex + 1);\n    }\n\n    const value = obj[firstSegment];\n\n    if (value !== null && value !== undefined) {\n      if (!remaining && (typeof value === 'string' || typeof value === 'number')) {\n        list.push(value.toString());\n      } else if (isArray(value)) {\n        // Search each item in the array.\n        for (let i = 0, len = value.length; i < len; i += 1) {\n          deepValue(value[i], remaining, list);\n        }\n      } else if (remaining) {\n        // An object. Recurse further.\n        deepValue(value, remaining, list);\n      }\n    }\n  }\n\n  return list;\n};\n\nmodule.exports = (obj, path) => {\n  return deepValue(obj, path, []);\n};\n\n//# sourceURL=webpack://Fuse/./src/helpers/deep_value.js?");

/***/ }),

/***/ "./src/helpers/is_array.js":
/*!*********************************!*\
  !*** ./src/helpers/is_array.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = obj => !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj);\n\n//# sourceURL=webpack://Fuse/./src/helpers/is_array.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Bitap = __webpack_require__(/*! ./bitap */ \"./src/bitap/index.js\");\n\nconst deepValue = __webpack_require__(/*! ./helpers/deep_value */ \"./src/helpers/deep_value.js\");\n\nconst isArray = __webpack_require__(/*! ./helpers/is_array */ \"./src/helpers/is_array.js\");\n\nclass Fuse {\n  constructor(list, {\n    // Approximately where in the text is the pattern expected to be found?\n    location = 0,\n    // Determines how close the match must be to the fuzzy location (specified above).\n    // An exact letter match which is 'distance' characters away from the fuzzy location\n    // would score as a complete mismatch. A distance of '0' requires the match be at\n    // the exact location specified, a threshold of '1000' would require a perfect match\n    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.\n    distance = 100,\n    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match\n    // (of both letters and location), a threshold of '1.0' would match anything.\n    threshold = 0.6,\n    // Machine word size\n    maxPatternLength = 32,\n    // Indicates whether comparisons should be case sensitive.\n    caseSensitive = false,\n    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.\n    tokenSeparator = / +/g,\n    // When true, the algorithm continues searching to the end of the input even if a perfect\n    // match is found before the end of the same input.\n    findAllMatches = false,\n    // Minimum number of characters that must be matched before a result is considered a match\n    minMatchCharLength = 1,\n    // The name of the identifier property. If specified, the returned result will be a list\n    // of the items' dentifiers, otherwise it will be a list of the items.\n    id = null,\n    // List of properties that will be searched. This also supports nested properties.\n    keys = [],\n    // Whether to sort the result list, by score\n    shouldSort = true,\n    // The get function to use when fetching an object's properties.\n    // The default will search nested paths *ie foo.bar.baz*\n    getFn = deepValue,\n    // Default sort function\n    sortFn = (a, b) => a.score - b.score,\n    // When true, the search algorithm will search individual words **and** the full string,\n    // computing the final score as a function of both. Note that when `tokenize` is `true`,\n    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.\n    tokenize = false,\n    // When true, the result set will only include records that match all tokens. Will only work\n    // if `tokenize` is also true.\n    matchAllTokens = false,\n    includeMatches = false,\n    includeScore = false,\n    // Will print to the console. Useful for debugging.\n    verbose = false\n  }) {\n    this.options = {\n      location,\n      distance,\n      threshold,\n      maxPatternLength,\n      isCaseSensitive: caseSensitive,\n      tokenSeparator,\n      findAllMatches,\n      minMatchCharLength,\n      id,\n      keys,\n      includeMatches,\n      includeScore,\n      shouldSort,\n      getFn,\n      sortFn,\n      verbose,\n      tokenize,\n      matchAllTokens\n    };\n    this.setCollection(list);\n  }\n\n  setCollection(list) {\n    this.list = list;\n    return list;\n  }\n\n  search(pattern, opts = {\n    limit: false\n  }) {\n    this._log(`---------\\nSearch pattern: \"${pattern}\"`);\n\n    const {\n      tokenSearchers,\n      fullSearcher\n    } = this._prepareSearchers(pattern);\n\n    let {\n      weights,\n      results\n    } = this._search(tokenSearchers, fullSearcher);\n\n    this._computeScore(weights, results);\n\n    if (this.options.shouldSort) {\n      this._sort(results);\n    }\n\n    if (opts.limit && typeof opts.limit === 'number') {\n      results = results.slice(0, opts.limit);\n    }\n\n    return this._format(results);\n  }\n\n  _prepareSearchers(pattern = '') {\n    const tokenSearchers = [];\n\n    if (this.options.tokenize) {\n      // Tokenize on the separator\n      const tokens = pattern.split(this.options.tokenSeparator);\n\n      for (let i = 0, len = tokens.length; i < len; i += 1) {\n        tokenSearchers.push(new Bitap(tokens[i], this.options));\n      }\n    }\n\n    let fullSearcher = new Bitap(pattern, this.options);\n    return {\n      tokenSearchers,\n      fullSearcher\n    };\n  }\n\n  _search(tokenSearchers = [], fullSearcher) {\n    const list = this.list;\n    const resultMap = {};\n    const results = []; // Check the first item in the list, if it's a string, then we assume\n    // that every item in the list is also a string, and thus it's a flattened array.\n\n    if (typeof list[0] === 'string') {\n      // Iterate over every item\n      for (let i = 0, len = list.length; i < len; i += 1) {\n        this._analyze({\n          key: '',\n          value: list[i],\n          record: i,\n          index: i\n        }, {\n          resultMap,\n          results,\n          tokenSearchers,\n          fullSearcher\n        });\n      }\n\n      return {\n        weights: null,\n        results\n      };\n    } // Otherwise, the first item is an Object (hopefully), and thus the searching\n    // is done on the values of the keys of each item.\n\n\n    const weights = {};\n\n    for (let i = 0, len = list.length; i < len; i += 1) {\n      let item = list[i]; // Iterate over every key\n\n      for (let j = 0, keysLen = this.options.keys.length; j < keysLen; j += 1) {\n        let key = this.options.keys[j];\n\n        if (typeof key !== 'string') {\n          weights[key.name] = {\n            weight: 1 - key.weight || 1\n          };\n\n          if (key.weight <= 0 || key.weight > 1) {\n            throw new Error('Key weight has to be > 0 and <= 1');\n          }\n\n          key = key.name;\n        } else {\n          weights[key] = {\n            weight: 1\n          };\n        }\n\n        this._analyze({\n          key,\n          value: this.options.getFn(item, key),\n          record: item,\n          index: i\n        }, {\n          resultMap,\n          results,\n          tokenSearchers,\n          fullSearcher\n        });\n      }\n    }\n\n    return {\n      weights,\n      results\n    };\n  }\n\n  _analyze({\n    key,\n    arrayIndex = -1,\n    value,\n    record,\n    index\n  }, {\n    tokenSearchers = [],\n    fullSearcher = [],\n    resultMap = {},\n    results = []\n  }) {\n    // Check if the texvaluet can be searched\n    if (value === undefined || value === null) {\n      return;\n    }\n\n    let exists = false;\n    let averageScore = -1;\n    let numTextMatches = 0;\n\n    if (typeof value === 'string') {\n      this._log(`\\nKey: ${key === '' ? '-' : key}`);\n\n      let mainSearchResult = fullSearcher.search(value);\n\n      this._log(`Full text: \"${value}\", score: ${mainSearchResult.score}`);\n\n      if (this.options.tokenize) {\n        let words = value.split(this.options.tokenSeparator);\n        let scores = [];\n\n        for (let i = 0; i < tokenSearchers.length; i += 1) {\n          let tokenSearcher = tokenSearchers[i];\n\n          this._log(`\\nPattern: \"${tokenSearcher.pattern}\"`); // let tokenScores = []\n\n\n          let hasMatchInText = false;\n\n          for (let j = 0; j < words.length; j += 1) {\n            let word = words[j];\n            let tokenSearchResult = tokenSearcher.search(word);\n            let obj = {};\n\n            if (tokenSearchResult.isMatch) {\n              obj[word] = tokenSearchResult.score;\n              exists = true;\n              hasMatchInText = true;\n              scores.push(tokenSearchResult.score);\n            } else {\n              obj[word] = 1;\n\n              if (!this.options.matchAllTokens) {\n                scores.push(1);\n              }\n            }\n\n            this._log(`Token: \"${word}\", score: ${obj[word]}`); // tokenScores.push(obj)\n\n          }\n\n          if (hasMatchInText) {\n            numTextMatches += 1;\n          }\n        }\n\n        averageScore = scores[0];\n        let scoresLen = scores.length;\n\n        for (let i = 1; i < scoresLen; i += 1) {\n          averageScore += scores[i];\n        }\n\n        averageScore = averageScore / scoresLen;\n\n        this._log('Token score average:', averageScore);\n      }\n\n      let finalScore = mainSearchResult.score;\n\n      if (averageScore > -1) {\n        finalScore = (finalScore + averageScore) / 2;\n      }\n\n      this._log('Score average:', finalScore);\n\n      let checkTextMatches = this.options.tokenize && this.options.matchAllTokens ? numTextMatches >= tokenSearchers.length : true;\n\n      this._log(`\\nCheck Matches: ${checkTextMatches}`); // If a match is found, add the item to <rawResults>, including its score\n\n\n      if ((exists || mainSearchResult.isMatch) && checkTextMatches) {\n        // Check if the item already exists in our results\n        let existingResult = resultMap[index];\n\n        if (existingResult) {\n          // Use the lowest score\n          // existingResult.score, bitapResult.score\n          existingResult.output.push({\n            key,\n            arrayIndex,\n            value,\n            score: finalScore,\n            matchedIndices: mainSearchResult.matchedIndices\n          });\n        } else {\n          // Add it to the raw result list\n          resultMap[index] = {\n            item: record,\n            output: [{\n              key,\n              arrayIndex,\n              value,\n              score: finalScore,\n              matchedIndices: mainSearchResult.matchedIndices\n            }]\n          };\n          results.push(resultMap[index]);\n        }\n      }\n    } else if (isArray(value)) {\n      for (let i = 0, len = value.length; i < len; i += 1) {\n        this._analyze({\n          key,\n          arrayIndex: i,\n          value: value[i],\n          record,\n          index\n        }, {\n          resultMap,\n          results,\n          tokenSearchers,\n          fullSearcher\n        });\n      }\n    }\n  }\n\n  _computeScore(weights, results) {\n    this._log('\\n\\nComputing score:\\n');\n\n    for (let i = 0, len = results.length; i < len; i += 1) {\n      const output = results[i].output;\n      const scoreLen = output.length;\n      let currScore = 1;\n      let bestScore = 1;\n\n      for (let j = 0; j < scoreLen; j += 1) {\n        let weight = weights ? weights[output[j].key].weight : 1;\n        let score = weight === 1 ? output[j].score : output[j].score || 0.001;\n        let nScore = score * weight;\n\n        if (weight !== 1) {\n          bestScore = Math.min(bestScore, nScore);\n        } else {\n          output[j].nScore = nScore;\n          currScore *= nScore;\n        }\n      }\n\n      results[i].score = bestScore === 1 ? currScore : bestScore;\n\n      this._log(results[i]);\n    }\n  }\n\n  _sort(results) {\n    this._log('\\n\\nSorting....');\n\n    results.sort(this.options.sortFn);\n  }\n\n  _format(results) {\n    const finalOutput = [];\n\n    if (this.options.verbose) {\n      let cache = [];\n\n      this._log('\\n\\nOutput:\\n\\n', JSON.stringify(results, function (key, value) {\n        if (typeof value === 'object' && value !== null) {\n          if (cache.indexOf(value) !== -1) {\n            // Circular reference found, discard key\n            return;\n          } // Store value in our collection\n\n\n          cache.push(value);\n        }\n\n        return value;\n      }));\n\n      cache = null;\n    }\n\n    let transformers = [];\n\n    if (this.options.includeMatches) {\n      transformers.push((result, data) => {\n        const output = result.output;\n        data.matches = [];\n\n        for (let i = 0, len = output.length; i < len; i += 1) {\n          let item = output[i];\n\n          if (item.matchedIndices.length === 0) {\n            continue;\n          }\n\n          let obj = {\n            indices: item.matchedIndices,\n            value: item.value\n          };\n\n          if (item.key) {\n            obj.key = item.key;\n          }\n\n          if (item.hasOwnProperty('arrayIndex') && item.arrayIndex > -1) {\n            obj.arrayIndex = item.arrayIndex;\n          }\n\n          data.matches.push(obj);\n        }\n      });\n    }\n\n    if (this.options.includeScore) {\n      transformers.push((result, data) => {\n        data.score = result.score;\n      });\n    }\n\n    for (let i = 0, len = results.length; i < len; i += 1) {\n      const result = results[i];\n\n      if (this.options.id) {\n        result.item = this.options.getFn(result.item, this.options.id)[0];\n      }\n\n      if (!transformers.length) {\n        finalOutput.push(result.item);\n        continue;\n      }\n\n      const data = {\n        item: result.item\n      };\n\n      for (let j = 0, len = transformers.length; j < len; j += 1) {\n        transformers[j](result, data);\n      }\n\n      finalOutput.push(data);\n    }\n\n    return finalOutput;\n  }\n\n  _log() {\n    if (this.options.verbose) {\n      console.log(...arguments);\n    }\n  }\n\n}\n\nmodule.exports = Fuse;\n\n//# sourceURL=webpack://Fuse/./src/index.js?");

/***/ })

/******/ });
});