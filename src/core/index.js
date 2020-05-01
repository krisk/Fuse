import { BitapSearch } from '../search'
import {
  isArray,
  isDefined,
  isString,
  isNumber,
  isObject
} from '../helpers/type-checkers'
import { createIndex, KeyStore } from '../tools'
import { transformMatches, transformScore } from '../transform'
import Config from './config'

const registeredSearchers = []

const LogicalOperator = {
  AND: '$and',
  OR: '$or'
}

const OperatorSet = new Set(Object.values(LogicalOperator))

////////
const util = require('util')
const print = (result) => {
  console.log(util.inspect(result, false, null, true /* enable colors */))
}
///////

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

  search(criteria, { limit = -1 } = {}) {
    let results = []
    const options = this.options

    if (isString(criteria)) {
      const searcher = createSearcher(criteria, options)

      if (isString(this._list[0])) {
        results = this._searchStringArrayWith(searcher)
      } else {
        results = this._searchAllWith(searcher)
      }
    } else {
      let root = parseQuery(criteria, options)

      const { keys, list } = this._index

      const _results = []

      for (let i = 0, len = list.length; i < len; i += 1) {
        let { $: item, i: idx } = list[i]

        if (!isDefined(item)) {
          continue
        }

        const walkTree = (node) => {
          if (node.children) {
            const operator = node.operator
            let res = []

            for (let k = 0; k < node.children.length; k += 1) {
              let child = node.children[k]
              let matches = walkTree(child)

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
              _results.push(...res)
            }
          } else {
            const { key, searcher } = node
            const keyIndex = keys.indexOf(key)
            const value = item[keyIndex]
            let matches = this._searchNestedWith({
              key,
              value,
              searcher
            })
            return matches
          }
        }

        walkTree(root)
      }

      results = dedupe(_results)
    }

    const { shouldSort, sortFn } = this.options

    this._computeScore(results)

    if (shouldSort) {
      results.sort(sortFn)
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit)
    }

    return this._format(results)
  }

  _searchStringArrayWith(searcher) {
    const { list } = this._index
    const { includeMatches } = this.options

    const results = []

    // Iterate over every string in the list
    for (let i = 0, len = list.length; i < len; i += 1) {
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

    return results
  }

  _searchLogicalWith({ key, searcher }) {
    const results = []
    const { keys, list } = this._index
    const keyIndex = keys.indexOf(key)

    for (let i = 0, len = list.length; i < len; i += 1) {
      let { $: item, i: idx } = list[i]

      if (!isDefined(item)) {
        continue
      }

      const value = item[keyIndex]

      // console.log({ key, value })

      let matches = this._searchNestedWith({
        key,
        value,
        searcher
      })

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        })
      }
    }

    return results
  }

  _searchAllWith(searcher) {
    const results = []

    const { keys, list } = this._index
    const len = list.length

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

        matches.push(
          ...this._searchNestedWith({
            key,
            value,
            searcher
          })
        )
      }

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        })
      }
    }

    return results
  }

  _searchNestedWith({ key, value, searcher }) {
    let matches = []

    if (!isDefined(value)) {
      return matches
    }

    const { includeMatches } = this.options

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
      }
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

export function register(...args) {
  registeredSearchers.push(...args)
}

function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i]
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}

function parseQuery(query, options) {
  const next = (query) => {
    const keys = Object.keys(query)
    const key = keys[0]

    if (!isArray(query) && isObject(query) && !OperatorSet.has(key)) {
      const pattern = query[key]

      return {
        key,
        pattern,
        searcher: createSearcher(pattern, options)
      }
    }

    let node = {
      children: [],
      operator: key
    }

    keys.forEach((key) => {
      const value = query[key]
      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item))
        })
      }
    })

    return node
  }

  if (!query[LogicalOperator.AND] || !query[LogicalOperator.OR]) {
    query = {
      [LogicalOperator.AND]: Object.keys(query).map((key) => ({
        [key]: query[key]
      }))
    }
  }

  return next(query)
}

function dedupe(items) {
  const results = []
  let map = {}
  for (let i = 0, len = items.length; i < len; i += 1) {
    let item = items[i]
    if (map[item.idx]) {
      map[item.idx].matches.push(...item.matches)
    } else {
      map[item.idx] = item
      results.push(item)
    }
  }
  return results
}
