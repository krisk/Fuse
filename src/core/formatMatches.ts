import { isDefined } from '../helpers/typeGuards'
import type { InternalResult, FuseResultMatch } from '../types'

export default function formatMatches(
  result: InternalResult
): FuseResultMatch[] {
  const matches: FuseResultMatch[] = []

  result.matches.forEach((match) => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return
    }

    const obj: FuseResultMatch = {
      indices: match.indices,
      value: match.value
    }

    if (match.key) {
      // `key.id` is the canonical dotted-string identity (array paths joined
      // with '.'); `key.src` is the raw user input and can be a string[].
      obj.key = match.key.id
    }

    if (match.idx! > -1) {
      obj.refIndex = match.idx
    }

    matches.push(obj)
  })

  return matches
}
