import { isArray, isDefined, isString, isNumber } from '../helpers/typeGuards'
import KeyStore from '../tools/KeyStore'
import FuseIndex, { createIndex } from '../tools/FuseIndex'
import {
  LogicalOperator,
  parse,
  type ParsedNode,
  type ParsedLeaf,
  type ParsedOperator
} from './queryParser'
import { createSearcher } from './register'
import Config from './config'
import computeScore, { computeScoreSingle } from './computeScore'
import MaxHeap from '../tools/MaxHeap'
import format from './format'
import * as ErrorMsg from './errorMessages'
import { createAnalyzer } from '../search/token/analyzer'
import { MAX_MASK_TERMS } from '../search/token'
import {
  buildInvertedIndex,
  addToInvertedIndex,
  removeAndShiftInvertedIndex
} from '../search/token/InvertedIndex'
import type { InvertedIndexData } from '../search/token/InvertedIndex'
import type {
  Searcher,
  SearchResult,
  InternalResult,
  MatchScore,
  IFuseOptions,
  FuseSearchOptions,
  FuseResult,
  Expression,
  KeyObject,
  SubRecord
} from '../types'

interface HeapSearchOptions {
  heap?: MaxHeap
  ignoreFieldNorm?: boolean
}

export default class Fuse<T> {
  options: Required<IFuseOptions<T>>
  _keyStore: KeyStore
  _docs: T[]
  _myIndex: FuseIndex<T>
  _invertedIndex: InvertedIndexData | null
  _lastQuery: string | null
  _lastSearcher: Searcher | null

  // Statics are assigned in entry.ts
  static version: string
  static createIndex: typeof createIndex
  static parseIndex: typeof import('../tools/FuseIndex').parseIndex
  static config: typeof Config
  static parseQuery: typeof parse
  static use: (...plugins: any[]) => void
  static match: (
    pattern: string,
    text: string,
    options?: IFuseOptions<any>
  ) => SearchResult

  constructor(
    docs: ReadonlyArray<T>,
    options?: IFuseOptions<T>,
    index?: FuseIndex<T>
  ) {
    this.options = { ...Config, ...options } as Required<IFuseOptions<T>>

    if (
      this.options.useExtendedSearch &&
      !process.env.EXTENDED_SEARCH_ENABLED
    ) {
      throw new Error(ErrorMsg.EXTENDED_SEARCH_UNAVAILABLE)
    }

    if (this.options.useTokenSearch && !process.env.TOKEN_SEARCH_ENABLED) {
      throw new Error(ErrorMsg.TOKEN_SEARCH_UNAVAILABLE)
    }

    this._keyStore = new KeyStore(this.options.keys)

    this._docs = docs as T[]
    this._myIndex = null as any
    this._invertedIndex = null

    this.setCollection(docs, index)

    this._lastQuery = null
    this._lastSearcher = null
  }

  _getSearcher(query: string): Searcher {
    if (this._lastQuery === query) {
      return this._lastSearcher!
    }
    const opts = this._invertedIndex
      ? { ...this.options, _invertedIndex: this._invertedIndex }
      : this.options
    const searcher = createSearcher(query, opts)
    this._lastQuery = query
    this._lastSearcher = searcher
    return searcher
  }

