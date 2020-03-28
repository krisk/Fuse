import { BitapSearch, ExtendedSearch, NGramSearch } from '../search'
import {
  isArray,
  isDefined,
  isString,
  isNumber
} from '../helpers/type-checkers'
import get from '../helpers/get'
import { createIndex, KeyStore } from '../tools'
import { transformMatches, transformScore } from '../transform'
import { MAX_BITS } from '../search/bitap-search/constants'

const FuseOptions = {
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
  sortFn: (a, b) => a.score - b.score,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Enabled extended-searching
  useExtendedSearch: false
}

export default class Fuse {
  constructor(list, options = FuseOptions, index = null) {
    this.options = { ...FuseOptions, ...options }
    // `caseSensitive` is deprecated, use `isCaseSensitive` instead
    this.options.isCaseSensitive = options.caseSensitive
    delete this.options.caseSensitive

    this._processKeys(this.options.keys)
    this.setCollection(list, index)
  }

  setCollection(list, index = null) {
    this.list = list
    this.listIsStringArray = isString(list[0])

    if (index) {
      this.setIndex(index)
    } else {
      this.setIndex(this._createIndex())
    }
  }

  setIndex(listIndex) {
    this._indexedList = listIndex
  }

  _processKeys(keys) {
    this._keyStore = new KeyStore(keys)
  }

  _createIndex() {
    return createIndex(this._keyStore.keys(), this.list, {
      getFn: this.options.getFn
    })
  }

  search(pattern, opts = { limit: false }) {
    const { useExtendedSearch, shouldSort } = this.options

    let searcher = null

    if (useExtendedSearch) {
      searcher = new ExtendedSearch(pattern, this.options)
    } else if (pattern.length > MAX_BITS) {
      searcher = new NGramSearch(pattern, this.options)
    } else {
      searcher = new BitapSearch(pattern, this.options)
    }

    let results = this._searchUsing(searcher)

    this._computeScore(results)

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

    return results
  }

  _computeScore(results) {
    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
      const matches = result.matches
      const scoreLen = matches.length

      let totalWeightedScore = 1

      for (let j = 0; j < scoreLen; j += 1) {
        const item = matches[j]
        const key = item.key
        const keyWeight = this._keyStore.get(key, 'weight')
        const weight = keyWeight > -1 ? keyWeight : 1
        const score =
          item.score === 0 && keyWeight > -1 ? Number.EPSILON : item.score

        totalWeightedScore *= Math.pow(score, weight)
      }

      result.score = totalWeightedScore
    }
  }

  _sort(results) {
    results.sort(this.options.sortFn)
  }

  _format(results) {
    const finalOutput = []

    const { includeMatches, includeScore } = this.options

    let transformers = []

    if (includeMatches) transformers.push(transformMatches)
    if (includeScore) transformers.push(transformScore)

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
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
