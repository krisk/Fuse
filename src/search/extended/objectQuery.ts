import ExtendedSearch, { normalizeValue } from './index'
import {
  isKnownOperator,
  matcherDefForOperator,
  negatedMatcherDefForOperator
} from './matchers'
import * as ErrorMsg from '../../core/errorMessages'
import { isArray, isObjectLike, isString } from '../../helpers/typeGuards'
import type { Matcher } from './matchers'
import type { Searcher } from '../../types'

// ── Object ("MongoDB-style") query compiler ───────────────────────
//
// Compiles one field's operator object into a `Matcher[][]` (OR-of-ANDs) — the
// exact shape `parseQuery` produces for string syntax — then hands it to
// `ExtendedSearch.fromMatchers` so scoring, index merging, and `hasInverse`
// come from the same evaluation path (parity guarantee).
//
// The settled grammar (a field value is exactly one of):
//   • an operator-only object            → one AND group
//   • { $and: [operator-only, …] }        → one AND group (flattened)
//   • { $or:  [operator-only | {$and}, …] } → OR of AND groups (2-level max)
// Anything deeper, structural siblings, empty objects/arrays, unknown operators,
// non-string or empty (post-normalization) values throw.
//
// Negation is `$not` wrapping exactly one operator, e.g. { $not: { $contains } }.
// It sits alongside other operators in a clause (they AND together) and resolves
// to the corresponding inverse matcher.

const AND = '$and'
const OR = '$or'
const NOT = '$not'

function isPlainObject(value: unknown): boolean {
  return isObjectLike(value) && !isArray(value)
}

// Compile an operator-only object (no `$and`/`$or`) into one AND group.
function compileClause(clause: any, keyPath: string, options: any): Matcher[] {
  if (!isPlainObject(clause)) {
    throw new Error(
      ErrorMsg.INVALID_FIELD_QUERY(
        keyPath,
        'each clause must be an operator object'
      )
    )
  }

  const ops = Object.keys(clause)
  if (!ops.length) {
    throw new Error(ErrorMsg.INVALID_FIELD_QUERY(keyPath, 'empty query'))
  }

  const group: Matcher[] = []
  for (let i = 0; i < ops.length; i += 1) {
    const op = ops[i]

    if (op === AND || op === OR) {
      throw new Error(
        ErrorMsg.INVALID_FIELD_QUERY(keyPath, `${op} cannot be nested`)
      )
    }

    let def: ReturnType<typeof matcherDefForOperator>
    let raw: any
    // The operator named in value errors: for `$not` that is the wrapped
    // operator, since that is where the offending value lives.
    let valueOp = op

    if (op === NOT) {
      // `$not` wraps exactly ONE operator. Multiple would be ambiguous: Mongo
      // reads the inner object as a conjunction, so NOT(A AND B) is NOT A OR
      // NOT B — an OR inside an AND group, which this grammar cannot express
      // without the combinatorial distribution it deliberately excludes.
      const inner = clause[op]
      if (!isPlainObject(inner)) {
        throw new Error(
          ErrorMsg.INVALID_FIELD_QUERY(
            keyPath,
            '$not must wrap an operator object'
          )
        )
      }

      const innerOps = Object.keys(inner)
      if (innerOps.length !== 1) {
        throw new Error(
          ErrorMsg.INVALID_FIELD_QUERY(
            keyPath,
            '$not must wrap exactly one operator'
          )
        )
      }

      const innerOp = innerOps[0]
      if (innerOp === NOT) {
        throw new Error(
          ErrorMsg.INVALID_FIELD_QUERY(keyPath, '$not cannot be nested')
        )
      }
      if (innerOp === AND || innerOp === OR) {
        throw new Error(
          ErrorMsg.INVALID_FIELD_QUERY(
            keyPath,
            `${innerOp} cannot be used inside $not`
          )
        )
      }
      if (!isKnownOperator(innerOp)) {
        throw new Error(ErrorMsg.UNKNOWN_QUERY_OPERATOR(innerOp))
      }

      // `$fuzzy` and `$eq` have no inverse matcher (fuzzy is graded rather than
      // boolean; whole-string inequality is unimplemented, which is why `$ne`
      // stays reserved). Report that distinctly from "unknown operator".
      def = negatedMatcherDefForOperator(innerOp)
      if (!def) {
        throw new Error(
          ErrorMsg.INVALID_FIELD_QUERY(
            keyPath,
            `'${innerOp}' cannot be negated`
          )
        )
      }

      raw = inner[innerOp]
      valueOp = innerOp
    } else {
      def = matcherDefForOperator(op)
      if (!def) {
        throw new Error(ErrorMsg.UNKNOWN_QUERY_OPERATOR(op))
      }
      raw = clause[op]
    }

    if (!isString(raw)) {
      throw new Error(
        ErrorMsg.INVALID_FIELD_QUERY(
          keyPath,
          `value for '${valueOp}' must be a string`
        )
      )
    }

    // Normalize the value exactly as string syntax normalizes a pattern, THEN
    // reject empty — `stripDiacritics` can empty a non-empty value (a lone
    // combining mark), and an empty value would otherwise reach the matchers.
    const value = normalizeValue(raw, options)
    if (!value.length) {
      throw new Error(ErrorMsg.EMPTY_QUERY_VALUE(valueOp, keyPath))
    }

    group.push(def.create(value, options))
  }

  return group
}

