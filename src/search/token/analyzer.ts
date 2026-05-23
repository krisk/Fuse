import { stripDiacritics } from '../../helpers/diacritics'

export type TokenizeFunction = (text: string) => string[]

export interface Analyzer {
  tokenize(text: string): string[]
}

interface AnalyzerOptions {
  isCaseSensitive?: boolean
  ignoreDiacritics?: boolean
  tokenize?: RegExp | TokenizeFunction
}

// Includes \p{M} (Mark) so combining marks stay attached to their base
// letter — without it, scripts like Devanagari and NFD-normalized Latin
// shatter (e.g. 'हिन्दी' → ['ह','न','द'], 'café'.normalize('NFD') → ['cafe']).
const DEFAULT_TOKEN = /[\p{L}\p{M}\p{N}_]+/gu

const warned = new WeakSet<RegExp>()

function warnNonGlobal(regex: RegExp): void {
  if (process.env.NODE_ENV === 'development' && !warned.has(regex)) {
    warned.add(regex)
    console.warn(
      `[Fuse] tokenize regex ${regex} lacks the global flag; only the ` +
        `first match per text will be returned. Add the 'g' flag.`
    )
  }
}

function resolveTokenize(
  tokenize: RegExp | TokenizeFunction | undefined
): TokenizeFunction {
  if (typeof tokenize === 'function') {
    let validated = false
    return (text: string): string[] => {
      const result = tokenize(text)
      if (process.env.NODE_ENV === 'development' && !validated) {
        validated = true
        if (
          !Array.isArray(result) ||
          result.some((t) => typeof t !== 'string')
        ) {
          throw new Error(
            `[Fuse] tokenize function must return string[]; received ${
              Array.isArray(result)
                ? 'array containing non-strings'
                : typeof result
            }.`
          )
        }
      }
      return result
    }
  }
  if (tokenize instanceof RegExp) {
    if (!tokenize.global) warnNonGlobal(tokenize)
    return (text: string): string[] => text.match(tokenize) || []
  }
  return (text: string): string[] => text.match(DEFAULT_TOKEN) || []
}

export function createAnalyzer({
  isCaseSensitive = false,
  ignoreDiacritics = false,
  tokenize
}: AnalyzerOptions = {}): Analyzer {
  const tokenizeFn = resolveTokenize(tokenize)
  return {
    tokenize(text: string): string[] {
      if (!isCaseSensitive) {
        text = text.toLowerCase()
      }
      if (ignoreDiacritics) {
        text = stripDiacritics(text)
      }
      return tokenizeFn(text)
    }
  }
}
