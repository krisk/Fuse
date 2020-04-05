export default class BaseMatch {
  constructor(pattern) {
    this.pattern = pattern
  }
  static isLiteralMatch(pattern) {
    return getMatch(pattern, this.literal)
  }
  static isRegMatch(pattern) {
    return getMatch(pattern, this.re)
  }
  search(/*text*/) {}
}

function getMatch(pattern, exp) {
  const matches = pattern.match(exp)
  return matches ? matches[1] : null
}
