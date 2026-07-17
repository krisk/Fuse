import BitapSearch from '../bitap'
import Config from '../../core/config'
import type { SearchResult, RangeTuple } from '../../types'

// ── Matcher interface ─────────────────────────────────────────────
//
// Each matcher is a lightweight object with a type tag and a search
// function. No class hierarchy needed — the search logic for most
// matchers is a one-liner.

export interface Matcher {
  type: string
  search(text: string): SearchResult
}

// ── Matcher definition ────────────────────────────────────────────
//
// A definition pairs the detection regexes (used by parseQuery to
// recognize string-syntax operators like ^, =, !) with a factory
// that creates a Matcher instance.

export interface MatcherDef {
  type: string
  multiRegex: RegExp
  singleRegex: RegExp
  create(pattern: string, options?: any): Matcher
}

// Whether a matcher type can return multiple index ranges
export const MULTI_MATCH_TYPES = new Set(['fuzzy', 'include'])

// Whether a matcher type is an inverse match
export function isInverse(type: string): boolean {
  return type.startsWith('inverse')
}

// ── Matcher definitions ───────────────────────────────────────────
//
// Order matters — parseQuery tries each in sequence and uses the
// first match. FuzzyMatch (catch-all) must be last.

// prettier-ignore
const matchers: MatcherDef[] = [
  // =term — exact match
  {
    type: 'exact',
    multiRegex: /^="(.*)"$/,
    singleRegex: /^=(.*)$/,
    create: (pattern) => ({
      type: 'exact',
      search(text) {
        const isMatch = text === pattern
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, pattern.length - 1] as unknown as RangeTuple[]
        }
      }
    })
  },

  // 'term — include (substring) match
  {
    type: 'include',
    multiRegex: /^'"(.*)"$/,
    singleRegex: /^'(.*)$/,
    create: (pattern) => ({
      type: 'include',
      search(text) {
        let location = 0
        let index: number
        const indices: RangeTuple[] = []
        const patternLen = pattern.length

        // Defense in depth: an empty pattern makes indexOf return `location`
        // forever (patternLen is 0, so `location` never advances) — an infinite
        // loop. Callers filter empty patterns (parseQuery's truthiness check,
        // the object compiler's post-normalization guard), but the matcher is a
        // shared primitive plugin authors can construct directly, so guard here.
        if (!patternLen) {
          return { isMatch: false, score: 1, indices }
        }

        while ((index = text.indexOf(pattern, location)) > -1) {
          location = index + patternLen
          indices.push([index, location - 1])
        }

        const isMatch = !!indices.length
        return { isMatch, score: isMatch ? 0 : 1, indices }
      }
    })
  },

  // ^term — prefix match
  {
    type: 'prefix-exact',
    multiRegex: /^\^"(.*)"$/,
    singleRegex: /^\^(.*)$/,
    create: (pattern) => ({
      type: 'prefix-exact',
      search(text) {
        const isMatch = text.startsWith(pattern)
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, pattern.length - 1] as unknown as RangeTuple[]
        }
      }
    })
  },

  // !^term — inverse prefix match
  {
    type: 'inverse-prefix-exact',
    multiRegex: /^!\^"(.*)"$/,
    singleRegex: /^!\^(.*)$/,
    create: (pattern) => ({
      type: 'inverse-prefix-exact',
      search(text) {
        const isMatch = !text.startsWith(pattern)
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1] as unknown as RangeTuple[]
        }
      }
    })
  },

  // !term$ — inverse suffix match
  {
    type: 'inverse-suffix-exact',
    multiRegex: /^!"(.*)"\$$/,
    singleRegex: /^!(.*)\$$/,
    create: (pattern) => ({
      type: 'inverse-suffix-exact',
      search(text) {
        const isMatch = !text.endsWith(pattern)
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1] as unknown as RangeTuple[]
        }
      }
    })
  },

  // term$ — suffix match
  {
    type: 'suffix-exact',
    multiRegex: /^"(.*)"\$$/,
    singleRegex: /^(.*)\$$/,
    create: (pattern) => ({
      type: 'suffix-exact',
      search(text) {
        const isMatch = text.endsWith(pattern)
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [text.length - pattern.length, text.length - 1] as unknown as RangeTuple[]
        }
      }
    })
  },

  // !term — inverse exact (does not contain)
  {
    type: 'inverse-exact',
    multiRegex: /^!"(.*)"$/,
    singleRegex: /^!(.*)$/,
    create: (pattern) => ({
      type: 'inverse-exact',
      search(text) {
        const isMatch = text.indexOf(pattern) === -1
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1] as unknown as RangeTuple[]
        }
      }
    })
  },

  // term — fuzzy match (catch-all, must be last)
  {
    type: 'fuzzy',
    multiRegex: /^"(.*)"$/,
    singleRegex: /^(.*)$/,
    create: (pattern, options = {}) => {
      const bitap = new BitapSearch(pattern, {
        location: options.location ?? Config.location,
        threshold: options.threshold ?? Config.threshold,
        distance: options.distance ?? Config.distance,
        includeMatches: options.includeMatches ?? Config.includeMatches,
        findAllMatches: options.findAllMatches ?? Config.findAllMatches,
        minMatchCharLength: options.minMatchCharLength ?? Config.minMatchCharLength,
        isCaseSensitive: options.isCaseSensitive ?? Config.isCaseSensitive,
        ignoreDiacritics: options.ignoreDiacritics ?? Config.ignoreDiacritics,
        ignoreLocation: options.ignoreLocation ?? Config.ignoreLocation
      })

      return {
        type: 'fuzzy',
        search(text) {
          return bitap.searchIn(text)
        }
      }
    }
  }
]

