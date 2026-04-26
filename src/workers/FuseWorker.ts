/// <reference lib="dom" />

import * as ErrorMsg from '../core/errorMessages'
import type {
  IFuseOptions,
  FuseOptionKey,
  FuseResult,
  FuseSearchOptions,
  Expression
} from '../types'

export interface FuseWorkerOptions {
  /** Number of parallel workers. Defaults to navigator.hardwareConcurrency (max 8). */
  numWorkers?: number
  /** Custom URL to the worker script. If not provided, resolves automatically via import.meta.url. */
  workerUrl?: string | URL
}

interface PendingCall {
  resolve: (value: any) => void
  reject: (reason: any) => void
}

interface Shard {
  worker: Worker
  globalIndices: number[]
}

const DEFAULT_MAX_WORKERS = 8

function getDefaultWorkerCount(): number {
  const hw = typeof navigator !== 'undefined'
    ? navigator.hardwareConcurrency || 4
    : 4
  return Math.min(hw, DEFAULT_MAX_WORKERS)
}

export default class FuseWorker<T> {
  private _options: IFuseOptions<T>
  private _workerOptions: FuseWorkerOptions
  private _docs: T[]
  private _shards: Shard[] | null = null
  private _addCursor = 0
  private _initPromise: Promise<void> | null = null
  private _pending: Map<number, PendingCall> = new Map()
  private _nextId = 0
  private _workerUrl: string | URL

  constructor(
    docs: ReadonlyArray<T>,
    options?: IFuseOptions<T>,
    workerOptions?: FuseWorkerOptions
  ) {
    this._docs = docs.slice()
    this._options = options || {} as IFuseOptions<T>
    this._workerOptions = workerOptions || {}
    // Reject function-valued options eagerly. Without this check, postMessage
    // throws DataCloneError on first search() rather than at construction.
    FuseWorker._assertNoFunctionOptions(this._options)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- import.meta.url is resolved by Rollup at build time
    this._workerUrl = this._workerOptions.workerUrl
      || new URL('./fuse.worker.mjs', import.meta.url)
  }

  private static _assertNoFunctionOptions<U>(options: IFuseOptions<U>): void {
    if (typeof (options as { sortFn?: unknown }).sortFn === 'function') {
      throw new Error(ErrorMsg.FUSE_WORKER_UNSUPPORTED_FN_OPTION('sortFn'))
    }
    if (typeof (options as { getFn?: unknown }).getFn === 'function') {
      throw new Error(ErrorMsg.FUSE_WORKER_UNSUPPORTED_FN_OPTION('getFn'))
    }
    const keys = options.keys
    if (Array.isArray(keys)) {
      for (let i = 0, len = keys.length; i < len; i += 1) {
        const key = keys[i] as FuseOptionKey<U>
        if (key && typeof key === 'object' && !Array.isArray(key)) {
          if (typeof (key as { getFn?: unknown }).getFn === 'function') {
            const name = (key as { name?: string | string[] }).name
            const label = Array.isArray(name) ? name.join('.') : (name ?? String(i))
            throw new Error(
              ErrorMsg.FUSE_WORKER_UNSUPPORTED_FN_OPTION(`keys[${label}].getFn`)
            )
          }
        }
      }
    }
  }

  private _getNumWorkers(): number {
    return this._workerOptions.numWorkers || getDefaultWorkerCount()
  }

  private _ensureInit(): Promise<void> {
    if (this._initPromise) return this._initPromise

    this._initPromise = this._init()
    return this._initPromise
  }

  private _spawnWorker(): Worker {
    const worker = new Worker(this._workerUrl, { type: 'module' })

    worker.onmessage = (e: MessageEvent) => {
      const { id, result, error } = e.data
      const handler = this._pending.get(id)
      if (!handler) return
      this._pending.delete(id)
      if (error) {
        handler.reject(new Error(error))
      } else {
        handler.resolve(result)
      }
    }

    worker.onerror = (e: ErrorEvent) => {
      for (const [, handler] of this._pending) {
        handler.reject(new Error(e.message))
      }
    }

    return worker
  }

  private _workerInitOptions(): IFuseOptions<T> {
    // Force includeScore so the main thread can do a global (score, idx)
    // tie-break across shards. Score is stripped from the final result if the
    // caller didn't ask for it.
    return { ...this._options, includeScore: true }
  }