  setCollection(docs: ReadonlyArray<T>, index?: FuseIndex<T>): void {
    this._docs = docs as T[]

    if (index && !(index instanceof FuseIndex)) {
      throw new Error(ErrorMsg.INCORRECT_INDEX_TYPE)
    }

    this._myIndex =
      index ||
      createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      })

    if (this.options.useTokenSearch) {
      const analyzer = createAnalyzer({
        isCaseSensitive: this.options.isCaseSensitive,
        ignoreDiacritics: this.options.ignoreDiacritics,
        tokenize: this.options.tokenize
      })
      this._invertedIndex = buildInvertedIndex(
        this._myIndex.records,
        this._myIndex.keys.length,
        analyzer
      )
    }

    this._invalidateSearcherCache()
  }

  add(doc: T): void {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc)
    const record = this._myIndex.add(doc, this._docs.length - 1)

    // Skip inverted-index bookkeeping when no record was appended (blank
    // strings produce null). The previous code read `records[records.length-1]`
    // unconditionally, which would re-ingest the previous doc on `add("")`.
    if (this._invertedIndex && record) {
      const analyzer = createAnalyzer({
        isCaseSensitive: this.options.isCaseSensitive,
        ignoreDiacritics: this.options.ignoreDiacritics,
        tokenize: this.options.tokenize
      })
      addToInvertedIndex(
        this._invertedIndex,
        record,
        this._myIndex.keys.length,
        analyzer
      )
    }

    this._invalidateSearcherCache()
  }

  remove(predicate: (doc: T, idx: number) => boolean = () => false): T[] {
    const results: T[] = []
    const indicesToRemove: number[] = []

    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      if (predicate(this._docs[i], i)) {
        results.push(this._docs[i])
        indicesToRemove.push(i)
      }
    }

    if (indicesToRemove.length) {
      if (this._invertedIndex) {
        removeAndShiftInvertedIndex(this._invertedIndex, indicesToRemove)
      }

      // Filter docs in a single pass instead of reverse-splicing
      const toRemove = new Set(indicesToRemove)
      this._docs = this._docs.filter((_, i) => !toRemove.has(i))
      this._myIndex.removeAll(indicesToRemove)

      this._invalidateSearcherCache()
    }

    return results
  }

  removeAt(idx: number): T {
    // Validate before any mutation. The previous code spliced `_docs` first
    // and let FuseIndex.removeAt throw afterward — partial-state on invalid
    // input. Atomic now.
    if (!Number.isInteger(idx) || idx < 0 || idx >= this._docs.length) {
      throw new Error(ErrorMsg.INVALID_DOC_INDEX)
    }

    if (this._invertedIndex) {
      removeAndShiftInvertedIndex(this._invertedIndex, [idx])
    }
    const doc = this._docs.splice(idx, 1)[0]
    this._myIndex.removeAt(idx)
    this._invalidateSearcherCache()
    return doc
  }

  _invalidateSearcherCache(): void {
    this._lastQuery = null
    this._lastSearcher = null
  }

  getIndex(): FuseIndex<T> {
    return this._myIndex
  }

  search(
    query: string | Expression,
    options?: FuseSearchOptions
  ): FuseResult<T>[] {
    const { limit = -1 } = options || {}
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options

    // Empty string query returns all docs (useful for search UIs)
    if (isString(query) && !query.trim()) {
      let docs: FuseResult<T>[] = this._docs.map((item, idx) => ({
        item,
        refIndex: idx
      }))
      if (isNumber(limit) && limit > -1) {
        docs = docs.slice(0, limit)
      }
      return docs
    }

    const useHeap = isNumber(limit) && limit > 0 && isString(query)

    let results: InternalResult[]

    if (useHeap) {
      const heap = new MaxHeap(limit)
      if (isString(this._docs[0])) {
        this._searchStringList(query as string, { heap, ignoreFieldNorm })
      } else {
        this._searchObjectList(query as string, { heap, ignoreFieldNorm })
      }
      results = heap.extractSorted(sortFn as any)
    } else {
      results = isString(query)
        ? isString(this._docs[0])
          ? this._searchStringList(query)!
          : this._searchObjectList(query)!
        : this._searchLogical(query as Expression)

      computeScore(results, { ignoreFieldNorm })

      if (shouldSort) {
        results.sort(sortFn as any)
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

  _searchStringList(
    query: string,
    { heap, ignoreFieldNorm }: HeapSearchOptions = {}
  ): InternalResult[] | null {
    const searcher = this._getSearcher(query)
    const requireAllTokens =
      this.options.useTokenSearch && this.options.tokenMatch === 'all'
    const { records } = this._myIndex
    const results: InternalResult[] | null = heap ? null : []

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const searchResult = searcher.searchIn(text)

      if (searchResult.isMatch) {
        const match: MatchScore = {
          score: searchResult.score,
          value: text,
          norm: norm!,
          indices: searchResult.indices
        }
        if (requireAllTokens) {
          match.matchedMask = searchResult.matchedMask
          match.matchedTerms = searchResult.matchedTerms
          match.termCount = searchResult.termCount
        }
        const matches = [match]

        // Record-level AND gate (token search `tokenMatch: 'all'`), applied
        // before heap insertion so `limit` returns the same top-N as unlimited.
        if (!requireAllTokens || this._coversAllTokens(matches)) {
          const result: InternalResult = { item: text, idx, matches }

          if (heap) {
            result.score = computeScoreSingle(result.matches, {
              ignoreFieldNorm
            })
            if (heap.shouldInsert(result.score)) {
              heap.insert(result)
            }
          } else {
            results!.push(result)
          }
        }
      }
    })

    return results
  }

  _searchLogical(query: Expression): InternalResult[] {
    if (!process.env.LOGICAL_SEARCH_ENABLED) {
      throw new Error(ErrorMsg.LOGICAL_SEARCH_UNAVAILABLE)
    }

    const expression = parse(query, this.options)

    const evaluate = (
      node: ParsedNode,
      item: any,
      idx: number
    ): InternalResult[] => {
      if (!('children' in node)) {
        const { keyId, searcher } = node as ParsedLeaf

        let matches: MatchScore[]

        if (keyId === null) {
          // Keyless entry: search across all keys
          matches = []
          this._myIndex.keys.forEach((key, keyIndex) => {
            matches.push(
              ...this._findMatches({
                key,
                value: item[keyIndex],
                searcher: searcher!
              })
            )
          })
        } else {
          matches = this._findMatches({
            key: this._keyStore.get(keyId),
            value: this._myIndex.getValueForItemAtKeyId(item, keyId),
            searcher: searcher!
          })
        }

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

      const { children, operator } = node as ParsedOperator
      const res: InternalResult[] = []
      for (let i = 0, len = children.length; i < len; i += 1) {
        const child = children[i]
        const result = evaluate(child, item, idx)
        if (result.length) {
          res.push(...result)
        } else if (operator === LogicalOperator.AND) {
          return []
        }
      }
      return res
    }

    const records = this._myIndex.records
    const resultMap = new Map<number, InternalResult>()
    const results: InternalResult[] = []

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        const expResults = evaluate(expression, item, idx)

        if (expResults.length) {
          // Dedupe when adding
          if (!resultMap.has(idx)) {
            resultMap.set(idx, { idx, item, matches: [] })
            results.push(resultMap.get(idx)!)
          }
          expResults.forEach(({ matches }) => {
            resultMap.get(idx)!.matches.push(...matches)
          })
        }
      }
    })

    return results
  }

  // When a search involves inverse patterns (e.g. !Syrup), the aggregation
  // across keys switches from "ANY key matches" to "ALL keys must match."
  // This is signaled by hasInverse on the SearchResult from ExtendedSearch.
  //
  // For mixed patterns like "^hello !Syrup", a key failure is ambiguous —
  // it could be the positive or inverse term that failed. In that case we
  // conservatively exclude the item, which is strictly better than the old
  // behavior of including it. See: https://github.com/krisk/Fuse/issues/712
  _searchObjectList(
    query: string,
    { heap, ignoreFieldNorm }: HeapSearchOptions = {}
  ): InternalResult[] | null {
    const searcher = this._getSearcher(query)
    const requireAllTokens =
      this.options.useTokenSearch && this.options.tokenMatch === 'all'
    const { keys, records } = this._myIndex
    const results: InternalResult[] | null = heap ? null : []

    // List is Array<Object>
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return
      }

      const matches: MatchScore[] = []
      let anyKeyFailed = false
      let hasInverse = false

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        const keyMatches = this._findMatches({
          key,
          value: item[keyIndex],
          searcher
        })

        if (keyMatches.length) {
          matches.push(...keyMatches)
          if (keyMatches[0].hasInverse) {
            hasInverse = true
          }
        } else {
          anyKeyFailed = true
        }
      })

      // If the search involves inverse patterns, ALL keys must match
      if (hasInverse && anyKeyFailed) {
        return
      }

      // Record-level AND gate (token search `tokenMatch: 'all'`): every query
      // term must be covered across the record's field/array-element matches.
      // Applied before heap insertion so `limit` returns the same top-N.
      if (
        matches.length &&
        (!requireAllTokens || this._coversAllTokens(matches))
      ) {
        const result: InternalResult = { idx, item, matches }

        if (heap) {
          result.score = computeScoreSingle(result.matches, { ignoreFieldNorm })
          if (heap.shouldInsert(result.score)) {
            heap.insert(result)
          }
        } else {
          results!.push(result)
        }
      }
    })

    return results
  }
  _findMatches({
    key,
    value,
    searcher
  }: {
    key: KeyObject | null
    value: SubRecord | SubRecord[] | undefined
    searcher: Searcher
  }): MatchScore[] {
    if (!isDefined(value)) {
      return []
    }

    const matches: MatchScore[] = []

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }: SubRecord) => {
        if (!isDefined(text)) {
          return
        }

        const searchResult = searcher.searchIn(text)

        if (searchResult.isMatch) {
          const match: MatchScore = {
            score: searchResult.score,
            key,
            value: text,
            idx,
            norm,
            indices: searchResult.indices,
            hasInverse: searchResult.hasInverse
          }
          // Carry token-search AND coverage only when present, so the default
          // (non-token / 'any') MatchScore keeps its original object shape.
          if (searchResult.termCount !== undefined) {
            match.matchedMask = searchResult.matchedMask
            match.matchedTerms = searchResult.matchedTerms
            match.termCount = searchResult.termCount
          }
          matches.push(match)
        }
      })
    } else {
      const { v: text, n: norm } = value

      const searchResult = searcher.searchIn(text)

      if (searchResult.isMatch) {
        const match: MatchScore = {
          score: searchResult.score,
          key,
          value: text,
          norm,
          indices: searchResult.indices,
          hasInverse: searchResult.hasInverse
        }
        if (searchResult.termCount !== undefined) {
          match.matchedMask = searchResult.matchedMask
          match.matchedTerms = searchResult.matchedTerms
          match.termCount = searchResult.termCount
        }
        matches.push(match)
      }
    }

    return matches
  }

  // Record-level AND gate for token search (`tokenMatch: 'all'`). Returns true
  // unless the matched terms across ALL of a record's field/array-element
  // matches fail to cover every query term. `termCount` is only set by
  // TokenSearch in 'all' mode, so non-token / 'any' searches always pass.
  _coversAllTokens(matches: MatchScore[]): boolean {
    const termCount = matches.length ? matches[0].termCount : undefined
    if (termCount === undefined) {
      return true
    }

    if (termCount <= MAX_MASK_TERMS) {
      let coverage = 0
      for (let i = 0; i < matches.length; i++) {
        coverage |= matches[i].matchedMask || 0
      }
      return coverage === 2 ** termCount - 1
    }

    const coverage = new Set<number>()
    for (let i = 0; i < matches.length; i++) {
      const terms = matches[i].matchedTerms
      if (terms) {
        for (const t of terms) {
          coverage.add(t)
        }
      }
    }
    return coverage.size === termCount
  }
}
