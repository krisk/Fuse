export const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available'

export const LOGICAL_SEARCH_UNAVAILABLE = 'Logical search is not available'

export const TOKEN_SEARCH_UNAVAILABLE = 'Token search is not available'

export const INCORRECT_INDEX_TYPE = "Incorrect 'index' type"

export const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key: string): string =>
  `Invalid value for key ${key}`

export const PATTERN_LENGTH_TOO_LARGE = (max: number): string =>
  `Pattern length exceeds max of ${max}.`

export const MISSING_KEY_PROPERTY = (name: string): string => `Missing ${name} property in key`

export const INVALID_KEY_WEIGHT_VALUE = (key: string): string =>
  `Property 'weight' in key '${key}' must be a positive integer`

export const FUSE_WORKER_UNSUPPORTED_FN_OPTION = (option: string): string =>
  `FuseWorker does not support function-valued option '${option}': ` +
  `functions cannot be transferred to Web Workers via postMessage. ` +
  `Remove this option or fall back to Fuse.`

export const FUSE_WORKER_TOKEN_SEARCH_UNSUPPORTED =
  `FuseWorker does not support useTokenSearch: token search depends on ` +
  `corpus-level statistics (df, fieldCount) that are computed per shard, ` +
  `so per-shard scores would diverge from single-thread Fuse. Use Fuse on ` +
  `the main thread for token search.`

export const FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED =
  `Fuse.match does not support useTokenSearch: token search requires ` +
  `corpus-level statistics (df, fieldCount) that a one-off string ` +
  `comparison does not have. Use new Fuse(...).search(...) instead.`
