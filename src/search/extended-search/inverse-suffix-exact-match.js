// Token: !.file$
// Match type: inverse-suffix-exact-match
// Description: Items that do not end with `.file`
import Match from './match'

export default class InverseSuffixExactMatch extends Match {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'inverse-suffix-exact'
  }
  static get literal() {
    return /^!"(.*)"\$$/
  }
  static get re() {
    return /^!(.*)\$$/
  }
  search(text) {
    const isMatch = !text.endsWith(this.pattern)
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      matchedIndices: [0, text.length - 1]
    }
  }
}
