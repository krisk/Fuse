import BaseMatch from './BaseMatch.js'

class IncludeMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }

  static get type() {
    return 'include'
  }

  static get multiRegex() {
    return /^'"(.*)"$/
  }

  static get singleRegex() {
    return /^'(.*)$/
  }

  search(text) {
    let index
    let location = 0

    const indices = []
    const patternLen = this.pattern.length

    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen
      indices.push([index, location - 1])
    }

    const isMatch = !!indices.length

    return { isMatch, score: isMatch ? 0 : 1, indices }
  }
}

export default IncludeMatch
