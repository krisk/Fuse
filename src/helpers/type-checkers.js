const INFINITY = 1 / 0

const isArray = value => !Array.isArray
  ? Object.prototype.toString.call(value) === '[object Array]'
  : Array.isArray(value)

// Adapted from:
// https://github.com/lodash/lodash/blob/f4ca396a796435422bd4fd41fadbd225edddf175/.internal/baseToString.js
const baseToString = value => {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  let result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

const toString = value => value == null ? '' : baseToString(value);

const isString = value => typeof value === 'string'

const isNumber = value => typeof value === 'number'

const isObject = value => typeof value === 'object'

const isDefined = value => value !== undefined && value !== null

module.exports = {
  isDefined,
  isArray,
  isString,
  isNumber,
  isObject,
  toString
}
