# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [6.5.3](https://github.com/krisk/Fuse/compare/v6.5.2...v6.5.3) (2021-12-23)


### Bug Fixes

* **logical:** scoring for logical OR ([6f6af51](https://github.com/krisk/Fuse/commit/6f6af51cc39058fafea6b126f7120afc4f7c192a)), closes [#593](https://github.com/krisk/Fuse/issues/593)

### [6.5.2](https://github.com/krisk/Fuse/compare/v6.5.1...v6.5.2) (2021-12-23)

### [6.5.1](https://github.com/krisk/Fuse/compare/v6.5.0...v6.5.1) (2021-12-23)


### Bug Fixes

* rollback min node version ([9918f67](https://github.com/krisk/Fuse/commit/9918f67ba9b6b9b54e53576312fa33a51f428a9d))

## [6.5.0](https://github.com/krisk/Fuse/compare/v6.4.6...v6.5.0) (2021-12-22)


### Features

* **scoring:** field length norm weight ([a9e0080](https://github.com/krisk/Fuse/commit/a9e00804497a1bfd7a94040520417825c085c945))


### Bug Fixes

* **typescript:** add config declaration to types ([2f4de0c](https://github.com/krisk/Fuse/commit/2f4de0c5ce061808f460de7f399b56a06539d4d5))

### [6.4.6](https://github.com/krisk/Fuse/compare/v6.4.5...v6.4.6) (2021-01-05)


### Bug Fixes

* **typescript:** fix search typings ([94766b2](https://github.com/krisk/Fuse/commit/94766b2ffcc2be0e5f15daa9a29cd92adbe2647a)), closes [#527](https://github.com/krisk/Fuse/issues/527)

### [6.4.5](https://github.com/krisk/Fuse/compare/v6.4.4...v6.4.5) (2021-01-01)


### Bug Fixes

* **ts:** export FuseIndex type ([2e60bee](https://github.com/krisk/Fuse/commit/2e60bee242c7b82f0d014a3a35281b34bc6b62fb)), closes [#519](https://github.com/krisk/Fuse/issues/519)

### [6.4.4](https://github.com/krisk/Fuse/compare/v6.4.3...v6.4.4) (2020-12-29)


### Bug Fixes

* **extended:** correctly score include-match results ([443c863](https://github.com/krisk/Fuse/commit/443c863c44a48225510057d7597cb743fda2d25f)), closes [#522](https://github.com/krisk/Fuse/issues/522)

### [6.4.3](https://github.com/krisk/Fuse/compare/v6.4.2...v6.4.3) (2020-10-30)


### Bug Fixes

* **extended:** ignoreLocation when useExtendedSearch is true ([8f67ac9](https://github.com/krisk/Fuse/commit/8f67ac985d3440c20d93ce1e1c5ba66f384ea9bf)), closes [#465](https://github.com/krisk/Fuse/issues/465)

### [6.4.2](https://github.com/krisk/Fuse/compare/v6.4.1...v6.4.2) (2020-10-20)


### Bug Fixes

* if null in array ([740a500](https://github.com/krisk/Fuse/commit/740a5004763d84b285075a2cece4f37bc5fa2830))

### [6.4.1](https://github.com/krisk/Fuse/compare/v6.4.0...v6.4.1) (2020-07-26)


### Bug Fixes

* handle booleans in the data ([226d868](https://github.com/krisk/Fuse/commit/226d868a1102402e1e773db305ddd3928ae92f79)), closes [#469](https://github.com/krisk/Fuse/issues/469)

## [6.4.0](https://github.com/krisk/Fuse/compare/v6.3.1...v6.4.0) (2020-06-28)


### Features

* **extended:** add ability to search actual exact string ([350283f](https://github.com/krisk/Fuse/commit/350283f45a9affe05c6b3176bb5a5a037916de58))

### [6.3.1](https://github.com/krisk/Fuse/compare/v6.3.0...v6.3.1) (2020-06-24)


### Bug Fixes

* **logical:** scores in logical query operators are ignored ([e357229](https://github.com/krisk/Fuse/commit/e357229846fff585707903c93f556d1562fbabba)), closes [#449](https://github.com/krisk/Fuse/issues/449)

## [6.3.0](https://github.com/krisk/Fuse/compare/v6.2.1...v6.3.0) (2020-06-23)


### Features

* provide alternative array notation for nested paths ([7077fbe](https://github.com/krisk/Fuse/commit/7077fbe5f40872f9555645dbad2e6729ca55a5d4)), closes [#432](https://github.com/krisk/Fuse/issues/432)


### Bug Fixes

* **typescript:** add types for string and object together for the key property ([85fb211](https://github.com/krisk/Fuse/commit/85fb211a22bf5921ecefab9ecf3f8e2647f46b49))
* **typescript:** add typing for nested paths with array notation ([dfa4823](https://github.com/krisk/Fuse/commit/dfa48238f9a28600fd36677f958f43bb3cab4c03))

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
