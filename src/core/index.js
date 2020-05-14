import { isArray, isDefined, isString, isNumber } from '../helpers/types'
import KeyStore from '../tools/KeyStore'
import FuseIndex, { createIndex } from '../tools/FuseIndex'
import { transformMatches, transformScore } from '../transform'
import { LogicalOperator, parse } from './queryParser'
import { createSearcher } from './register'
import Config from './config'
import * as ErrorMsg from './errorMessages'

export default class Fuse {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options }

    if (
      this.options.useExtendedSearch &&
      !process.env.EXTENDED_SEARCH_ENABLED
    ) {
      throw new Error(ErrorMsg.EXTENDED_SEARCH_UNAVAILABLE)
    }

    this._keyStore = new KeyStore(this.options.keys)

    this.setCollection(docs, index)
  }

  setCollection(docs, index) {
    this._docs = docs

    if (index && !(index instanceof FuseIndex)) {
      throw new Error(ErrorMsg.INCORRECT_INDEX_TYPE)
    }

    this._myIndex =
      index ||
      createIndex(this._keyStore.keys(), this._docs, {
        getFn: this.options.getFn
      })
  }

  add(doc) {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc)
    this._myIndex.add(doc)
  }

  removeAt(idx) {
    this._docs.splice(idx, 1)
    this._myIndex.removeAt(idx)
  }

  getIndex() {
    return this._myIndex
  }

  search(query, { limit = -1 } = {}) {
    const { includeMatches, includeScore, shouldSort, sortFn } = this.options

    let results = isString(query)
      ? isString(this._docs[0])
        ? this._searchStringList(query)
        : this._searchObjectList(query)
      : this._searchLogical(query)

    computeScore(results, this._keyStore)

    if (shouldSort) {
      results.sort(sortFn)
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit)
    }

    return format(results, this._docs, {
      includeMatches,
      includeScore
    })
  }

  _searchStringList(query) {
    const searcher = createSearcher(query, this.options)
    const { records } = this._myIndex
    const results = []

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const { isMatch, score, indices } = searcher.searchIn(text)

      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{ score, value: text, norm, indices }]
        })
      }
    })

    return results
  }

  _searchLogical(query) {
    if (!process.env.LOGICAL_SEARCH_ENABLED) {
      throw new Error(ErrorMsg.LOGICAL_SEARCH_UNAVAILABLE)
    }

    const expression = parse(query, this.options)
    const { keys, records } = this._myIndex
    const resultMap = {}
    const results = []

    const evaluateExpression = (node, item, idx) => {
      if (node.children) {
        const operator = node.operator
        let res = []

        for (let k = 0; k < node.children.length; k += 1) {
          let child = node.children[k]
          let matches = evaluateExpression(child, item, idx)

          if (matches && matches.length) {
            res.push({
              idx,
              item,
              matches
            })
            if (operator === LogicalOperator.OR) {
              // Short-circuit
              break
            }
          } else if (operator === LogicalOperator.AND) {
            res.length = 0
            // Short-circuit
            break
          }
        }

        if (res.length) {
          // Dedupe when adding
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] }
            results.push(resultMap[idx])
          }
          res.forEach(({ matches }) => {
            resultMap[idx].matches.push(...matches)
          })
        }
      } else {
        const { key, searcher } = node
        const value = item[keys.indexOf(key)]

        return this._findMatches({
          key,
          value,
          searcher
        })
      }
    }

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        evaluateExpression(expression, item, idx)
      }
    })

    return results
  }

  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options)
    const { keys, records } = this._myIndex
    const results = []

    // List is Array<Object>
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return
      }

      let matches = []

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
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
    if (!isDefined(value)) {
      return []
    }

    let matches = []

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }) => {
        if (!isDefined(text)) {
          return
        }

        const { isMatch, score, indices } = searcher.searchIn(text)

        if (isMatch) {
          matches.push({
            score,
            key,
            value: text,
            idx,
            norm,
            indices
          })
        }
      })
    } else {
      const { v: text, n: norm } = value

      const { isMatch, score, indices } = searcher.searchIn(text)

      if (isMatch) {
        matches.push({ score, key, value: text, norm, indices })
      }
    }

    return matches
  }
}

// Practical scoring function
function computeScore(results, keyStore) {
  results.forEach((result) => {
    let totalScore = 1

    result.matches.forEach(({ key, norm, score }) => {
      const weight = keyStore.get(key, 'weight')

      totalScore *= Math.pow(
        score === 0 && weight ? Number.EPSILON : score,
        (weight || 1) * norm
      )
    })

    result.score = totalScore
  })
}

function format(
  results,
  docs,
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
      item: docs[idx],
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
