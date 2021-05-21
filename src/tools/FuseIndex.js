import { isArray } from "../helpers/types.js";
import { isBlank } from "../helpers/types.js";
import { isString } from "../helpers/types.js";
import { isDefined } from "../helpers/types.js";

import Config from "../core/config.js";
import normGenerator from "./norm.js";
import { createKey } from "./KeyStore.js";

class FuseIndex {
  constructor({ _get = Config._get } = {}) {
    this.norm = normGenerator(3);
    this._get = _get;
    this.isCreated = false;

    this.setIndexRecords();
  }

  setSources(docs = []) {
    this.docs = docs;
  }

  setIndexRecords(records = []) {
    this.records = records;
  }

  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};

    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }

  create() {
    if (this.isCreated || !this.docs.length) return;

    this.isCreated = true;

    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }

    this.norm.clear();
  }

  add(doc) {
    const idx = this.size();

    if (isString(doc)) {
      this._addString(doc, idx);
      return;
    }

    this._addObject(doc, idx);
  }

  removeAt(idx) {
    this.records.splice(idx, 1);

    for (let i = idx, size = this.size(); i < size; i++) this.records[i].i--;
  }

  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]];
  }

  size() {
    return this.records.length;
  }

  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) return;

    let record = { v: doc, i: docIndex, n: this.norm.get(doc) };

    this.records.push(record);
  }

  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} };

    this.keys.forEach((key, keyIndex) => {
      let value = this._get(doc, key.path);

      if (!isDefined(value) || (!isArray(value) && isBlank(value))) return;

      if (!isArray(value) && !isBlank(value)) {
        /** This is the sub record that we add at the `keyIndex` if the above expression evaluates to true. */
        record.$[keyIndex] = { v: value, n: this.norm.get(value) };
        return;
      }

      const stack = [{ nestedArrIndex: -1, value }];
      let subRecords = [];

      while (stack.length) {
        const { nestedArrIndex, value } = stack.pop();

        if (!isDefined(value)) {
          continue;
        }

        if (isString(value) && !isBlank(value)) {
          subRecords.push({
            v: value,
            i: nestedArrIndex,
            n: this.norm.get(value),
          });
          continue;
        }

        if (isArray(value)) {
          value.forEach((item, k) => {
            stack.push({
              value: item,
              nestedArrIndex: k,
            });
          });
          continue;
        }

        console.error(
          new Error(
            `Path "${key}" points to a non-string value. Received: ${value}`
          )
        );
      }

      record.$[keyIndex] = subRecords;
    });

    this.records.push(record);
  }

  toJSON() {
    return { keys: this.keys, records: this.records };
  }
}

export function createIndex(keys, docs, { _get = Config._get } = {}) {
  const myIndex = new FuseIndex({ _get });

  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();

  return myIndex;
}

export function parseIndex(data, { _get = Config._get } = {}) {
  const { keys, records } = data;
  const myIndex = new FuseIndex({ _get });

  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);

  return myIndex;
}

export default FuseIndex;
