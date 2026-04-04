/// <reference lib="webworker" />

import Fuse from '../core'
import Config from '../core/config'
import { createIndex } from '../tools/FuseIndex'
import { ExtendedSearch } from '../search'
import TokenSearch from '../search/token'
import register from '../core/register'

// Register all search plugins so the worker supports full features
if (process.env.EXTENDED_SEARCH_ENABLED) {
  register(ExtendedSearch)
}
if (process.env.TOKEN_SEARCH_ENABLED) {
  register(TokenSearch)
}

Fuse.createIndex = createIndex
Fuse.config = Config

type WorkerMessage =
  | { id: number; method: 'init'; args: [any[], any] }
  | { id: number; method: 'search'; args: [string, any?] }
  | { id: number; method: 'add'; args: [any] }
  | { id: number; method: 'setCollection'; args: [any[]] }

let fuse: Fuse<any> | null = null

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { id, method, args } = e.data

  try {
    let result: any

    switch (method) {
      case 'init': {
        const [docs, options] = args
        fuse = new Fuse(docs, options)
        result = true
        break
      }
      case 'search': {
        result = fuse!.search(args[0], args[1])
        break
      }
      case 'add': {
        fuse!.add(args[0])
        result = true
        break
      }
      case 'setCollection': {
        fuse!.setCollection(args[0])
        result = true
        break
      }
    }

    self.postMessage({ id, result })
  } catch (err: any) {
    self.postMessage({ id, error: err.message })
  }
}
