/**
 * Fuse.js v5.2.3 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2020 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

'use strict';

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

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
var isDefined = function isDefined(value) {
  return value !== undefined && value !== null;
};
var isBlank = function isBlank(value) {
  return !value.trim().length;
};

function get(obj, path) {
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
}

var MatchOptions = {
  // Whether the matches should be included in the result set. When true, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When true, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};
var BasicOptions = {
  // When true, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: function sortFn(a, b) {
    return a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1;
  }
};
var FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};
var AdvancedOptions = {
  // When true, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get
};
var Config = _objectSpread2({}, BasicOptions, {}, MatchOptions, {}, FuzzyOptions, {}, AdvancedOptions);

function computeScore(pattern) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$errors = _ref.errors,
      errors = _ref$errors === void 0 ? 0 : _ref$errors,
      _ref$currentLocation = _ref.currentLocation,
      currentLocation = _ref$currentLocation === void 0 ? 0 : _ref$currentLocation,
      _ref$expectedLocation = _ref.expectedLocation,
      expectedLocation = _ref$expectedLocation === void 0 ? 0 : _ref$expectedLocation,
      _ref$distance = _ref.distance,
      distance = _ref$distance === void 0 ? Config.distance : _ref$distance;

  var accuracy = errors / pattern.length;
  var proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy;
  }

  return accuracy + proximity / distance;
}

function convertMaskToIndices() {
  var matchmask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var minMatchCharLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Config.minMatchCharLength;
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
}

// Machine word size
var MAX_BITS = 32;

function search(text, pattern, patternAlphabet) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$location = _ref.location,
      location = _ref$location === void 0 ? Config.location : _ref$location,
      _ref$distance = _ref.distance,
      distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
      _ref$threshold = _ref.threshold,
      threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
      _ref$findAllMatches = _ref.findAllMatches,
      findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
      _ref$minMatchCharLeng = _ref.minMatchCharLength,
      minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
      _ref$includeMatches = _ref.includeMatches,
      includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches;

  if (pattern.length > MAX_BITS) {
    throw new Error("Pattern length exceeds max of ".concat(MAX_BITS, "."));
  }

  var patternLen = pattern.length; // Set starting location at beginning text and initialize the alphabet.

  var textLen = text.length; // Handle the case when location > text.length

  var expectedLocation = Math.max(0, Math.min(location, textLen)); // Highest score beyond which we give up.

  var currentThreshold = threshold; // Is there a nearby exact match? (speedup)

  var bestLocation = expectedLocation; // A mask of the matches, used for building the indices

  var matchMask = [];

  if (includeMatches) {
    for (var i = 0; i < textLen; i += 1) {
      matchMask[i] = 0;
    }
  }

  var index; // Get all exact matches, here for speed up

  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    var score = computeScore(pattern, {
      currentLocation: index,
      expectedLocation: expectedLocation,
      distance: distance
    });
    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;

    if (includeMatches) {
      var _i = 0;

      while (_i < patternLen) {
        matchMask[index + _i] = 1;
        _i += 1;
      }
    }
  } // Reset the best location


  bestLocation = -1;
  var lastBitArr = [];
  var finalScore = 1;
  var binMax = patternLen + textLen;
  var mask = 1 << (patternLen <= MAX_BITS - 1 ? patternLen - 1 : MAX_BITS - 2);

  for (var _i2 = 0; _i2 < patternLen; _i2 += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    var binMin = 0;
    var binMid = binMax;

    while (binMin < binMid) {
      var _score2 = computeScore(pattern, {
        errors: _i2,
        currentLocation: expectedLocation + binMid,
        expectedLocation: expectedLocation,
        distance: distance
      });

      if (_score2 <= currentThreshold) {
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
    bitArr[finish + 1] = (1 << _i2) - 1;

    for (var j = finish; j >= start; j -= 1) {
      var currentLocation = j - 1;
      var charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (charMatch && includeMatches) {
        matchMask[currentLocation] = 1;
      } // First pass: exact match


      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch; // Subsequent passes: fuzzy match

      if (_i2 !== 0) {
        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & mask) {
        finalScore = computeScore(pattern, {
          errors: _i2,
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


    var _score = computeScore(pattern, {
      errors: _i2 + 1,
      currentLocation: expectedLocation,
      expectedLocation: expectedLocation,
      distance: distance
    });

    if (_score > currentThreshold) {
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
    result.matchedIndices = convertMaskToIndices(matchMask, minMatchCharLength);
  }

  return result;
}

function createPatternAlphabet(pattern) {
  var mask = {};
  var len = pattern.length;

  for (var i = 0; i < len; i += 1) {
    mask[pattern.charAt(i)] = 0;
  }

  for (var _i = 0; _i < len; _i += 1) {
    mask[pattern.charAt(_i)] |= 1 << len - _i - 1;
  }

  return mask;
}

var BitapSearch = /*#__PURE__*/function () {
  function BitapSearch(pattern) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$location = _ref.location,
        location = _ref$location === void 0 ? Config.location : _ref$location,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
        _ref$distance = _ref.distance,
        distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
        _ref$includeMatches = _ref.includeMatches,
        includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
        _ref$findAllMatches = _ref.findAllMatches,
        findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
        _ref$minMatchCharLeng = _ref.minMatchCharLength,
        minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
        _ref$isCaseSensitive = _ref.isCaseSensitive,
        isCaseSensitive = _ref$isCaseSensitive === void 0 ? Config.isCaseSensitive : _ref$isCaseSensitive;

    _classCallCheck(this, BitapSearch);

    this.options = {
      location: location,
      threshold: threshold,
      distance: distance,
      includeMatches: includeMatches,
      findAllMatches: findAllMatches,
      minMatchCharLength: minMatchCharLength,
      isCaseSensitive: isCaseSensitive
    };
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.chunks = [];
    var index = 0;

    while (index < this.pattern.length) {
      var _pattern = this.pattern.substring(index, index + MAX_BITS);

      this.chunks.push({
        pattern: _pattern,
        alphabet: createPatternAlphabet(_pattern)
      });
      index += MAX_BITS;
    }
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
        var _result = {
          isMatch: true,
          score: 0
        };

        if (includeMatches) {
          _result.matchedIndices = [[0, text.length - 1]];
        }

        return _result;
      } // Otherwise, use Bitap algorithm


      var _this$options2 = this.options,
          location = _this$options2.location,
          distance = _this$options2.distance,
          threshold = _this$options2.threshold,
          findAllMatches = _this$options2.findAllMatches,
          minMatchCharLength = _this$options2.minMatchCharLength;
      var allMatchedIndices = [];
      var totalScore = 0;
      var hasMatches = false;

      for (var i = 0, len = this.chunks.length; i < len; i += 1) {
        var _this$chunks$i = this.chunks[i],
            pattern = _this$chunks$i.pattern,
            alphabet = _this$chunks$i.alphabet;

        var _result2 = search(text, pattern, alphabet, {
          location: location + MAX_BITS * i,
          distance: distance,
          threshold: threshold,
          findAllMatches: findAllMatches,
          minMatchCharLength: minMatchCharLength,
          includeMatches: includeMatches
        });

        var isMatch = _result2.isMatch,
            score = _result2.score,
            matchedIndices = _result2.matchedIndices;

        if (isMatch) {
          hasMatches = true;
        }

        totalScore += score;

        if (isMatch && matchedIndices) {
          allMatchedIndices = [].concat(_toConsumableArray(allMatchedIndices), _toConsumableArray(matchedIndices));
        }
      }

      var result = {
        isMatch: hasMatches,
        score: hasMatches ? totalScore / this.chunks.length : 1
      };

      if (hasMatches && includeMatches) {
        result.matchedIndices = allMatchedIndices;
      }

      return result;
    }
  }]);

  return BitapSearch;
}();

