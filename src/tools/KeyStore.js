import { isString } from '../helpers/type-checkers'

const hasOwn = Object.prototype.hasOwnProperty

export default class KeyStore {
  constructor(keys) {
    this._keys = {}
    this._keyNames = []
    const len = keys.length

    // Iterate over every key
    if (keys.length && isString(keys[0])) {
      for (let i = 0; i < len; i += 1) {
        const key = keys[i]
        this._keys[key] = {
          weight: 1
        }
        this._keyNames.push(key)
      }
    } else {
      let totalWeight = 0

      for (let i = 0; i < len; i += 1) {
        const key = keys[i]

        let obj = {}

        if (!hasOwn.call(key, 'name')) {
          throw new Error('Missing "name" property in key object')
        }

        const keyName = key.name
        this._keyNames.push(keyName)

        if (!hasOwn.call(key, 'weight')) {
          throw new Error('Missing "weight" property in key object')
        }

        const weight = key.weight

        if (weight <= 0 || weight >= 1) {
          throw new Error(
            '"weight" property in key must be in the range of (0, 1)'
          )
        }

        obj.weight = weight

        if (hasOwn.call(key, 'threshold')) {
          obj.threshold = key.threshold
        }

        this._keys[keyName] = obj

        totalWeight += weight
      }

      // Normalize weights so that their sum is equal to 1
      for (let i = 0; i < len; i += 1) {
        this._keys[this._keyNames[i]].weight /= totalWeight
      }
    }
  }
  get(key, name) {
    return this._keys[key] ? this._keys[key][name] : -1
  }
  keys() {
    return this._keyNames
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}
