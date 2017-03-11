import {
  find,
  map,
  range,
  repeat,
} from 'ramda'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import PatternSynth from './PatternSynth'
import {findById, mapIndexed} from '../../../utils/helpers'
import {
  patternSynthPlayingStart,
  patternSynthPlayingStop,
  patternSynthStepsAdd,
  patternSynthStepsRemove,
  patternSynthStepVelocitySet,
} from '../../../actions'

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
  patternsSynth,
  plugins,
  screen: {height, width},
  settings: {bpm, rootNote, selectedScale},
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
  } = findById(Number(id), patternsSynth)

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
    rootNote,
    selectedScale,
    steps,
    stepVelocity,
    width,
    xLength,
    yLength,
  }
}

const mapDispatchToProps = {
  patternSynthPlayingStart,
  patternSynthPlayingStop,
  patternSynthStepsAdd,
  patternSynthStepsRemove,
  patternSynthStepVelocitySet,
}

export default connect(mapStateToProps, mapDispatchToProps)(PatternSynth)
