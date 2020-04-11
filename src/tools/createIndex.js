import { isArray, isDefined, isString } from '../helpers/type-checkers'
import get from '../helpers/get'
import createNGram from '../search/ngram/createNGram'

const SPACE = /[^ ]+/g

export default function createIndex(
  keys,
  list,
  { getFn = get, ngrams = false } = {}
) {
  let indexedList = []

  // List is Array<String>
  if (isString(list[0])) {
    // Iterate over every string in the list
    for (let i = 0, len = list.length; i < len; i += 1) {
      const value = list[i]

      if (isDefined(value)) {
        let record = {
          $: value,
          idx: i,
          t: value.match(SPACE).length
        }

        if (ngrams) {
          record.ng = createNGram(value, { sort: true })
        }

        indexedList.push(record)
      }
    }
  } else {
    // List is Array<Object>
    const keysLen = keys.length

    for (let i = 0, len = list.length; i < len; i += 1) {
      let item = list[i]

      let record = { idx: i, $: {} }

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

            if (isString(value)) {
              let subRecord = {
                $: value,
                idx: arrayIndex,
                t: value.match(SPACE).length
              }

              if (ngrams) {
                subRecord.ng = createNGram(value, { sort: true })
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
          record.$[key] = subRecords
        } else {
          let subRecord = { $: value, t: value.match(SPACE).length }

          if (ngrams) {
            subRecord.ng = createNGram(value, { sort: true })
          }

          record.$[key] = subRecord
        }
      }

      indexedList.push(record)
    }
  }

  return indexedList
}
