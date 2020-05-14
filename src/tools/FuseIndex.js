import { isArray, isDefined, isString, isBlank } from '../helpers/types'
import Config from '../core/config'
import normGenerator from './norm'

export default class FuseIndex {
  constructor({ getFn = Config.getFn } = {}) {
    this.norm = normGenerator(3)
    this.getFn = getFn
    this.isCreated = false

    this.setRecords()
  }
  setCollection(docs = []) {
    this.docs = docs
  }
  setRecords(records = []) {
    this.records = records
  }
  setKeys(keys = []) {
    this.keys = keys
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return
    }

    this.isCreated = true

    // List is Array<String>
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex)
      })
    } else {
      // List is Array<Object>
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex)
      })
    }

    this.norm.clear()
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size()

    if (isString(doc)) {
      this._addString(doc, idx)
    } else {
      this._addObject(doc, idx)
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1)

    // Change ref index of every subsquent doc
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1
    }
  }
  size() {
    return this.records.length
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return
    }

    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    }

    this.records.push(record)
  }
  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} }

    // Iterate over every key (i.e, path), and fetch the value at that key
    this.keys.forEach((key, keyIndex) => {
      let value = this.getFn(doc, key)

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

    this.records.push(record)
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
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
  const { keys, records } = data
  let myIndex = new FuseIndex({ getFn })
  myIndex.setKeys(keys)
  myIndex.setRecords(records)
  return myIndex
}
