import parseQuery from "./parseQuery.js";
import FuzzyMatch from "./FuzzyMatch.js";
import IncludeMatch from "./IncludeMatch.js";

import Config from "../../core/config.js";

/** These extended matchers can return an array of matches, as opposed to a single match. */
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);

/**
 * Command-like searching
 * ======================
 *
 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`, search in a given text.
 *
 * Search syntax:
 *
 * | Token       | Match type                 | Description                            |
 * | ----------- | -------------------------- | -------------------------------------- |
 * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
 * | `=scheme`   | exact-match                | Items that are `scheme`                |
 * | `'python`   | include-match              | Items that include `python`            |
 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
 *
 * A single pipe character acts as an OR operator. For example, the following query matches entries that start with `core` and end
 * with either`go`, `rb`, or`py`.
 *
 * ```
 * ^core go$ | rb$ | py$
 * ```
 */
class ExtendedSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      distance = Config.distance,
      threshold = Config.threshold,
      includeMatches = Config.includeMatches,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      isCaseSensitive = Config.isCaseSensitive,
      minMatchCharLength = Config.minMatchCharLength,
    } = {}
  ) {
    this.query = null;
    this.options = {
      distance,
      location,
      threshold,
      includeMatches,
      findAllMatches,
      ignoreLocation,
      isCaseSensitive,
      minMatchCharLength,
    };
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.query = parseQuery(this.pattern, this.options);
  }

  static condition(_, options) {
    return options.useExtendedSearch;
  }

  searchIn(text) {
    const query = this.query;

    if (!query) return { isMatch: false, score: 1 };

    const { includeMatches, isCaseSensitive } = this.options;

    text = isCaseSensitive ? text : text.toLowerCase();

    let numMatches = 0;
    let totalScore = 0;
    let allIndices = [];

    for (let i = 0, qry_len = query.length; i < qry_len; i++) {
      const searchers = query[i];

      numMatches = 0;
      allIndices.length = 0;

      for (let j = 0, search_len = searchers.length; j < search_len; j++) {
        const searcher = searchers[j];
        const { isMatch, indices, score } = searcher.search(text);

        if (!isMatch) {
          totalScore = 0;
          numMatches = 0;
          allIndices.length = 0;
          break;
        }

        numMatches++;
        totalScore += score;

        if (!includeMatches) continue;

        const type = searcher.constructor.type;

        if (MultiMatchSet.has(type)) {
          allIndices = [...allIndices, ...indices];
          continue;
        }

        allIndices.push(indices);
      }

      if (!numMatches) continue;

      let result = { score: totalScore / numMatches, isMatch: true };

      if (includeMatches) result.indices = allIndices;

      return result;
    }

    return { score: 1, isMatch: false };
  }
}

export default ExtendedSearch;
