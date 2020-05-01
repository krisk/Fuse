import { isArray, isObject } from '../helpers/type-checkers'
import { BitapSearch } from '../search'

const LogicalOperator = {
  AND: '$and',
  OR: '$or'
}

const OperatorSet = new Set(Object.values(LogicalOperator))

export function register(...args) {
  registeredSearchers.push(...args)
}

const registeredSearchers = []

export function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i]
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}

export function parseQuery(query, options) {
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

export function walkTree(root, indexItem, searchFn) {
  let { $: item, i: idx } = indexItem

  if (!isDefined(item)) {
    return []
  }

  const results = []

  const walk = (node) => {
    if (node.children) {
      const operator = node.operator
      let res = []

      for (let k = 0; k < node.children.length; k += 1) {
        let child = node.children[k]
        let matches = walk(child)

        if (matches && matches.length) {
          res.push({
            idx,
            item,
            matches
          })
        } else if (operator === LogicalOperator.AND) {
          res.length = 0
          break
        }
      }
      if (res.length) {
        results.push(...res)
      }
    } else {
      const { key, searcher } = node
      const keyIndex = keys.indexOf(key)
      const value = item[keyIndex]

      let matches = searchFn({
        key,
        value,
        searcher
      })

      return matches
    }
  }

  walk(root)

  return results
}

export function dedupe(items) {
  const results = []
  let map = {}
  for (let i = 0, len = items.length; i < len; i += 1) {
    let item = items[i]
    if (map[item.idx]) {
      map[item.idx].matches.push(...item.matches)
    } else {
      map[item.idx] = item
      results.push(item)
    }
  }
  return results
}
