import type { RangeTuple } from '../types'

export function mergeIndices(indices: RangeTuple[]): RangeTuple[] {
  if (indices.length <= 1) return indices

  indices.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  const merged: RangeTuple[] = [indices[0]]

  for (let i = 1, len = indices.length; i < len; i += 1) {
    const last = merged[merged.length - 1]
    const curr = indices[i]
    if (curr[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], curr[1])
    } else {
      merged.push(curr)
    }
  }

  return merged
}
