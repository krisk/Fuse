const withMatches = (result, data) => {
  const output = result.output
  data.matches = []

  for (let i = 0, len = output.length; i < len; i += 1) {
    let item = output[i]

    if (item.matchedIndices.length === 0) {
      continue
    }

    let obj = {
      indices: item.matchedIndices,
      value: item.value
    }

    if (item.key) {
      obj.key = item.key
    }

    if (item.hasOwnProperty('arrayIndex') && item.arrayIndex > -1) {
      obj.arrayIndex = item.arrayIndex
    }

    data.matches.push(obj)
  }
}

const withScore = (result, data) => {
  data.score = result.score
}

module.exports = {
  withMatches,
  withScore
}