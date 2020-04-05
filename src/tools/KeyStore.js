import { isString } from '../helpers/type-checkers'

export default class KeyStore {
  constructor(keys) {
    this._keys = {}
    this._keyNames = []
    this._length = keys.length

    // Iterate over every key
    if (keys.length && isString(keys[0])) {
      for (let i = 0; i < this._length; i += 1) {
        const key = keys[i]
        this._keys[key] = {
          weight: 1
        }
        this._keyNames.push(key)
      }
    } else {
      let totalWeight = 0

      for (let i = 0; i < this._length; i += 1) {
        const key = keys[i]

        if (!Object.prototype.hasOwnProperty.call(key, 'name')) {
          throw new Error('Missing "name" property in key object')
        }

        const keyName = key.name
        this._keyNames.push(keyName)

        if (!Object.prototype.hasOwnProperty.call(key, 'weight')) {
          throw new Error('Missing "weight" property in key object')
        }

        const weight = key.weight

        if (weight <= 0 || weight >= 1) {
          throw new Error(
            '"weight" property in key must be in the range of (0, 1)'
          )
        }

        this._keys[keyName] = {
          weight
        }

        totalWeight += weight
      }

      // Normalize weights so that their sum is equal to 1
      for (let i = 0; i < this._length; i += 1) {
        const keyName = this._keyNames[i]
        const keyWeight = this._keys[keyName].weight
        this._keys[keyName].weight = keyWeight / totalWeight
      }
    }
  }
  get(key, name) {
    return this._keys[key] ? this._keys[key][name] : -1
  }
  keys() {
    return this._keyNames
  }
  count() {
    return this._length
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}
