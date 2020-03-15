const { union, intersection } = require('../array-utils')

module.exports = (nGram1, nGram2) => {
  let nGramUnion = union(nGram1, nGram2)
  let nGramIntersection = intersection(nGram1, nGram2)

  return 1 - nGramIntersection.length / nGramUnion.length
}