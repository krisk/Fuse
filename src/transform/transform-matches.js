module.exports = (result, data) => {
  const matches = result.matches
  data.matches = []

  for (let i = 0, len = matches.length; i < len; i += 1) {
    let match = matches[i]

    if (match.indices.length === 0) {
      continue
    }

    let obj = {
      indices: match.indices,
      value: match.value
    }

    if (match.key) {
      obj.key = match.key
    }

    if (match.idx > -1) {
      obj.refIndex = match.idx
    }

    data.matches.push(obj)
  }
}