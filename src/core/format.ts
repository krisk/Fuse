import Config from './config'
import { transformMatches, transformScore } from '../transform'
import type { InternalResult, FuseResult } from '../types'

export default function format<T>(
  results: InternalResult[],
  docs: T[],
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
): FuseResult<T>[] {
  const transformers: Array<(result: InternalResult, data: any) => void> = []

  if (includeMatches) transformers.push(transformMatches)
  if (includeScore) transformers.push(transformScore)

  return results.map((result) => {
    const { idx } = result

    const data: any = {
      item: docs[idx],
      refIndex: idx
    }

    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data)
      })
    }

    return data
  })
}
