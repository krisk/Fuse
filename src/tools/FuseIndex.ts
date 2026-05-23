import {
  isArray,
  isDefined,
  isString,
  isBlank,
  toString
} from '../helpers/typeGuards'
import Config from '../core/config'
import * as ErrorMsg from '../core/errorMessages'
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
  // Appends a record for `doc` at `docIndex` (the doc's position in the source
  // array). Returns the appended record, or null when `doc` is a blank string
  // (those are skipped at record creation; see `_createStringRecord`). Callers
  // use the return value to gate downstream bookkeeping like the inverted
  // index, which must not be touched when no record was produced.
  add(doc: T, docIndex: number): IndexRecord | null {
    if (!Number.isInteger(docIndex) || docIndex < 0) {
      throw new Error(ErrorMsg.INVALID_DOC_INDEX)
    }

    if (isString(doc)) {
      const record = this._createStringRecord(
        doc as unknown as string,
        docIndex
      )
      if (record) {
        this.records.push(record)
      }
      return record
    }

    const record = this._createObjectRecord(doc, docIndex)
    this.records.push(record)
    return record
  }
  // Removes the record for the doc at the specified source-array (docs) index.
  // Blank string docs have no record; callers may pass such an index and the
  // splice is a no-op, but subsequent records still need their .i decremented
  // to track the docs array that the caller is splicing in parallel.
  removeAt(idx: number): void {
    if (!Number.isInteger(idx) || idx < 0) {
      throw new Error(ErrorMsg.INVALID_DOC_INDEX)
    }

    // Find and remove the record at this doc-index, if one exists. Records are
    // typically sorted by .i but the algorithm doesn't depend on it — parsed
    // indexes via setIndexRecords may arrive in arbitrary order.
    for (let i = 0, len = this.records.length; i < len; i += 1) {
      if (this.records[i].i === idx) {
        this.records.splice(i, 1)
        break
      }
    }

    // Decrement every record whose source-array index is now stale.
    for (let i = 0, len = this.records.length; i < len; i += 1) {
      if (this.records[i].i > idx) {
        this.records[i].i -= 1
      }
    }
  }
  // Removes records for the docs at the specified source-array indices, then
  // shifts every surviving record's .i down by the count of removed indices
  // strictly less than it (mirrors removeAndShiftInvertedIndex's shift math).
  // Invalid entries (non-integer, negative) in `indices` are dropped silently
  // — removeAll's natural use case is "caller passed a list of matched doc
  // indices"; asymmetric throw-vs-no-op would be more surprising than a clean
  // filter.
  removeAll(indices: number[]): void {
    const toRemove = new Set<number>()
    for (const v of indices) {
      if (Number.isInteger(v) && v >= 0) {
        toRemove.add(v)
      }
    }

    if (toRemove.size === 0) {
      return
    }

    this.records = this.records.filter((r) => !toRemove.has(r.i))

    const sorted = Array.from(toRemove).sort((a, b) => a - b)
    for (const record of this.records) {
      // shift = count of removed indices strictly less than record.i
      let lo = 0
      let hi = sorted.length
      while (lo < hi) {
        const mid = (lo + hi) >>> 1
        if (sorted[mid] < record.i) lo = mid + 1
        else hi = mid
      }
      record.i -= lo
    }
  }
  getValueForItemAtKeyId(item: any, keyId: string): any {
    return item[this._keysMap[keyId]]
  }
  size(): number {
    return this.records.length
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
    for (
      let keyIndex = 0, keyLen = this.keys.length;
      keyIndex < keyLen;
      keyIndex++
    ) {
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
  {
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  }: FuseIndexOptions<T> = {}
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
  {
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  }: FuseIndexOptions<T> = {}
): FuseIndex<T> {
  const { keys, records } = data
  const myIndex = new FuseIndex<T>({ getFn, fieldNormWeight })
  myIndex.setKeys(keys as KeyObject[])
  myIndex.setIndexRecords(records)
  return myIndex
}
