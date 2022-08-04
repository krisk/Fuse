import { isString, isArray } from '../helpers/types'
import * as ErrorMsg from '../core/errorMessages'

const hasOwn = Object.prototype.hasOwnProperty

export default class KeyStore {
  constructor(keys) {
    this._keys = []
    this._keyMap = {}

    let totalWeight = 0

    keys.forEach((key) => {
      let obj = createKey(key)

      this._keys.push(obj)
      this._keyMap[obj.id] = obj

      totalWeight += obj.weight
    })

    // Normalize weights so that their sum is equal to 1
    this._keys.forEach((key) => {
      key.weight /= totalWeight
    })
  }
  get(keyId) {
    return this._keyMap[keyId]
  }
  keys() {
    return this._keys
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}

export function createKey(key) {
  let path = null
  let id = null
  let src = null
  let weight = 1
  let getFn = null

  if (isString(key) || isArray(key)) {
    src = key
    path = createKeyPath(key)
    id = createKeyId(key)
  } else {
    if (!hasOwn.call(key, 'name')) {
      throw new Error(ErrorMsg.MISSING_KEY_PROPERTY('name'))
    }

    const name = key.name
    src = name

    if (hasOwn.call(key, 'weight')) {
      weight = key.weight

      if (weight <= 0) {
        throw new Error(ErrorMsg.INVALID_KEY_WEIGHT_VALUE(name))
      }
    }

    path = createKeyPath(name)
    id = createKeyId(name)
    getFn = key.getFn
  }

  return { path, id, weight, src, getFn }
}

export function createKeyPath(key) {
  return isArray(key) ? key : key.split('.')
}

export function createKeyId(key) {
  return isArray(key) ? key.join('.') : key
}
