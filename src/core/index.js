import { BitapSearch } from '../search'
import {
  isArray,
  isDefined,
  isString,
  isNumber
} from '../helpers/type-checkers'
import { createIndex, KeyStore } from '../tools'
import { transformMatches, transformScore } from '../transform'
import Config from './config'

const registeredSearchers = []

export function register(...args) {
  registeredSearchers.push(...args)
}

export default class Fuse {
  constructor(list, options = {}, index) {
    this.options = { ...Config, ...options }

    this._keyStore = new KeyStore(this.options.keys)
    this.setCollection(list, index)
  }

  setCollection(list, index) {
    this._list = list
    this._listIsStringArray = isString(list[0])

    this._index =
      index ||
      createIndex(this._keyStore.keys(), this._list, {
        getFn: this.options.getFn
      })
  }

  search(pattern, { limit = -1 } = {}) {
    pattern = pattern.trim()

    if (!pattern.length) {
      return []
    }

    const { shouldSort } = this.options

    let searcher = null

    for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
      let searcherClass = registeredSearchers[i]
      if (searcherClass.condition(pattern, this.options)) {
        searcher = new searcherClass(pattern, this.options)
        break
      }
    }

    if (!searcher) {
      searcher = new BitapSearch(pattern, this.options)
    }

    let results = this._searchWith(searcher)

    this._computeScore(results)

    if (shouldSort) {
      results.sort(this.options.sortFn)
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit)
    }

    return this._format(results)
  }

  _searchWith(searcher) {
    const { keys, list } = this._index
    const results = []
    const { includeMatches } = this.options
    const len = list.length

    // List is Array<String>
    if (this._listIsStringArray) {
      // Iterate over every string in the list
      for (let i = 0; i < len; i += 1) {
        let value = list[i]
        let { v: text, i: idx, n: norm } = value

        if (!isDefined(text)) {
          continue
        }

        let searchResult = searcher.searchIn(value)

        const { isMatch, score } = searchResult

        if (!isMatch) {
          continue
        }

        let match = { score, value: text, norm }

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
      const keysLen = keys.length

      for (let i = 0; i < len; i += 1) {
        let { $: item, i: idx } = list[i]

        if (!isDefined(item)) {
          continue
        }

        let matches = []

        // Iterate over every key (i.e, path), and fetch the value at that key
        for (let j = 0; j < keysLen; j += 1) {
          const key = keys[j]
          const value = item[j]

          if (!isDefined(value)) {
            continue
          }

          if (isArray(value)) {
            for (let k = 0, len = value.length; k < len; k += 1) {
              let arrItem = value[k]
              const { v: text, i: idx, n: norm } = arrItem

              if (!isDefined(text)) {
                continue
              }

              let searchResult = searcher.searchIn(arrItem)

              const { isMatch, score } = searchResult

              if (!isMatch) {
                continue
              }

              let match = { score, key, value: text, idx, norm }

              if (includeMatches) {
                match.indices = searchResult.matchedIndices
              }

              matches.push(match)
            }
          } else {
            const { v: text, n: norm } = value

            let searchResult = searcher.searchIn(value)

            const { isMatch, score } = searchResult

            if (!isMatch) {
              continue
            }

            let match = { score, key, value: text, norm }

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

  // Practical scoring function
  _computeScore(results) {
    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
      const matches = result.matches
      const numMatches = matches.length

      let totalScore = 1

      for (let j = 0; j < numMatches; j += 1) {
        const match = matches[j]
        const { key, norm } = match

        const keyWeight = this._keyStore.get(key, 'weight')
        const weight = keyWeight > -1 ? keyWeight : 1
        const score =
          match.score === 0 && keyWeight > -1 ? Number.EPSILON : match.score

        totalScore *= Math.pow(score, weight * norm)
      }

      result.score = totalScore
    }
  }

  _format(results) {
    const output = []

    const { includeMatches, includeScore } = this.options

    let transformers = []

    if (includeMatches) transformers.push(transformMatches)
    if (includeScore) transformers.push(transformScore)

    for (let i = 0, len = results.length; i < len; i += 1) {
      const result = results[i]
      const { idx } = result

      const data = {
        item: this._list[idx],
        refIndex: idx
      }

      if (transformers.length) {
        for (let j = 0, len = transformers.length; j < len; j += 1) {
          transformers[j](result, data)
        }
      }

      output.push(data)
    }

    return output
  }
}
