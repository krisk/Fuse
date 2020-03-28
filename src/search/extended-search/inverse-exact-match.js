// Token: !fire
// Match type: inverse-exact-match
// Description: Items that do not include `fire`

const isForPattern = (pattern) => pattern.charAt(0) == '!'

const sanitize = (pattern) => pattern.substr(1)

const match = (pattern, text) => {
  const sanitizedPattern = sanitize(pattern)
  const isMatch = text.indexOf(sanitizedPattern) === -1

  return {
    isMatch,
    score: 0
  }
}

export default {
  isForPattern,
  sanitize,
  match
}
