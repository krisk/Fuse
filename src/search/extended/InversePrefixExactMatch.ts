// Token: !^fire
// Match type: inverse-prefix-exact-match
// Description: Items that do not start with `fire`

import BaseMatch from './BaseMatch'
import type { SearchResult } from '../../types'

export default class InversePrefixExactMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'inverse-prefix-exact'
  }
  static get multiRegex(): RegExp {
    return /^!\^"(.*)"$/
  }
  static get singleRegex(): RegExp {
    return /^!\^(.*)$/
  }
  search(text: string): SearchResult {
    const isMatch = !text.startsWith(this.pattern)

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1] as any
    }
  }
}
