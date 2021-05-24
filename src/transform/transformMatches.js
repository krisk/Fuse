import { isDefined } from '../helpers/types.js'

function transformMatches(result, data) {
  const matches = result.matches

  if (!isDefined(matches)) return

  data.matches = []

  matches.forEach((match) => {
    if (!isDefined(match.indices) || !match?.indices.length) return

    let obj = {
      value: match.value,
      indices: match.indices
    }

    if (match.key) obj.key = match.key.src

    if (match.idx > -1) obj.refIndex = match.idx

    data.matches.push(obj)
  })
}

export default transformMatches
