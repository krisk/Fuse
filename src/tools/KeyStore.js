import { isString, isArray } from '../helpers/type-checkers'

const hasOwn = Object.prototype.hasOwnProperty

export default class KeyStore {
  constructor(keys) {
    this._keys = {}
    this._keyNames = []

    const len = keys.length

    let totalWeight = 0

    for (let i = 0; i < len; i += 1) {
      const key = keys[i]

      let keyName
      let weight = 1

      if (isString(key)) {
        keyName = key
      } else {
        if (hasOwn.call(key, 'name')) {
          keyName = key.name
        }
        if (hasOwn.call(key, 'weight')) {
          weight = key.weight

          if (weight <= 0) {
            throw new Error(
              '"weight" property in key must be a positive integer'
            )
          }
        }
      }

      this._keyNames.push(keyName)

      this._keys[keyName] = { weight }

      totalWeight += weight
    }

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
