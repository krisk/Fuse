// Token: ^file
// Match type: prefix-exact-match
// Description: Items that start with `file`

const search = (pattern, text) => {
  const isMatch = text.startsWith(pattern)

  return {
    isMatch,
    score: 0
  }
}

const literal = /^\^"(.*)"$/
const re = /^\^(.*)$/
const name = 'prefix-exact'

export default {
  name,
  literal,
  re,
  search
}
