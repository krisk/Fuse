import { isArray, isObject } from '../helpers/type-checkers'
import { createSearcher } from './register'

export const LogicalOperator = {
  AND: '$and',
  OR: '$or'
}

const OperatorSet = new Set(Object.values(LogicalOperator))

export function parse(query, options) {
  const next = (query) => {
    const keys = Object.keys(query)
    const key = keys[0]

    if (!isArray(query) && isObject(query) && !OperatorSet.has(key)) {
      const pattern = query[key]

      return {
        key,
        pattern,
        searcher: createSearcher(pattern, options)
      }
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

  if (!query[LogicalOperator.AND] || !query[LogicalOperator.OR]) {
    query = {
      [LogicalOperator.AND]: Object.keys(query).map((key) => ({
        [key]: query[key]
      }))
    }
  }

  return next(query)
}
