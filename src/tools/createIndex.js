import { isArray, isDefined, isString, isBlank } from '../helpers/type-checkers'
import Config from '../core/config'
import normGenerator from './norm'

export default function createIndex(keys, list, { getFn = Config.getFn } = {}) {
  let indexedList = []
  let norm = normGenerator(3)

  // List is Array<String>
  if (isString(list[0])) {
    // Iterate over every string in the list
    for (let i = 0, len = list.length; i < len; i += 1) {
      const value = list[i]

      if (isDefined(value) && !isBlank(value)) {
        let record = {
          v: value,
          i,
          n: norm.get(value)
        }

        indexedList.push(record)
      }
    }
  } else {
    // List is Array<Object>
    const keysLen = keys.length

    for (let i = 0, len = list.length; i < len; i += 1) {
      let item = list[i]

      let record = { i, $: {} }

      // Iterate over every key (i.e, path), and fetch the value at that key
      for (let j = 0; j < keysLen; j += 1) {
        let key = keys[j]
        let value = getFn(item, key)

        if (!isDefined(value)) {
          continue
        }

        if (isArray(value)) {
          let subRecords = []
          const stack = [{ arrayIndex: -1, value }]

          while (stack.length) {
            const { arrayIndex, value } = stack.pop()

            if (!isDefined(value)) {
              continue
            }

            if (isString(value) && !isBlank(value)) {
              let subRecord = {
                v: value,
                i: arrayIndex,
                n: norm.get(value)
              }

              subRecords.push(subRecord)
            } else if (isArray(value)) {
              for (let k = 0, arrLen = value.length; k < arrLen; k += 1) {
                stack.push({
                  arrayIndex: k,
                  value: value[k]
                })
              }
            } else {
              // If we're here, the `path` is either incorrect, or pointing to a non-string.
              // console.error(new Error(`Path "${key}" points to a non-string value. Received: ${value}`))
            }
          }
          record.$[j] = subRecords
        } else if (!isBlank(value)) {
          let subRecord = {
            v: value,
            n: norm.get(value)
          }

          record.$[j] = subRecord
        }
      }

      indexedList.push(record)
    }
  }

  norm.clear()

  return {
    keys,
    list: indexedList
  }
}
