import { isArray, isDefined, isString, isBlank } from '../helpers/type-checkers'
import Config from '../core/config'
import normGenerator from './norm'

export default class FuseIndex {
  constructor({ getFn = Config.getFn } = {}) {
    this.norm = normGenerator(3)
    this.getFn = getFn
    this.isCreated = false

    this.setIndex()
  }
  setCollection(docs = []) {
    this.docs = docs
  }
  setIndex(index = []) {
    this.index = index
  }
  setKeys(keys = []) {
    this.keys = keys
  }
  create() {
    if (this.isCreated) {
      return
    }

    this.isCreated = true

    // List is Array<String>
    if (isString(this.docs[0])) {
      this.docs.forEach((item, itemIndex) => {
        this.addString(item, itemIndex)
      })
    } else {
      // List is Array<Object>
      this.docs.forEach((item, itemIndex) => {
        this.addObject(item, itemIndex)
      })
    }

    this.norm.clear()
  }
  addString(item, itemIndex) {
    if (!isDefined(item) || isBlank(item)) {
      return
    }

    let record = {
      v: item,
      i: itemIndex,
      n: this.norm.get(item)
    }

    this.index.push(record)
  }
  addObject(item, itemIndex) {
    let record = { i: itemIndex, $: {} }

    // Iterate over every key (i.e, path), and fetch the value at that key
    this.keys.forEach((key, keyIndex) => {
      let value = this.getFn(item, key)

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
              n: this.norm.get(value)
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
          n: this.norm.get(value)
        }

        record.$[keyIndex] = subRecord
      }
    })

    this.index.push(record)
  }
  toJSON() {
    return {
      keys: this.keys,
      index: this.index
    }
  }
}

export function createIndex(keys, docs, { getFn = Config.getFn } = {}) {
  let myIndex = new FuseIndex({ getFn })
  myIndex.setKeys(keys)
  myIndex.setCollection(docs)
  myIndex.create()
  return myIndex
}

export function parseIndex(data, { getFn = Config.getFn } = {}) {
  const { keys, index } = data
  let myIndex = new FuseIndex({ getFn })
  myIndex.setKeys(keys)
  myIndex.setIndex(index)
  return myIndex
}
