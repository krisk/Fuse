/**
 * Fuse.js v7.4.0-beta.3 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

const FUSE_WORKER_UNSUPPORTED_FN_OPTION = option => `FuseWorker does not support function-valued option '${option}': ` + `functions cannot be transferred to Web Workers via postMessage. ` + `Remove this option or fall back to Fuse.`;
const FUSE_WORKER_TOKEN_SEARCH_UNSUPPORTED = `FuseWorker does not support useTokenSearch: token search depends on ` + `corpus-level statistics (df, fieldCount) that are computed per shard, ` + `so per-shard scores would diverge from single-thread Fuse. Use Fuse on ` + `the main thread for token search.`;

/// <reference lib="dom" />

const DEFAULT_MAX_WORKERS = 8;
function getDefaultWorkerCount() {
  const hw = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  return Math.min(hw, DEFAULT_MAX_WORKERS);
}
class FuseWorker {
  _shards = null;
  _addCursor = 0;
  _initPromise = null;
  _pending = new Map();
  _nextId = 0;
  constructor(docs, options, workerOptions) {
    this._docs = docs.slice();
    this._options = options || {};
    this._workerOptions = workerOptions || {};
    // Reject function-valued options eagerly. Without this check, postMessage
    // throws DataCloneError on first search() rather than at construction.
    FuseWorker._assertNoFunctionOptions(this._options);
    // Token search needs global corpus statistics, but each shard would build
    // its own — scores would diverge from single-thread Fuse. Refuse upfront
    // rather than silently returning ordering that doesn't match.
    if (this._options.useTokenSearch) {
      throw new Error(FUSE_WORKER_TOKEN_SEARCH_UNSUPPORTED);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- import.meta.url is resolved by Rollup at build time
    this._workerUrl = this._workerOptions.workerUrl || new URL('./fuse.worker.mjs', import.meta.url);
  }
  static _assertNoFunctionOptions(options) {
    if (typeof options.sortFn === 'function') {
      throw new Error(FUSE_WORKER_UNSUPPORTED_FN_OPTION('sortFn'));
    }
    if (typeof options.getFn === 'function') {
      throw new Error(FUSE_WORKER_UNSUPPORTED_FN_OPTION('getFn'));
    }
    const keys = options.keys;
    if (Array.isArray(keys)) {
      for (let i = 0, len = keys.length; i < len; i += 1) {
        const key = keys[i];
        if (key && typeof key === 'object' && !Array.isArray(key)) {
          if (typeof key.getFn === 'function') {
            const name = key.name;
            const label = Array.isArray(name) ? name.join('.') : name ?? String(i);
            throw new Error(FUSE_WORKER_UNSUPPORTED_FN_OPTION(`keys[${label}].getFn`));
          }
        }
      }
    }
  }
  _getNumWorkers() {
    return this._workerOptions.numWorkers || getDefaultWorkerCount();
  }
  _ensureInit() {
    if (this._initPromise) return this._initPromise;
    this._initPromise = this._init();
    return this._initPromise;
  }
  _spawnWorker() {
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
    return worker;
  }
  _workerInitOptions() {
    // Force includeScore so the main thread can do a global (score, idx)
    // tie-break across shards. Score is stripped from the final result if the
    // caller didn't ask for it.
    return {
      ...this._options,
      includeScore: true
    };
  }
  async _init() {
    const numWorkers = this._getNumWorkers();
    const chunkSize = Math.ceil(this._docs.length / numWorkers);
    this._shards = [];
    this._addCursor = 0;
    const workerInitOptions = this._workerInitOptions();
    const initPromises = [];
    for (let i = 0; i < numWorkers; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, this._docs.length);
      const chunk = this._docs.slice(start, end);
      const globalIndices = [];
      for (let j = start; j < end; j += 1) globalIndices.push(j);
      const shard = {
        worker: this._spawnWorker(),
        globalIndices
      };
      this._shards.push(shard);
      initPromises.push(this._call(shard.worker, 'init', [chunk, workerInitOptions]));
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
    const shards = this._shards;
    const results = await Promise.all(shards.map(s => this._call(s.worker, 'search', [query, options])));

    // Merge results from all shards, rewriting refIndex from shard-local to global
    const merged = [];
    for (let i = 0, len = results.length; i < len; i += 1) {
      const {
        globalIndices
      } = shards[i];
      for (const r of results[i]) {
        merged.push({
          ...r,
          refIndex: globalIndices[r.refIndex]
        });
      }
    }
    const shouldSort = this._options.shouldSort !== false;
    if (shouldSort) {
      // Mirror Fuse's default sortFn: (score, idx) tie-break, but on the
      // GLOBAL refIndex so equal-score results across shards collapse into a
      // deterministic order matching single-thread Fuse.
      merged.sort((a, b) => {
        const sa = a.score ?? 0;
        const sb = b.score ?? 0;
        if (sa === sb) {
          return a.refIndex < b.refIndex ? -1 : 1;
        }
        return sa < sb ? -1 : 1;
      });
    } else {
      // Restore global collection order. Round-robin add() and
      // shard-concatenation order otherwise leak through.
      merged.sort((a, b) => a.refIndex - b.refIndex);
    }

    // Workers always include score so the merge above can tie-break; strip it
    // here if the caller didn't ask for it. Rebuild the object instead of
    // `delete`-ing — `delete` deopts the shape and roughly doubles the
    // post-sort cost on large result sets.
    if (!this._options.includeScore) {
      for (let i = 0, len = merged.length; i < len; i += 1) {
        const r = merged[i];
        merged[i] = r.matches !== undefined ? {
          item: r.item,
          refIndex: r.refIndex,
          matches: r.matches
        } : {
          item: r.item,
          refIndex: r.refIndex
        };
      }
    }
    const limit = options?.limit;
    if (limit && limit > 0) {
      return merged.slice(0, limit);
    }
    return merged;
  }
  async add(doc) {
    await this._ensureInit();
    const shards = this._shards;
    const shard = shards[this._addCursor % shards.length];
    this._addCursor += 1;
    const globalIdx = this._docs.length;
    this._docs.push(doc);
    shard.globalIndices.push(globalIdx);
    await this._call(shard.worker, 'add', [doc]);
  }
  async setCollection(docs) {
    this._docs = docs.slice();
    if (!this._shards) {
      this._initPromise = null;
      return;
    }
    const shards = this._shards;
    const chunkSize = Math.ceil(this._docs.length / shards.length);
    this._addCursor = 0;
    const tasks = [];
    for (let i = 0, len = shards.length; i < len; i += 1) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, this._docs.length);
      const chunk = this._docs.slice(start, end);
      const globalIndices = [];
      for (let j = start; j < end; j += 1) globalIndices.push(j);
      shards[i].globalIndices = globalIndices;
      tasks.push(this._call(shards[i].worker, 'setCollection', [chunk]));
    }
    await Promise.all(tasks);
  }
  terminate() {
    if (this._shards) {
      for (const {
        worker
      } of this._shards) {
        worker.terminate();
      }
      this._shards = null;
    }
    this._initPromise = null;
    for (const [, handler] of this._pending) {
      handler.reject(new Error('FuseWorker terminated'));
    }
    this._pending.clear();
  }
}

export { FuseWorker };