export default matchers

// ── Object-query operator lookup ──────────────────────────────────
//
// The object ("MongoDB-style") query syntax maps each `$`-prefixed operator
// to one of the matcher types above, bypassing the string regexes. The values
// are the same matcher factories string syntax uses, so scoring, indices, and
// inverse behavior are identical.
//
// Negation is expressed by wrapping an operator in `$not` rather than by
// separate `$notX` operators, so `NEGATED_TYPE` below maps an operator to the
// matcher that implements its inverse. Only these three can be negated: the
// inverse matchers are concrete implementations, not a computed negation, and
// there is no inverse of `fuzzy` (graded, not boolean) or of `exact`
// (whole-string inequality has no matcher yet, which is why `$ne` stays
// reserved).
//
// Note `inverse-exact` is a historical misnomer: it is implemented as
// does-NOT-contain (`indexOf === -1`), so it is the inverse of `$contains`.

const OPERATOR_TO_TYPE: Record<string, string> = {
  $fuzzy: 'fuzzy',
  $eq: 'exact',
  $contains: 'include',
  $startsWith: 'prefix-exact',
  $endsWith: 'suffix-exact'
}

const NEGATED_TYPE: Record<string, string> = {
  $contains: 'inverse-exact',
  $startsWith: 'inverse-prefix-exact',
  $endsWith: 'inverse-suffix-exact'
}

// Index the matcher definitions by their `type` tag, once.
const DEF_BY_TYPE: Record<string, MatcherDef> = {}
for (const def of matchers) {
  DEF_BY_TYPE[def.type] = def
}

// Resolve an operator key (e.g. `$startsWith`) to its matcher definition.
// Returns undefined for unknown operators; the caller decides how to throw so
// it can attach the offending key/path to the message.
export function matcherDefForOperator(op: string): MatcherDef | undefined {
  const type = OPERATOR_TO_TYPE[op]
  return type ? DEF_BY_TYPE[type] : undefined
}

// Resolve the INVERSE of an operator, for `$not: { <op>: … }`. Returns
// undefined when the operator has no inverse matcher (`$fuzzy`, `$eq`), which
// the caller reports as "cannot be negated" rather than "unknown operator".
export function negatedMatcherDefForOperator(
  op: string
): MatcherDef | undefined {
  const type = NEGATED_TYPE[op]
  return type ? DEF_BY_TYPE[type] : undefined
}

// Whether an operator key is known at all (positive form).
export function isKnownOperator(op: string): boolean {
  return op in OPERATOR_TO_TYPE
}
