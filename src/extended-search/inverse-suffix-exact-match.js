// Token: !.file$
// Match type: inverse-suffix-exact-match
// Description: Items that do not end with `.file`

const isForPattern = pattern => pattern.charAt(0) == '!' && pattern.charAt(pattern.length - 1) == '$'

const sanitize = pattern => pattern.substring(1, pattern.length - 1)

const match = (pattern, text) => {
  const sanitizedPattern = sanitize(pattern)
  const isMatch = !text.endsWith(sanitizedPattern)
  return {
    isMatch,
    score: 0
  }
}

module.exports = {
  isForPattern,
  sanitize,
  match
}