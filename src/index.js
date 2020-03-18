
const { BitapSearch, ExtendedSearch, NGramSearch } = require('./search')
const { isArray, isDefined, isString, isNumber, isObject } = require('./helpers/type-checkers')
const get = require('./helpers/get')
const { createIndex, KeyStore } = require('./tools')
const { transformMatches, transformScore } = require('./transform')
const { MAX_BITS } = require('./search/bitap-search/constants')

// // Will print to the console. Useful for debugging.
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

let FuseOptions = {
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
  sortFn: (a, b) => (a.score - b.score),
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Enabled extended-searching
  useExtendedSearch: false
}

class Fuse {
  constructor(list, options = FuseOptions, index = null) {
    this.options = { ...FuseOptions, ...options }
    // `caseSensitive` is deprecated, use `isCaseSensitive` instead
    this.options.isCaseSensitive = options.caseSensitive
    delete this.options.caseSensitive

    // debugTime('Constructing')
    this._processKeys(this.options.keys)
    this.setCollection(list, index)
    // debugTimeEnd('Constructing')
  }

  setCollection(list, index = null) {
    this.list = list
    this.listIsStringArray = isString(list[0])

    if (index) {
      this.setIndex(index)
    } else {
      // debugTime('Process index')
      this.setIndex(this._createIndex())
      // debugTimeEnd('Process index')
    }
  }

  setIndex(listIndex) {
    this._indexedList = listIndex
    // debug(listIndex)
  }

  _processKeys(keys) {
    this._keyStore = new KeyStore(keys)

    // debug('Process Keys')
    if (Fuse.verbose) {
      // debug(this._keyStore.toJSON())
    }
  }

  _createIndex() {
    return createIndex(this._keyStore.keys(), this.list, {
      getFn: this.options.getFn
    })
  }

  search(pattern, opts = { limit: false }) {
    // debug(`--------- Search pattern: "${pattern}"`)
    const { useExtendedSearch, shouldSort } = this.options

    let searcher = null

    if (useExtendedSearch) {
      searcher = new ExtendedSearch(pattern, this.options)
    } else if (pattern.length > MAX_BITS) {
      searcher = new NGramSearch(pattern, this.options)
    } else {
      searcher = new BitapSearch(pattern, this.options)
    }

    // debugTime('Search time');
    let results = this._searchUsing(searcher)
    // debugTimeEnd('Search time');

    // debugTime('Compute score time');
    this._computeScore(results)
    // debugTimeEnd('Compute score time');

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
      const keyNames = this._keyStore.keys()
      const keysLen = this._keyStore.count()

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

          // debug(` Key: ${key === '' ? '--' : key}`)

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

              // debug(`Full text: "${text}", score: ${score}`)

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

            // debug(`Full text: "${text}", score: ${score}`)

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

    // debug("--------- RESULTS -----------")
    // debug(results)
    // debug("-----------------------------")

    return results
  }

  _computeScore(results) {
    // debug('Computing score: ')

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
      const matches = result.matches
      const scoreLen = matches.length

      let totalWeightedScore = 1
      // let bestScore = -1

      for (let j = 0; j < scoreLen; j += 1) {
        const item = matches[j]
        const key = item.key
        const keyWeight = this._keyStore.get(key, 'weight')
        const weight = keyWeight > -1 ? keyWeight : 1
        const score = item.score === 0 && keyWeight > -1
          ? Number.EPSILON
          : item.score

        totalWeightedScore *= Math.pow(score, weight)

        // Keep track of the best score.. just in case
        // Actually, we're not really using it.. but need to think of a way to incorporate this
        // bestScore = bestScore == -1 ? item.score : Math.min(bestScore, item.score)
      }

      result.score = totalWeightedScore
      // result.$score = bestScore

      // debug(result)
    }
  }

  _sort(results) {
    // debug('Sorting....')
    results.sort(this.options.sortFn)
  }

  _format(results) {
    const finalOutput = []

    const { includeMatches, includeScore, } = this.options

    // if (Fuse.verbose) {
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

    let transformers = []

    if (includeMatches) transformers.push(transformMatches)
    if (includeScore) transformers.push(transformScore)

    // debug("===== RESULTS ======")
    // debug(results)
    // debug("====================")

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]

      // debug('result', result)

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

Fuse.createIndex = createIndex

module.exports = Fuse
