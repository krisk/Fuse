import { isArray } from '../helpers/types.js'
import { isNumber } from '../helpers/types.js'
import { isString } from '../helpers/types.js'
import { isDefined } from '../helpers/types.js'

import KeyStore from '../tools/KeyStore.js'
import FuseIndex from '../tools/FuseIndex.js'
import { createIndex } from '../tools/FuseIndex.js'

import Config from './config.js'
import format from './format.js'
import computeScore from './computeScore.js'
import { createSearcher } from './register.js'

import { parse } from './queryParser.js'
import { LogicalOperator } from './queryParser.js'

import { IncorrectIndexTypeException } from './error.js'
import { LogicalSearchUnavailableException } from './error.js'
import { ExtendedSearchUnavailableException } from './error.js'

class Fuse {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options }

    if (this.options.useExtendedSearch && !process.env.EXTENDED_SEARCH_ENABLED)
      throw new ExtendedSearchUnavailableException()

    this._keyStore = new KeyStore(this.options.keys)

    this.setCollection(docs, index)
  }

  setCollection(docs, index) {
    this._docs = docs

    if (index && !(index instanceof FuseIndex))
      throw new IncorrectIndexTypeException()

    this._myIndex =
      index ||
      createIndex(this.options.keys, this._docs, {
        _get: this.options._get
      })
  }

  add(doc) {
    if (!isDefined(doc)) return

    this._docs.push(doc)
    this._myIndex.add(doc)
  }

  remove(predicate = (doc, idx) => false) {
    const results = []

    for (let i = 0, doc_len = this._docs.length; i < doc_len; i++) {
      const doc = this._docs[i]

      if (!predicate(doc, i)) continue

      this.removeAt(i)
      i--
      len--

      results.push(doc)
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
      _sort,
      ignoreFieldNorm
    } = this.options

    let results = isString(query)
      ? isString(this._docs[0])
        ? this._searchStringList(query)
        : this._searchObjectList(query)
      : this._searchLogical(query)

    computeScore(results, { ignoreFieldNorm })

    if (shouldSort) results.sort(_sort)

    if (isNumber(limit) && limit > -1) results = results.slice(0, limit)

    return format(results, this._docs, {
      includeMatches,
      includeScore
    })
  }

  _searchStringList(query) {
    const results = []
    const { records } = this._myIndex
    const searcher = createSearcher(query, this.options)

    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) return

      const { isMatch, score, indices } = searcher.searchIn(text)

      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [
            {
              score,
              value: text,
              norm,
              indices
            }
          ]
        })
      }
    })

    return results
  }

  _searchLogical(query) {
    if (!process.env.LOGICAL_SEARCH_ENABLED)
      throw new LogicalSearchUnavailableException()

    const expression = parse(query, this.options)

    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node

        const matches = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        })

        if (!(matches && matches.length)) return []

        return [{ idx, item, matches }]
      }

      switch (node.operator) {
        case LogicalOperator.AND: {
          const res = []

          for (
            let i = 0, child_len = node.children.length;
            i < child_len;
            i++
          ) {
            const child = node.children[i]
            const result = evaluate(child, item, idx)

            if (!result.length) return []

            res.push(...result)
          }

          return res
        }
        case LogicalOperator.OR: {
          const res = []

          for (
            let i = 0, child_len = node.children.length;
            i < child_len;
            i++
          ) {
            const child = node.children[i]
            const result = evaluate(child, item, idx)

            if (!result.length) continue

            res.push(...result)
            break
          }

          return res
        }
      }
    }

    const records = this._myIndex.records
    const results = []
    const resultMap = {}

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx)

        if (expResults.length) {
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
    const results = []
    const { keys, records } = this._myIndex
    const searcher = createSearcher(query, this.options)

    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) return

      let matches = []

      keys.forEach((key, keyIndex) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          })
        )
      })

      if (matches.length) results.push({ idx, item, matches })
    })

    return results
  }

  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) return []

    let matches = []

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }) => {
        if (!isDefined(text)) return

        const { isMatch, score, indices } = searcher.searchIn(text)

        if (isMatch)
          matches.push({ score, key, value: text, idx, norm, indices })
      })
      return matches
    }

    const { v: text, n: norm } = value
    const { isMatch, score, indices } = searcher.searchIn(text)

    if (isMatch) matches.push({ score, key, value: text, norm, indices })

    return matches
  }
}

export default Fuse
