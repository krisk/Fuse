// Token: !.file$
// Match type: inverse-suffix-exact-match
// Description: Items that do not end with `.file`

const search = (pattern, text) => {
  const isMatch = !text.endsWith(pattern)

  return {
    isMatch,
    score: 0
  }
}

const literal = /^!"(.*)"\$$/
const re = /^!(.*)\$$/
const name = 'inverse-suffix-exact'

export default {
  name,
  literal,
  re,
  search
}
