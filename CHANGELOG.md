# Version 6.0.0

- Added [logical query expressions](https://fusejs.io/api/query.html) (#411)
- Added ability to dynamically add/remove items (#412)
- Mix different `options:key` types during intialization (#413)
- Improved indexing performances, as well storage savings (#405, #407)

# Version 5.2.0

- Addresses #390, #376, #382, #385
- Removed ngram search and extended bitap to search long patterns

# Version 5.0.9-beta

- Fixed Fuse global name. Erroenously set as 'Fuse.js'

# Version 5.0.8-beta

- Changed bundler to Rollup.
- Added ES6 modules for bundlers and browsers (`fuse.esm.js`) (fixed [#262](#262))
- Added CommonJS builds (`fuse.common.js`)

## Breaking Changes

- The minimified version is finally actually called `fuse.min.js`

# Version 5.0.7-beta

- Fixed (#363)

# Version 5.0.6-beta

- Fixed (#357)

# Version 5.0.3-beta

- A couple of fixes, courtesy of [Daniel Dickinson](https://github.com/cshoredaniel):
  - Generate multiple targets with webpack (#359)
  - Fixed TypeError (#360)

# Version 5.0.2-beta

- Added indexing for increased performance over large lists
  - Added `Fuse.createIndex`, which created and returns an index. This function can be used to pre-generate the index, which you can then save, and ultimately pass to the `Fuse` instance.

## Breaking Changes

- Removed `id` option
- Changed format of the search results
- Updated TypeScript definitions

# Version 5.0.1-beta

- Removed `matchAllTokens` option.

# Version 5.0.0-beta

- Added ability to search patterns longer > 32 characters
- Removed `maxPatternLength` option

# Version 4.1.0-beta

- Perf optimization on nested array search

# Version 4.0.4-beta

- Re-added license information

# Version 4.0.3-beta

- Increased Node version

# Version 4.0.2-beta

- Added missing tests

# Version 4.0.1-beta

- Removed unused codepath
- Fixed case sensititivity check
- Upgraded dev dependencies

# Version 4.0.0-beta

- Added extended search [Discussion](https://github.com/krisk/Fuse/issues/356)
- Removed tokenization [Discussion](https://github.com/krisk/Fuse/issues/355)

# Version 3.6.0

- Improved error handling for keys

# Version 3.5.0

- Fixed #341, adjusting weights into the calculation
- Improved performance by ~10% (really can only be seen when you have 10k+ items)

# Version 3.4.3

- Fixed #261
- Rewrote tests to Jest framework
- Wrote tests for TypeScript typings
- Cleanup build

# Version 3.4.2

- Fixed #288

# Version 3.4.1

- Ensured `dist/` content is production ready (both full and min versions) #283

# Version 3.4.0

- Upgraded build tool to Webpack 4. New `dist/` output.

# Version 3.3.1

- Fixed the circular JSON TypeError (#197). Thanks [ThinkTankShark](https://github.com/ThinkTankShark)!

# Version 3.2.1

- Fixed issue in which more fuzzy matches would weaken a score instead of strengthening it (#233)

# Version 3.2.0

- Give better result for exact match when using weighted keys (#192)

# Version 3.1.0

- Added match index location for array key (#183)
- Allow searching deep nested numbers (#189)

# Version 3.0.5

- Escape special characters in search pattern (#168)

# Version 3.0.4

- Random bug fixes (#162)

# Version 3.0.0

- Removed Bower support
- Modified library into a more more palatable architecture, where the Bitap portion is now its own separate module.

### BREAKING CHANGES

- Removed `include` option in favor of more explicit booleans: `includeScore` and `includeMatches`. Both are `false` by default.
- Removed `searchFn` option, as this (for now) will remain a Bitap based solution

# Version 2.7.4

- Reverted to previous version, thus fixing breaking changes (a little bit of a version match here)

# Version 2.6.2

- Revert back to previous version

# Version 2.6.2

- Fix typings based on TypeScript guidelines (#129)

# Version 2.6.0

- Added Typescript definition
- Added ability to set min/max matched character lengths when returning the matched indices (#122)

# Version 2.5.0

- Added option to search by matching all tokens (in every record) when `matchAllTokens:true` (#95)

# Version 2.3.0

- Added token separator to options, when `tokenize:true` (#93)
- General code clean up (#88)
- Bunch of other bug fixes

# Version 2.2.0

- Added option to include matched indices (#6)
- Added ability to search with weighted keys (#62)

# Version 2.1.0-beta

- Added ability to search with weighted keys (#62)

# Version 2.0.0

- Modified search algorithm to search individual words AND the full string, computing the final score as a function of both. This yields better scoring accuracy (#41)
- Changed exact substrings to not have a score of zero. That is searching for "hell" in "hello" will not yield a score of zero, while searching for "hello" will (#63)
- Added `verbose` option, which will print to the console useful information, mostly for debugging
- Improved code structure.
- Added version information within Fuse itself
- Added this Changelog (#64)
- Added fallback when pattern length is greater than machine word length (i.e, > 32 characters) (#38)
- Allowed results with a value of 0 to be returned (#73)
