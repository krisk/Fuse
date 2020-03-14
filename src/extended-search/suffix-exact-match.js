// Token: .file$
// Match type: suffix-exact-match
// Description: Items that end with `.file`

const isForPattern = pattern => pattern.charAt(pattern.length - 1) == '$'

const sanitize = pattern => pattern.substr(0, pattern.length - 1)

const match = (pattern, text) => {
  const sanitizedPattern = sanitize(pattern)
  const isMatch = text.endsWith(sanitizedPattern)

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