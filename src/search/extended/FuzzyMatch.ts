import BaseMatch from './BaseMatch'
import BitapSearch from '../bitap'
import Config from '../../core/config'
import type { SearchResult } from '../../types'

export default class FuzzyMatch extends BaseMatch {
  _bitapSearch: BitapSearch

  constructor(
    pattern: string,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreDiacritics = Config.ignoreDiacritics,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    super(pattern)
    this._bitapSearch = new BitapSearch(pattern, {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreDiacritics,
      ignoreLocation
    })
  }
  static get type(): string {
    return 'fuzzy'
  }
  static get multiRegex(): RegExp {
    return /^"(.*)"$/
  }
  static get singleRegex(): RegExp {
    return /^(.*)$/
  }
  search(text: string): SearchResult {
    return this._bitapSearch.searchIn(text)
  }
}
