import type { SearchResult } from '../../types'

export default class BaseMatch {
  pattern: string

  constructor(pattern: string) {
    this.pattern = pattern
  }
  static multiRegex: RegExp
  static singleRegex: RegExp
  static type: string
  static isMultiMatch(pattern: string): string | null {
    return getMatch(pattern, this.multiRegex)
  }
  static isSingleMatch(pattern: string): string | null {
    return getMatch(pattern, this.singleRegex)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search(_text: string): SearchResult {
    return { isMatch: false, score: 1 }
  }
}

function getMatch(pattern: string, exp: RegExp): string | null {
  const matches = pattern.match(exp)
  return matches ? matches[1] : null
}
