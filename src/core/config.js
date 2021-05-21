import get from "../helpers/get.js";

/**
 * @property {Bool} MatchOptions.includeMatches
 * @description Whether the matches should be included in the result set. When `true`, each record in the result set will include
 * the indices of the matched characters. These can consequently be used for highlighting purposes.
 *
 * @property {Bool} MatchOptions.findAllMatches
 * @description When `true`, the matching function will continue to the end of a search pattern even if a perfect match has already
 * been located in the string.
 *
 * @property {Number} MatchOptions.minMatchCharLength
 * @description Minimum number of characters that must be matched before a result is considered a match.
 */
export const MatchOptions = {
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
};

/**
 * @property {Bool} BasicOptions.isCaseSensitive
 * @description When `true`, the algorithm continues searching to the end of the input even if a perfect match is found before the
 * end of the same input.
 *
 * @property {Bool} BasicOptions.includeScore
 * @description When `true`, the matching function will continue to the end of a search pattern even if perfect match is found.
 *
 * @property {List} BasicOptions.keys
 * @description List of properties that will be searched. This also supports nested properties.
 *
 * @property {Bool} BasicOptions.shouldSort
 * @description Whether to sort the result list, by score.
 *
 * @property {Function} BasicOptions.sortFn
 * @description Default sort function: sort by ascending score, ascending index.
 */
export const BasicOptions = {
  isCaseSensitive: false,
  includeScore: false,
  keys: [],
  shouldSort: true,
  _sort: (a, b) =>
    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1,
};

/**
 * @property {Number} FuzzyOptions.location
 * @description Approximately where in the text is the pattern expected to be found?
 *
 * @property {Number} FuzzyOptions.threshold
 * @description At what pint does the match algorithm give up. A threshold of '0.0' requires a perfect match (of both letters and
 * location), a threshold of '1.0' would match anything.
 *
 * @property {Number} FuzzyOptions.distance
 * @description Determines how close the match must be to the fuzzy location (specified above). An exact letter match which is
 * 'distance' characters away from the fuzzy location would score as a complete mismatch. A distance of '0' requires the match be
 * at the exact location specified, a threshold of '1000' would require a perfect match to be within 800 characters of the fuzzy
 * location to be found using a '0.8; threshold.
 */
export const FuzzyOptions = {
  location: 0,
  threshold: 0.6,
  distance: 100,
};

/**
 * @property {Bool} AdvancedOptions.useExtendedSearch
 * @description When `true`, it enables the use of unix-like search commands.
 *
 * @property {Function} AdvancedOptions.getFn
 * @description The get function to use when fetching an object's properties. The default will search nested paths
 * *ie foo.bar.baz*.
 *
 * @property {Bool} AdvancedOptions.ignoreLocation
 * @description When `true`, search will ignore `location` and `distance`, so it won't matter where in the string the pattern
 * appears.
 *
 * @property {Bool} AdvancedOptions.ignoreFieldNorm
 * @description When `true`, the calculation for the relevance score (used for sorting) will ignore the field-length norm.
 */
export const AdvancedOptions = {
  useExtendedSearch: false,
  _get: get,
  ignoreLocation: false,
  ignoreFieldNorm: false,
};

export default {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions,
};
