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

    const s = score === 0 && weight ? Number.EPSILON : score
    const exponent = (weight || 1) * (ignoreFieldNorm ? 1 : norm)

    totalScore *= exponent === 1 ? s : Math.pow(s, exponent)
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
