// Token: ^file
// Match type: prefix-exact-match
// Description: Items that start with `file`

const isForPattern = pattern => pattern.charAt(0) == '^'

const sanitize = pattern => pattern.substr(1)

const match = (pattern, text) => {
  const sanitizedPattern = sanitize(pattern)
  const isMatch = text.startsWith(sanitizedPattern)

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