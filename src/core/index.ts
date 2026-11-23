import { isDefined, isString, isNumber } from '../helpers/typeGuards'
import KeyStore from '../tools/KeyStore'
import FuseIndex, {
  createIndex,
  STRING_RECORD,
  OBJECT_RECORD,
  SCALAR,
  EMPTY_ARRAY
} from '../tools/FuseIndex'
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
import MaxHeap, { type Comparator } from '../tools/MaxHeap'
import format from './format'
import * as ErrorMsg from './errorMessages'
import { createAnalyzer } from '../search/token/analyzer'
import { MAX_MASK_TERMS } from '../search/token'
import {
  buildInvertedIndexFromColumns,
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
  KeyObject
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
  // False when the index was passed in (new Fuse(docs, opts, index) or
  // setCollection(docs, index)). Such an index may be shared with other Fuse
  // instances, so it's cloned before the first add/remove (copy-on-write).
  _ownsIndex: boolean
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
    this._ownsIndex = true
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

    this._ownsIndex = !index
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
      this._invertedIndex = buildInvertedIndexFromColumns(
        this._myIndex,
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

    this._ensureOwnIndex()
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
      this._ensureOwnIndex()
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
    this._ensureOwnIndex()
    const doc = this._docs.splice(idx, 1)[0]
    this._myIndex.removeAt(idx)
    this._invalidateSearcherCache()
    return doc
  }

  _ensureOwnIndex(): void {
    if (!this._ownsIndex) {
      this._myIndex = this._myIndex.clone()
      this._ownsIndex = true
    }
  }

  _invalidateSearcherCache(): void {
    this._lastQuery = null
    this._lastSearcher = null
  }

  getIndex(): FuseIndex<T> {
    return this._myIndex
  }

  // FuseIndex.keys carries raw user weights; only KeyStore normalises them to
  // sum to 1. Scoring off the raw weights underflows for large values and
  // diverges from the keyed logical path. Resolve each key to its normalised
  // counterpart by id (kept aligned to item[keyIndex]), once per search.
  _normalizedKeys(): KeyObject[] {
    return this._myIndex.keys.map((key) => this._keyStore.get(key.id) || key)
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

    // The heap selects a sorted top-N, so it only applies when sorting is on.
    // With `shouldSort: false` we must keep the collection-order-then-slice path
    // so `search(query, { limit })` still equals `search(query).slice(0, limit)`.
    const useHeap =
      shouldSort && Number.isInteger(limit) && limit > 0 && isString(query)

    // sortFn is typed for the public FuseSortFunctionArg shape, but at sort and
    // heap time we operate on InternalResult; one assertion bridges the two.
    const comparator = sortFn as unknown as Comparator

    // Canonical tie-break for string/object search: break comparator ties by
    // item index so heap selection and the full sort agree. Both then equal a
    // full sort under this idx tie-break, sliced to the limit. This only bites
    // when a custom sortFn returns 0 for distinct results (the default sortFn
    // and any total-order comparator decide every pair). Applying it to the
    // unlimited sort too keeps the contract even when an index's records are not
    // in idx order (e.g. via Fuse.parseIndex), where a raw stable sort would
    // instead preserve scan order. Logical search has no heap path, so it keeps
    // the raw comparator.
    const stable: Comparator = (a, b) => comparator(a, b) || a.idx - b.idx

    let results: InternalResult[]

    if (useHeap) {
      const heap = new MaxHeap(limit, stable)
      if (isString(this._docs[0])) {
        this._searchStringList(query as string, { heap, ignoreFieldNorm })
      } else {
        this._searchObjectList(query as string, { heap, ignoreFieldNorm })
      }
      results = heap.extractSorted()
    } else {
      results = isString(query)
        ? isString(this._docs[0])
          ? this._searchStringList(query)!
          : this._searchObjectList(query)!
        : this._searchLogical(query as Expression)

      computeScore(results, { ignoreFieldNorm })

      if (shouldSort) {
        results.sort(isString(query) ? stable : comparator)
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
    const index = this._myIndex
    const recCount = index.size()
    const recKind = index._recKind
    const recDoc = index._recDoc
    const recStart = index._recStart
    const entValue = index._entValue
    const normValues = index._normValues
    const entNormId = index._entNormId
    const results: InternalResult[] | null = heap ? null : []

    // Iterate over every string in the index
    for (let r = 0; r < recCount; r += 1) {
      // Object records have no text of their own (only in parsed indexes).
      if (recKind[r] !== STRING_RECORD) {
        continue
      }

      const e = recStart[r]
      const text = entValue[e]
      const idx = recDoc[r]
      const searchResult = searcher.searchIn(text)

      if (searchResult.isMatch) {
        const match: MatchScore = {
          score: searchResult.score,
          value: text,
          norm: normValues[entNormId[e]],
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
            heap.insert(result)
          } else {
            results!.push(result)
          }
        }
      }
    }

    return results
  }

  _searchLogical(query: Expression): InternalResult[] {
    if (!process.env.LOGICAL_SEARCH_ENABLED) {
      throw new Error(ErrorMsg.LOGICAL_SEARCH_UNAVAILABLE)
    }

    const options = this._invertedIndex
      ? { ...this.options, _invertedIndex: this._invertedIndex }
      : this.options
    const expression = parse(query, options)

    // Keyless leaves fan out across all keys; normalised weights keep their
    // scores consistent with string and keyed queries.
    const keys = this._normalizedKeys()

    const index = this._myIndex
    // A custom sortFn sees each result's `item` (the record's fields in the
    // record format), so build it only when one is set.
    const needItem = this.options.sortFn !== Config.sortFn

    const evaluate = (
      node: ParsedNode,
      r: number,
      idx: number
    ): InternalResult[] => {
      if (!('children' in node)) {
        const { keyId, searcher } = node as ParsedLeaf

        let matches: MatchScore[]

        if (keyId === null) {
          // Keyless entry: search across all keys
          matches = []
          let anyKeyFailed = false
          let hasInverse = false
          keys.forEach((key, keyIndex) => {
            const [start, end] = index._keyRange(r, keyIndex)
            const keyMatches = this._findMatches(key, start, end, searcher!)
            if (keyMatches.length) {
              matches.push(...keyMatches)
              hasInverse ||= !!keyMatches[0].hasInverse
            } else {
              anyKeyFailed = true
            }
          })
          // Match the global string-search aggregation within this leaf,
          // before the surrounding logical operators combine its result.
          if (hasInverse && anyKeyFailed) {
            return []
          }
        } else {
          const keyIndex = index._keysMap[keyId]
          const [start, end] =
            keyIndex === undefined ? [0, 0] : index._keyRange(r, keyIndex)
          matches = this._findMatches(
            this._keyStore.get(keyId),
            start,
            end,
            searcher!
          )
        }

        // Each token leaf has its own query terms. Check coverage before
        // combining clauses so OR branches cannot supply each other's words.
        // Explicit operators do not report token coverage and remain unchanged.
        if (
          matches &&
          matches.length &&
          (matches[0].termCount === undefined || this._coversAllTokens(matches))
        ) {
          return [
            {
              idx,
              item: undefined,
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
        const result = evaluate(child, r, idx)
        if (result.length) {
          res.push(...result)
        } else if (operator === LogicalOperator.AND) {
          return []
        }
      }
      return res
    }

    const resultMap = new Map<number, InternalResult>()
    const results: InternalResult[] = []

    for (let r = 0, n = index.size(); r < n; r += 1) {
      // String records have no fields (only in parsed indexes).
      if (index._recKind[r] !== OBJECT_RECORD) {
        continue
      }
      const idx = index._recDoc[r]
      const expResults = evaluate(expression, r, idx)

      if (expResults.length) {
        // Dedupe when adding
        if (!resultMap.has(idx)) {
          resultMap.set(idx, {
            idx,
            item: needItem ? index._materializeFields(r) : undefined,
            matches: []
          })
          results.push(resultMap.get(idx)!)
        }
        expResults.forEach(({ matches }) => {
          resultMap.get(idx)!.matches.push(...matches)
        })
      }
    }

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
    const index = this._myIndex
    const recCount = index.size()
    const recKind = index._recKind
    const recDoc = index._recDoc
    const recStart = index._recStart
    const recLen = index._recLen
    const entKey = index._entKey
    const keys = this._normalizedKeys()
    const keyCount = keys.length
    // A custom sortFn sees each result's `item` (the record's fields in the
    // record format), so build it only when one is set.
    const needItem = this.options.sortFn !== Config.sortFn
    const results: InternalResult[] | null = heap ? null : []

    // List is Array<Object>
    for (let r = 0; r < recCount; r += 1) {
      // String records have no fields (only in parsed indexes).
      if (recKind[r] !== OBJECT_RECORD) {
        continue
      }

      const matches: MatchScore[] = []
      let anyKeyFailed = false
      let hasInverse = false

      // Visit every key (i.e, path), including keys with no entries, which
      // count as failed keys for inverse aggregation. Entries are in key
      // order, so one cursor walks them.
      let cursor = recStart[r]
      const end = cursor + recLen[r]
      for (let keyIndex = 0; keyIndex < keyCount; keyIndex += 1) {
        while (cursor < end && entKey[cursor] < keyIndex) cursor += 1
        let stop = cursor
        while (stop < end && entKey[stop] === keyIndex) stop += 1

        const keyMatches = this._findMatches(
          keys[keyIndex],
          cursor,
          stop,
          searcher
        )
        cursor = stop

        if (keyMatches.length) {
          matches.push(...keyMatches)
          if (keyMatches[0].hasInverse) {
            hasInverse = true
          }
        } else {
          anyKeyFailed = true
        }
      }

      // If the search involves inverse patterns, ALL keys must match
      if (hasInverse && anyKeyFailed) {
        continue
      }

      // Record-level AND gate (token search `tokenMatch: 'all'`): every query
      // term must be covered across the record's field/array-element matches.
      // Applied before heap insertion so `limit` returns the same top-N.
      if (
        matches.length &&
        (!requireAllTokens || this._coversAllTokens(matches))
      ) {
        const result: InternalResult = {
          idx: recDoc[r],
          item: needItem ? index._materializeFields(r) : undefined,
          matches
        }

        if (heap) {
          result.score = computeScoreSingle(result.matches, { ignoreFieldNorm })
          heap.insert(result)
        } else {
          results!.push(result)
        }
      }
    }

    return results
  }
  // Matches for one key of a record: the entries [start, end) of that key.
  // No entries means the key is absent; the EMPTY_ARRAY sentinel is a present
  // array with no items. Both produce no matches, as before.
  _findMatches(
    key: KeyObject | null,
    start: number,
    end: number,
    searcher: Searcher
  ): MatchScore[] {
    if (start === end) {
      return []
    }

    const index = this._myIndex
    const entIdx = index._entIdx
    const pos = entIdx[start]

    if (pos === EMPTY_ARRAY) {
      return []
    }

    const entValue = index._entValue
    const normValues = index._normValues
    const entNormId = index._entNormId
    const matches: MatchScore[] = []

    if (pos !== SCALAR) {
      let anyElementFailed = false
      let hasInverse = false
      for (let e = start; e < end; e += 1) {
        const text = entValue[e]
        const searchResult = searcher.searchIn(text)

        if (searchResult.isMatch) {
          const match: MatchScore = {
            score: searchResult.score,
            key,
            value: text,
            idx: entIdx[e],
            norm: normValues[entNormId[e]],
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
          hasInverse ||= !!searchResult.hasInverse
        } else {
          anyElementFailed = true
        }
      }
      // Mirror cross-key inverse aggregation: a matching sibling must not
      // hide an excluded array element. Positive searches still match any.
      if (hasInverse && anyElementFailed) {
        return []
      }
    } else {
      const text = entValue[start]
      const searchResult = searcher.searchIn(text)

      if (searchResult.isMatch) {
        const match: MatchScore = {
          score: searchResult.score,
          key,
          value: text,
          norm: normValues[entNormId[start]],
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
