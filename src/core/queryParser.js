import { isArray } from '../helpers/types.js'
import { isString } from '../helpers/types.js'
import { isObject } from '../helpers/types.js'
import { createKeyId } from '../tools/KeyStore.js'

import { createSearcher } from './register.js'
import { LogicalSearchInvalidQueryForKeyException } from './error.js'

export const LogicalOperator = {
  AND: '$and',
  OR: '$or'
}

const KeyType = {
  PATH: '$path',
  PATTERN: '$val'
}

const isPath = (query) => !!query[KeyType.PATH]

const isLeaf = (query) =>
  !isArray(query) && isObject(query) && !isExpression(query)

const isExpression = (query) =>
  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR])

const convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
})

export function parse(query, options, { auto = true } = {}) {
  const next = (query) => {
    let keys = Object.keys(query)
    const isQueryPath = isPath(query)

    if (!isQueryPath && keys.length > 1 && !isExpression(query))
      return next(convertToExplicit(query))

    if (isLeaf(query)) {
      const key = isQueryPath ? query[KeyType.PATH] : keys[0]
      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key]

      if (!isString(pattern))
        throw new LogicalSearchInvalidQueryForKeyException(key)

      const obj = {
        keyId: createKeyId(key),
        pattern
      }

      if (auto) obj.searcher = createSearcher(pattern, options)

      return obj
    }

    let node = {
      children: [],
      operator: keys[0]
    }

    keys.forEach((key) => {
      const value = query[key]

      if (isArray(value))
        value.forEach((item) => {
          node.children.push(next(item))
        })
    })

    return node
  }

  if (!isExpression(query)) query = convertToExplicit(query)

  return next(query)
}
