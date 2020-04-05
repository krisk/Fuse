import Config from '../../core/config'

export default function computeScore(
  pattern,
  {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance
  } = {}
) {
  const accuracy = errors / pattern.length
  const proximity = Math.abs(expectedLocation - currentLocation)

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy
  }

  return accuracy + proximity / distance
}
