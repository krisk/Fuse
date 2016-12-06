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
