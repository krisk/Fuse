import BaseMatch from './BaseMatch.js'

class ExactMatch extends BaseMatch {
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

export default ExactMatch
