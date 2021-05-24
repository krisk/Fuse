import BaseMatch from './BaseMatch.js'

class PrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }

  static get type() {
    return 'prefix-exact'
  }

  static get multiRegex() {
    return /^\^"(.*)"$/
  }

  static get singleRegex() {
    return /^\^(.*)$/
  }

  search(text) {
    const isMatch = text.startsWith(this.pattern)

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

export default PrefixExactMatch
