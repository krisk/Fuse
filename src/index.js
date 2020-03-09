const BitapSearch = require('./bitap-search')
const EntendedSearch = require('./extended-search')
const { get, isArray } = require('./utils')

class Fuse {
  constructor(list, {
    // Approximately where in the text is the pattern expected to be found?
    location = 0,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance = 100,
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold = 0.6,
    // Machine word size
    maxPatternLength = 32,
    // Indicates whether comparisons should be case sensitive.
    caseSensitive = false,
    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.
    tokenSeparator = / +/g,
    // When true, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    findAllMatches = false,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength = 1,
    // The name of the identifier property. If specified, the returned result will be a list
    // of the items' dentifiers, otherwise it will be a list of the items.
    id = null,
    // List of properties that will be searched. This also supports nested properties.
    keys = [],
    // Whether to sort the result list, by score
    shouldSort = true,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn = get,
    // Default sort function
    sortFn = (a, b) => (a.score - b.score),
    // When true, the result set will only include records that match all tokens. Will only work
    // if `tokenize` is also true.
    matchAllTokens = false,

    includeMatches = false,
    includeScore = false,

    // Enabled extended-searching
    useExtendedSearch = false,

    // Will print to the console. Useful for debugging.
    verbose = false
  }) {
    this.options = {
      location,
      distance,
      threshold,
      maxPatternLength,
      isCaseSensitive: caseSensitive,
      tokenSeparator,
      findAllMatches,
      minMatchCharLength,
      id,
      keys,
      includeMatches,
      includeScore,
      shouldSort,
      getFn,
      sortFn,
      verbose,
      matchAllTokens,
      useExtendedSearch
    }

    this.setCollection(list)
    this._processKeys(keys)
  }

  setCollection(list) {
    this.list = list
    return list
  }

  _processKeys(keys) {
    this._keyWeights = {}
    this._keyNames = []

    // Iterate over every key
    if (keys.length && typeof keys[0] == 'string') {
      for (let i = 0, keysLen = keys.length; i < keysLen; i += 1) {
        const key = keys[i]
        this._keyWeights[key] = 1
        this._keyNames.push(key)
      }
    } else {
      let lowest = null
      let highest = null
      let weightsTotal = 0

      for (let i = 0, keysLen = keys.length; i < keysLen; i += 1) {
        const key = keys[i]

        if (!key.hasOwnProperty('name')) {
          throw new Error('Missing "name" property in key object')
        }

        const keyName = key.name
        this._keyNames.push(keyName)

        if (!key.hasOwnProperty('weight')) {
          throw new Error('Missing "weight" property in key object')
        }

        const keyWeight = key.weight

        if (keyWeight < 0 || keyWeight > 1) {
          throw new Error('"weight" property in key must bein the range of [0, 1)')
        }

        if (highest == null) {
          highest = keyWeight
        } else {
          highest = Math.max(highest, keyWeight)
        }

        if (lowest == null) {
          lowest = keyWeight
        } else {
          lowest = Math.min(lowest, keyWeight)
        }

        this._keyWeights[keyName] = keyWeight

        weightsTotal += keyWeight
      }

      if (weightsTotal > 1) {
        throw new Error('Total of weights cannot exceed 1')
      }
    }
  }

  search(pattern, opts = { limit: false }) {
    this._log(`---------\nSearch pattern: "${pattern}"`)

    const options = this.options

    let searcher = null

    if (this.options.useExtendedSearch) {
      searcher = new EntendedSearch(pattern, options)
    } else {
      searcher = new BitapSearch(pattern, options)
    }

    //console.time('_search');
    let results = this._search(searcher)
    //console.timeEnd('_search');

    //console.time('_computeScore');
    this._computeScore(results)
    //console.timeEnd('_computeScore');

    if (this.options.shouldSort) {
      this._sort(results)
    }

    if (opts.limit && typeof opts.limit === 'number') {
      results = results.slice(0, opts.limit)
    }

    return this._format(results)
  }

  _search(searcher) {
    const list = this.list
    const resultMap = {}
    const results = []

    // Check the first item in the list, if it's a string, then we assume
    // that every item in the list is also a string, and thus it's a flattened array.
    if (typeof list[0] === 'string') {
      // Iterate over every item
      for (let i = 0, len = list.length; i < len; i += 1) {
        this._analyze({
          key: '',
          value: list[i],
          record: i,
          index: i
        }, {
          resultMap,
          results,
          searcher
        })
      }
      return results
    }

    // Otherwise, the first item is an Object (hopefully), and thus the searching
    // is done on the values of the keys of each item.
    for (let i = 0, len = list.length; i < len; i += 1) {
      let item = list[i]
      // Iterate over every key
      for (let j = 0, keysLen = this._keyNames.length; j < keysLen; j += 1) {
        let key = this._keyNames[j]

        this._analyze({
          key,
          value: this.options.getFn(item, key),
          record: item,
          index: i
        }, {
          resultMap,
          results,
          searcher
        })
      }
    }

    return results
  }

