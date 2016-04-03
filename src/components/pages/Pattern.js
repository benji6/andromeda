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
import {defaultMemoize} from 'reselect'
import store from '../../store'
import {
  patternCellClick,
  setPatternActivePosition
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

const onPlay = (dispatch, patternId) => {
  let count = 0
  stopped = false

  const timeoutCallback = _ => {
    if (stopped === true) return
    const {patterns, rootNote, scale} = store.getState()
    const {steps, octave, xLength, yLength} = patterns[patternId]
    const position = count % xLength
    dispatch(setPatternActivePosition({patternId, value: position}))
    activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop &&
      instrumentObj.inputNoteStop(id))
    activeNotes.clear()

    compose(
      map(({x, y}) => {
        const {patterns, plugins} = store.getState()
        const {instrument, volume} = patterns[patternId]
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

const stopVisuals = (dispatch, patternId) => {
  stopped = true
  dispatch(setPatternActivePosition({patternId, value: null}))
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
  5,
  (dispatch, patternId, y, x) => dispatch(patternCellClick({patternId, x, y}))
)

const emptyPatternData = defaultMemoize((xLength, yLength) => map(range(0), repeat(xLength, yLength)))

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  playing,
  rootNote,
  scale
}, {params: {patternId}}) => {
  const {activePosition, steps, xLength, yLength} = patterns[patternId]

  const patternData = mapIndexed(
    (x, rowIndex) => map(
      colIndex => ({active: colIndex === activePosition, selected: stepExists(colIndex, rowIndex, steps)}),
      x
    ),
    emptyPatternData(xLength, yLength)
  )

  return {
    dispatch,
    patternData,
    patternId: Number(patternId),
    playing,
    rootNote,
    scale,
    yLength
  }
})

export default connectComponent(({
  dispatch,
  patternData,
  patternId,
  playing,
  rootNote,
  scale,
  yLength
}) => {
  return <div>
    <Pattern {...{
      onClick: cellClickHandler(dispatch, patternId),
      patternData,
      rootNote,
      scale,
      yLabel: yLabel(scale, yLength, rootNote)
    }} />
    <PlayButton
      dispatch={dispatch}
      onPlay={partial(onPlay, [dispatch, patternId])}
      onStop={partial(onStop, [dispatch, patternId])}
      playing={playing}
    />
    <nav>
      <FullButton to={`/controllers/pattern/${patternId}/settings`}>Options</FullButton>
    </nav>
  </div>
})
