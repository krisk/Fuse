import { isArray, isDefined, isString, isBlank } from '../helpers/type-checkers'
import Config from '../core/config'
import normGenerator from './norm'

export default function createIndex(keys, list, { getFn = Config.getFn } = {}) {
  let indexedList = []
  let norm = normGenerator(3)

  // List is Array<String>
  if (isString(list[0])) {
    list.forEach((item, itemIndex) => {
      if (!isDefined(item) || isBlank(item)) {
        return
      }

      let record = {
        v: item,
        i: itemIndex,
        n: norm.get(item)
      }

      indexedList.push(record)
    })
  } else {
    // List is Array<Object>
    list.forEach((item, itemIndex) => {
      let record = { i: itemIndex, $: {} }

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        let value = getFn(item, key)

        if (!isDefined(value)) {
          return
        }

        if (isArray(value)) {
          let subRecords = []
          const stack = [{ nestedArrIndex: -1, value }]

          while (stack.length) {
            const { nestedArrIndex, value } = stack.pop()

            if (!isDefined(value)) {
              continue
            }

            if (isString(value) && !isBlank(value)) {
              let subRecord = {
                v: value,
                i: nestedArrIndex,
                n: norm.get(value)
              }

              subRecords.push(subRecord)
            } else if (isArray(value)) {
              value.forEach((item, k) => {
                stack.push({
                  nestedArrIndex: k,
                  value: item
                })
              })
            } else {
              // If we're here, the `path` is either incorrect, or pointing to a non-string.
              // console.error(new Error(`Path "${key}" points to a non-string value. Received: ${value}`))
            }
          }
          record.$[keyIndex] = subRecords
        } else if (!isBlank(value)) {
          let subRecord = {
            v: value,
            n: norm.get(value)
          }

          record.$[keyIndex] = subRecord
        }
      })

      indexedList.push(record)
    })
  }

  norm.clear()

  return {
    keys,
    list: indexedList
  }
}
