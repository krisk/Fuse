const {
  isArray,
  isDefined,
  isString
} = require('../helpers/type-checkers')

const get = require('../helpers/get')

const ngram = require('../search/ngram-search/ngram')

module.exports = (keys, list, { getFn = get, ngrams = false }) => {
  let indexedList = []

  // List is Array<String>
  if (isString(list[0])) {
    // Iterate over every string in the list
    for (let i = 0, len = list.length; i < len; i += 1) {
      const value = list[i]

      if (isDefined(value)) {
        // if (!isCaseSensitive) {
        //   value = value.toLowerCase()
        // }

        let record = {
          $: value,
          idx: i
        }

        if (ngrams) {
          record.ng = ngram(value, { sort: true })
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

              // if (!isCaseSensitive) {
              //   v = v.toLowerCase()
              // }

              let subRecord = { $: value, idx: arrayIndex }

              if (ngrams) {
                subRecord.ng = ngram(value, { sort: true })
              }

              subRecords.push(subRecord)

            } else if (isArray(value)) {
              for (let k = 0, arrLen = value.length; k < arrLen; k += 1) {
                stack.push({
                  arrayIndex: k,
                  value: value[k],
                })
              }
            }
          }
          record.$[key] = subRecords
        } else {
          // if (!isCaseSensitive) {
          //   value = value.toLowerCase()
          // }

          let subRecord = { $: value }

          if (ngrams) {
            subRecord.ng = ngram(value, { sort: true })
          }

          record.$[key] = subRecord
        }
      }

      indexedList.push(record)
    }
  }

  return indexedList
}