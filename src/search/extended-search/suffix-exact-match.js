// Token: .file$
// Match type: suffix-exact-match
// Description: Items that end with `.file`

const search = (pattern, text) => {
  const isMatch = text.endsWith(pattern)

  return {
    isMatch,
    score: 0
  }
}

const literal = /^"(.*)"\$$/
const re = /^(.*)\$$/
const name = 'suffix-exact'

export default {
  name,
  literal,
  re,
  search
}
