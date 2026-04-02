// Token: !.file$
// Match type: inverse-suffix-exact-match
// Description: Items that do not end with `.file`
import BaseMatch from './BaseMatch'
import type { SearchResult } from '../../types'

export default class InverseSuffixExactMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'inverse-suffix-exact'
  }
  static get multiRegex(): RegExp {
    return /^!"(.*)"\$$/
  }
  static get singleRegex(): RegExp {
    return /^!(.*)\$$/
  }
  search(text: string): SearchResult {
    const isMatch = !text.endsWith(this.pattern)
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1] as any
    }
  }
}
