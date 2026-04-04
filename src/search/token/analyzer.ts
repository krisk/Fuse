import { stripDiacritics } from '../../helpers/diacritics'

export interface Analyzer {
  tokenize(text: string): string[]
}

interface AnalyzerOptions {
  isCaseSensitive?: boolean
  ignoreDiacritics?: boolean
}

const WORD = /\b\w+\b/g

export function createAnalyzer({
  isCaseSensitive = false,
  ignoreDiacritics = false
}: AnalyzerOptions = {}): Analyzer {
  return {
    tokenize(text: string): string[] {
      if (!isCaseSensitive) {
        text = text.toLowerCase()
      }
      if (ignoreDiacritics) {
        text = stripDiacritics(text)
      }
      return text.match(WORD) || []
    }
  }
}
