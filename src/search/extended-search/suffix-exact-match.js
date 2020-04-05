// Token: .file$
// Match type: suffix-exact-match
// Description: Items that end with `.file`
import Match from './match'

export default class SuffixExactMatch extends Match {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'suffix-exact'
  }
  static get literal() {
    return /^"(.*)"\$$/
  }
  static get re() {
    return /^(.*)\$$/
  }
  search(text) {
    const isMatch = text.endsWith(this.pattern)

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      matchedIndices: [text.length - this.pattern.length, text.length - 1]
    }
  }
}
