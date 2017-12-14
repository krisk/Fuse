const { List } = require('immutable')
const isArray = require('./is_array')

const deepValue = (obj, path, list) => {
  if (!path) {
    // If there's no path left, we've gotten to the object we care about.
    return list.push(obj)
  }

  const dotIndex = path.indexOf('.')
  let firstSegment = path
  let remaining = null

  if (dotIndex !== -1) {
    firstSegment = path.slice(0, dotIndex)
    remaining = path.slice(dotIndex + 1)
  }

  const value = obj.get(firstSegment)
  
  if (value !== null && value !== undefined) {
    if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
      return list.push(value.toString())
    } else if (List.isList(value)) {
      // Search each item in the array.
      return value.reduce((accumulation, item) => deepValue(item, remaining, accumulation), list)
    } else if (remaining) {
      // An object. Recurse further.
      return list.concat(deepValue(value, remaining, list))
    }
  }

  return list
}

module.exports = (obj, path) => {
  return deepValue(obj, path, List())
}
