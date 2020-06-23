import { isDefined, isString, isNumber, isArray, toString } from './types'

export default function get(obj, path) {
  let list = []
  let arr = false

  const deepGet = (obj, path, index) => {
    if (!path[index]) {
      // If there's no path left, we've arrived at the object we care about.
      list.push(obj)
    } else {
      let key = path[index]

      const value = obj[key]

      if (!isDefined(value)) {
        return
      }

      if (index === path.length - 1 && (isString(value) || isNumber(value))) {
        list.push(toString(value))
      } else if (isArray(value)) {
        arr = true
        // Search each item in the array.
        for (let i = 0, len = value.length; i < len; i += 1) {
          deepGet(value[i], path, index + 1)
        }
      } else if (path.length) {
        // An object. Recurse further.
        deepGet(value, path, index + 1)
      }
    }
  }

  deepGet(obj, path, 0)

  return arr ? list : list[0]
}
