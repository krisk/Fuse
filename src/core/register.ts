import { BitapSearch } from '../search'
import type { Searcher } from '../types'

const registeredSearchers: any[] = []

export default function register(...args: any[]): void {
  registeredSearchers.push(...args)
}

export function createSearcher(pattern: string, options: any): Searcher {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i]
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}
