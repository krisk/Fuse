/**
 * Fuse.js v7.4.0-beta.1 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/// <reference lib="dom" />

const DEFAULT_MAX_WORKERS = 8;
function getDefaultWorkerCount() {
  const hw = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  return Math.min(hw, DEFAULT_MAX_WORKERS);
}
class FuseWorker {
  _workers = null;
  _initPromise = null;
  _pending = new Map();
  _nextId = 0;
  constructor(docs, options, workerOptions) {
    this._docs = docs;
    this._options = options || {};
    this._workerOptions = workerOptions || {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- import.meta.url is resolved by Rollup at build time
    this._workerUrl = this._workerOptions.workerUrl || new URL('./fuse.worker.mjs', import.meta.url);
  }
  _getNumWorkers() {
    return this._workerOptions.numWorkers || getDefaultWorkerCount();
  }
  _ensureInit() {
    if (this._initPromise) return this._initPromise;
    this._initPromise = this._init();
    return this._initPromise;
  }
  async _init() {
    const numWorkers = this._getNumWorkers();
    const chunkSize = Math.ceil(this._docs.length / numWorkers);
    const initPromises = [];
    this._workers = [];
    for (let i = 0; i < numWorkers; i++) {
      const chunk = this._docs.slice(i * chunkSize, (i + 1) * chunkSize);
      const worker = new Worker(this._workerUrl, {
        type: 'module'
      });
      worker.onmessage = e => {
        const {
          id,
          result,
          error
        } = e.data;
        const handler = this._pending.get(id);
        if (!handler) return;
        this._pending.delete(id);
        if (error) {
          handler.reject(new Error(error));
        } else {
          handler.resolve(result);
        }
      };
      worker.onerror = e => {
        for (const [, handler] of this._pending) {
          handler.reject(new Error(e.message));
        }
      };
      this._workers.push(worker);
      initPromises.push(this._call(worker, 'init', [chunk, this._options]));
    }
    await Promise.all(initPromises);
  }
  _call(worker, method, args) {
    const id = this._nextId++;
    return new Promise((resolve, reject) => {
      this._pending.set(id, {
        resolve,
        reject
      });
      worker.postMessage({
        id,
        method,
        args
      });
    });
  }
  async search(query, options) {
    await this._ensureInit();
    const results = await Promise.all(this._workers.map(worker => this._call(worker, 'search', [query, options])));

    // Merge results from all shards
    const merged = [];
    for (const shardResults of results) {
      merged.push(...shardResults);
    }

    // Sort by score (lower is better)
    const shouldSort = this._options.shouldSort !== false;
    if (shouldSort) {
      merged.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    }

    // Apply limit
    const limit = options?.limit;
    if (limit && limit > 0) {
      return merged.slice(0, limit);
    }
    return merged;
  }
  async add(doc) {
    await this._ensureInit();

    // Round-robin across workers
    const idx = this._nextId % this._workers.length;
    await this._call(this._workers[idx], 'add', [doc]);
  }
  async setCollection(docs) {
    this._docs = docs;
    if (this._workers) {
      const numWorkers = this._workers.length;
      const chunkSize = Math.ceil(docs.length / numWorkers);
      await Promise.all(this._workers.map((worker, i) => {
        const chunk = docs.slice(i * chunkSize, (i + 1) * chunkSize);
        return this._call(worker, 'setCollection', [chunk]);
      }));
    } else {
      this._initPromise = null;
    }
  }
  terminate() {
    if (this._workers) {
      for (const worker of this._workers) {
        worker.terminate();
      }
      this._workers = null;
    }
    this._initPromise = null;
    for (const [, handler] of this._pending) {
      handler.reject(new Error('FuseWorker terminated'));
    }
    this._pending.clear();
  }
}

export { FuseWorker };
