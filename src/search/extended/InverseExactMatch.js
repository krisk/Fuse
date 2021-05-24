import BaseMatch from './BaseMatch.js'

class InverseExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }

  static get type() {
    return 'inverse-exact'
  }

  static get multiRegex() {
    return /^!"(.*)"$/
  }

  static get singleRegex() {
    return /^!(.*)$/
  }

  search(text) {
    const index = text.indexOf(this.pattern)
    const isMatch = index === -1

    return { isMatch, score: isMatch ? 0 : 1, indices: [0, text.length - 1] }
  }
}

export default InverseExactMatch
