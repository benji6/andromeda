import {
  curry,
  curryN,
  forEach,
  map,
  range,
  repeat
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {defaultMemoize} from 'reselect'
import audioContext from '../../audioContext'
import {
  patternCellClick,
  setPatternMarkerPosition,
  setPatternPlayStartTime,
} from '../../actions'
import {mapIndexed} from '../../utils/helpers'
import FullButton from '../atoms/FullButton'
import PlayButton from '../atoms/PlayButton'
import Pattern from '../organisms/Pattern'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import {stepExists} from '../../reducers/patterns'
import {instrumentInstance} from '../../utils/derivedData'
import store from '../../store'
import scales from '../../constants/scales'

let animationFrameRequest
let timeoutId

const yLabel = curry(
  (selectedScale, yLength, rootNote, octave, i) => noteNameFromPitch(pitchFromScaleIndex(
    scales[selectedScale],
    yLength - i - 1
  ) + rootNote + 12 * octave)
)

const cellClickHandler = curryN(5, (dispatch, patternId, y, x) =>
  dispatch(patternCellClick({patternId, x, y})))

const emptyPatternData = defaultMemoize((xLength, yLength) =>
  map(range(0), repeat(xLength, yLength)))

const connectComponent = connect(({
  dispatch,
  patterns,
  plugins,
  settings: {bpm, rootNote, selectedScale},
}, {params: {patternId}}) => {
  const {
    activeNotes,
    instrument,
    markerPosition,
    octave,
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
    activeNotes,
    bpm,
    dispatch,
    instrument,
    markerPosition,
    octave,
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
})

const visualLoop = patternId => _ => {
  const state = store.getState()
  const {playStartTime, xLength} = state.patterns[patternId]
  const {settings: {bpm}} = state
  const noteDuration = 60 / bpm
  const patternDuration = xLength * noteDuration
  animationFrameRequest = requestAnimationFrame(visualLoop(patternId))
  store.dispatch(setPatternMarkerPosition({
    patternId,
    value: (audioContext.currentTime - playStartTime) / patternDuration % 1,
  }))
}

export default connectComponent(class extends React.Component {
  componentWillMount () {
    const {patternId, playing} = this.props
    playing && visualLoop(patternId)()
  }

  componentWillUnmount () {
    cancelAnimationFrame(animationFrameRequest)
  }

  onPlay () {
    const {patternId} = this.props
    store.dispatch(setPatternPlayStartTime({patternId, value: audioContext.currentTime}))
    const {playStartTime} = this.props
    let nextLoopEndTime = playStartTime
    const audioLoop = (i = 0) => {
      const state = store.getState()
      const {
        activeNotes,
        instrument,
        octave,
        steps,
        volume,
        xLength,
        yLength,
      } = state.patterns[patternId]
      const {plugins, settings: {bpm, rootNote, selectedScale}} = state
      const instrumentObj = instrumentInstance(instrument, plugins)
      const noteDuration = 60 / bpm
      const patternDuration = xLength * noteDuration
      const currentLoopEndTime = nextLoopEndTime
      nextLoopEndTime += patternDuration

      timeoutId = setTimeout(
        _ => audioLoop(++i),
        (nextLoopEndTime - audioContext.currentTime - 0.1) * 1000
      )

      forEach(({x, y}) => {
        const id = `pattern-${patternId}-${x}-${y}-${i}`
        activeNotes.add({instrumentObj, id})
        instrumentObj.noteStart({
          frequency: pitchToFrequency(pitchFromScaleIndex(
            scales[selectedScale],
            yLength - 1 - y + scales[selectedScale].length * octave
          ) + rootNote),
          gain: volume,
          id,
          startTime: currentLoopEndTime + noteDuration * x,
          stopTime: currentLoopEndTime + noteDuration * (x + 1),
        })
      }, steps)
    }

    audioLoop()
    visualLoop(patternId)()
  }

  onStop () {
    const {activeNotes, dispatch, patternId} = this.props
    forEach(({id, instrumentObj}) => instrumentObj.noteStop &&
      instrumentObj.noteStop(id), activeNotes)
    activeNotes.clear()
    clearTimeout(timeoutId)
    cancelAnimationFrame(animationFrameRequest)
    dispatch(setPatternMarkerPosition({patternId, value: 0}))
  }

  render () {
    const {
      dispatch,
      markerPosition,
      octave,
      patternData,
      patternId,
      playing,
      rootNote,
      selectedScale,
      yLength,
    } = this.props

    return <div>
      <h2 className='text-center'>{`Pattern ${patternId}`}</h2>
      <Pattern {...{
        markerPosition,
        onClick: cellClickHandler(dispatch, patternId),
        patternData,
        yLabel: yLabel(selectedScale, yLength, rootNote, octave),
      }} />
      <PlayButton {...{
        dispatch,
        onPlay: ::this.onPlay,
        onStop: ::this.onStop,
        patternId,
        playing,
      }} />
      <nav>
        <FullButton to={`/controllers/pattern/${patternId}/settings`}>
          Options
        </FullButton>
      </nav>
    </div>
  }
})
