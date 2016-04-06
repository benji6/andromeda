import {
  compose,
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
  setSongActivePosition,
  songCellClick
} from '../../actions'
import {mapIndexed} from '../../utils/helpers'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import FullButton from '../atoms/FullButton'
import PlayButton from '../atoms/PlayButton'
import Pattern from '../organisms/Pattern'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import {stepExists} from '../../reducers/patterns'
import {instrumentInstance} from '../../utils/derivedData'

const activeNotes = new Set()

let stopped = true

const onPlay = dispatch => {
  const {xLength, yLength} = store.getState().song
  let count = 0
  stopped = false

  const timeoutCallback = _ => {
    if (stopped === true) return
    const {activePatternIndex, patterns, rootNote, scale} = store.getState()
    const {steps, octave} = patterns[activePatternIndex]

    const position = count % xLength
    dispatch(setSongActivePosition(position))
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
  dispatch(setSongActivePosition(null))
}

const stopAudio = _ => {
  activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop &&
    instrumentObj.inputNoteStop(id))
  activeNotes.clear()
}

const onStop = compose(stopAudio, stopVisuals)

const cellClickHandler = curryN(
  4,
  (dispatch, y, x) => dispatch(songCellClick({x, y}))
)

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}) => ({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}))

export default connectComponent(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}) => {
  const {activePosition, steps, xLength, yLength} = store.getState().song
  const emptyPatternData = map(range(0), repeat(xLength, yLength))
  const patternData = mapIndexed(
    (x, rowIndex) => map(
      colIndex => ({active: colIndex === activePosition, selected: stepExists(colIndex, rowIndex, steps)}),
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
      yLabel: x => <ButtonPrimarySmall to='/controllers/pattern/'>
        {`Pattern ${x}`}
      </ButtonPrimarySmall>
    }} />
    <PlayButton
      onPlay={partial(onPlay, [dispatch])}
      onStop={partial(onStop, [dispatch])}
    />
    <nav>
      <FullButton to='/controllers/song/settings'>Options</FullButton>
    </nav>
  </div>
})
