/**
 * Fuse.js v7.4.0-beta.2 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

'use strict';

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- import.meta.url is resolved by Rollup at build time
    this._workerUrl = this._workerOptions.workerUrl || new URL('./fuse.worker.mjs', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('fuse-worker.cjs', document.baseURI).href)));
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
  async _init() {
    const numWorkers = this._getNumWorkers();
    const chunkSize = Math.ceil(this._docs.length / numWorkers);
    this._shards = [];
    this._addCursor = 0;
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
      initPromises.push(this._call(shard.worker, 'init', [chunk, this._options]));
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

exports.FuseWorker = FuseWorker;
