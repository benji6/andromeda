import {
  compose,
  curry,
  curryN,
  filter,
  map,
  partial,
  range,
  repeat
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import store from '../../store'
import {
  activePatternCellClick,
  setActivePatternActivePosition
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

const activeNotes = new Set()
let stopped = true

const onPlay = dispatch => {
  let count = 0
  stopped = false

  const timeoutCallback = _ => {
    if (stopped === true) return
    const {activePatternIndex, patterns, rootNote, scale} = store.getState()
    const {steps, octave, xLength, yLength} = patterns[activePatternIndex]
    const position = count % xLength
    dispatch(setActivePatternActivePosition(position))
    activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop &&
      instrumentObj.inputNoteStop(id))
    activeNotes.clear()

    compose(
      map(({x, y}) => {
        const {activePatternIndex, patterns, plugins} = store.getState()
        const {instrument, volume} = patterns[activePatternIndex]
        const id = `pattern-${x}-${y}`
        const instrumentObj = instrumentInstance(instrument, plugins)
        activeNotes.add({instrumentObj, id})
        instrumentObj.inputNoteStart({
          frequency: pitchToFrequency(pitchFromScaleIndex(
            scale.scales[scale.scaleName],
            yLength - 1 - y + scale.scales[scale.scaleName].length * octave
          ) + rootNote),
          gain: volume,
          id
        })
      }),
      filter(({x}) => x === position)
    )(steps)

    count++
    setTimeout(timeoutCallback, 60000 / store.getState().bpm)
  }
  timeoutCallback()
}

const stopVisuals = dispatch => {
  stopped = true
  dispatch(setActivePatternActivePosition(null))
}

const stopAudio = _ => {
  activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop &&
    instrumentObj.inputNoteStop(id))
  activeNotes.clear()
}

const onStop = compose(stopAudio, stopVisuals)

const yLabel = curry(
  (scale, yLength, rootNote, i) => noteNameFromPitch(pitchFromScaleIndex(
    scale.scales[scale.scaleName],
    yLength - i - 1
  ) + rootNote)
)

const cellClickHandler = curryN(
  4,
  (dispatch, y, x) => dispatch(activePatternCellClick({x, y}))
)

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  playing,
  rootNote,
  scale
}) => {
  const {activePosition, steps, xLength, yLength} = patterns[activePatternIndex]
  return {
    activePosition,
    dispatch,
    instrument,
    playing,
    rootNote,
    scale,
    steps,
    xLength,
    yLength
  }
})

export default connectComponent(({
  activePosition,
  dispatch,
  instrument,
  playing,
  rootNote,
  scale,
  steps,
  xLength,
  yLength
}) => {
  const emptyPatternData = map(range(0), repeat(xLength, yLength))
  const patternData = mapIndexed(
    (x, rowIndex) => map(
      colIndex => ({active: colIndex === activePosition, selected: stepExists(steps, colIndex, rowIndex)}),
      x
    ),
    emptyPatternData
  )

  return <div>
    <Pattern {...{
      onClick: cellClickHandler(dispatch),
      patternData,
      rootNote,
      scale,
      yLabel: yLabel(scale, yLength, rootNote)
    }} />
    <PlayButton
      dispatch={dispatch}
      onPlay={partial(onPlay, [dispatch])}
      onStop={partial(onStop, [dispatch])}
      playing={playing}
    />
    <nav>
      <FullButton to='/controllers/pattern/settings'>Options</FullButton>
    </nav>
  </div>
})
