class BaseMatch {
  constructor(pattern) {
    this.pattern = pattern
  }

  static isMultiMatch(pattern) {
    return getMatch(pattern, this.multiRegex)
  }

  static isSingleMatch(pattern) {
    return getMatch(pattern, this.singleRegex)
  }
}

function getMatch(pattern, exp) {
  const matches = pattern.match(exp)
  return matches ? matches[1] : null
}

export default BaseMatch
