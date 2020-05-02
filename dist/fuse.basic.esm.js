/**
 * Fuse.js v5.2.3 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2020 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

const INFINITY = 1 / 0;

const isArray = (value) =>
  !Array.isArray
    ? Object.prototype.toString.call(value) === '[object Array]'
    : Array.isArray(value);

// Adapted from:
// https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js
const baseToString = (value) => {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result
};

const toString = (value) => (value == null ? '' : baseToString(value));

const isString = (value) => typeof value === 'string';

const isNumber = (value) => typeof value === 'number';

const isObject = (value) => typeof value === 'object';

const isDefined = (value) => value !== undefined && value !== null;

const isBlank = (value) => !value.trim().length;

function get(obj, path) {
  let list = [];
  let arr = false;

  const _get = (obj, path) => {
    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj);
    } else {
      const dotIndex = path.indexOf('.');

      let key = path;
      let remaining = null;

      if (dotIndex !== -1) {
        key = path.slice(0, dotIndex);
        remaining = path.slice(dotIndex + 1);
      }

      const value = obj[key];

      if (isDefined(value)) {
        if (!remaining && (isString(value) || isNumber(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true;
          // Search each item in the array.
          for (let i = 0, len = value.length; i < len; i += 1) {
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
    return list
  }

  return list[0]
}

const MatchOptions = {
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

const BasicOptions = {
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
  sortFn: (a, b) =>
    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
};

const FuzzyOptions = {
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

const AdvancedOptions = {
  // When true, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get
};

var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
};

const SPACE = /[^ ]+/g;

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
function norm(mantissa = 3) {
  const cache = new Map();

  return {
    get(value) {
      const numTokens = value.match(SPACE).length;

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      const n = parseFloat((1 / Math.sqrt(numTokens)).toFixed(mantissa));

      cache.set(numTokens, n);

      return n
    },
    clear() {
      cache.clear();
    }
  }
}

function createIndex(keys, list, { getFn = Config.getFn } = {}) {
  let indexedList = [];
  let norm$1 = norm(3);

  // List is Array<String>
  if (isString(list[0])) {
    list.forEach((item, itemIndex) => {
      if (!isDefined(item) || isBlank(item)) {
        return
      }

      let record = {
        v: item,
        i: itemIndex,
        n: norm$1.get(item)
      };

      indexedList.push(record);
    });
  } else {
    // List is Array<Object>
    list.forEach((item, itemIndex) => {
      let record = { i: itemIndex, $: {} };

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        let value = getFn(item, key);

        if (!isDefined(value)) {
          return
        }

        if (isArray(value)) {
          let subRecords = [];
          const stack = [{ nestedArrIndex: -1, value }];

          while (stack.length) {
            const { nestedArrIndex, value } = stack.pop();

            if (!isDefined(value)) {
              continue
            }

            if (isString(value) && !isBlank(value)) {
              let subRecord = {
                v: value,
                i: nestedArrIndex,
                n: norm$1.get(value)
              };

              subRecords.push(subRecord);
            } else if (isArray(value)) {
              value.forEach((item, k) => {
                stack.push({
                  nestedArrIndex: k,
                  value: item
                });
              });
            }
          }
          record.$[keyIndex] = subRecords;
        } else if (!isBlank(value)) {
          let subRecord = {
            v: value,
            n: norm$1.get(value)
          };

          record.$[keyIndex] = subRecord;
        }
      });

      indexedList.push(record);
    });
  }

  norm$1.clear();

  return {
    keys,
    list: indexedList
  }
}

const hasOwn = Object.prototype.hasOwnProperty;

class KeyStore {
  constructor(keys) {
    this._keys = {};
    this._keyNames = [];
    const len = keys.length;

    // Iterate over every key
    if (keys.length && isString(keys[0])) {
      for (let i = 0; i < len; i += 1) {
        const key = keys[i];
        this._keys[key] = {
          weight: 1
        };
        this._keyNames.push(key);
      }
    } else {
      let totalWeight = 0;

      for (let i = 0; i < len; i += 1) {
        const key = keys[i];

        let obj = {};

        if (!hasOwn.call(key, 'name')) {
          throw new Error('Missing "name" property in key object')
        }

        const keyName = key.name;
        this._keyNames.push(keyName);

        if (!hasOwn.call(key, 'weight')) {
          throw new Error('Missing "weight" property in key object')
        }

        const weight = key.weight;

        if (weight <= 0 || weight >= 1) {
          throw new Error(
            '"weight" property in key must be in the range of (0, 1)'
          )
        }

        obj.weight = weight;

        if (hasOwn.call(key, 'threshold')) {
          obj.threshold = key.threshold;
        }

        this._keys[keyName] = obj;

        totalWeight += weight;
      }

      // Normalize weights so that their sum is equal to 1
      for (let i = 0; i < len; i += 1) {
        this._keys[this._keyNames[i]].weight /= totalWeight;
      }
    }
  }
  get(key, name) {
    return this._keys[key] && this._keys[key][name]
  }
  keys() {
    return this._keyNames
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}

function transformMatches(result, data) {
  const matches = result.matches;
  data.matches = [];

  if (!isDefined(matches)) {
    return
  }

  for (let i = 0, len = matches.length; i < len; i += 1) {
    let match = matches[i];

    if (!isDefined(match.indices) || match.indices.length === 0) {
      continue
    }

    const { indices, value } = match;

    let obj = {
      indices,
      value
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

function computeScore(
  pattern,
  {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance
  } = {}
) {
  const accuracy = errors / pattern.length;
  const proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy
  }

  return accuracy + proximity / distance
}

function convertMaskToIndices(
  matchmask = [],
  minMatchCharLength = Config.minMatchCharLength
) {
  let matchedIndices = [];
  let start = -1;
  let end = -1;
  let i = 0;

  for (let len = matchmask.length; i < len; i += 1) {
    let match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        matchedIndices.push([start, end]);
      }
      start = -1;
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    matchedIndices.push([start, i - 1]);
  }

  return matchedIndices
}

// Machine word size
const MAX_BITS = 32;

function search(
  text,
  pattern,
  patternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches
  } = {}
) {
  if (pattern.length > MAX_BITS) {
    throw new Error(`Pattern length exceeds max of ${MAX_BITS}.`)
  }

  const patternLen = pattern.length;
  // Set starting location at beginning text and initialize the alphabet.
  const textLen = text.length;
  // Handle the case when location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  // Highest score beyond which we give up.
  let currentThreshold = threshold;
  // Is there a nearby exact match? (speedup)
  let bestLocation = expectedLocation;

  // A mask of the matches, used for building the indices
  const matchMask = [];

  if (includeMatches) {
    for (let i = 0; i < textLen; i += 1) {
      matchMask[i] = 0;
    }
  }

  let index;

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore(pattern, {
      currentLocation: index,
      expectedLocation,
      distance
    });

    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;

    if (includeMatches) {
      let i = 0;
      while (i < patternLen) {
        matchMask[index + i] = 1;
        i += 1;
      }
    }
  }

  // Reset the best location
  bestLocation = -1;

  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;

  const mask = 1 << (patternLen <= MAX_BITS - 1 ? patternLen - 1 : MAX_BITS - 2);

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0;
    let binMid = binMax;

    while (binMin < binMid) {
      const score = computeScore(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance
      });

      if (score <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }

      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid;

    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen;

    // Initialize the bit array
    let bitArr = Array(finish + 2);

    bitArr[finish + 1] = (1 << i) - 1;

    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (charMatch && includeMatches) {
        matchMask[currentLocation] = 1;
      }

      // First pass: exact match
      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

      // Subsequent passes: fuzzy match
      if (i !== 0) {
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & mask) {
        finalScore = computeScore(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance
        });

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore;
          bestLocation = currentLocation;

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    const score = computeScore(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance
    });

    if (score > currentThreshold) {
      break
    }

    lastBitArr = bitArr;
  }

  let result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: !finalScore ? 0.001 : finalScore
  };

  if (includeMatches) {
    result.matchedIndices = convertMaskToIndices(matchMask, minMatchCharLength);
  }

  return result
}

function createPatternAlphabet(pattern) {
  let mask = {};
  let len = pattern.length;

  for (let i = 0; i < len; i += 1) {
    mask[pattern.charAt(i)] = 0;
  }

  for (let i = 0; i < len; i += 1) {
    mask[pattern.charAt(i)] |= 1 << (len - i - 1);
  }

  return mask
}

class BitapSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive
    } = {}
  ) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

    this.chunks = [];

    let index = 0;
    while (index < this.pattern.length) {
      let pattern = this.pattern.substring(index, index + MAX_BITS);
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern)
      });
      index += MAX_BITS;
    }
  }

  searchIn(value) {
    let text = value.v;
    return this.searchInString(text)
  }

  searchInString(text) {
    const { isCaseSensitive, includeMatches } = this.options;

    if (!isCaseSensitive) {
      text = text.toLowerCase();
    }

    // Exact match
    if (this.pattern === text) {
      let result = {
        isMatch: true,
        score: 0
      };

      if (includeMatches) {
        result.matchedIndices = [[0, text.length - 1]];
      }

      return result
    }

    // Otherwise, use Bitap algorithm
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength
    } = this.options;

    let allMatchedIndices = [];
    let totalScore = 0;
    let hasMatches = false;

    for (let i = 0, len = this.chunks.length; i < len; i += 1) {
      let { pattern, alphabet } = this.chunks[i];

      let result = search(text, pattern, alphabet, {
        location: location + MAX_BITS * i,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches
      });

      const { isMatch, score, matchedIndices } = result;

      if (isMatch) {
        hasMatches = true;
      }

      totalScore += score;

      if (isMatch && matchedIndices) {
        allMatchedIndices = [...allMatchedIndices, ...matchedIndices];
      }
    }

    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };

    if (hasMatches && includeMatches) {
      result.matchedIndices = allMatchedIndices;
    }

    return result
  }
}

const registeredSearchers = [];

function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}

const LogicalOperator = {
  AND: '$and',
  OR: '$or'
};

const OperatorSet = new Set(Object.values(LogicalOperator));

function parseQuery(query, options) {
  const next = (query) => {
    const keys = Object.keys(query);
    const key = keys[0];

    if (!isArray(query) && isObject(query) && !OperatorSet.has(key)) {
      const pattern = query[key];

      return {
        key,
        pattern,
        searcher: createSearcher(pattern, options)
      }
    }

    let node = {
      children: [],
      operator: key
    };

    keys.forEach((key) => {
      const value = query[key];
      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item));
        });
      }
    });

    return node
  };

  if (!query[LogicalOperator.AND] || !query[LogicalOperator.OR]) {
    query = {
      [LogicalOperator.AND]: Object.keys(query).map((key) => ({
        [key]: query[key]
      }))
    };
  }

  return next(query)
}

class Fuse {
  constructor(list, options = {}, index) {
    this.options = { ...Config, ...options };

    this._keyStore = new KeyStore(this.options.keys);
    this.setCollection(list, index);
  }

  setCollection(list, index) {
    this._list = list;

    this._index =
      index ||
      createIndex(this._keyStore.keys(), this._list, {
        getFn: this.options.getFn
      });
  }

  search(query, { limit = -1 } = {}) {
    let results = [];

    const { includeMatches, includeScore, shouldSort, sortFn } = this.options;

    if (isString(query)) {
      const searcher = createSearcher(query, this.options);

      results = isString(this._list[0])
        ? this._searchStringArrayWith(searcher)
        : this._searchAllWith(searcher);
    } else {
      let expression = parseQuery(query, this.options);

      const { keys, list } = this._index;

      const resultMap = {};

      list.forEach((listItem) => {
        let { $: item, i: idx } = listItem;

        if (!isDefined(item)) {
          return
        }

        const evaluateExpression = (node) => {
          if (node.children) {
            const operator = node.operator;
            let res = [];

            for (let k = 0; k < node.children.length; k += 1) {
              let child = node.children[k];
              let matches = evaluateExpression(child);

              if (matches && matches.length) {
                res.push({
                  idx,
                  item,
                  matches
                });
              } else if (operator === LogicalOperator.AND) {
                res.length = 0;
                break
              }
            }

            if (res.length) {
              // Dedupe when adding
              if (!resultMap[idx]) {
                resultMap[idx] = { idx, item, matches: [] };
                results.push(resultMap[idx]);
              }
              res.forEach((item) => {
                resultMap[idx].matches.push(...item.matches);
              });
            }
          } else {
            const { key, searcher } = node;
            const keyIndex = keys.indexOf(key);
            const value = item[keyIndex];

            let matches = this._findMatches({
              key,
              value,
              searcher
            });
            return matches
          }
        };

        evaluateExpression(expression);
      });
    }

    computeScore$1(results, this._keyStore);

    if (shouldSort) {
      results.sort(sortFn);
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }

    return format(results, this._list, {
      includeMatches,
      includeScore
    })
  }

  _searchStringArrayWith(searcher) {
    const { list } = this._index;
    const { includeMatches } = this.options;

    const results = [];

    // Iterate over every string in the list
    list.forEach((listItem) => {
      let { v: text, i: idx, n: norm } = listItem;

      if (!isDefined(text)) {
        return
      }

      let searchResult = searcher.searchIn(listItem);

      const { isMatch, score } = searchResult;

      if (!isMatch) {
        return
      }

      let match = { score, value: text, norm };

      if (includeMatches) {
        match.indices = searchResult.matchedIndices;
      }

      results.push({
        item: text,
        idx,
        matches: [match]
      });
    });

    return results
  }

  _searchLogicalWith({ key, searcher }) {
    const results = [];
    const { keys, list } = this._index;
    const keyIndex = keys.indexOf(key);

    list.forEach((listItem) => {
      let { $: item, i: idx } = listItem;

      if (!isDefined(item)) {
        return
      }

      let matches = this._findMatches({
        key,
        value: item[keyIndex],
        searcher
      });

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });

    return results
  }

  _searchAllWith(searcher) {
    const { keys, list } = this._index;
    const results = [];

    // List is Array<Object>
    list.forEach((listItem) => {
      let { $: item, i: idx } = listItem;

      if (!isDefined(item)) {
        return
      }

      let matches = [];

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, j) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[j],
            searcher
          })
        );
      });

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });

    return results
  }
  _findMatches({ key, value, searcher }) {
    let matches = [];

    if (!isDefined(value)) {
      return matches
    }

    const { includeMatches } = this.options;

    if (isArray(value)) {
      value.forEach((arrValue) => {
        const { v: text, i: idx, n: norm } = arrValue;

        if (!isDefined(text)) {
          return
        }

        let searchResult = searcher.searchIn(arrValue);

        const { isMatch, score } = searchResult;

        if (!isMatch) {
          return
        }

        let match = {
          score,
          key,
          value: text,
          idx,
          norm
        };

        if (includeMatches) {
          match.indices = searchResult.matchedIndices;
        }

        matches.push(match);
      });
    } else {
      const { v: text, n: norm } = value;

      let searchResult = searcher.searchIn(value);

      const { isMatch, score } = searchResult;

      if (!isMatch) {
        return []
      }

      let match = { score, key, value: text, norm };

      if (includeMatches) {
        match.indices = searchResult.matchedIndices;
      }

      matches.push(match);
    }

    return matches
  }
}

// Practical scoring function
function computeScore$1(results, keyStore) {
  results.forEach((result) => {
    let totalScore = 1;

    result.matches.forEach((match) => {
      const { key, norm } = match;

      const keyWeight = keyStore.get(key, 'weight') || -1;
      const weight = keyWeight > -1 ? keyWeight : 1;

      const score =
        match.score === 0 && keyWeight > -1 ? Number.EPSILON : match.score;

      totalScore *= Math.pow(score, weight * norm);
    });

    result.score = totalScore;
  });
}

function format(
  results,
  list,
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
) {
  const transformers = [];

  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);

  return results.map((result) => {
    const { idx } = result;

    const data = {
      item: list[idx],
      refIndex: idx
    };

    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    }

    return data
  })
}

Fuse.version = '5.2.3';
Fuse.createIndex = createIndex;
Fuse.config = Config;

export default Fuse;
