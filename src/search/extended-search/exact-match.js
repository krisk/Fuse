// Token: 'file
// Match type: exact-match
// Description: Items that include `file`

const search = (pattern, text) => {
  const index = text.indexOf(pattern)
  const isMatch = index > -1

  return {
    isMatch,
    score: 0
  }
}

const literal = /^'"(.*)"$/
const re = /^'(.*)$/
const name = 'exact'

export default {
  name,
  literal,
  re,
  search
}