var SPACE = /[^ ]+/g;
function createIndex(keys, list) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$getFn = _ref.getFn,
      getFn = _ref$getFn === void 0 ? Config.getFn : _ref$getFn;

  var indexedList = []; // List is Array<String>

  if (isString(list[0])) {
    // Iterate over every string in the list
    for (var i = 0, len = list.length; i < len; i += 1) {
      var value = list[i];

      if (isDefined(value) && !isBlank(value)) {
        var record = {
          $: value,
          idx: i,
          t: value.match(SPACE).length
        };
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

            if (isString(_value2) && !isBlank(_value2)) {
              var subRecord = {
                $: _value2,
                idx: arrayIndex,
                t: _value2.match(SPACE).length
              };
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
        } else if (!isBlank(_value)) {
          var _subRecord = {
            $: _value,
            t: _value.match(SPACE).length
          };
          _record.$[key] = _subRecord;
        }
      }

      indexedList.push(_record);
    }
  }

  return indexedList;
}

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

        if (!Object.prototype.hasOwnProperty.call(_key, 'name')) {
          throw new Error('Missing "name" property in key object');
        }

        var keyName = _key.name;

        this._keyNames.push(keyName);

        if (!Object.prototype.hasOwnProperty.call(_key, 'weight')) {
          throw new Error('Missing "weight" property in key object');
        }

        var weight = _key.weight;

        if (weight <= 0 || weight >= 1) {
          throw new Error('"weight" property in key must be in the range of (0, 1)');
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

function transformMatches(result, data) {
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
}

function transformScore(result, data) {
  data.score = result.score;
}

var registeredSearchers = [];

var Fuse = /*#__PURE__*/function () {
  function Fuse(list) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Fuse);

    this.options = _objectSpread2({}, Config, {}, options);

    this._processKeys(this.options.keys);

    this.setCollection(list, index);
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
        this.setIndex(this._createIndex());
      }
    }
  }, {
    key: "setIndex",
    value: function setIndex(listIndex) {
      this._indexedList = listIndex;
    }
  }, {
    key: "_processKeys",
    value: function _processKeys(keys) {
      this._keyStore = new KeyStore(keys);
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
      pattern = pattern.trim();

      if (!pattern.length) {
        return [];
      }

      var shouldSort = this.options.shouldSort;
      var searcher = null;

      for (var i = 0, len = registeredSearchers.length; i < len; i += 1) {
        var searcherClass = registeredSearchers[i];

        if (searcherClass.condition(pattern, this.options)) {
          searcher = new searcherClass(pattern, this.options);
          break;
        }
      }

      if (!searcher) {
        searcher = new BitapSearch(pattern, this.options);
      }

      var results = this._searchUsing(searcher);

      this._computeScore(results);

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
              idx = value.idx,
              t = value.t;

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
            value: text,
            t: t
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
            var _value = item[key];

            if (!isDefined(_value)) {
              continue;
            }

            if (isArray(_value)) {
              for (var k = 0, _len2 = _value.length; k < _len2; k += 1) {
                var arrItem = _value[k];
                var _text = arrItem.$,
                    _idx2 = arrItem.idx,
                    _t = arrItem.t;

                if (!isDefined(_text)) {
                  continue;
                }

                var _searchResult = searcher.searchIn(arrItem);

                var _isMatch = _searchResult.isMatch,
                    _score = _searchResult.score;

                if (!_isMatch) {
                  continue;
                }

                var _match = {
                  score: _score,
                  key: key,
                  value: _text,
                  idx: _idx2,
                  t: _t
                };

                if (includeMatches) {
                  _match.indices = _searchResult.matchedIndices;
                }

                matches.push(_match);
              }
            } else {
              var _text2 = _value.$,
                  _t2 = _value.t;

              var _searchResult2 = searcher.searchIn(_value);

              var _isMatch2 = _searchResult2.isMatch,
                  _score2 = _searchResult2.score;

              if (!_isMatch2) {
                continue;
              }

              var _match2 = {
                score: _score2,
                key: key,
                value: _text2,
                t: _t2
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
      }

      return results;
    } // Practical scoring function

  }, {
    key: "_computeScore",
    value: function _computeScore(results) {
      var resultsLen = results.length;

      for (var i = 0; i < resultsLen; i += 1) {
        var result = results[i];
        var matches = result.matches;
        var numMatches = matches.length;
        var totalScore = 1;

        for (var j = 0; j < numMatches; j += 1) {
          var match = matches[j];
          var key = match.key,
              t = match.t;

          var keyWeight = this._keyStore.get(key, 'weight');

          var weight = keyWeight > -1 ? keyWeight : 1;
          var score = match.score === 0 && keyWeight > -1 ? Number.EPSILON : match.score; // Field-length norm: the shorter the field, the higher the weight.

          var norm = 1 / Math.sqrt(t);
          totalScore *= Math.pow(score, weight * norm);
        }

        result.score = totalScore;
      }
    }
  }, {
    key: "_sort",
    value: function _sort(results) {
      results.sort(this.options.sortFn);
    }
  }, {
    key: "_format",
    value: function _format(results) {
      var finalOutput = [];
      var _this$options = this.options,
          includeMatches = _this$options.includeMatches,
          includeScore = _this$options.includeScore;
      var transformers = [];
      if (includeMatches) transformers.push(transformMatches);
      if (includeScore) transformers.push(transformScore);

      for (var i = 0, len = results.length; i < len; i += 1) {
        var result = results[i];
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

Fuse.version = '5.2.3';
Fuse.createIndex = createIndex;
Fuse.config = Config;

module.exports = Fuse;
