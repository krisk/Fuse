import Config from '../../core/config'
import type { RangeTuple } from '../../types'

// Collects runs of set cells in matchmask[from, to) that are at least
// minMatchCharLength long. Cells outside [from, to) must be unset.
export default function convertMaskToIndices(
  matchmask: ArrayLike<number> = [],
  minMatchCharLength: number = Config.minMatchCharLength,
  from: number = 0,
  to: number = matchmask.length
): RangeTuple[] {
  const indices: RangeTuple[] = []

  if (to <= from) {
    return indices
  }

  let start = -1
  let end = -1
  let i = from

  for (; i < to; i += 1) {
    const match = matchmask[i]
    if (match && start === -1) {
      start = i
    } else if (!match && start !== -1) {
      end = i - 1
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end])
      }
      start = -1
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    indices.push([start, i - 1])
  }

  return indices
}
