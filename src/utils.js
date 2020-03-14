const INFINITY = 1 / 0

const isArray = value => !Array.isArray
  ? Object.prototype.toString.call(value) === '[object Array]'
  : Array.isArray(value)

// Adapted from:
// https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js
const baseToString = value => {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  let result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

const toString = value => value == null ? '' : baseToString(value);

const isString = value => typeof value === 'string'

const isNum = value => typeof value === 'number'

const isDefined = value => value !== undefined && value !== null

const get = (obj, path) => {
  let list = []
  let arr = false

  const _get = (obj, path) => {
    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj)
    } else {
      const dotIndex = path.indexOf('.')

      let key = path
      let remaining = null

      if (dotIndex !== -1) {
        key = path.slice(0, dotIndex)
        remaining = path.slice(dotIndex + 1)
      }

      const value = obj[key]

      if (value !== null && value !== undefined) {
        if (!remaining && (isString(value) || isNum(value))) {
          list.push(toString(value))
        } else if (isArray(value)) {
          arr = true
          // Search each item in the array.
          for (let i = 0, len = value.length; i < len; i += 1) {
            _get(value[i], remaining)
          }
        } else if (remaining) {
          // An object. Recurse further.
          _get(value, remaining)
        }
      }
    }
  }

  _get(obj, path)

  if (arr) {
    return list
  }

  return list[0]
}

module.exports = {
  get,
  isDefined,
  isArray,
  isString,
  isNum,
  toString
}
