// Token: 'file
// Match type: include-match
// Description: Items that include `file`

import BaseMatch from './BaseMatch'
import type { SearchResult, RangeTuple } from '../../types'

export default class IncludeMatch extends BaseMatch {
  constructor(pattern: string) {
    super(pattern)
  }
  static get type(): string {
    return 'include'
  }
  static get multiRegex(): RegExp {
    return /^'"(.*)"$/
  }
  static get singleRegex(): RegExp {
    return /^'(.*)$/
  }
  search(text: string): SearchResult {
    let location = 0
    let index: number

    const indices: RangeTuple[] = []
    const patternLen = this.pattern.length

    // Get all exact matches
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen
      indices.push([index, location - 1])
    }

    const isMatch = !!indices.length

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices
    }
  }
}
