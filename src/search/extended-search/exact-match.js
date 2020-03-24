// Token: 'file
// Match type: exact-match
// Description: Items that include `file`

const isForPattern = pattern => pattern.charAt(0) == "'"

const sanitize = pattern => pattern.substr(1)

const match = (pattern, text) => {
  const sanitizedPattern = sanitize(pattern)
  const index = text.indexOf(sanitizedPattern)
  const isMatch = index > -1

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