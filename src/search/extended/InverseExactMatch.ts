// Token: !fire
// Match type: inverse-exact-match
// Description: Items that do not include `fire`

import BaseMatch from './BaseMatch'
import type { SearchResult } from '../../types'

export default class InverseExactMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'inverse-exact'
  }
  static get multiRegex(): RegExp {
    return /^!"(.*)"$/
  }
  static get singleRegex(): RegExp {
    return /^!(.*)$/
  }
  search(text: string): SearchResult {
    const index = text.indexOf(this.pattern)
    const isMatch = index === -1

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1] as any
    }
  }
}
