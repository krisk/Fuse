// Token: !fire
// Match type: inverse-exact-match
// Description: Items that do not include `fire`

const search = (pattern, text) => {
  const isMatch = text.indexOf(pattern) === -1

  return {
    isMatch,
    score: 0
  }
}

const literal = /^!"(.*)"$/
const re = /^!(.*)$/
const name = 'inverse-exact'

export default {
  name,
  literal,
  re,
  search
}
