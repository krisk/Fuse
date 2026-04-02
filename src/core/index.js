import { isArray, isDefined, isString, isNumber } from '../helpers/types'
import KeyStore from '../tools/KeyStore'
import FuseIndex, { createIndex } from '../tools/FuseIndex'
import { LogicalOperator, parse } from './queryParser'
import { createSearcher } from './register'
import Config from './config'
import computeScore, { computeScoreSingle } from './computeScore'
import MaxHeap from '../tools/MaxHeap'
import format from './format'
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

    this._lastQuery = null
    this._lastSearcher = null
  }

  _getSearcher(query) {
    if (this._lastQuery === query) {
      return this._lastSearcher
    }
    const searcher = createSearcher(query, this.options)
    this._lastQuery = query
    this._lastSearcher = searcher
    return searcher
  }

  setCollection(docs, index) {
    this._docs = docs

    if (index && !(index instanceof FuseIndex)) {
      throw new Error(ErrorMsg.INCORRECT_INDEX_TYPE)
    }

    this._myIndex =
      index ||
      createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      })
  }

  add(doc) {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc)
    this._myIndex.add(doc)
  }

  remove(predicate = (/* doc, idx */) => false) {
    const results = []
    const indicesToRemove = []

    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      if (predicate(this._docs[i], i)) {
        results.push(this._docs[i])
        indicesToRemove.push(i)
      }
    }

    if (indicesToRemove.length) {
      // Remove from docs in reverse to preserve indices
      for (let i = indicesToRemove.length - 1; i >= 0; i -= 1) {
        this._docs.splice(indicesToRemove[i], 1)
      }
      this._myIndex.removeAll(indicesToRemove)
    }

    return results
  }

  removeAt(idx) {
    this._docs.splice(idx, 1)
    this._myIndex.removeAt(idx)
  }

  getIndex() {
    return this._myIndex
  }

  search(query, { limit = -1 } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options

    const useHeap = isNumber(limit) && limit > 0 && isString(query)

    let results

    if (useHeap) {
      const heap = new MaxHeap(limit)
      if (isString(this._docs[0])) {
        this._searchStringList(query, { heap, ignoreFieldNorm })
      } else {
        this._searchObjectList(query, { heap, ignoreFieldNorm })
      }
      results = heap.extractSorted(sortFn)
    } else {
      results = isString(query)
        ? isString(this._docs[0])
          ? this._searchStringList(query)
          : this._searchObjectList(query)
        : this._searchLogical(query)

      computeScore(results, { ignoreFieldNorm })

      if (shouldSort) {
        results.sort(sortFn)
      }

      if (isNumber(limit) && limit > -1) {
        results = results.slice(0, limit)
      }
    }

    return format(results, this._docs, {
      includeMatches,
      includeScore
    })
  }

  _searchStringList(query, { heap, ignoreFieldNorm } = {}) {
    const searcher = this._getSearcher(query)
    const { records } = this._myIndex
    const results = heap ? null : []

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const { isMatch, score, indices } = searcher.searchIn(text)

      if (isMatch) {
        const result = {
          item: text,
          idx,
          matches: [{ score, value: text, norm, indices }]
        }

        if (heap) {
          computeScoreSingle(result, { ignoreFieldNorm })
          if (heap.shouldInsert(result.score)) {
            heap.insert(result)
          }
        } else {
          results.push(result)
        }
      }
    })

    return results
  }

  _searchLogical(query) {
    if (!process.env.LOGICAL_SEARCH_ENABLED) {
      throw new Error(ErrorMsg.LOGICAL_SEARCH_UNAVAILABLE)
    }

    const expression = parse(query, this.options)

    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node

        const matches = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        })

        if (matches && matches.length) {
          return [
            {
              idx,
              item,
              matches
            }
          ]
        }

        return []
      }

      const res = []
      for (let i = 0, len = node.children.length; i < len; i += 1) {
        const child = node.children[i]
        const result = evaluate(child, item, idx)
        if (result.length) {
          res.push(...result)
        } else if (node.operator === LogicalOperator.AND) {
          return []
        }
      }
      return res
    }

    const records = this._myIndex.records
    const resultMap = new Map()
    const results = []

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx)

        if (expResults.length) {
          // Dedupe when adding
          if (!resultMap.has(idx)) {
            resultMap.set(idx, { idx, item, matches: [] })
            results.push(resultMap.get(idx))
          }
          expResults.forEach(({ matches }) => {
            resultMap.get(idx).matches.push(...matches)
          })
        }
      }
    })

    return results
  }

  _searchObjectList(query, { heap, ignoreFieldNorm } = {}) {
    const searcher = this._getSearcher(query)
    const { keys, records } = this._myIndex
    const results = heap ? null : []

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
        const result = { idx, item, matches }

        if (heap) {
          computeScoreSingle(result, { ignoreFieldNorm })
          if (heap.shouldInsert(result.score)) {
            heap.insert(result)
          }
        } else {
          results.push(result)
        }
      }
    })

    return results
  }
  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) {
      // For inverse matchers, a missing value should be a match
      // (e.g., !doe should match when the field is null/undefined)
      const { isMatch, score, indices } = searcher.searchIn('')
      if (isMatch) {
        return [{ score, key, value: '', norm: 1, indices }]
      }
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
