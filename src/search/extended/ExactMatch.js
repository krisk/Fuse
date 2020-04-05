// Token: 'file
// Match type: exact-match
// Description: Items that include `file`

import BaseMatch from './BaseMatch'

export default class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'exact'
  }
  static get literal() {
    return /^'"(.*)"$/
  }
  static get re() {
    return /^'(.*)$/
  }
  search(text) {
    const index = text.indexOf(this.pattern)
    const isMatch = index > -1

    return {
      isMatch,
      score: isMatch ? 1 : 0,
      matchedIndices: [index, index + this.pattern.length - 1]
    }
  }
}
