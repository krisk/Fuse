// Token: 'file
// Match type: exact-match
// Description: Items that include `file`

import BaseMatch from './BaseMatch'

export default class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern)
  }
  static get type() {
    return 'exact'
  }
  static get multiRegex() {
    return /^'"(.*)"$/
  }
  static get singleRegex() {
    return /^'(.*)$/
  }
  search(text) {
    let location = 0
    let index

    const matchedIndices = []
    const patternLen = this.pattern.length

    // Get all exact matches
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen
      matchedIndices.push([index, location - 1])
    }

    const isMatch = !!matchedIndices.length

    return {
      isMatch,
      score: isMatch ? 1 : 0,
      matchedIndices
    }
  }
}
