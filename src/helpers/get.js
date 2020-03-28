import {
  isDefined,
  isString,
  isNumber,
  isArray,
  toString
} from './type-checkers'

export default function get(obj, path) {
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

      if (isDefined(value)) {
        if (!remaining && (isString(value) || isNumber(value))) {
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
