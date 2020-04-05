export default class Match {
  constructor(pattern) {
    this.pattern = pattern
  }
  static isLiteralMatch(pattern) {
    const matches = pattern.match(this.literal)
    return matches ? matches[1] : null
  }
  static isRegMatch(pattern, re) {
    const matches = pattern.match(this.re)
    return matches ? matches[1] : null
  }
  search(text) {}
}
