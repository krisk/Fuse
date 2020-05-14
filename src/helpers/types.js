export function isArray(value) {
  return !Array.isArray
    ? Object.prototype.toString.call(value) === '[object Array]'
    : Array.isArray(value)
}

// Adapted from:
// https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js
const INFINITY = 1 / 0
export function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  let result = value + ''
  return result == '0' && 1 / value == -INFINITY ? '-0' : result
}

export function toString(value) {
  return value == null ? '' : baseToString(value)
}

export function isString(value) {
  return typeof value === 'string'
}

export function isNumber(value) {
  return typeof value === 'number'
}

export function isObject(value) {
  return typeof value === 'object'
}

export function isDefined(value) {
  return value !== undefined && value !== null
}

export function isBlank(value) {
  return !value.trim().length
}
