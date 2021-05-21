import BaseMatch from "./BaseMatch.js";

import Config from "../../core/config.js";
import BitapSearch from "../bitap/index.js";

class FuzzyMatch extends BaseMatch {
  constructor(
    pattern,
    {
      location = Config.location,
      distance = Config.distance,
      threshold = Config.threshold,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      ignoreLocation = Config.ignoreLocation,
      isCaseSensitive = Config.isCaseSensitive,
      minMatchCharLength = Config.minMatchCharLength,
    } = {}
  ) {
    super(pattern);

    this._bitapSearch = new BitapSearch(pattern, {
      location,
      distance,
      threshold,
      includeMatches,
      findAllMatches,
      ignoreLocation,
      isCaseSensitive,
      minMatchCharLength,
    });
  }

  static get type() {
    return "fuzzy";
  }

  static get multiRegex() {
    return /^"(.*)"$/;
  }

  static get singleRegex() {
    return /^(.*)$/;
  }

  search(text) {
    return this._bitapSearch.searchIn(text);
  }
}

export default FuzzyMatch;
