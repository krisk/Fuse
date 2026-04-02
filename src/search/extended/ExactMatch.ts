// Token: 'file
// Match type: exact-match
// Description: Items that are `file`

import BaseMatch from './BaseMatch'
import type { SearchResult } from '../../types'

export default class ExactMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'exact'
  }
  static get multiRegex(): RegExp {
    return /^="(.*)"$/
  }
  static get singleRegex(): RegExp {
    return /^=(.*)$/
  }
  search(text: string): SearchResult {
    const isMatch = text === this.pattern

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1] as any
    }
  }
}
