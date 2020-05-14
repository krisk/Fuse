/**
 * Fuse.js v6.0.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2020 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (_isNativeReflectConstruct()) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
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

  function isArray(value) {
    return !Array.isArray ? Object.prototype.toString.call(value) === '[object Array]' : Array.isArray(value);
  } // Adapted from:
  // https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js

  var INFINITY = 1 / 0;
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  }
  function isObject(value) {
    return _typeof(value) === 'object';
  }
  function isDefined(value) {
    return value !== undefined && value !== null;
  }
  function isBlank(value) {
    return !value.trim().length;
  }

  var EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';
  var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
  var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = function LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key) {
    return "Invalid value for key ".concat(key);
  };
  var PATTERN_LENGTH_TOO_LARGE = function PATTERN_LENGTH_TOO_LARGE(max) {
    return "Pattern length exceeds max of ".concat(max, ".");
  };
  var MISSING_KEY_PROPERTY = function MISSING_KEY_PROPERTY(name) {
    return "Missing ".concat(name, " property in key");
  };
  var INVALID_KEY_WEIGHT_VALUE = function INVALID_KEY_WEIGHT_VALUE(key) {
    return "Property 'weight' in key '".concat(key, "' must be a positive integer");
  };

  var hasOwn = Object.prototype.hasOwnProperty;

  var KeyStore = /*#__PURE__*/function () {
    function KeyStore(keys) {
      var _this = this;

      _classCallCheck(this, KeyStore);

      this._keys = {};
      this._keyNames = [];
      var totalWeight = 0;
      keys.forEach(function (key) {
        var keyName;
        var weight = 1;

        if (isString(key)) {
          keyName = key;
        } else {
          if (!hasOwn.call(key, 'name')) {
            throw new Error(MISSING_KEY_PROPERTY('name'));
          }

          keyName = key.name;

          if (hasOwn.call(key, 'weight')) {
            weight = key.weight;

            if (weight <= 0) {
              throw new Error(INVALID_KEY_WEIGHT_VALUE(keyName));
            }
          }
        }

        _this._keyNames.push(keyName);

        _this._keys[keyName] = {
          weight: weight
        };
        totalWeight += weight;
      }); // Normalize weights so that their sum is equal to 1

      this._keyNames.forEach(function (key) {
        _this._keys[key].weight /= totalWeight;
      });
    }

    _createClass(KeyStore, [{
      key: "get",
      value: function get(key, name) {
        return this._keys[key] && this._keys[key][name];
      }
    }, {
      key: "keys",
      value: function keys() {
        return this._keyNames;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return JSON.stringify(this._keys);
      }
    }]);

    return KeyStore;
  }();

  function get(obj, path) {
    var list = [];
    var arr = false;

    var deepGet = function deepGet(obj, path) {
      if (!path) {
        // If there's no path left, we've arrived at the object we care about.
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

        if (!isDefined(value)) {
          return;
        }

        if (!remaining && (isString(value) || isNumber(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true; // Search each item in the array.

          for (var i = 0, len = value.length; i < len; i += 1) {
            deepGet(value[i], remaining);
          }
        } else if (remaining) {
          // An object. Recurse further.
          deepGet(value, remaining);
        }
      }
    };

    deepGet(obj, path);
    return arr ? list : list[0];
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

  var SPACE = /[^ ]+/g; // Field-length norm: the shorter the field, the higher the weight.
  // Set to 3 decimals to reduce index size.

  function norm() {
    var mantissa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var cache = new Map();
    return {
      get: function get(value) {
        var numTokens = value.match(SPACE).length;

        if (cache.has(numTokens)) {
          return cache.get(numTokens);
        }

        var n = parseFloat((1 / Math.sqrt(numTokens)).toFixed(mantissa));
        cache.set(numTokens, n);
        return n;
      },
      clear: function clear() {
        cache.clear();
      }
    };
  }

  var FuseIndex = /*#__PURE__*/function () {
    function FuseIndex() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$getFn = _ref.getFn,
          getFn = _ref$getFn === void 0 ? Config.getFn : _ref$getFn;

      _classCallCheck(this, FuseIndex);

      this.norm = norm(3);
      this.getFn = getFn;
      this.isCreated = false;
      this.setRecords();
    }

    _createClass(FuseIndex, [{
      key: "setCollection",
      value: function setCollection() {
        var docs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.docs = docs;
      }
    }, {
      key: "setRecords",
      value: function setRecords() {
        var records = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.records = records;
      }
    }, {
      key: "setKeys",
      value: function setKeys() {
        var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.keys = keys;
      }
    }, {
      key: "create",
      value: function create() {
        var _this = this;

        if (this.isCreated || !this.docs.length) {
          return;
        }

        this.isCreated = true; // List is Array<String>

        if (isString(this.docs[0])) {
          this.docs.forEach(function (doc, docIndex) {
            _this._addString(doc, docIndex);
          });
        } else {
          // List is Array<Object>
          this.docs.forEach(function (doc, docIndex) {
            _this._addObject(doc, docIndex);
          });
        }

        this.norm.clear();
      } // Adds a doc to the end of the index

    }, {
      key: "add",
      value: function add(doc) {
        var idx = this.size();

        if (isString(doc)) {
          this._addString(doc, idx);
        } else {
          this._addObject(doc, idx);
        }
      } // Removes the doc at the specified index of the index

    }, {
      key: "removeAt",
      value: function removeAt(idx) {
        this.records.splice(idx, 1); // Change ref index of every subsquent doc

        for (var i = idx, len = this.size(); i < len; i += 1) {
          this.records[i].i -= 1;
        }
      }
    }, {
      key: "size",
      value: function size() {
        return this.records.length;
      }
    }, {
      key: "_addString",
      value: function _addString(doc, docIndex) {
        if (!isDefined(doc) || isBlank(doc)) {
          return;
        }

        var record = {
          v: doc,
          i: docIndex,
          n: this.norm.get(doc)
        };
        this.records.push(record);
      }
    }, {
      key: "_addObject",
      value: function _addObject(doc, docIndex) {
        var _this2 = this;

        var record = {
          i: docIndex,
          $: {}
        }; // Iterate over every key (i.e, path), and fetch the value at that key

        this.keys.forEach(function (key, keyIndex) {
          var value = _this2.getFn(doc, key);

          if (!isDefined(value)) {
            return;
          }

          if (isArray(value)) {
            (function () {
              var subRecords = [];
              var stack = [{
                nestedArrIndex: -1,
                value: value
              }];

              while (stack.length) {
                var _stack$pop = stack.pop(),
                    nestedArrIndex = _stack$pop.nestedArrIndex,
                    _value = _stack$pop.value;

                if (!isDefined(_value)) {
                  continue;
                }

                if (isString(_value) && !isBlank(_value)) {
                  var subRecord = {
                    v: _value,
                    i: nestedArrIndex,
                    n: _this2.norm.get(_value)
                  };
                  subRecords.push(subRecord);
                } else if (isArray(_value)) {
                  _value.forEach(function (item, k) {
                    stack.push({
                      nestedArrIndex: k,
                      value: item
                    });
                  });
                }
              }

              record.$[keyIndex] = subRecords;
            })();
          } else if (!isBlank(value)) {
            var subRecord = {
              v: value,
              n: _this2.norm.get(value)
            };
            record.$[keyIndex] = subRecord;
          }
        });
        this.records.push(record);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          keys: this.keys,
          records: this.records
        };
      }
    }]);

    return FuseIndex;
  }();
  function createIndex(keys, docs) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$getFn = _ref2.getFn,
        getFn = _ref2$getFn === void 0 ? Config.getFn : _ref2$getFn;

    var myIndex = new FuseIndex({
      getFn: getFn
    });
    myIndex.setKeys(keys);
    myIndex.setCollection(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$getFn = _ref3.getFn,
        getFn = _ref3$getFn === void 0 ? Config.getFn : _ref3$getFn;

    var keys = data.keys,
        records = data.records;
    var myIndex = new FuseIndex({
      getFn: getFn
    });
    myIndex.setKeys(keys);
    myIndex.setRecords(records);
    return myIndex;
  }

  function transformMatches(result, data) {
    var matches = result.matches;
    data.matches = [];

    if (!isDefined(matches)) {
      return;
    }

    matches.forEach(function (match) {
      if (!isDefined(match.indices) || !match.indices.length) {
        return;
      }

      var indices = match.indices,
          value = match.value;
      var obj = {
        indices: indices,
        value: value
      };

      if (match.key) {
        obj.key = match.key;
      }

      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }

      data.matches.push(obj);
    });
  }

  function transformScore(result, data) {
    data.score = result.score;
  }

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
    var indices = [];
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
          indices.push([start, end]);
        }

        start = -1;
      }
    } // (i-1 - start) + 1 => i - start


    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      indices.push([start, i - 1]);
    }

    return indices;
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
      throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
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
      score: Math.max(0.001, finalScore)
    };

    if (includeMatches) {
      result.indices = convertMaskToIndices(matchMask, minMatchCharLength);
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
      value: function searchIn(text) {
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
            _result.indices = [[0, text.length - 1]];
          }

          return _result;
        } // Otherwise, use Bitap algorithm


        var _this$options2 = this.options,
            location = _this$options2.location,
            distance = _this$options2.distance,
            threshold = _this$options2.threshold,
            findAllMatches = _this$options2.findAllMatches,
            minMatchCharLength = _this$options2.minMatchCharLength;
        var allIndices = [];
        var totalScore = 0;
        var hasMatches = false;
        this.chunks.forEach(function (_ref2, i) {
          var pattern = _ref2.pattern,
              alphabet = _ref2.alphabet;

          var _search = search(text, pattern, alphabet, {
            location: location + MAX_BITS * i,
            distance: distance,
            threshold: threshold,
            findAllMatches: findAllMatches,
            minMatchCharLength: minMatchCharLength,
            includeMatches: includeMatches
          }),
              isMatch = _search.isMatch,
              score = _search.score,
              indices = _search.indices;

          if (isMatch) {
            hasMatches = true;
          }

          totalScore += score;

          if (isMatch && indices) {
            allIndices = [].concat(_toConsumableArray(allIndices), _toConsumableArray(indices));
          }
        });
        var result = {
          isMatch: hasMatches,
          score: hasMatches ? totalScore / this.chunks.length : 1
        };

        if (hasMatches && includeMatches) {
          result.indices = allIndices;
        }

        return result;
      }
    }]);

    return BitapSearch;
  }();

  var BaseMatch = /*#__PURE__*/function () {
    function BaseMatch(pattern) {
      _classCallCheck(this, BaseMatch);

      this.pattern = pattern;
    }

    _createClass(BaseMatch, [{
      key: "search",
      value: function search()
      /*text*/
      {}
    }], [{
      key: "isMultiMatch",
      value: function isMultiMatch(pattern) {
        return getMatch(pattern, this.multiRegex);
      }
    }, {
      key: "isSingleMatch",
      value: function isSingleMatch(pattern) {
        return getMatch(pattern, this.singleRegex);
      }
    }]);

    return BaseMatch;
  }();

  function getMatch(pattern, exp) {
    var matches = pattern.match(exp);
    return matches ? matches[1] : null;
  }

  var ExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(ExactMatch, _BaseMatch);

    var _super = _createSuper(ExactMatch);

    function ExactMatch(pattern) {
      _classCallCheck(this, ExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(ExactMatch, [{
      key: "search",
      value: function search(text) {
        var location = 0;
        var index;
        var indices = [];
        var patternLen = this.pattern.length; // Get all exact matches

        while ((index = text.indexOf(this.pattern, location)) > -1) {
          location = index + patternLen;
          indices.push([index, location - 1]);
        }

        var isMatch = !!indices.length;
        return {
          isMatch: isMatch,
          score: isMatch ? 1 : 0,
          indices: indices
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^'"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^'(.*)$/;
      }
    }]);

    return ExactMatch;
  }(BaseMatch);

  var InverseExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(InverseExactMatch, _BaseMatch);

    var _super = _createSuper(InverseExactMatch);

    function InverseExactMatch(pattern) {
      _classCallCheck(this, InverseExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(InverseExactMatch, [{
      key: "search",
      value: function search(text) {
        var index = text.indexOf(this.pattern);
        var isMatch = index === -1;
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'inverse-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^!"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^!(.*)$/;
      }
    }]);

    return InverseExactMatch;
  }(BaseMatch);

  var PrefixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(PrefixExactMatch, _BaseMatch);

    var _super = _createSuper(PrefixExactMatch);

    function PrefixExactMatch(pattern) {
      _classCallCheck(this, PrefixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(PrefixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = text.startsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'prefix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^\^"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^\^(.*)$/;
      }
    }]);

    return PrefixExactMatch;
  }(BaseMatch);

  var InversePrefixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(InversePrefixExactMatch, _BaseMatch);

    var _super = _createSuper(InversePrefixExactMatch);

    function InversePrefixExactMatch(pattern) {
      _classCallCheck(this, InversePrefixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(InversePrefixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = !text.startsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'inverse-prefix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^!\^"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^!\^(.*)$/;
      }
    }]);

    return InversePrefixExactMatch;
  }(BaseMatch);

  var SuffixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(SuffixExactMatch, _BaseMatch);

    var _super = _createSuper(SuffixExactMatch);

    function SuffixExactMatch(pattern) {
      _classCallCheck(this, SuffixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(SuffixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = text.endsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [text.length - this.pattern.length, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'suffix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^"(.*)"\$$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^(.*)\$$/;
      }
    }]);

    return SuffixExactMatch;
  }(BaseMatch);

  var InverseSuffixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(InverseSuffixExactMatch, _BaseMatch);

    var _super = _createSuper(InverseSuffixExactMatch);

    function InverseSuffixExactMatch(pattern) {
      _classCallCheck(this, InverseSuffixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(InverseSuffixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = !text.endsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'inverse-suffix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^!"(.*)"\$$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^!(.*)\$$/;
      }
    }]);

    return InverseSuffixExactMatch;
  }(BaseMatch);

  var FuzzyMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(FuzzyMatch, _BaseMatch);

    var _super = _createSuper(FuzzyMatch);

    function FuzzyMatch(pattern) {
      var _this;

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

      _classCallCheck(this, FuzzyMatch);

      _this = _super.call(this, pattern);
      _this._bitapSearch = new BitapSearch(pattern, {
        location: location,
        threshold: threshold,
        distance: distance,
        includeMatches: includeMatches,
        findAllMatches: findAllMatches,
        minMatchCharLength: minMatchCharLength,
        isCaseSensitive: isCaseSensitive
      });
      return _this;
    }

    _createClass(FuzzyMatch, [{
      key: "search",
      value: function search(text) {
        return this._bitapSearch.searchIn(text);
      }
    }], [{
      key: "type",
      get: function get() {
        return 'fuzzy';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^(.*)$/;
      }
    }]);

    return FuzzyMatch;
  }(BaseMatch);

  var searchers = [ExactMatch, PrefixExactMatch, InversePrefixExactMatch, InverseSuffixExactMatch, SuffixExactMatch, InverseExactMatch, FuzzyMatch];
  var searchersLen = searchers.length; // Regex to split by spaces, but keep anything in quotes together

  var SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
  var OR_TOKEN = '|'; // Return a 2D array representation of the query, for simpler parsing.
  // Example:
  // "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]

  function parseQuery(pattern) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return pattern.split(OR_TOKEN).map(function (item) {
      var query = item.trim().split(SPACE_RE).filter(function (item) {
        return item && !!item.trim();
      });
      var results = [];

      for (var i = 0, len = query.length; i < len; i += 1) {
        var queryItem = query[i]; // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)

        var found = false;
        var idx = -1;

        while (!found && ++idx < searchersLen) {
          var searcher = searchers[idx];
          var token = searcher.isMultiMatch(queryItem);

          if (token) {
            results.push(new searcher(token, options));
            found = true;
          }
        }

        if (found) {
          continue;
        } // 2. Handle single query matches (i.e, once that are *not* quoted)


        idx = -1;

        while (++idx < searchersLen) {
          var _searcher = searchers[idx];

          var _token = _searcher.isSingleMatch(queryItem);

          if (_token) {
            results.push(new _searcher(_token, options));
            break;
          }
        }
      }

      return results;
    });
  }

  // to a singl match

  var MultiMatchSet = new Set([FuzzyMatch.type, ExactMatch.type]);
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
    function ExtendedSearch(pattern) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$isCaseSensitive = _ref.isCaseSensitive,
          isCaseSensitive = _ref$isCaseSensitive === void 0 ? Config.isCaseSensitive : _ref$isCaseSensitive,
          _ref$includeMatches = _ref.includeMatches,
          includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
          _ref$minMatchCharLeng = _ref.minMatchCharLength,
          minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
          _ref$findAllMatches = _ref.findAllMatches,
          findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
          _ref$location = _ref.location,
          location = _ref$location === void 0 ? Config.location : _ref$location,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
          _ref$distance = _ref.distance,
          distance = _ref$distance === void 0 ? Config.distance : _ref$distance;

      _classCallCheck(this, ExtendedSearch);

      this.query = null;
      this.options = {
        isCaseSensitive: isCaseSensitive,
        includeMatches: includeMatches,
        minMatchCharLength: minMatchCharLength,
        findAllMatches: findAllMatches,
        location: location,
        threshold: threshold,
        distance: distance
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.query = parseQuery(this.pattern, this.options);
    }

    _createClass(ExtendedSearch, [{
      key: "searchIn",
      value: function searchIn(text) {
        var query = this.query;

        if (!query) {
          return {
            isMatch: false,
            score: 1
          };
        }

        var _this$options = this.options,
            includeMatches = _this$options.includeMatches,
            isCaseSensitive = _this$options.isCaseSensitive;
        text = isCaseSensitive ? text : text.toLowerCase();
        var numMatches = 0;
        var allIndices = [];
        var totalScore = 0; // ORs

        for (var i = 0, qLen = query.length; i < qLen; i += 1) {
          var searchers = query[i]; // Reset indices

          allIndices.length = 0;
          numMatches = 0; // ANDs

          for (var j = 0, pLen = searchers.length; j < pLen; j += 1) {
            var searcher = searchers[j];

            var _searcher$search = searcher.search(text),
                isMatch = _searcher$search.isMatch,
                indices = _searcher$search.indices,
                score = _searcher$search.score;

            if (isMatch) {
              numMatches += 1;
              totalScore += score;

              if (includeMatches) {
                var type = searcher.constructor.type;

                if (MultiMatchSet.has(type)) {
                  allIndices = [].concat(_toConsumableArray(allIndices), _toConsumableArray(indices));
                } else {
                  allIndices.push(indices);
                }
              }
            } else {
              totalScore = 0;
              numMatches = 0;
              allIndices.length = 0;
              break;
            }
          } // OR condition, so if TRUE, return


          if (numMatches) {
            var result = {
              isMatch: true,
              score: totalScore / numMatches
            };

            if (includeMatches) {
              result.indices = allIndices;
            }

            return result;
          }
        } // Nothing was matched


        return {
          isMatch: false,
          score: 1
        };
      }
    }], [{
      key: "condition",
      value: function condition(_, options) {
        return options.useExtendedSearch;
      }
    }]);

    return ExtendedSearch;
  }();

  var registeredSearchers = [];
  function register() {
    registeredSearchers.push.apply(registeredSearchers, arguments);
  }
  function createSearcher(pattern, options) {
    for (var i = 0, len = registeredSearchers.length; i < len; i += 1) {
      var searcherClass = registeredSearchers[i];

      if (searcherClass.condition(pattern, options)) {
        return new searcherClass(pattern, options);
      }
    }

    return new BitapSearch(pattern, options);
  }

  var LogicalOperator = {
    AND: '$and',
    OR: '$or'
  };

  var isExpression = function isExpression(query) {
    return !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
  };

  var isLeaf = function isLeaf(query) {
    return !isArray(query) && isObject(query) && !isExpression(query);
  };

  var convertToExplicit = function convertToExplicit(query) {
    return _defineProperty({}, LogicalOperator.AND, Object.keys(query).map(function (key) {
      return _defineProperty({}, key, query[key]);
    }));
  }; // When `auto` is `true`, the parse function will infer and initialize and add
  // the appropriate `Searcher` instance


  function parse(query, options) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref3$auto = _ref3.auto,
        auto = _ref3$auto === void 0 ? true : _ref3$auto;

    var next = function next(query) {
      var keys = Object.keys(query);

      if (keys.length > 1 && !isExpression(query)) {
        return next(convertToExplicit(query));
      }

      var key = keys[0];

      if (isLeaf(query)) {
        var pattern = query[key];

        if (!isString(pattern)) {
          throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
        }

        var obj = {
          key: key,
          pattern: pattern
        };

        if (auto) {
          obj.searcher = createSearcher(pattern, options);
        }

        return obj;
      }

      var node = {
        children: [],
        operator: key
      };
      keys.forEach(function (key) {
        var value = query[key];

        if (isArray(value)) {
          value.forEach(function (item) {
            node.children.push(next(item));
          });
        }
      });
      return node;
    };

    if (!isExpression(query)) {
      query = convertToExplicit(query);
    }

    return next(query);
  }

  var Fuse = /*#__PURE__*/function () {
    function Fuse(docs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var index = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, Fuse);

      this.options = _objectSpread2({}, Config, {}, options);

      if (this.options.useExtendedSearch && !true) {
        throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
      }

      this._keyStore = new KeyStore(this.options.keys);
      this.setCollection(docs, index);
    }

    _createClass(Fuse, [{
      key: "setCollection",
      value: function setCollection(docs, index) {
        this._docs = docs;

        if (index && !(index instanceof FuseIndex)) {
          throw new Error(INCORRECT_INDEX_TYPE);
        }

        this._myIndex = index || createIndex(this._keyStore.keys(), this._docs, {
          getFn: this.options.getFn
        });
      }
    }, {
      key: "add",
      value: function add(doc) {
        if (!isDefined(doc)) {
          return;
        }

        this._docs.push(doc);

        this._myIndex.add(doc);
      }
    }, {
      key: "removeAt",
      value: function removeAt(idx) {
        this._docs.splice(idx, 1);

        this._myIndex.removeAt(idx);
      }
    }, {
      key: "getIndex",
      value: function getIndex() {
        return this._myIndex;
      }
    }, {
      key: "search",
      value: function search(query) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$limit = _ref.limit,
            limit = _ref$limit === void 0 ? -1 : _ref$limit;

        var _this$options = this.options,
            includeMatches = _this$options.includeMatches,
            includeScore = _this$options.includeScore,
            shouldSort = _this$options.shouldSort,
            sortFn = _this$options.sortFn;
        var results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
        computeScore$1(results, this._keyStore);

        if (shouldSort) {
          results.sort(sortFn);
        }

        if (isNumber(limit) && limit > -1) {
          results = results.slice(0, limit);
        }

        return format(results, this._docs, {
          includeMatches: includeMatches,
          includeScore: includeScore
        });
      }
    }, {
      key: "_searchStringList",
      value: function _searchStringList(query) {
        var searcher = createSearcher(query, this.options);
        var records = this._myIndex.records;
        var results = []; // Iterate over every string in the index

        records.forEach(function (_ref2) {
          var text = _ref2.v,
              idx = _ref2.i,
              norm = _ref2.n;

          if (!isDefined(text)) {
            return;
          }

          var _searcher$searchIn = searcher.searchIn(text),
              isMatch = _searcher$searchIn.isMatch,
              score = _searcher$searchIn.score,
              indices = _searcher$searchIn.indices;

          if (isMatch) {
            results.push({
              item: text,
              idx: idx,
              matches: [{
                score: score,
                value: text,
                norm: norm,
                indices: indices
              }]
            });
          }
        });
        return results;
      }
    }, {
      key: "_searchLogical",
      value: function _searchLogical(query) {
        var _this = this;

        var expression = parse(query, this.options);
        var _this$_myIndex = this._myIndex,
            keys = _this$_myIndex.keys,
            records = _this$_myIndex.records;
        var resultMap = {};
        var results = [];

        var evaluateExpression = function evaluateExpression(node, item, idx) {
          if (node.children) {
            var operator = node.operator;
            var res = [];

            for (var k = 0; k < node.children.length; k += 1) {
              var child = node.children[k];
              var matches = evaluateExpression(child, item, idx);

              if (matches && matches.length) {
                res.push({
                  idx: idx,
                  item: item,
                  matches: matches
                });

                if (operator === LogicalOperator.OR) {
                  // Short-circuit
                  break;
                }
              } else if (operator === LogicalOperator.AND) {
                res.length = 0; // Short-circuit

                break;
              }
            }

            if (res.length) {
              // Dedupe when adding
              if (!resultMap[idx]) {
                resultMap[idx] = {
                  idx: idx,
                  item: item,
                  matches: []
                };
                results.push(resultMap[idx]);
              }

              res.forEach(function (_ref3) {
                var _resultMap$idx$matche;

                var matches = _ref3.matches;

                (_resultMap$idx$matche = resultMap[idx].matches).push.apply(_resultMap$idx$matche, _toConsumableArray(matches));
              });
            }
          } else {
            var key = node.key,
                searcher = node.searcher;
            var value = item[keys.indexOf(key)];
            return _this._findMatches({
              key: key,
              value: value,
              searcher: searcher
            });
          }
        };

        records.forEach(function (_ref4) {
          var item = _ref4.$,
              idx = _ref4.i;

          if (isDefined(item)) {
            evaluateExpression(expression, item, idx);
          }
        });
        return results;
      }
    }, {
      key: "_searchObjectList",
      value: function _searchObjectList(query) {
        var _this2 = this;

        var searcher = createSearcher(query, this.options);
        var _this$_myIndex2 = this._myIndex,
            keys = _this$_myIndex2.keys,
            records = _this$_myIndex2.records;
        var results = []; // List is Array<Object>

        records.forEach(function (_ref5) {
          var item = _ref5.$,
              idx = _ref5.i;

          if (!isDefined(item)) {
            return;
          }

          var matches = []; // Iterate over every key (i.e, path), and fetch the value at that key

          keys.forEach(function (key, keyIndex) {
            matches.push.apply(matches, _toConsumableArray(_this2._findMatches({
              key: key,
              value: item[keyIndex],
              searcher: searcher
            })));
          });

          if (matches.length) {
            results.push({
              idx: idx,
              item: item,
              matches: matches
            });
          }
        });
        return results;
      }
    }, {
      key: "_findMatches",
      value: function _findMatches(_ref6) {
        var key = _ref6.key,
            value = _ref6.value,
            searcher = _ref6.searcher;

        if (!isDefined(value)) {
          return [];
        }

        var matches = [];

        if (isArray(value)) {
          value.forEach(function (_ref7) {
            var text = _ref7.v,
                idx = _ref7.i,
                norm = _ref7.n;

            if (!isDefined(text)) {
              return;
            }

            var _searcher$searchIn2 = searcher.searchIn(text),
                isMatch = _searcher$searchIn2.isMatch,
                score = _searcher$searchIn2.score,
                indices = _searcher$searchIn2.indices;

            if (isMatch) {
              matches.push({
                score: score,
                key: key,
                value: text,
                idx: idx,
                norm: norm,
                indices: indices
              });
            }
          });
        } else {
          var text = value.v,
              norm = value.n;

          var _searcher$searchIn3 = searcher.searchIn(text),
              isMatch = _searcher$searchIn3.isMatch,
              score = _searcher$searchIn3.score,
              indices = _searcher$searchIn3.indices;

          if (isMatch) {
            matches.push({
              score: score,
              key: key,
              value: text,
              norm: norm,
              indices: indices
            });
          }
        }

        return matches;
      }
    }]);

    return Fuse;
  }(); // Practical scoring function

  function computeScore$1(results, keyStore) {
    results.forEach(function (result) {
      var totalScore = 1;
      result.matches.forEach(function (_ref8) {
        var key = _ref8.key,
            norm = _ref8.norm,
            score = _ref8.score;
        var weight = keyStore.get(key, 'weight');
        totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * norm);
      });
      result.score = totalScore;
    });
  }

  function format(results, docs) {
    var _ref9 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref9$includeMatches = _ref9.includeMatches,
        includeMatches = _ref9$includeMatches === void 0 ? Config.includeMatches : _ref9$includeMatches,
        _ref9$includeScore = _ref9.includeScore,
        includeScore = _ref9$includeScore === void 0 ? Config.includeScore : _ref9$includeScore;

    var transformers = [];
    if (includeMatches) transformers.push(transformMatches);
    if (includeScore) transformers.push(transformScore);
    return results.map(function (result) {
      var idx = result.idx;
      var data = {
        item: docs[idx],
        refIndex: idx
      };

      if (transformers.length) {
        transformers.forEach(function (transformer) {
          transformer(result, data);
        });
      }

      return data;
    });
  }

  Fuse.version = '6.0.0';
  Fuse.createIndex = createIndex;
  Fuse.parseIndex = parseIndex;
  Fuse.config = Config;

  {
    Fuse.parseQuery = parse;
  }

  {
    register(ExtendedSearch);
  }

  return Fuse;

})));
