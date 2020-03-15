
const BitapSearch = require('./bitap-search')
const ExtendedSearch = require('./extended-search')
const NGramSearch = require('./ngram-search')
// const ngram = require('./ngram-search/ngram')
const {
  get,
  isArray,
  isDefined,
  isString,
  isNumber,
  isObject
} = require('./utils')
const { withMatches, withScore } = require('./formatters')
const { MAX_BITS } = require('./bitap-search/constants')

// Will print to the console. Useful for debugging.
function debug() {
  if (Fuse.verbose) {
    // console.log(...arguments)
    const util = require('util')
    console.log(util.inspect(...arguments, false, null, true /* enable colors */))
  }
}

function debugTime(value) {
  if (Fuse.verboseTime) {
    console.time(value)
  }
}

function debugTimeEnd(value) {
  if (Fuse.verboseTime) {
    console.timeEnd(value)
  }
}

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
    // List of properties that will be searched. This also supports nested properties.
    keys = [],
    // Whether to sort the result list, by score
    shouldSort = true,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn = get,
    // Default sort function
    sortFn = (a, b) => (a.score - b.score),

    includeMatches = false,
    includeScore = false,

    // Enabled extended-searching
    useExtendedSearch = false,
  }) {
    this.options = {
      location,
      distance,
      threshold,
      isCaseSensitive: caseSensitive,
      findAllMatches,
      minMatchCharLength,
      keys,
      includeMatches,
      includeScore,
      shouldSort,
      getFn,
      sortFn,
      useExtendedSearch
    }

    debugTime('Constructing')
    this._processKeys(keys)
    this.setCollection(list)
    debugTimeEnd('Constructing')
  }

  setCollection(list) {
    this.list = list
    this.listIsStringArray = isString(list[0])
    this._buildIndexedList()
    return list
  }

  _processKeys(keys) {
    this._keyWeights = {}
    this._keyNames = []

    // Iterate over every key
    if (keys.length && isString(keys[0])) {
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

  _buildIndexedList() {
    const list = this.list
    this._indexedList = []

    const { isCaseSensitive } = this.options

    // List is Array<String>
    if (this.listIsStringArray) {
      // Iterate over every string in the list
      for (let i = 0, len = list.length; i < len; i += 1) {
        const value = list[i]

        if (isDefined(value)) {
          // if (!isCaseSensitive) {
          //   value = value.toLowerCase()
          // }

          this._indexedList.push({
            $: value,
            idx: i,
            // ng: ngram(value, { sort: true })
          })
        }
      }

    } else {
      // List is Array<Object>
      const getFn = this.options.getFn
      const keyNames = this._keyNames
      const keysLen = keyNames.length

      for (let i = 0, len = list.length; i < len; i += 1) {
        let item = list[i]

        let entry = {
          idx: i,
          $: {}
        }

        // Iterate over every key (i.e, path), and fetch the value at that key
        for (let j = 0; j < keysLen; j += 1) {
          let key = keyNames[j]
          let value = getFn(item, key)

          if (!isDefined(value)) {
            continue
          }

          if (isArray(value)) {
            let entries = []
            const stack = [{ arrayIndex: -1, value }]

            while (stack.length) {
              const { arrayIndex, value } = stack.pop()

              if (!isDefined(value)) {
                continue
              }

              if (isString(value)) {

                let $ = value
                // if (!isCaseSensitive) {
                //   v = v.toLowerCase()
                // }

                entries.push({
                  $,
                  idx: arrayIndex,
                  // ng: ngram(value, { sort: true })
                })
              } else if (isArray(value)) {
                for (let k = 0, arrLen = value.length; k < arrLen; k += 1) {
                  stack.push({
                    arrayIndex: k,
                    value: value[k],
                  })
                }
              }
            }
            entry.$[key] = entries
          } else {
            // if (!isCaseSensitive) {
            //   value = value.toLowerCase()
            // }

            entry.$[key] = {
              $: value,
              // ng: ngram(value, { sort: true })
            }
          }
        }

        this._indexedList.push(entry)
      }
    }

    debug('Processed List')
    debug(this._indexedList)
  }

  search(pattern, opts = { limit: false }) {
    debug(`--------- Search pattern: "${pattern}"`)

    const { useExtendedSearch, shouldSort } = this.options

    let searcher = null

    if (useExtendedSearch) {
      searcher = new ExtendedSearch(pattern, this.options)
    } else if (pattern.length > MAX_BITS) {
      searcher = new NGramSearch(pattern, this.options)
    } else {
      searcher = new BitapSearch(pattern, this.options)
    }

    debugTime('Search time');
    let results = this._searchUsing(searcher)
    debugTimeEnd('Search time');

    debugTime('Compute score time');
    this._computeScore(results)
    debugTimeEnd('Compute score time');

    if (shouldSort) {
      this._sort(results)
    }

    if (opts.limit && isNumber(opts.limit)) {
      results = results.slice(0, opts.limit)
    }

    return this._format(results)
  }

  _searchUsing(searcher) {
    const list = this._indexedList
    const resultMap = {}
    const results = []
    const { includeMatches } = this.options

    // List is Array<String>
    if (this.listIsStringArray) {
      // Iterate over every string in the list
      for (let i = 0, len = list.length; i < len; i += 1) {
        let value = list[i]
        let { $: text, idx } = value

        if (!isDefined(text)) {
          continue
        }

        let searchResult = searcher.searchIn(value)

        const { isMatch, score } = searchResult

        if (!isMatch) {
          continue
        }

        let match = { score, value: text }

        if (includeMatches) {
          match.indices = searchResult.matchedIndices
        }

        results.push({
          item: text,
          idx,
          matches: [match]
        })
      }

    } else {
      // List is Array<Object>
      const keyNames = this._keyNames
      const keysLen = keyNames.length

      for (let i = 0, len = list.length; i < len; i += 1) {
        let { $: item, idx } = list[i]

        if (!isDefined(item)) {
          continue
        }

        let matches = []

        // Iterate over every key (i.e, path), and fetch the value at that key
        for (let j = 0; j < keysLen; j += 1) {
          let key = keyNames[j]
          let value = item[key]

          debug(` Key: ${key === '' ? '--' : key}`)

          if (!isDefined(value)) {
            continue
          }

          if (isArray(value)) {
            for (let k = 0, len = value.length; k < len; k += 1) {
              let arrItem = value[k]
              let text = arrItem.$
              let idx = arrItem.idx

              if (!isDefined(text)) {
                continue
              }

              let searchResult = searcher.searchIn(arrItem)

              const { isMatch, score } = searchResult

              debug(`Full text: "${text}", score: ${score}`)

              if (!isMatch) {
                continue
              }

              let match = { score, key, value: text, idx }

              if (includeMatches) {
                match.indices = searchResult.matchedIndices
              }

              matches.push(match)
            }
          } else {
            let text = value.$
            let searchResult = searcher.searchIn(value)
            const { isMatch, score } = searchResult

            debug(`Full text: "${text}", score: ${score}`)

            if (!isMatch) {
              continue
            }

            let match = { score, key, value: text }

            if (includeMatches) {
              match.indices = searchResult.matchedIndices
            }

            matches.push(match)
          }
        }

        if (matches.length) {
          results.push({
            idx,
            item,
            matches
          })
        }
      }
    }

    debug("--------- RESULTS -----------")
    debug(results)
    debug("-----------------------------")

    return results
  }

  _computeScore(results) {
    debug('Computing score: ')

    const weights = this._keyWeights
    const hasWeights = !!Object.keys(weights).length

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
      const matches = result.matches
      const scoreLen = matches.length

      let totalWeightedScore = 1

      let bestScore = -1

      for (let j = 0; j < scoreLen; j += 1) {
        const item = matches[j]
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

      debug(result)
    }
  }

  _sort(results) {
    debug('Sorting....')
    results.sort(this.options.sortFn)
  }

  _format(results) {
    const finalOutput = []

    const { includeMatches, includeScore, } = this.options

    if (Fuse.verbose) {
      let cache = []
      debug('Output:', JSON.stringify(results, (key, value) => {
        if (isObject(value) && isDefined(value)) {
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

    debug("===== RESULTS ======")
    debug(results)
    debug("====================")

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]

      debug('result', result)

      const { idx } = result

      const data = {
        item: this.list[idx],
        refIndex: idx
      }

      if (transformers.length) {
        for (let j = 0, len = transformers.length; j < len; j += 1) {
          transformers[j](result, data)
        }
      }


      finalOutput.push(data)
    }

    return finalOutput
  }
}

Fuse.verbose = false
Fuse.verboseTime = false

module.exports = Fuse
