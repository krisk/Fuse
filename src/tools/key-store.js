const { isString } = require('../helpers/type-checkers')

class KeyStore {
  constructor(keys) {
    this._keys = {}
    this._keyNames = []
    this._length = keys.length
    this._hasWeights = false

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
      let keyWeightsTotal = 0

      for (let i = 0; i < this._length; i += 1) {
        const key = keys[i]

        if (!key.hasOwnProperty('name')) {
          throw new Error('Missing "name" property in key object')
        }

        const keyName = key.name
        this._keyNames.push(keyName)

        if (!key.hasOwnProperty('weight')) {
          throw new Error('Missing "weight" property in key object')
        }

        const keyWeight = key.weight

        if (keyWeight <= 0 || keyWeight >= 1) {
          throw new Error('"weight" property in key must bein the range of (0, 1)')
        }

        this._keys[keyName] = {
          weight: keyWeight
        }

        keyWeightsTotal += keyWeight

        this._hasWeights = true
      }

      if (keyWeightsTotal > 1) {
        throw new Error('Total of keyWeights cannot exceed 1')
      }
    }
  }
  get(key, name) {
    return this._keys[key] ? this._keys[key][name] : null
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

module.exports = KeyStore