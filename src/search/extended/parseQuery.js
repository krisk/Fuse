import ExactMatch from "./ExactMatch.js";
import FuzzyMatch from "./FuzzyMatch.js";
import IncludeMatch from "./IncludeMatch.js";
import SuffixExactMatch from "./SuffixExactMatch.js";
import PrefixExactMatch from "./PrefixExactMatch.js";
import InverseExactMatch from "./InverseExactMatch.js";
import InversePrefixExactMatch from "./InversePrefixExactMatch.js";
import InverseSuffixExactMatch from "./InverseSuffixExactMatch.js";

/**
 * ❗Order is important. DO NOT CHANGE.
 *
 * [0] -> ExactMatch
 * [1] -> IncludeMatch
 * [2] -> PrefixExactMatch
 * [3] -> InversePrefixExactMatch
 * [4] -> InverseSuffixExactMatch
 * [5] -> SuffixExactMatch
 * [6] -> InverseExactMatch
 * [7] -> FuzzyMatch
 */
const searchers = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch,
];

const searchersLen = searchers.length;

/** Regex to split by spaces, but keep anything in quotes together. */
const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = "|";

/**
 * Return a 2D array representation of the query, for simpler parsing.
 * Example:
 *  "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
 */
function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item
      .trim()
      .split(SPACE_RE)
      .filter((item) => item && !!item.trim());
    let results = [];

    for (let i = 0, qry_len = query.length; i < qry_len; i += 1) {
      let idx = -1;
      let found = false;
      const queryItem = query[i];

      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isMultiMatch(queryItem);

        if (!token) continue;

        results.push(new searcher(token, options));
        found = true;
      }

      if (found) continue;

      idx = -1;

      while (++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isSingleMatch(queryItem);

        if (!token) continue;

        results.push(new searcher(token, options));
        break;
      }
    }

    return results;
  });
}

export default parseQuery;
