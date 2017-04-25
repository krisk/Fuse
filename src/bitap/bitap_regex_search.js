module.exports = (text, pattern, tokenSeparator = / +/g) => {
  let matches = text.match(new RegExp(pattern.replace(tokenSeparator, '|')))
  let isMatch = !!matches
  let matchedIndices = []

  if (isMatch) {
    for (i = 0, matchesLen = matches.length; i < matchesLen; i += 1) {
      match = matches[i]
      matchedIndices.push([text.indexOf(match), match.length - 1])
    }
  }
  
  return {
    // TODO: revisit this score
    score: isMatched ? 0.5 : 1,
    isMatch,
    matchedIndices
  } 
}