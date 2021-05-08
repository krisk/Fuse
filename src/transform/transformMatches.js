import { isDefined } from '../helpers/types'

export default function transformMatches(includeScore) {
  return function (result, data) {
    const matches = result.matches
    data.matches = []

    if (!isDefined(matches)) {
      return
    }

    matches.forEach((match) => {
      if (!isDefined(match.indices) || !match.indices.length) {
        return
      }

      const { indices, value } = match

      let obj = {
        indices,
        value
      }

      if (includeScore && isDefined(match.score)) {
        obj.score = match.score
      }

      if (match.key) {
        obj.key = match.key.src
      }

      if (match.idx > -1) {
        obj.refIndex = match.idx
      }

      data.matches.push(obj)
    })
  }
} 
