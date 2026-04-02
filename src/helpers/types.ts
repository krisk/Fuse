export function isArray(value: unknown): value is any[] {
  return !Array.isArray
    ? getTag(value) === '[object Array]'
    : Array.isArray(value)
}

// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0
export function baseToString(value: unknown): string {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  let result = value + ''
  return result == '0' && 1 / (value as number) == -INFINITY ? '-0' : result
}

export function toString(value: unknown): string {
  return value == null ? '' : baseToString(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
export function isBoolean(value: unknown): value is boolean {
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && getTag(value) == '[object Boolean]')
  )
}

export function isObject(value: unknown): boolean {
  return typeof value === 'object'
}

// Checks if `value` is object-like.
export function isObjectLike(value: unknown): boolean {
  return isObject(value) && value !== null
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isBlank(value: string): boolean {
  return !value.trim().length
}

// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value: unknown): string {
  return value == null
    ? value === undefined
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(value)
}
