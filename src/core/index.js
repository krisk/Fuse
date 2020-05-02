import {
  isArray,
  isDefined,
  isString,
  isNumber
} from '../helpers/type-checkers'
import { createIndex, KeyStore } from '../tools'
import { transformMatches, transformScore } from '../transform'
import { LogicalOperator, parse } from './queryParser'
import { createSearcher } from './register'
import Config from './config'

export default class Fuse {
  constructor(list, options = {}, index) {
    this.options = { ...Config, ...options }

    this._keyStore = new KeyStore(this.options.keys)
    this.setCollection(list, index)
  }

  setCollection(list, index) {
    this._list = list

    this._index =
      index ||
      createIndex(this._keyStore.keys(), this._list, {
        getFn: this.options.getFn
      })
  }

  search(query, { limit = -1 } = {}) {
    let results = []

    const { includeMatches, includeScore, shouldSort, sortFn } = this.options

    if (isString(query)) {
      const searcher = createSearcher(query, this.options)

      results = isString(this._list[0])
        ? this._searchStringArrayWith(searcher)
        : this._searchAllWith(searcher)
    } else {
      let expression = parse(query, this.options)

      const { keys, list } = this._index

      const resultMap = {}

      list.forEach((listItem) => {
        let { $: item, i: idx } = listItem

        if (!isDefined(item)) {
          return
        }

        const evaluateExpression = (node) => {
          if (node.children) {
            const operator = node.operator
            let res = []

            for (let k = 0; k < node.children.length; k += 1) {
              let child = node.children[k]
              let matches = evaluateExpression(child)

              if (matches && matches.length) {
                res.push({
                  idx,
                  item,
                  matches
                })
              } else if (operator === LogicalOperator.AND) {
                res.length = 0
                break
              }
            }

            if (res.length) {
              // Dedupe when adding
              if (!resultMap[idx]) {
                resultMap[idx] = { idx, item, matches: [] }
                results.push(resultMap[idx])
              }
              res.forEach((item) => {
                resultMap[idx].matches.push(...item.matches)
              })
            }
          } else {
            const { key, searcher } = node
            const keyIndex = keys.indexOf(key)
            const value = item[keyIndex]

            let matches = this._findMatches({
              key,
              value,
              searcher
            })
            return matches
          }
        }

        evaluateExpression(expression)
      })
    }

    computeScore(results, this._keyStore)

    if (shouldSort) {
      results.sort(sortFn)
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit)
    }

    return format(results, this._list, {
      includeMatches,
      includeScore
    })
  }

  _searchStringArrayWith(searcher) {
    const { list } = this._index
    const { includeMatches } = this.options

    const results = []

    // Iterate over every string in the list
    list.forEach((listItem) => {
      let { v: text, i: idx, n: norm } = listItem

      if (!isDefined(text)) {
        return
      }

      let searchResult = searcher.searchIn(listItem)

      const { isMatch, score } = searchResult

      if (!isMatch) {
        return
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
    })

    return results
  }

  _searchLogicalWith({ key, searcher }) {
    const results = []
    const { keys, list } = this._index
    const keyIndex = keys.indexOf(key)

    list.forEach((listItem) => {
      let { $: item, i: idx } = listItem

      if (!isDefined(item)) {
        return
      }

      let matches = this._findMatches({
        key,
        value: item[keyIndex],
        searcher
      })

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        })
      }
    })

    return results
  }

  _searchAllWith(searcher) {
    const { keys, list } = this._index
    const results = []

    // List is Array<Object>
    list.forEach((listItem) => {
      let { $: item, i: idx } = listItem

      if (!isDefined(item)) {
        return
      }

      let matches = []

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, j) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[j],
            searcher
          })
        )
      })

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        })
      }
    })

    return results
  }
  _findMatches({ key, value, searcher }) {
    let matches = []

    if (!isDefined(value)) {
      return matches
    }

    const { includeMatches } = this.options

    if (isArray(value)) {
      value.forEach((arrValue) => {
        const { v: text, i: idx, n: norm } = arrValue

        if (!isDefined(text)) {
          return
        }

        let searchResult = searcher.searchIn(arrValue)

        const { isMatch, score } = searchResult

        if (!isMatch) {
          return
        }

        let match = {
          score,
          key,
          value: text,
          idx,
          norm
        }

        if (includeMatches) {
          match.indices = searchResult.matchedIndices
        }

        matches.push(match)
      })
    } else {
      const { v: text, n: norm } = value

      let searchResult = searcher.searchIn(value)

      const { isMatch, score } = searchResult

      if (!isMatch) {
        return []
      }

      let match = { score, key, value: text, norm }

      if (includeMatches) {
        match.indices = searchResult.matchedIndices
      }

      matches.push(match)
    }

    return matches
  }
}

// Practical scoring function
function computeScore(results, keyStore) {
  results.forEach((result) => {
    let totalScore = 1

    result.matches.forEach((match) => {
      const { key, norm } = match

      const keyWeight = keyStore.get(key, 'weight') || -1
      const weight = keyWeight > -1 ? keyWeight : 1

      const score =
        match.score === 0 && keyWeight > -1 ? Number.EPSILON : match.score

      totalScore *= Math.pow(score, weight * norm)
    })

    result.score = totalScore
  })
}

function format(
  results,
  list,
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
) {
  const transformers = []

  if (includeMatches) transformers.push(transformMatches)
  if (includeScore) transformers.push(transformScore)

  return results.map((result) => {
    const { idx } = result

    const data = {
      item: list[idx],
      refIndex: idx
    }

    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data)
      })
    }

    return data
  })
}
