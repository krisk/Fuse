// Token: 'file
// Match type: exact-match
// Description: Items that are `file`

import BaseMatch from './BaseMatch'

export default class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'exact'
  }
  static get multiRegex() {
    return /^="(.*)"$/
  }
  static get singleRegex() {
    return /^=(.*)$/
  }
  search(text) {
    const isMatch = text === this.pattern

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}
