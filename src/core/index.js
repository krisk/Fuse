import { isArray, isDefined, isString, isNumber } from '../helpers/types'
import KeyStore from '../tools/KeyStore'
import FuseIndex, { createIndex } from '../tools/FuseIndex'
import { LogicalOperator, parse } from './queryParser'
import { createSearcher } from './register'
import Config from './config'
import computeScore from './computeScore'
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

    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      const doc = this._docs[i]
      if (predicate(doc, i)) {
        this.removeAt(i)
        i -= 1
        len -= 1

        results.push(doc)
      }
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

    let results = isString(query)
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

      /*eslint indent: [2, 2, {"SwitchCase": 1}]*/
      switch (node.operator) {
        case LogicalOperator.AND: {
          const res = []
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i]
            const result = evaluate(child, item, idx)
            if (result.length) {
              res.push(...result)
            } else {
              return []
            }
          }
          return res
        }
        case LogicalOperator.OR: {
          const res = []
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i]
            const result = evaluate(child, item, idx)
            if (result.length) {
              res.push(...result)
              break
            }
          }
          return res
        }
      }
    }

    const records = this._myIndex.records
    const resultMap = {}
    const results = []

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx)

        if (expResults.length) {
          // Dedupe when adding
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] }
            results.push(resultMap[idx])
          }
          expResults.forEach(({ matches }) => {
            resultMap[idx].matches.push(...matches)
          })
        }
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
