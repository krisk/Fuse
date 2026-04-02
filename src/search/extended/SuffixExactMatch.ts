// Token: .file$
// Match type: suffix-exact-match
// Description: Items that end with `.file`
import BaseMatch from './BaseMatch'
import type { SearchResult } from '../../types'

export default class SuffixExactMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'suffix-exact'
  }
  static get multiRegex(): RegExp {
    return /^"(.*)"\$$/
  }
  static get singleRegex(): RegExp {
    return /^(.*)\$$/
  }
  search(text: string): SearchResult {
    const isMatch = text.endsWith(this.pattern)

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1] as any
    }
  }
}
