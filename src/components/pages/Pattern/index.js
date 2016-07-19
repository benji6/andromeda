import {
  map,
  range,
  repeat,
} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import {mapIndexed} from '../../../utils/helpers'
import {stepExists} from '../../../reducers/patterns'
import PatternBeat from './PatternBeat'
import PatternSynth from './PatternSynth'

const emptyPatternData = defaultMemoize((xLength, yLength) =>
  map(range(0), repeat(xLength, yLength)))

const mapStateToProps = ({
  dispatch,
  patterns,
  plugins,
  settings: {bpm, rootNote, selectedScale},
}, {params: {patternId}}) => {
  const {
    beatPattern,
    instrument,
    markerPosition,
    playing,
    playStartTime,
    steps,
    volume,
    xLength,
    yLength,
  } = patterns[patternId]

  const patternData = mapIndexed(
    (x, rowIndex) => map(colIndex => ({
      selected: stepExists(colIndex, rowIndex, steps)
    }), x),
    emptyPatternData(xLength, yLength)
  )

  return {
    beatPattern,
    bpm,
    dispatch,
    instrument,
    markerPosition,
    patternData,
    patternId: Number(patternId),
    playing,
    playStartTime,
    plugins,
    rootNote,
    selectedScale,
    steps,
    volume,
    xLength,
    yLength,
  }
}

export default connect(mapStateToProps)(
  props => props.beatPattern
    ? createElement(PatternBeat, props)
    : createElement(PatternSynth, props)
)
