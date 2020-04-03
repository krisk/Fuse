// Token: !^fire
// Match type: inverse-prefix-exact-match
// Description: Items that do not start with `fire`

const search = (pattern, text) => {
  const isMatch = !text.startsWith(pattern)

  return {
    isMatch,
    score: 0
  }
}

const literal = /^!\^"(.*)"$/
const re = /^!\^(.*)$/
const name = 'inverse-prefix-exact'

export default {
  name,
  literal,
  re,
  search
}
