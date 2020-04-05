// Token: 'file
// Match type: exact-match
// Description: Items that include `file`

import Match from './match'

export default class ExactMatch extends Match {
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
