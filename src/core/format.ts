import Config from './config'
import formatMatches from './formatMatches'
import type { InternalResult, FuseResult } from '../types'

export default function format<T>(
  results: InternalResult[],
  docs: T[],
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
): FuseResult<T>[] {
  return results.map((result) => {
    const { idx } = result

    const data: FuseResult<T> = {
      item: docs[idx],
      refIndex: idx
    }

    if (includeMatches) data.matches = formatMatches(result)
    if (includeScore) data.score = result.score

    return data
  })
}
