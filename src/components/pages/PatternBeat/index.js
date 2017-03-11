import {find, map, range, repeat} from 'ramda'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import PatternBeat from './PatternBeat'
import {
  patternBeatPlayingStart,
  patternBeatPlayingStop,
  patternBeatStepsAdd,
  patternBeatStepsRemove,
  patternBeatStepVelocitySet,
} from '../../../actions'
import {findById, mapIndexed} from '../../../utils/helpers'

const emptyPatternData = defaultMemoize((xLength, yLength) => map(range(0), repeat(xLength, yLength)))

const patternData = defaultMemoize((xLength, yLength, steps) => mapIndexed(
  (x, rowIndex) => map(colIndex => {
    const step = find(({x, y}) => x === colIndex && y === rowIndex, steps)
    return {
      selected: Boolean(step),
      velocity: step && step.velocity,
    }
  }, x),
  emptyPatternData(xLength, yLength)
))

const mapStateToProps = ({
  patternsBeat,
  plugins,
  screen: {height, width},
  settings: {bpm},
}, {params: {id}}) => {
  const {
    gain,
    instrument,
    markerPosition,
    playing,
    playStartTime,
    steps,
    stepVelocity,
    xLength,
    yLength,
  } = findById(Number(id), patternsBeat)

  return {
    bpm,
    gain,
    height: height * 0.69,
    instrument,
    markerPosition,
    patternData: patternData(xLength, yLength, steps),
    patternId: Number(id),
    playing,
    playStartTime,
    plugins,
    steps,
    stepVelocity,
    width,
    xLength,
  }
}

const mapDispatchToProps = {
  patternBeatPlayingStart,
  patternBeatPlayingStop,
  patternBeatStepsAdd,
  patternBeatStepsRemove,
  patternBeatStepVelocitySet,
}

export default connect(mapStateToProps, mapDispatchToProps)(PatternBeat)