  private async _init(): Promise<void> {
    const numWorkers = this._getNumWorkers()
    const chunkSize = Math.ceil(this._docs.length / numWorkers)

    this._shards = []
    this._addCursor = 0

    const workerInitOptions = this._workerInitOptions()
    const initPromises: Promise<void>[] = []
    for (let i = 0; i < numWorkers; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, this._docs.length)
      const chunk = this._docs.slice(start, end)
      const globalIndices: number[] = []
      for (let j = start; j < end; j += 1) globalIndices.push(j)

      const shard: Shard = { worker: this._spawnWorker(), globalIndices }
      this._shards.push(shard)
      initPromises.push(this._call(shard.worker, 'init', [chunk, workerInitOptions]))
    }

    await Promise.all(initPromises)
  }

  private _call(worker: Worker, method: string, args: any[]): Promise<any> {
    const id = this._nextId++
    return new Promise((resolve, reject) => {
      this._pending.set(id, { resolve, reject })
      worker.postMessage({ id, method, args })
    })
  }

  async search(
    query: string | Expression,
    options?: FuseSearchOptions
  ): Promise<FuseResult<T>[]> {
    await this._ensureInit()

    const shards = this._shards!
    const results: FuseResult<T>[][] = await Promise.all(
      shards.map((s) => this._call(s.worker, 'search', [query, options]))
    )

    // Merge results from all shards, rewriting refIndex from shard-local to global
    const merged: FuseResult<T>[] = []
    for (let i = 0, len = results.length; i < len; i += 1) {
      const { globalIndices } = shards[i]
      for (const r of results[i]) {
        merged.push({ ...r, refIndex: globalIndices[r.refIndex] })
      }
    }

    const shouldSort = this._options.shouldSort !== false
    if (shouldSort) {
      // Mirror Fuse's default sortFn: (score, idx) tie-break, but on the
      // GLOBAL refIndex so equal-score results across shards collapse into a
      // deterministic order matching single-thread Fuse.
      merged.sort((a, b) => {
        const sa = a.score ?? 0
        const sb = b.score ?? 0
        if (sa === sb) {
          return a.refIndex < b.refIndex ? -1 : 1
        }
        return sa < sb ? -1 : 1
      })
    } else {
      // Restore global collection order. Round-robin add() and
      // shard-concatenation order otherwise leak through.
      merged.sort((a, b) => a.refIndex - b.refIndex)
    }

    // Workers always include score so the merge above can tie-break; strip it
    // here if the caller didn't ask for it. Rebuild the object instead of
    // `delete`-ing — `delete` deopts the shape and roughly doubles the
    // post-sort cost on large result sets.
    if (!this._options.includeScore) {
      for (let i = 0, len = merged.length; i < len; i += 1) {
        const r = merged[i]
        merged[i] = r.matches !== undefined
          ? { item: r.item, refIndex: r.refIndex, matches: r.matches }
          : { item: r.item, refIndex: r.refIndex }
      }
    }

    const limit = options?.limit
    if (limit && limit > 0) {
      return merged.slice(0, limit)
    }

    return merged
  }

  async add(doc: T): Promise<void> {
    await this._ensureInit()

    const shards = this._shards!
    const shard = shards[this._addCursor % shards.length]
    this._addCursor += 1

    const globalIdx = this._docs.length
    this._docs.push(doc)
    shard.globalIndices.push(globalIdx)

    await this._call(shard.worker, 'add', [doc])
  }

  async setCollection(docs: ReadonlyArray<T>): Promise<void> {
    this._docs = docs.slice()

    if (!this._shards) {
      this._initPromise = null
      return
    }

    const shards = this._shards
    const chunkSize = Math.ceil(this._docs.length / shards.length)
    this._addCursor = 0

    const tasks: Promise<void>[] = []
    for (let i = 0, len = shards.length; i < len; i += 1) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, this._docs.length)
      const chunk = this._docs.slice(start, end)
      const globalIndices: number[] = []
      for (let j = start; j < end; j += 1) globalIndices.push(j)

      shards[i].globalIndices = globalIndices
      tasks.push(this._call(shards[i].worker, 'setCollection', [chunk]))
    }

    await Promise.all(tasks)
  }

  terminate(): void {
    if (this._shards) {
      for (const { worker } of this._shards) {
        worker.terminate()
      }
      this._shards = null
    }
    this._initPromise = null

    for (const [, handler] of this._pending) {
      handler.reject(new Error('FuseWorker terminated'))
    }
    this._pending.clear()
  }
}
