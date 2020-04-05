import Match from './match'
import BitapSearch from '../bitap-search'

export default class FuzzyMatch extends Match {
  constructor(pattern, options) {
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
