// Token: !fire
// Match type: inverse-exact-match
// Description: Items that do not include `fire`

import Match from './match'

export default class InverseExactMatch extends Match {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'inverse-exact'
  }
  static get literal() {
    return /^!"(.*)"$/
  }
  static get re() {
    return /^!(.*)$/
  }
  search(text) {
    const index = text.indexOf(this.pattern)
    const isMatch = index === -1

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      matchedIndices: [0, text.length - 1]
    }
  }
}
