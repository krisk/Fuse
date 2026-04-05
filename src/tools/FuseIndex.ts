import { isArray, isDefined, isString, isBlank, toString } from '../helpers/typeGuards'
import Config from '../core/config'
import normGenerator from './fieldNorm'
import { createKey } from './KeyStore'
import type {
  KeyObject,
  FuseOptionKey,
  NormInterface,
  GetFunction,
  IndexRecord,
  SubRecord,
  FuseIndexOptions
} from '../types'

export default class FuseIndex<T = any> {
  norm: NormInterface
  getFn: GetFunction
  isCreated: boolean
  docs: ReadonlyArray<T>
  records!: IndexRecord[]
  keys: KeyObject[]
  _keysMap: Record<string, number>

  constructor({
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  }: FuseIndexOptions<T> = {}) {
    this.norm = normGenerator(fieldNormWeight, 3)
    this.getFn = getFn as GetFunction
    this.isCreated = false
    this.docs = []
    this.keys = []
    this._keysMap = {}

    this.setIndexRecords()
  }
  setSources(docs: ReadonlyArray<T> = []): void {
    this.docs = docs
  }
  setIndexRecords(records: IndexRecord[] = []): void {
    this.records = records
  }
  setKeys(keys: KeyObject[] = []): void {
    this.keys = keys
    this._keysMap = {}
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx
    })
  }
  create(): void {
    if (this.isCreated || !this.docs.length) {
      return
    }

    this.isCreated = true

    const len = this.docs.length
    this.records = new Array(len)
    let recordCount = 0

    // List is Array<String>
    if (isString(this.docs[0])) {
      for (let i = 0; i < len; i++) {
        const record = this._createStringRecord(this.docs[i] as string, i)
        if (record) {
          this.records[recordCount++] = record
        }
      }
    } else {
      // List is Array<Object>
      for (let i = 0; i < len; i++) {
        this.records[recordCount++] = this._createObjectRecord(this.docs[i], i)
      }
    }

    this.records.length = recordCount
    this.norm.clear()
  }
  // Adds a doc to the end of the index
  add(doc: T): void {
    const idx = this.size()

    if (isString(doc)) {
      this._addString(doc, idx)
    } else {
      this._addObject(doc, idx)
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx: number): void {
    this.records.splice(idx, 1)

    // Change ref index of every subsquent doc
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1
    }
  }
  // Removes docs at the specified indices
  removeAll(indices: number[]): void {
    const toRemove = new Set(indices)
    this.records = this.records.filter((_, i) => !toRemove.has(i))
    for (let i = 0, len = this.records.length; i < len; i += 1) {
      this.records[i].i = i
    }
  }
  getValueForItemAtKeyId(item: any, keyId: string): any {
    return item[this._keysMap[keyId]]
  }
  size(): number {
    return this.records.length
  }
  _addString(doc: string, docIndex: number): void {
    const record = this._createStringRecord(doc, docIndex)
    if (record) {
      this.records.push(record)
    }
  }
  _addObject(doc: any, docIndex: number): void {
    this.records.push(this._createObjectRecord(doc, docIndex))
  }
  _createStringRecord(doc: string, docIndex: number): IndexRecord | null {
    if (!isDefined(doc) || isBlank(doc)) {
      return null
    }

    return {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    }
  }
  _createObjectRecord(doc: any, docIndex: number): IndexRecord {
    const record: IndexRecord = { i: docIndex, $: {} }

    // Iterate over every key (i.e, path), and fetch the value at that key
    for (let keyIndex = 0, keyLen = this.keys.length; keyIndex < keyLen; keyIndex++) {
      const key = this.keys[keyIndex]
      const value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path)

      if (!isDefined(value)) {
        continue
      }

      if (isArray(value)) {
        const subRecords: SubRecord[] = []

        for (let i = 0, len = value.length; i < len; i += 1) {
          const item = value[i]

          if (!isDefined(item)) {
            continue
          }

          if (isString(item)) {
            // Custom getFn returning plain string array (backward compat)
            if (!isBlank(item)) {
              const subRecord: SubRecord = {
                v: item,
                i: i,
                n: this.norm.get(item)
              }

              subRecords.push(subRecord)
            }
          } else if (isDefined(item.v)) {
            // Default get() returns {v, i} objects with original array indices
            const text = isString(item.v) ? item.v : toString(item.v)
            if (!isBlank(text)) {
              const subRecord: SubRecord = {
                v: text,
                i: item.i,
                n: this.norm.get(text)
              }

              subRecords.push(subRecord)
            }
          }
        }
        record.$![keyIndex] = subRecords
      } else if (isString(value) && !isBlank(value)) {
        const subRecord: SubRecord = {
          v: value,
          n: this.norm.get(value)
        }

        record.$![keyIndex] = subRecord
      }
    }

    return record
  }
  toJSON(): {
    keys: ReadonlyArray<Omit<KeyObject, 'getFn'>>
    records: IndexRecord[]
  } {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      keys: this.keys.map(({ getFn, ...key }) => key),
      records: this.records
    }
  }
}

export function createIndex<T>(
  keys: FuseOptionKey<T>[],
  docs: ReadonlyArray<T>,
  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight }: FuseIndexOptions<T> = {}
): FuseIndex<T> {
  const myIndex = new FuseIndex<T>({ getFn, fieldNormWeight })
  myIndex.setKeys(keys.map(createKey))
  myIndex.setSources(docs)
  myIndex.create()
  return myIndex
}

export function parseIndex<T>(
  data: {
    keys: ReadonlyArray<KeyObject>
    records: IndexRecord[]
  },
  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight }: FuseIndexOptions<T> = {}
): FuseIndex<T> {
  const { keys, records } = data
  const myIndex = new FuseIndex<T>({ getFn, fieldNormWeight })
  myIndex.setKeys(keys as KeyObject[])
  myIndex.setIndexRecords(records)
  return myIndex
}
