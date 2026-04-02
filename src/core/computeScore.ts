import Config from './config'
import type { InternalResult } from '../types'

export function computeScoreSingle(
  result: InternalResult,
  { ignoreFieldNorm = Config.ignoreFieldNorm }
): void {
  let totalScore = 1

  result.matches.forEach(({ key, norm, score }) => {
    const weight = key ? key.weight : null

    totalScore *= Math.pow(
      score === 0 && weight ? Number.EPSILON : score,
      (weight || 1) * (ignoreFieldNorm ? 1 : norm)
    )
  })

  result.score = totalScore
}

// Practical scoring function
export default function computeScore(
  results: InternalResult[],
  { ignoreFieldNorm = Config.ignoreFieldNorm }
): void {
  results.forEach((result) => {
    computeScoreSingle(result, { ignoreFieldNorm })
  })
}
