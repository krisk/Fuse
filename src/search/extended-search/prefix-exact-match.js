// Token: ^file
// Match type: prefix-exact-match
// Description: Items that start with `file`
import Match from './match'

export default class PrefixExactMatch extends Match {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'prefix-exact'
  }
  static get literal() {
    return /^\^"(.*)"$/
  }
  static get re() {
    return /^\^(.*)$/
  }
  search(text) {
    const isMatch = text.startsWith(this.pattern)

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      matchedIndices: [0, this.pattern.length - 1]
    }
  }
}
