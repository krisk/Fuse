import { union, intersection } from '../array-utils'

export default function jaccardDistance(nGram1, nGram2) {
  let nGramUnion = union(nGram1, nGram2)
  let nGramIntersection = intersection(nGram1, nGram2)

  return 1 - nGramIntersection.length / nGramUnion.length
}
