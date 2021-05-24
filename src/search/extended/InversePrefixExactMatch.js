import BaseMatch from './BaseMatch.js'

class InversePrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }

  static get type() {
    return 'inverse-prefix-exact'
  }

  static get multiRegex() {
    return /^!\^"(.*)"$/
  }

  static get singleRegex() {
    return /^!\^(.*)$/
  }

  search(text) {
    const isMatch = !text.startsWith(this.pattern)

    return { isMatch, score: isMatch ? 0 : 1, indices: [0, text.length - 1] }
  }
}

export default InversePrefixExactMatch
