import Match from './match'
import BitapSearch from '../bitap-search'
import Config from '../../core/config'

export default class FuzzyMatch extends Match {
  constructor(
    pattern,
    options = ({
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive
    } = {})
  ) {
    super(pattern)
    this._bitapSearch = new BitapSearch(pattern, options)
  }
  static get type() {
    return 'fuzzy'
  }
  static get literal() {
    return /^"(.*)"$/
  }
  static get re() {
    return /^(.*)$/
  }
  search(text) {
    return this._bitapSearch.searchInString(text)
  }
}
