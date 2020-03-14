const BitapSearch = require('./bitap-search')
const ExtendedSearch = require('./extended-search')
const NGramSearch = require('./ngram-search')
const { get, isArray } = require('./utils')
const { withMatches, withScore } = require('./formatters')
const { MAX_BITS } = require('./bitap-search/constants')

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
    // Indicates whether comparisons should be case sensitive.
    caseSensitive = false,
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
      isCaseSensitive: caseSensitive,
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
    this.listIsStringArray = typeof list[0] == 'string'
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
        this._keyWeights[keyName] = keyWeight

        if (keyWeight < 0 || keyWeight > 1) {
          throw new Error('"weight" property in key must bein the range of [0, 1)')
        }


        weightsTotal += keyWeight
      }

      if (weightsTotal > 1) {
        throw new Error('Total of weights cannot exceed 1')
      }
    }
  }

  search(pattern, opts = { limit: false }) {
    this._log(`---------\nSearch pattern: "${pattern}"`)

    const { useExtendedSearch, shouldSort } = this.options

    let searcher = null

    if (useExtendedSearch) {
      searcher = new ExtendedSearch(pattern, this.options)
    } else if (pattern.length > MAX_BITS) {
      searcher = new NGramSearch(pattern, this.options)
    } else {
      searcher = new BitapSearch(pattern, this.options)
    }

    // console.time('_search');
    let results = this._searchUsing(searcher)
    // console.timeEnd('_search');

    //console.time('_computeScore');
    this._computeScore(results)
    //console.timeEnd('_computeScore');

    if (shouldSort) {
      this._sort(results)
    }

    if (opts.limit && typeof opts.limit === 'number') {
      results = results.slice(0, opts.limit)
    }

    return this._format(results)
  }

  _searchUsing(searcher) {
    const list = this.list
    const resultMap = {}
    const results = []

    // List is Array<String>
    if (this.listIsStringArray) {
      // Iterate over every string in the list
      for (let i = 0, len = list.length; i < len; i += 1) {
        this._analyze(searcher, {
          key: '',
          value: list[i],
          record: i,
          index: i
        }, {
          resultMap,
          results
        })
      }

    } else {
      // List is Array<Object>

      const getFn = this.options.getFn
      const keyNames = this._keyNames
      const keysLen = keyNames.length

      for (let i = 0, len = list.length; i < len; i += 1) {
        let item = list[i]
        // Iterate over every key (i.e, path), and fetch the value at that key
        for (let j = 0; j < keysLen; j += 1) {
          let key = keyNames[j]

          this._analyze(searcher, {
            key,
            value: getFn(item, key),
            record: item,
            index: i
          }, {
            resultMap,
            results
          })
        }
      }
    }

    return results
  }

  _analyze(searcher, { key, value, record, index }, { resultMap = {}, results = [] }) {
    // Internal search function for cleanless and speed up.
    const { includeMatches } = this.options

    // initialize stack with the first entry
    const stack = [{ arrayIndex: -1, value, record, index }]

    while (stack.length) {
      const { arrayIndex, value, record, index } = stack.pop()

      if (value === undefined || value === null) {
        continue
      }

      if (typeof value === 'string') {
        this._log(`\nKey: ${key === '' ? '--' : key}`)
        let searchResult = searcher.searchIn(value)

        const { isMatch, score } = searchResult

        this._log(`Full text: "${value}", score: ${score}`)

        if (!isMatch) {
          continue
        }

        let _searchResult = { key, arrayIndex, value, score }

        if (includeMatches) {
          _searchResult.matchedIndices = searchResult.matchedIndices
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
      } else if (isArray(value)) {
        for (let i = 0, len = value.length; i < len; i += 1) {
          stack.push({
            arrayIndex: i,
            value: value[i],
            record,
            index
          })
        }
      }
    }

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

        // Keep track of the best score.. just in case
        // Actually, we're not really using it.. but need to think of a way to incorporate this
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

    const {
      includeMatches,
      includeScore,
      id,
      getFn,
      verbose
    } = this.options

    if (verbose) {
      let cache = []
      this._log('\n\nOutput:\n\n', JSON.stringify(results, (key, value) => {
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

    if (includeMatches) transformers.push(withMatches)
    if (includeScore) transformers.push(withScore)

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]

      if (id) {
        result.item = getFn(result.item, id)[0]
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
