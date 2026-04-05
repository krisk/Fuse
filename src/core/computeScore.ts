import Config from './config'
import type { InternalResult, MatchScore } from '../types'

export function computeScoreSingle(
  matches: MatchScore[],
  { ignoreFieldNorm = Config.ignoreFieldNorm }
): number {
  let totalScore = 1

  for (let i = 0, len = matches.length; i < len; i++) {
    const { key, norm, score } = matches[i]
    const weight = key ? key.weight : null

    totalScore *= Math.pow(
      score === 0 && weight ? Number.EPSILON : score,
      (weight || 1) * (ignoreFieldNorm ? 1 : norm)
    )
  }

  return totalScore
}

export default function computeScore(
  results: InternalResult[],
  { ignoreFieldNorm = Config.ignoreFieldNorm }
): void {
  for (let i = 0, len = results.length; i < len; i++) {
    results[i].score = computeScoreSingle(results[i].matches, { ignoreFieldNorm })
  }
}
