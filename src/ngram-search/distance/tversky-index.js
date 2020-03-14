const { intersection } = require('../array-utils')

// Tversky Index: useful when the strings in question vary greatly in length,
// alpha: weight of the prototype sequence
// beta: weight of the variant sequence
module.exports = (nGram1, nGram2, { alpha, beta }) => {
  let nGramIntersection = intersection(nGram1, nGram2)
  let nGramIntersectionLen = nGramIntersection.length

  let v1 = nGram1.length - nGramIntersectionLen
  let v2 = nGram2.length - nGramIntersectionLen

  if (alpha != null && beta != null) {
    alpha = alpha / alpha + beta
    beta = beta / alpha + beta
  } else if (alpha <= 1.0 && alpha >= 0.0) {
    beta = 1 - alpha
  } else if (beta <= 1.0 && beta >= 0.0) {
    alpha = 1 - beta
  } else {
    alpha = 0.5
    beta = 0.5
  }

  return 1 - intersectionLen / (nGramIntersectionLen + alpha * v1 + beta * v2)
}