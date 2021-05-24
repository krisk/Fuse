import Config from '../../core/config.js'

function convertMaskToIndices(
  matchmask = [],
  minMatchCharLength = Config.minMatchCharLength
) {
  let i = 0
  let end = -1
  let start = -1
  let indices = []

  for (let match_mask_len = matchmask.length; i < match_mask_len; i++) {
    if (matchmask[i] && start === -1) {
      start = i
      continue
    }

    end = i - 1

    if (end - start + 1 >= minMatchCharLength) indices.push([start, end])

    start = -1
  }

  if (matchmask[i - 1] && i - start >= minMatchCharLength)
    indices.push([start, i - 1])

  return indices
}

export default convertMaskToIndices
