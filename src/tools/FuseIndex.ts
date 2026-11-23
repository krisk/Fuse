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

// Record kinds.
export const STRING_RECORD = 0
export const OBJECT_RECORD = 1

// `entIdx` values that aren't array positions.
export const SCALAR = -1
// A present array field with no recorded items, serialized as `[]`. Carries no
// text: every consumer of entries must skip it before using the value.
export const EMPTY_ARRAY = -2

let warnedRecordsDeprecated = false

// Columnar index: records and their field values live in parallel typed
// arrays instead of one object per record and per value.
//
//   _recDoc[r]    source-array index of record r
//   _recKind[r]   STRING_RECORD or OBJECT_RECORD
//   _recStart[r]  offset of record r's first entry
//   _recLen[r]    number of entries of record r
//
//   _entKey[e]    key index of entry e (0 for string records)
//   _entIdx[e]    array position, SCALAR, or EMPTY_ARRAY
//   _entNormId[e] field-length norm, as an index into _normValues (norms
//                 come from word counts, so there are few distinct values;
//                 the table holds the exact Float64 values)
//   _entValue[e]  the text (same string reference as the document)
//
// A record's entries are in key order, and within a key in array order. A key
// with no entries is absent. Records keep their insertion order (parsed
// indexes may not be sorted by doc index). Removing a record marks its entries
// dead; the entry columns are compacted once dead entries outnumber live ones.
export default class FuseIndex<T = any> {
  norm: NormInterface
  getFn: GetFunction
  isCreated: boolean
  docs: ReadonlyArray<T>
  keys: KeyObject[]
  _keysMap: Record<string, number>

  _recCount = 0
  _recDoc = new Int32Array(16)
  _recKind = new Uint8Array(16)
  _recStart = new Uint32Array(16)
  _recLen = new Uint32Array(16)

