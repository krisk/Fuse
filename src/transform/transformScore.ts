import type { InternalResult } from '../types'

export default function transformScore(result: InternalResult, data: any): void {
  data.score = result.score
}