// Compile a `{ $and: [...] }` group into a single flattened AND group.
function compileAndGroup(arr: any, keyPath: string, options: any): Matcher[] {
  if (!isArray(arr) || !arr.length) {
    throw new Error(
      ErrorMsg.INVALID_FIELD_QUERY(keyPath, '$and must be a non-empty array')
    )
  }
  const group: Matcher[] = []
  for (let i = 0; i < arr.length; i += 1) {
    // Each `$and` member is an operator-only clause; compileClause throws on any
    // nested `$and`/`$or`, which enforces the 2-level cap.
    const matchers = compileClause(arr[i], keyPath, options)
    for (let j = 0; j < matchers.length; j += 1) {
      group.push(matchers[j])
    }
  }
  return group
}

export function compileFieldQuery(
  fieldValue: any,
  keyPath: string,
  options: any
): Matcher[][] {
  if (!isPlainObject(fieldValue)) {
    throw new Error(
      ErrorMsg.INVALID_FIELD_QUERY(keyPath, 'field query must be an object')
    )
  }

  const keys = Object.keys(fieldValue)
  if (!keys.length) {
    throw new Error(ErrorMsg.INVALID_FIELD_QUERY(keyPath, 'empty query'))
  }

  const hasAnd = keys.indexOf(AND) !== -1
  const hasOr = keys.indexOf(OR) !== -1

  if (hasAnd || hasOr) {
    // `$and`/`$or` must stand alone — no operator siblings, no both.
    if (keys.length > 1) {
      throw new Error(
        ErrorMsg.INVALID_FIELD_QUERY(
          keyPath,
          'operators cannot be mixed with $and/$or'
        )
      )
    }

    if (hasAnd) {
      // { $and: [...] } → a single AND group.
      return [compileAndGroup(fieldValue[AND], keyPath, options)]
    }

    // { $or: [...] } → each member is its own OR group. A member may itself be
    // an { $and: [...] } group (the 2-level OR-of-ANDs); anything else is an
    // operator-only clause. A nested `$or` member is rejected by compileClause.
    const arr = fieldValue[OR]
    if (!isArray(arr) || !arr.length) {
      throw new Error(
        ErrorMsg.INVALID_FIELD_QUERY(keyPath, '$or must be a non-empty array')
      )
    }
    const groups: Matcher[][] = []
    for (let i = 0; i < arr.length; i += 1) {
      const member = arr[i]
      if (isPlainObject(member) && Object.keys(member).indexOf(AND) !== -1) {
        if (Object.keys(member).length > 1) {
          throw new Error(
            ErrorMsg.INVALID_FIELD_QUERY(keyPath, '$and cannot have siblings')
          )
        }
        groups.push(compileAndGroup(member[AND], keyPath, options))
      } else {
        groups.push(compileClause(member, keyPath, options))
      }
    }
    return groups
  }

  // Operator-only object → a single AND group.
  return [compileClause(fieldValue, keyPath, options)]
}

// The registered object-leaf compiler: build the matcher grid, wrap it in an
// ExtendedSearch that evaluates it. Registered under EXTENDED_SEARCH_ENABLED
// (entry.ts / worker.ts) so core code never imports the matcher layer.
export function compileObjectLeaf(
  fieldValue: any,
  keyPath: string,
  options: any
): Searcher {
  return ExtendedSearch.fromMatchers(
    compileFieldQuery(fieldValue, keyPath, options),
    options
  )
}
