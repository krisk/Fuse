import { isString } from '../helpers/types'
import * as ErrorMsg from '../core/errorMessages'

const hasOwn = Object.prototype.hasOwnProperty

export default class KeyStore {
  constructor(keys) {
    this._keys = {}
    this._keyNames = []

    let totalWeight = 0

    keys.forEach((key) => {
      let keyName
      let weight = 1

      if (isString(key)) {
        keyName = key
      } else {
        if (!hasOwn.call(key, 'name')) {
          throw new Error(ErrorMsg.MISSING_KEY_PROPERTY('name'))
        }
        keyName = key.name

        if (hasOwn.call(key, 'weight')) {
          weight = key.weight

          if (weight <= 0) {
            throw new Error(ErrorMsg.INVALID_KEY_WEIGHT_VALUE(keyName))
          }
        }
      }

      this._keyNames.push(keyName)

      this._keys[keyName] = { weight }

      totalWeight += weight
    })

    // Normalize weights so that their sum is equal to 1
    this._keyNames.forEach((key) => {
      this._keys[key].weight /= totalWeight
    })
  }
  get(key, name) {
    return this._keys[key] && this._keys[key][name]
  }
  keys() {
    return this._keyNames
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}
