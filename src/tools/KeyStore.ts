import { isString, isArray } from '../helpers/typeGuards'
import * as ErrorMsg from '../core/errorMessages'
import type { KeyObject, FuseOptionKey } from '../types'

const hasOwn = Object.prototype.hasOwnProperty

export default class KeyStore {
  _keys: KeyObject[]
  _keyMap: Record<string, KeyObject>

  constructor(keys: FuseOptionKey<any>[]) {
    this._keys = []
    this._keyMap = {}

    let totalWeight = 0

    keys.forEach((key) => {
      const obj = createKey(key)

      this._keys.push(obj)
      this._keyMap[obj.id] = obj

      totalWeight += obj.weight
    })

    // Normalize weights so that their sum is equal to 1
    this._keys.forEach((key) => {
      key.weight /= totalWeight
    })
  }
  get(keyId: string): KeyObject {
    return this._keyMap[keyId]
  }
  keys(): KeyObject[] {
    return this._keys
  }
  toJSON(): string {
    return JSON.stringify(this._keys)
  }
}

export function createKey(key: FuseOptionKey<any>): KeyObject {
  let path: string[] | null = null
  let id: string | null = null
  let src: string | string[] | null = null
  let weight: number = 1
  let getFn: ((obj: any) => string | string[]) | null = null

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

  return { path: path!, id: id!, weight, src: src!, getFn }
}

export function createKeyPath(key: string | string[]): string[] {
  return isArray(key) ? key : key.split('.')
}

export function createKeyId(key: string | string[]): string {
  return isArray(key) ? key.join('.') : key
}
