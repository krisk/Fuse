// Token: !^fire
// Match type: inverse-prefix-exact-match
// Description: Items that do not start with `fire`

const isForPattern = (pattern) =>
  pattern.charAt(0) == '!' && pattern.charAt(1) == '^'

const sanitize = (pattern) => pattern.substr(2)

const match = (pattern, text) => {
  const sanitizedPattern = sanitize(pattern)
  const isMatch = !text.startsWith(sanitizedPattern)

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
