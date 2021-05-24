export function isArray(value) {
  return !Array.isArray
    ? getTag(value) === '[object Array]'
    : Array.isArray(value)
}

export function baseToString(value) {
  const INFINITY = 1 / 0

  /** Exit early for strings to avoid a performance hit in some environments. */
  if (typeof value == 'string') return value

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

export function isBoolean(value) {
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && getTag(value) == '[object Boolean]')
  )
}

export function isObject(value) {
  return typeof value === 'object'
}

export function isObjectLike(value) {
  return isObject(value) && value !== null
}

export function isDefined(value) {
  return value !== undefined && value !== null
}

export function isBlank(value) {
  return !value.trim().length
}

function getTag(value) {
  return value == null
    ? value === undefined
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(value)
}
