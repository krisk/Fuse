const withMatches = (result, data) => {
  const matches = result.matches
  data.matches = []

  for (let i = 0, len = matches.length; i < len; i += 1) {
    let item = matches[i]

    if (item.indices.length === 0) {
      continue
    }

    let obj = {
      indices: item.indices,
      value: item.value
    }

    if (item.key) {
      obj.key = item.key
    }

    if (item.refIndex > -1) {
      obj.refIndex = item.refIndex
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