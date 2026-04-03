import Config from './config'
import type { InternalResult, MatchScore } from '../types'

export function computeScoreSingle(
  matches: MatchScore[],
  { ignoreFieldNorm = Config.ignoreFieldNorm }
): number {
  let totalScore = 1

  matches.forEach(({ key, norm, score }) => {
    const weight = key ? key.weight : null

    totalScore *= Math.pow(
      score === 0 && weight ? Number.EPSILON : score,
      (weight || 1) * (ignoreFieldNorm ? 1 : norm)
    )
  })

  return totalScore
}

export default function computeScore(
  results: InternalResult[],
  { ignoreFieldNorm = Config.ignoreFieldNorm }
): void {
  results.forEach((result) => {
    result.score = computeScoreSingle(result.matches, { ignoreFieldNorm })
  })
}
