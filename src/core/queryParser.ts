import { isArray, isObject, isString } from '../helpers/types'
import { createSearcher } from './register'
import * as ErrorMsg from './errorMessages'
import { createKeyId } from '../tools/KeyStore'
import type { Searcher, Expression } from '../types'

export const LogicalOperator = {
  AND: '$and',
  OR: '$or'
} as const

const KeyType = {
  PATH: '$path',
  PATTERN: '$val'
} as const

export interface ParsedLeaf {
  keyId: string | null
  pattern: string
  searcher?: Searcher
}

export interface ParsedOperator {
  children: ParsedNode[]
  operator: string
}

export type ParsedNode = ParsedLeaf | ParsedOperator

const isExpression = (query: any): boolean =>
  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR])

const isPath = (query: any): boolean => !!query[KeyType.PATH]

const isLeaf = (query: any): boolean =>
  !isArray(query) && isObject(query) && !isExpression(query)

const convertToExplicit = (query: any): any => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
})

// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
export function parse(query: Expression, options: any, { auto = true } = {}): ParsedNode {
  const next = (query: any): ParsedNode => {
    // Keyless string entry: search across all keys
    if (isString(query)) {
      const obj: ParsedLeaf = {
        keyId: null,
        pattern: query
      }

      if (auto) {
        obj.searcher = createSearcher(query, options)
      }

      return obj
    }

    const keys = Object.keys(query)

    const isQueryPath = isPath(query)

    if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
      return next(convertToExplicit(query))
    }

    if (isLeaf(query)) {
      const key = isQueryPath ? query[KeyType.PATH] : keys[0]

      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key]

      if (!isString(pattern)) {
        throw new Error(ErrorMsg.LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))
      }

      const obj: ParsedLeaf = {
        keyId: createKeyId(key),
        pattern
      }

      if (auto) {
        obj.searcher = createSearcher(pattern, options)
      }

      return obj
    }

    const node: ParsedOperator = {
      children: [],
      operator: keys[0]
    }

    keys.forEach((key) => {
      const value = query[key]

      if (isArray(value)) {
        value.forEach((item: any) => {
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
