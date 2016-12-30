import {map, pluck, range} from 'ramda'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import {findById} from '../../../utils/helpers'
import {stepExists} from '../../../reducers/song'
import {
  patternBeatAdd,
  patternSynthAdd,
  patternDelete,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
} from '../../../actions'
import Song from './Song'

const getSteps = defaultMemoize((steps, patterns) => map(({patternId, x, y}) => ({
  x,
  xLength: patterns.length ? findById(patternId, patterns).xLength : 0,
  y,
}), steps))

const patternData = defaultMemoize((xLength, patterns, steps) => map(
  pattern => map(
    colIndex => ({selected: stepExists(colIndex, pattern.id, steps)}),
    range(0, xLength)
  ),
  patterns
))

const patternNames = defaultMemoize(map(({beatPattern, id}) => `${beatPattern ? 'Beat' : 'Synth'} - ${id}`))

const mapStateToProps = ({
  nav: {lastDirection},
  patterns,
  screen: {height, width},
  song: {
    isPlaying,
    markerPosition,
    steps,
    xLength,
  },
}) => ({
  height: height * 0.69,
  isEmpty: !patterns.length,
  isPlaying,
  lastDirection,
  markerPosition,
  patternData: patternData(xLength, patterns, steps),
  patternIds: pluck('id', patterns),
  patternNames: patternNames(patterns),
  steps: getSteps(steps, patterns),
  width,
})

const mapDispatchToProps = {
  patternBeatAdd,
  patternDelete,
  patternSynthAdd,
  songPlayingStart,
  songPlayingStop,
  songStepsAdd,
  songStepsRemove,
}

export default connect(mapStateToProps, mapDispatchToProps)(Song)
