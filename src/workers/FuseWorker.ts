/// <reference lib="dom" />

import type {
  IFuseOptions,
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
  private _docs: ReadonlyArray<T>
  private _workers: Worker[] | null = null
  private _initPromise: Promise<void> | null = null
  private _pending: Map<number, PendingCall> = new Map()
  private _nextId = 0
  private _workerUrl: string | URL

  constructor(
    docs: ReadonlyArray<T>,
    options?: IFuseOptions<T>,
    workerOptions?: FuseWorkerOptions
  ) {
    this._docs = docs
    this._options = options || {} as IFuseOptions<T>
    this._workerOptions = workerOptions || {}
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- import.meta.url is resolved by Rollup at build time
    this._workerUrl = this._workerOptions.workerUrl
      || new URL('./fuse.worker.mjs', import.meta.url)
  }

  private _getNumWorkers(): number {
    return this._workerOptions.numWorkers || getDefaultWorkerCount()
  }

  private _ensureInit(): Promise<void> {
    if (this._initPromise) return this._initPromise

    this._initPromise = this._init()
    return this._initPromise
  }

  private async _init(): Promise<void> {
    const numWorkers = this._getNumWorkers()
    const chunkSize = Math.ceil(this._docs.length / numWorkers)
    const initPromises: Promise<void>[] = []

    this._workers = []

    for (let i = 0; i < numWorkers; i++) {
      const chunk = this._docs.slice(i * chunkSize, (i + 1) * chunkSize)
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

      this._workers.push(worker)
      initPromises.push(this._call(worker, 'init', [chunk, this._options]))
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

    const results = await Promise.all(
      this._workers!.map((worker) => this._call(worker, 'search', [query, options]))
    )

    // Merge results from all shards
    const merged: FuseResult<T>[] = []
    for (const shardResults of results) {
      merged.push(...shardResults)
    }

    // Sort by score (lower is better)
    const shouldSort = this._options.shouldSort !== false
    if (shouldSort) {
      merged.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    }

    // Apply limit
    const limit = options?.limit
    if (limit && limit > 0) {
      return merged.slice(0, limit)
    }

    return merged
  }

  async add(doc: T): Promise<void> {
    await this._ensureInit()

    // Round-robin across workers
    const idx = this._nextId % this._workers!.length
    await this._call(this._workers![idx], 'add', [doc])
  }

  async setCollection(docs: ReadonlyArray<T>): Promise<void> {
    this._docs = docs

    if (this._workers) {
      const numWorkers = this._workers.length
      const chunkSize = Math.ceil(docs.length / numWorkers)

      await Promise.all(
        this._workers.map((worker, i) => {
          const chunk = docs.slice(i * chunkSize, (i + 1) * chunkSize)
          return this._call(worker, 'setCollection', [chunk])
        })
      )
    } else {
      this._initPromise = null
    }
  }

  terminate(): void {
    if (this._workers) {
      for (const worker of this._workers) {
        worker.terminate()
      }
      this._workers = null
    }
    this._initPromise = null

    for (const [, handler] of this._pending) {
      handler.reject(new Error('FuseWorker terminated'))
    }
    this._pending.clear()
  }
}
