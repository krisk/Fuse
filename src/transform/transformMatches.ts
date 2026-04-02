import { isDefined } from '../helpers/types'
import type { InternalResult } from '../types'

export default function transformMatches(result: InternalResult, data: any): void {
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

    const obj: any = {
      indices,
      value
    }

    if (match.key) {
      obj.key = match.key.src
    }

    if (match.idx! > -1) {
      obj.refIndex = match.idx
    }

    data.matches.push(obj)
  })
}
