import { BitapSearch } from '../search/index.js'

const registeredSearchers = []

function register(...args) {
  registeredSearchers.push(...args)
}

export function createSearcher(pattern, options) {
  for (
    let i = 0, reg_searcher_len = registeredSearchers.length;
    i < reg_searcher_len;
    i++
  ) {
    let searcherClass = registeredSearchers[i]

    if (searcherClass.condition(pattern, options))
      return new searcherClass(pattern, options)
  }

  return new BitapSearch(pattern, options)
}

export default register
