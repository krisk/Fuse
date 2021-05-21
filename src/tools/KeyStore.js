import { isArray } from "../helpers/types.js";
import { isString } from "../helpers/types.js";
import { MissingKeyPropertyException } from "../core/error.js";
import { InvalidKeyWeightValueException } from "../core/error.js";

const hasOwn = Object.prototype.hasOwnProperty;

class KeyStore {
  constructor(keys) {
    let totalWeight = 0;

    this._keys = [];
    this._keyMap = {};

    keys.forEach((key) => {
      let obj = createKey(key);

      totalWeight += obj.weight;

      this._keys.push(obj);
      this._keyMap[obj.id] = obj;

      totalWeight += obj.weight;
    });

    /** Normalize weights so that their sum is equal to 1. */
    this._keys.forEach((key) => {
      key.weight /= totalWeight;
    });
  }

  get(keyId) {
    return this._keyMap[keyId];
  }

  keys() {
    return this._keys;
  }

  toJSON() {
    return JSON.stringify(this._keys);
  }
}

export function createKey(key) {
  let src = null;
  let weight = 1;

  if (isString(key) || isArray(key))
    return { path: createKeyPath(key), id: createKey(key), weight, src: key };

  if (!hasOwn.call(key, "name")) throw new MissingKeyPropertyException("name");

  const name = key.name;

  src = name;

  if (hasOwn.call(key, "weight")) {
    weight = key.weight;

    if (weight <= 0) throw new InvalidKeyWeightValueException(name);
  }

  return { path: createKeyPath(name), id: createKeyId(name), weight, src };
}

export function createKeyPath(key) {
  return isArray(key) ? key : key.split(".");
}

export function createKeyId(key) {
  return isArray(key) ? key.join(".") : key;
}

export default KeyStore;
