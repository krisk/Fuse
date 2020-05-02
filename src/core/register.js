import { BitapSearch } from '../search'

const registeredSearchers = []

export default function register(...args) {
  registeredSearchers.push(...args)
}

export function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i]
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}
