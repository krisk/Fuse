import { isArray, isObject, isString } from '../helpers/type-checkers'
import { createSearcher } from './register'

export const LogicalOperator = {
  AND: '$and',
  OR: '$or'
}

const isExpression = (query) =>
  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR])

const isLeaf = (query) =>
  !isArray(query) && isObject(query) && !isExpression(query)

const convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
})

// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
export function parse(query, options, { auto = true } = {}) {
  const next = (query) => {
    let keys = Object.keys(query)

    if (keys.length > 1 && !isExpression(query)) {
      return next(convertToExplicit(query))
    }

    let key = keys[0]

    if (isLeaf(query)) {
      const pattern = query[key]

      if (!isString(pattern)) {
        throw new Error(`Invalid value for key "${key}"`)
      }

      const obj = {
        key,
        pattern
      }

      if (auto) {
        obj.searcher = createSearcher(pattern, options)
      }

      return obj
    }

    let node = {
      children: [],
      operator: key
    }

    keys.forEach((key) => {
      const value = query[key]

      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item))
        })
      }
    })

    return node
  }

  if (!isExpression(query)) {
    query = convertToExplicit(query)
  }

  return next(query)
}
