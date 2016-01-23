import {decimalPart} from '../utils/helpers'

module.exports = (noteDuration, currentTime) => {
  const notesSinceBeginning = currentTime / noteDuration
  return currentTime + (1 - decimalPart(notesSinceBeginning)) * noteDuration
}