  _entCount = 0
  _entDead = 0
  _entKey = new Uint32Array(64)
  _entIdx = new Int32Array(64)
  _entNormId = new Uint32Array(64)
  _normValues: number[] = []
  _normIds = new Map<number | string, number>()
  // Small direct-mapped cache in front of _normIds: norms take few distinct
  // values, so almost every lookup hits. A slot is trusted only when the
  // value at its id matches exactly.
  _normCache = new Int32Array(1024).fill(-1)
  _entValue: string[] = []

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
  }

  /**
   * @deprecated Will be removed in v8. Returns a detached snapshot of the
   * index in the record format: a fresh copy on each access, so changes to it
   * don't affect search. Use `toJSON()` to serialize an index.
   */
  get records(): IndexRecord[] {
    if (process.env.NODE_ENV === 'development' && !warnedRecordsDeprecated) {
      warnedRecordsDeprecated = true
      console.warn(
        '[Fuse] FuseIndex.records is deprecated and will be removed in v8; ' +
          'use toJSON() to serialize an index.'
      )
    }
    return this._materializeAll()
  }
  set records(records: IndexRecord[]) {
    this.setIndexRecords(records)
  }

  setSources(docs: ReadonlyArray<T> = []): void {
    this.docs = docs
  }
  // Replaces the index contents with the given records (copied into columns,
  // so later changes to `records` don't affect the index).
  setIndexRecords(records: IndexRecord[] = []): void {
    this._reset(records.length, estimateEntries(records))
    for (let i = 0, len = records.length; i < len; i += 1) {
      const record = records[i]
      if (record.v !== undefined) {
        // Hot path for string records: one entry, written directly.
        if (this._recCount === this._recDoc.length) this._growRecords()
        if (this._entCount === this._entKey.length) this._growEntries()
        const r = this._recCount
        const e = this._entCount
        this._recDoc[r] = checkPosition(record.i)
        this._recKind[r] = STRING_RECORD
        this._recStart[r] = e
        this._recLen[r] = 1
        this._entKey[e] = 0
        this._entIdx[e] = SCALAR
        this._entNormId[e] = this._normIdOf(record.n as number)
        this._entValue[e] = record.v
        this._recCount = r + 1
        this._entCount = e + 1
      } else {
        this._appendRecord(record)
      }
    }
    this._trim()
  }
  // A copy that owns its storage, for callers about to mutate an index they
  // don't own. Keys, getFn and the norm cache are shared (never mutated).
  clone(): FuseIndex<T> {
    const copy = new FuseIndex<T>({ getFn: this.getFn })
    copy.norm = this.norm
    copy.isCreated = this.isCreated
    copy.setSources(this.docs)
    copy.setKeys(this.keys)
    copy._recCount = this._recCount
    copy._recDoc = this._recDoc.slice(0, this._recCount)
    copy._recKind = this._recKind.slice(0, this._recCount)
    copy._recStart = this._recStart.slice(0, this._recCount)
    copy._recLen = this._recLen.slice(0, this._recCount)
    copy._entCount = this._entCount
    copy._entDead = this._entDead
    copy._entKey = this._entKey.slice(0, this._entCount)
    copy._entIdx = this._entIdx.slice(0, this._entCount)
    copy._entNormId = this._entNormId.slice(0, this._entCount)
    copy._normValues = this._normValues.slice()
    copy._normIds = new Map(this._normIds)
    copy._normCache = this._normCache.slice()
    copy._entValue = this._entValue.slice(0, this._entCount)
    return copy
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
    const isStringList = isString(this.docs[0])
    // String lists have one entry per record; object lists usually several.
    this._reset(len, isStringList ? len : len * 4)

    // List is Array<String>
    if (isStringList) {
      // Hot path for string lists: columns are pre-sized to one entry per
      // doc, so no growth checks are needed and everything stays local.
      const docs = this.docs as unknown as string[]
      const recDoc = this._recDoc
      const recKind = this._recKind
      const recStart = this._recStart
      const recLen = this._recLen
      const entKey = this._entKey
      const entIdx = this._entIdx
      const entNormId = this._entNormId
      const entValue = this._entValue
      let n = 0
      for (let i = 0; i < len; i++) {
        const doc = docs[i]
        if (!isDefined(doc) || isBlank(doc)) {
          continue
        }
        recDoc[n] = i
        recKind[n] = STRING_RECORD
        recStart[n] = n
        recLen[n] = 1
        entKey[n] = 0
        entIdx[n] = SCALAR
        entNormId[n] = this._normIdOf(this.norm.get(doc))
        entValue[n] = doc
        n += 1
      }
      this._recCount = n
      this._entCount = n
    } else {
      // List is Array<Object>
      for (let i = 0; i < len; i++) {
        this._addObject(this.docs[i], i)
      }
    }

    this._trim()
    this.norm.clear()
  }
  // Appends a record for `doc` at `docIndex` (the doc's position in the source
  // array). Returns the appended record (a detached copy in the record format),
  // or null when `doc` is a blank string (those are skipped at record
  // creation). Callers use the return value to gate downstream bookkeeping
  // like the inverted index, which must not be touched when no record was
  // produced.
  add(doc: T, docIndex: number): IndexRecord | null {
    if (!Number.isInteger(docIndex) || docIndex < 0) {
      throw new Error(ErrorMsg.INVALID_DOC_INDEX)
    }

    const added = isString(doc)
      ? this._addString(doc as unknown as string, docIndex)
      : (this._addObject(doc, docIndex), true)

    return added ? this._materialize(this._recCount - 1) : null
  }
  // Removes the record for the doc at the specified source-array (docs) index.
  // Blank string docs have no record; callers may pass such an index and the
  // removal is a no-op, but subsequent records still need their doc index
  // decremented to track the docs array that the caller is splicing in
  // parallel.
  removeAt(idx: number): void {
    if (!Number.isInteger(idx) || idx < 0) {
      throw new Error(ErrorMsg.INVALID_DOC_INDEX)
    }

    // Records are typically sorted by doc index, but parsed indexes may arrive
    // in arbitrary order, so search rather than assume.
    for (let r = 0; r < this._recCount; r += 1) {
      if (this._recDoc[r] === idx) {
        this._removeRecordAt(r)
        break
      }
    }

    for (let r = 0; r < this._recCount; r += 1) {
      if (this._recDoc[r] > idx) {
        this._recDoc[r] -= 1
      }
    }
  }
  // Removes records for the docs at the specified source-array indices, then
  // shifts every surviving record's doc index down by the count of removed
  // indices strictly less than it. Invalid entries (non-integer, negative) in
  // `indices` are dropped silently.
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

    // One pass: drop removed records (keeping order) and shift each
    // survivor's doc index down by the count of removed indices below it.
    const sorted = Array.from(toRemove).sort((a, b) => a - b)
    const recDoc = this._recDoc
    const recKind = this._recKind
    const recStart = this._recStart
    const recLen = this._recLen
    let w = 0
    for (let r = 0, n = this._recCount; r < n; r += 1) {
      const docIdx = recDoc[r]
      if (toRemove.has(docIdx)) {
        this._entDead += recLen[r]
        continue
      }
      let lo = 0
      let hi = sorted.length
      while (lo < hi) {
        const mid = (lo + hi) >>> 1
        if (sorted[mid] < docIdx) lo = mid + 1
        else hi = mid
      }
      recDoc[w] = docIdx - lo
      if (w !== r) {
        recKind[w] = recKind[r]
        recStart[w] = recStart[r]
        recLen[w] = recLen[r]
      }
      w += 1
    }
    this._recCount = w
    if (this._entDead > this._entCount - this._entDead) {
      this._compact()
    }
  }
  getValueForItemAtKeyId(item: any, keyId: string): any {
    return item[this._keysMap[keyId]]
  }
  size(): number {
    return this._recCount
  }
  // The entry range [start, end) of key `keyIdx` in record r (empty if the
  // key is absent).
  _keyRange(r: number, keyIdx: number): [number, number] {
    let start = this._recStart[r]
    const end = start + this._recLen[r]
    while (start < end && this._entKey[start] < keyIdx) start += 1
    let stop = start
    while (stop < end && this._entKey[stop] === keyIdx) stop += 1
    return [start, stop]
  }
  // Calls fn with each text value of record r, in entry order, skipping the
  // EMPTY_ARRAY sentinel (which carries no text).
  _forEachText(r: number, fn: (text: string) => void): void {
    const start = this._recStart[r]
    const end = start + this._recLen[r]
    for (let e = start; e < end; e += 1) {
      if (this._entIdx[e] !== EMPTY_ARRAY) fn(this._entValue[e])
    }
  }
  toJSON(): {
    keys: ReadonlyArray<Omit<KeyObject, 'getFn'>>
    records: IndexRecord[]
  } {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      keys: this.keys.map(({ getFn, ...key }) => key),
      records: this._materializeAll()
    }
  }

  // ── Record format (for toJSON, the deprecated getter, add() and sortFn) ──

  _materializeAll(): IndexRecord[] {
    const records: IndexRecord[] = new Array(this._recCount)
    for (let r = 0; r < this._recCount; r += 1) {
      records[r] = this._materialize(r)
    }
    return records
  }
  _materialize(r: number): IndexRecord {
    const start = this._recStart[r]
    if (this._recKind[r] === STRING_RECORD) {
      return {
        v: this._entValue[start],
        i: this._recDoc[r],
        n: this._normValues[this._entNormId[start]]
      }
    }
    return { i: this._recDoc[r], $: this._materializeFields(r) }
  }
  // The `$` object of an object record, in the record format.
  _materializeFields(r: number): Record<number, SubRecord | SubRecord[]> {
    const fields: Record<number, SubRecord | SubRecord[]> = {}
    const start = this._recStart[r]
    const end = start + this._recLen[r]
    for (let e = start; e < end; e += 1) {
      const key = this._entKey[e]
      const pos = this._entIdx[e]
      if (pos === SCALAR) {
        fields[key] = {
          v: this._entValue[e],
          n: this._normValues[this._entNormId[e]]
        }
      } else {
        let list = fields[key] as SubRecord[] | undefined
        if (!list) {
          list = []
          fields[key] = list
        }
        if (pos !== EMPTY_ARRAY) {
          list.push({
            v: this._entValue[e],
            i: pos,
            n: this._normValues[this._entNormId[e]]
          })
        }
      }
    }
    return fields
  }

  // ── Building ─────────────────────────────────────────────────────────────

  _addString(doc: string, docIndex: number): boolean {
    if (!isDefined(doc) || isBlank(doc)) {
      return false
    }
    this._beginRecord(docIndex, STRING_RECORD)
    this._pushEntry(0, SCALAR, this.norm.get(doc), doc)
    this._endRecord()
    return true
  }
  _addObject(doc: any, docIndex: number): void {
    this._beginRecord(docIndex, OBJECT_RECORD)

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
        const before = this._entCount

        for (let i = 0, len = value.length; i < len; i += 1) {
          const item = value[i]

          if (!isDefined(item)) {
            continue
          }

          if (isString(item)) {
            // Custom getFn returning plain string array (backward compat)
            if (!isBlank(item)) {
              this._pushEntry(keyIndex, i, this.norm.get(item), item)
            }
          } else if (isDefined(item.v)) {
            // Default get() returns {v, i} objects with original array indices
            const text = isString(item.v) ? item.v : toString(item.v)
            if (!isBlank(text)) {
              this._pushEntry(keyIndex, item.i, this.norm.get(text), text)
            }
          }
        }

        // A defined array with no recorded items is still recorded (as `[]`).
        if (this._entCount === before) {
          this._pushEntry(keyIndex, EMPTY_ARRAY, 0, '')
        }
      } else if (isString(value) && !isBlank(value)) {
        this._pushEntry(keyIndex, SCALAR, this.norm.get(value), value)
      }
    }

    this._endRecord()
  }
  // Copies one record in the record format into the columns.
  _appendRecord(record: IndexRecord): void {
    if (record.v !== undefined) {
      this._beginRecord(checkPosition(record.i), STRING_RECORD)
      this._pushEntry(0, SCALAR, record.n as number, record.v)
      this._endRecord()
      return
    }

    this._beginRecord(checkPosition(record.i), OBJECT_RECORD)
    const fields = record.$ || {}
    // for...in visits integer-like keys in ascending numeric order (per spec),
    // which is the key order entries must be stored in.
    for (const k in fields) {
      const key = checkPosition(+k)
      const value = fields[key]
      if (!isDefined(value)) continue
      if (isArray(value)) {
        if (!value.length) {
          this._pushEntry(key, EMPTY_ARRAY, 0, '')
        }
        for (const sub of value) {
          this._pushEntry(key, checkPosition(sub.i), sub.n, sub.v)
        }
      } else {
        this._pushEntry(key, SCALAR, value.n, value.v)
      }
    }
    this._endRecord()
  }

  // ── Column storage ───────────────────────────────────────────────────────

  _reset(expectedRecords: number, expectedEntries = expectedRecords * 2): void {
    const recCap = Math.max(16, expectedRecords)
    this._recCount = 0
    this._recDoc = new Int32Array(recCap)
    this._recKind = new Uint8Array(recCap)
    this._recStart = new Uint32Array(recCap)
    this._recLen = new Uint32Array(recCap)
    this._entCount = 0
    this._entDead = 0
    this._entKey = new Uint32Array(Math.max(64, expectedEntries))
    this._entIdx = new Int32Array(this._entKey.length)
    this._entNormId = new Uint32Array(this._entKey.length)
    this._normValues = []
    this._normIds = new Map()
    this._normCache.fill(-1)
    this._entValue = []
  }
  _beginRecord(docIndex: number, kind: number): void {
    if (docIndex > 0x7fffffff) {
      throw new Error(ErrorMsg.INVALID_DOC_INDEX)
    }
    if (this._recCount === this._recDoc.length) {
      this._growRecords()
    }
    const r = this._recCount
    this._recDoc[r] = docIndex
    this._recKind[r] = kind
    this._recStart[r] = this._entCount
    this._recLen[r] = 0
  }
  _growRecords(): void {
    const cap = Math.max(16, this._recDoc.length * 2)
    this._recDoc = grow(this._recDoc, new Int32Array(cap))
    this._recKind = grow(this._recKind, new Uint8Array(cap))
    this._recStart = grow(this._recStart, new Uint32Array(cap))
    this._recLen = grow(this._recLen, new Uint32Array(cap))
  }
  _growEntries(): void {
    const cap = Math.max(64, this._entKey.length * 2)
    this._entKey = grow(this._entKey, new Uint32Array(cap))
    this._entIdx = grow(this._entIdx, new Int32Array(cap))
    this._entNormId = grow(this._entNormId, new Uint32Array(cap))
  }
  _endRecord(): void {
    const r = this._recCount
    this._recLen[r] = this._entCount - this._recStart[r]
    this._recCount += 1
  }
  _pushEntry(key: number, pos: number, norm: number, value: string): void {
    if (this._entCount === this._entKey.length) {
      this._growEntries()
    }
    const e = this._entCount
    this._entKey[e] = key
    this._entIdx[e] = pos
    this._entNormId[e] = this._normIdOf(norm)
    this._entValue[e] = value
    this._entCount += 1
  }
  // The id of a norm value in _normValues, adding it if new.
  _normIdOf(norm: number): number {
    const slot = (norm * 1048576) & 1023
    let normId = this._normCache[slot]
    if (normId < 0 || !Object.is(this._normValues[normId], norm)) {
      // Map keys treat -0 as 0; keep -0 apart so values stay exact.
      const key = Object.is(norm, -0) ? NEGATIVE_ZERO_KEY : norm
      let id = this._normIds.get(key)
      if (id === undefined) {
        id = this._normValues.length
        this._normValues.push(norm)
        this._normIds.set(key, id)
      }
      normId = id
      this._normCache[slot] = normId
    }
    return normId
  }
  // Drops the record at position r, shifting later records down with native
  // memory moves, and marks its entries dead.
  _removeRecordAt(r: number): void {
    const n = this._recCount
    this._entDead += this._recLen[r]
    this._recDoc.copyWithin(r, r + 1, n)
    this._recKind.copyWithin(r, r + 1, n)
    this._recStart.copyWithin(r, r + 1, n)
    this._recLen.copyWithin(r, r + 1, n)
    this._recCount = n - 1
    if (this._entDead > this._entCount - this._entDead) {
      this._compact()
    }
  }
  // Rewrites the entry columns with live entries only, in record order.
  _compact(): void {
    const live = this._entCount - this._entDead
    const cap = Math.max(64, live)
    const key = new Uint32Array(cap)
    const idx = new Int32Array(cap)
    const normId = new Uint32Array(cap)
    const value: string[] = new Array(live)
    let p = 0
    for (let r = 0; r < this._recCount; r += 1) {
      const start = this._recStart[r]
      const len = this._recLen[r]
      key.set(this._entKey.subarray(start, start + len), p)
      idx.set(this._entIdx.subarray(start, start + len), p)
      normId.set(this._entNormId.subarray(start, start + len), p)
      for (let k = 0; k < len; k += 1) value[p + k] = this._entValue[start + k]
      this._recStart[r] = p
      p += len
    }
    this._entKey = key
    this._entIdx = idx
    this._entNormId = normId
    this._entValue = value
    this._entCount = p
    this._entDead = 0
  }
  // Shrinks the columns to fit after a bulk build when more than a quarter of
  // the capacity is unused (copying costs build time); later adds grow them
  // again.
  _trim(): void {
    const rc = Math.max(16, this._recCount)
    if (this._recDoc.length > rc * 1.25) {
      this._recDoc = this._recDoc.slice(0, rc)
      this._recKind = this._recKind.slice(0, rc)
      this._recStart = this._recStart.slice(0, rc)
      this._recLen = this._recLen.slice(0, rc)
    }
    const ec = Math.max(64, this._entCount)
    if (this._entKey.length > ec * 1.25) {
      this._entKey = this._entKey.slice(0, ec)
      this._entIdx = this._entIdx.slice(0, ec)
      this._entNormId = this._entNormId.slice(0, ec)
    }
  }
}

const NEGATIVE_ZERO_KEY = '-0'

// Validates a document index, field key or array position read from records
// (the typed columns would silently wrap anything outside 0..2^31-1).
function checkPosition(value: unknown): number {
  const n = value as number
  if ((n | 0) !== n || n < 0) {
    throw new Error(ErrorMsg.INVALID_INDEX_RECORD)
  }
  return n
}

// Entries per record, estimated from the first record, for pre-sizing.
function estimateEntries(records: IndexRecord[]): number {
  if (!records.length) return 0
  const first = records[0]
  let perRecord = 1
  if (first.v === undefined && first.$) {
    perRecord = 0
    for (const k in first.$) {
      const value = first.$[+k]
      perRecord += isArray(value) ? Math.max(1, value.length) : 1
    }
  }
  return Math.ceil(records.length * Math.max(1, perRecord) * 1.25)
}

function grow<A extends Int32Array | Uint32Array | Uint8Array>(
  from: A,
  to: A
): A {
  to.set(from as any)
  return to
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
  // Records are copied into columns, so the caller's data is never touched.
  myIndex.setIndexRecords(records)
  return myIndex
}
