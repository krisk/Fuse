import { isArray, isDefined, isString, isNumber } from '../helpers/types'
import KeyStore from '../tools/KeyStore'
import FuseIndex, { createIndex } from '../tools/FuseIndex'
import { LogicalOperator, parse, type ParsedNode, type ParsedLeaf, type ParsedOperator } from './queryParser'
import { createSearcher } from './register'
import Config from './config'
import computeScore, { computeScoreSingle } from './computeScore'
import MaxHeap from '../tools/MaxHeap'
import format from './format'
import * as ErrorMsg from './errorMessages'
import type {
  Searcher,
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
  _lastQuery: string | null
  _lastSearcher: Searcher | null

  // Statics are assigned in entry.ts
  static version: string
  static createIndex: typeof createIndex
  static parseIndex: typeof import('../tools/FuseIndex').parseIndex
  static config: typeof Config
  static parseQuery: typeof parse
  static use: (...plugins: any[]) => void

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

    this._keyStore = new KeyStore(this.options.keys)

    this._docs = docs as T[]
    this._myIndex = null as any

    this.setCollection(docs, index)

    this._lastQuery = null
    this._lastSearcher = null
  }

  _getSearcher(query: string): Searcher {
    if (this._lastQuery === query) {
      return this._lastSearcher!
    }
    const searcher = createSearcher(query, this.options)
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
  }

  add(doc: T): void {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc)
    this._myIndex.add(doc)
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
      // Remove from docs in reverse to preserve indices
      for (let i = indicesToRemove.length - 1; i >= 0; i -= 1) {
        this._docs.splice(indicesToRemove[i], 1)
      }
      this._myIndex.removeAll(indicesToRemove)
    }

    return results
  }

  removeAt(idx: number): void {
    this._docs.splice(idx, 1)
    this._myIndex.removeAt(idx)
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

  _searchStringList(query: string, { heap, ignoreFieldNorm }: HeapSearchOptions = {}): InternalResult[] | null {
    const searcher = this._getSearcher(query)
    const { records } = this._myIndex
    const results: InternalResult[] | null = heap ? null : []

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const { isMatch, score, indices } = searcher.searchIn(text)

      if (isMatch) {
        const result: InternalResult = {
          item: text,
          idx,
          matches: [{ score, value: text, norm: norm!, indices } as MatchScore]
        }

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

  _searchLogical(query: Expression): InternalResult[] {
    if (!process.env.LOGICAL_SEARCH_ENABLED) {
      throw new Error(ErrorMsg.LOGICAL_SEARCH_UNAVAILABLE)
    }

    const expression = parse(query, this.options)

    const evaluate = (node: ParsedNode, item: any, idx: number): InternalResult[] => {
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

  // Known limitation: inverse patterns (e.g. !Syrup) don't work correctly
  // across multiple keys. Each key is searched independently and the item is
  // included if ANY key matches. This is correct for positive patterns but
  // wrong for inverse ones:
  //
  //   Positive "hello" with keys [title, author]:
  //     title="hello world" → isMatch: true
  //     author="Bob Smith"  → isMatch: false
  //     → include (correct: found in at least one key)
  //
  //   Inverse "!Syrup" with keys [title, author]:
  //     title="Maple Syrup Pancakes" → isMatch: false (contains Syrup)
  //     author="Chef Bob"            → isMatch: true  (no Syrup)
  //     → include (wrong: should exclude because title contains Syrup)
  //
  // Fixing this requires knowing which results are inverse vs positive, but
  // searchIn() returns a single { isMatch, score } with no per-term breakdown.
  // For mixed patterns like "^hello !Syrup", we'd need per-term results from
  // ExtendedSearch to know whether a key failed due to the positive or inverse
  // term — which means redesigning the Searcher interface.
  //
  // Workaround: use logical queries for inverse patterns across keys:
  //   fuse.search({ $and: [{ title: '!Syrup' }, { author: '!Syrup' }] })
  //
  // See: https://github.com/krisk/Fuse/issues/712
  _searchObjectList(query: string, { heap, ignoreFieldNorm }: HeapSearchOptions = {}): InternalResult[] | null {
    const searcher = this._getSearcher(query)
    const { keys, records } = this._myIndex
    const results: InternalResult[] | null = heap ? null : []

    // List is Array<Object>
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return
      }

      const matches: MatchScore[] = []

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
  _findMatches({ key, value, searcher }: { key: KeyObject | null; value: SubRecord | SubRecord[] | undefined; searcher: Searcher }): MatchScore[] {
    if (!isDefined(value)) {
      return []
    }

    const matches: MatchScore[] = []

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }: SubRecord) => {
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
