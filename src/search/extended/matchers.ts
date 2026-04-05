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
