// Token: ^file
// Match type: prefix-exact-match
// Description: Items that start with `file`
import BaseMatch from './BaseMatch'
import type { SearchResult } from '../../types'

export default class PrefixExactMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'prefix-exact'
  }
  static get multiRegex(): RegExp {
    return /^\^"(.*)"$/
  }
  static get singleRegex(): RegExp {
    return /^\^(.*)$/
  }
  search(text: string): SearchResult {
    const isMatch = text.startsWith(this.pattern)

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1] as any
    }
  }
}