  _analyze({ key, arrayIndex = -1, value, record, index }, { searcher, resultMap = {}, results = [] }) {
    // Internal search function for cleanless and speed up.
    const search = (arrayIndex, value, record, index) => {
      // Check if the texvaluet can be searched
      if (value === undefined || value === null) {
        return
      }

      if (typeof value === 'string') {
        let exists = false
        let averageScore = -1

        this._log(`\nKey: ${key === '' ? '--' : key}`)

        let mainSearchResult = searcher.search(value)

        this._log(`Full text: "${value}", score: ${mainSearchResult.score}`)

        let finalScore = mainSearchResult.score
        if (averageScore > -1) {
          finalScore = (finalScore + averageScore) / 2
        }

        this._log('Score average:', finalScore)

        // If a match is found, add the item to <rawResults>, including its score
        if (exists || mainSearchResult.isMatch) {
          let _searchResult = {
            key,
            arrayIndex,
            value,
            score: finalScore
          }

          if (this.options.includeMatches) {
            _searchResult.matchedIndices = mainSearchResult.matchedIndices
          }

          // Check if the item already exists in our results
          let existingResult = resultMap[index]
          if (existingResult) {
            existingResult.output.push(_searchResult)
          } else {
            resultMap[index] = {
              item: record,
              output: [_searchResult]
            }

            results.push(resultMap[index])
          }
        }
      } else if (isArray(value)) {
        for (let i = 0, len = value.length; i < len; i += 1) {
          search(i, value[i], record, index)
        }
      }
    }

    search(arrayIndex, value, record, index)
  }

  _computeScore(results) {
    this._log('\n\nComputing score:\n')

    const weights = this._keyWeights
    const hasWeights = !!Object.keys(weights).length

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
      const output = result.output
      const scoreLen = output.length

      let totalWeightedScore = 1

      let bestScore = -1

      for (let j = 0; j < scoreLen; j += 1) {
        const item = output[j]
        const key = item.key
        const weight = hasWeights ? weights[key] : 1
        const score = item.score === 0 && weights && weights[key] > 0
          ? Number.EPSILON
          : item.score

        bestScore = bestScore == -1 ? item.score : Math.min(bestScore, item.score)

        totalWeightedScore *= Math.pow(score, weight)
      }

      result.score = totalWeightedScore
      result.$score = bestScore

      this._log(result)
    }
  }

  _sort(results) {
    this._log('\n\nSorting....')
    results.sort(this.options.sortFn)
  }

  _format(results) {
    const finalOutput = []

    if (this.options.verbose) {
      let cache = []
      this._log('\n\nOutput:\n\n', JSON.stringify(results, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return
          }
          // Store value in our collection
          cache.push(value)
        }
        return value
      }, 2))
      cache = null
    }

    let transformers = []

    if (this.options.includeMatches) {
      transformers.push((result, data) => {
        const output = result.output
        data.matches = []

        for (let i = 0, len = output.length; i < len; i += 1) {
          let item = output[i]

          if (item.matchedIndices.length === 0) {
            continue
          }

          let obj = {
            indices: item.matchedIndices,
            value: item.value
          }
          if (item.key) {
            obj.key = item.key
          }
          if (item.hasOwnProperty('arrayIndex') && item.arrayIndex > -1) {
            obj.arrayIndex = item.arrayIndex
          }
          data.matches.push(obj)
        }
      })
    }

    if (this.options.includeScore) {
      transformers.push((result, data) => {
        data.score = result.score
      })
    }

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]

      if (this.options.id) {
        result.item = this.options.getFn(result.item, this.options.id)[0]
      }

      if (!transformers.length) {
        finalOutput.push(result.item)
        continue
      }

      const data = {
        item: result.item
      }

      for (let j = 0, len = transformers.length; j < len; j += 1) {
        transformers[j](result, data)
      }

      finalOutput.push(data)
    }

    return finalOutput
  }

  _log() {
    if (this.options.verbose) {
      console.log(...arguments)
    }
  }
}

module.exports = Fuse
