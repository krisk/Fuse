import { isArray } from './types.js'
import { isString } from './types.js'
import { isNumber } from './types.js'
import { toString } from './types.js'
import { isBoolean } from './types.js'
import { isDefined } from './types.js'

function get(obj, path) {
  let list = []
  let arr = false

  const deepGet = (obj, path, index) => {
    if (!isDefined(obj)) return

    if (!path[index]) {
      /** If there's no path left, we've arrived at the object we care about. */
      list.push(obj)
      return
    }

    let key = path[index]
    const value = obj[key]

    if (!isDefined(value)) return

    /** If we're at the last value in the path, and if it's a string/number/bool, add it to the list. */
    if (
      index === path.length - 1 &&
      (isString(value) || isNumber(value) || isBoolean(value))
    ) {
      list.push(toString(value))
      return
    }

    if (isArray(value)) {
      arr = true
      for (let i = 0, val_len = value.length; i < val_len; i++)
        deepGet(value[i], path, index + 1)
      return
    }

    if (path.length) {
      deepGet(value, path, index + 1)
      return
    }
  }

  /** Backwards compatibility (since path used to be a string). */
  deepGet(obj, isString(path) ? path.split('.') : path, 0)

  return arr ? list : list[0]
}

export default get
