import { isArray, isDefined, isString, isBlank } from '../helpers/types'
import Config from '../core/config'
import normGenerator from './norm'
import { createKey } from './KeyStore'

export default class FuseIndex {
  constructor({
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  } = {}) {
    this.norm = normGenerator(fieldNormWeight, 3)
    this.getFn = getFn
    this.isCreated = false

    this.setIndexRecords()
  }
  setSources(docs = []) {
    this.docs = docs
  }
  setIndexRecords(records = []) {
    this.records = records
  }
  setKeys(keys = []) {
    this.keys = keys
    this._keysMap = {}
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx
    })
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
  // Removes docs at the specified indices (must be sorted ascending)
  removeAll(indices) {
    // Remove in reverse order to avoid index shifting during splice
    for (let i = indices.length - 1; i >= 0; i -= 1) {
      this.records.splice(indices[i], 1)
    }
    // Single re-index pass
    for (let i = 0, len = this.records.length; i < len; i += 1) {
      this.records[i].i = i
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]]
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
      let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path)

      if (!isDefined(value)) {
        return
      }

      if (isArray(value)) {
        let subRecords = []

        for (let i = 0, len = value.length; i < len; i += 1) {
          const item = value[i]

          if (!isDefined(item)) {
            continue
          }

          if (isString(item)) {
            // Custom getFn returning plain string array (backward compat)
            if (!isBlank(item)) {
              let subRecord = {
                v: item,
                i: i,
                n: this.norm.get(item)
              }

              subRecords.push(subRecord)
            }
          } else if (isString(item.v) && !isBlank(item.v)) {
            // Default get() returns {v, i} objects with original array indices
            let subRecord = {
              v: item.v,
              i: item.i,
              n: this.norm.get(item.v)
            }

            subRecords.push(subRecord)
          }
        }
        record.$[keyIndex] = subRecords
      } else if (isString(value) && !isBlank(value)) {
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

export function createIndex(
  keys,
  docs,
  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
) {
  const myIndex = new FuseIndex({ getFn, fieldNormWeight })
  myIndex.setKeys(keys.map(createKey))
  myIndex.setSources(docs)
  myIndex.create()
  return myIndex
}

export function parseIndex(
  data,
  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
) {
  const { keys, records } = data
  const myIndex = new FuseIndex({ getFn, fieldNormWeight })
  myIndex.setKeys(keys)
  myIndex.setIndexRecords(records)
  return myIndex
}
