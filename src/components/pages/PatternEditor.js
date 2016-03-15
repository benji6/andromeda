import {
  compose,
  curry,
  curryN,
  filter,
  identity,
  inc,
  map,
  partial,
  range,
  repeat,
  T,
  transduce
} from 'ramda'
import React from 'react'
import {Observable, Subject} from 'rx'
import store from '../../store'
import {
  activePatternCellClick,
  setActivePatternActivePosition
} from '../../actions'
import {mapIndexed, rawConnect} from '../../utils/helpers'
import Pattern from '../organisms/Pattern'
import PlayButton from '../atoms/PlayButton'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import PatternMenu from '../organisms/PatternMenu'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import {noteExists} from '../../reducers/patterns'
import {instrumentInstance} from '../../utils/derivedData'

const playStopSubject = new Subject()
const activeNotes = new Set()

const onPlay = dispatch => map(
  count => {
    const {activePatternIndex, patterns, rootNote, scale} = store.getState()
    const {notes, octave, xLength, yLength} = patterns[activePatternIndex]
    return {
      notes,
      octave,
      position: count % xLength,
      rootNote,
      scale,
      yLength
    }
  },
  Observable.generateWithRelativeTime(
    0,
    T,
    inc,
    identity,
    _ => 60000 / store.getState().bpm
  )
  .takeUntil(playStopSubject))
  .do(({position}) => {
    dispatch(setActivePatternActivePosition(position))
    activeNotes.forEach(({id, instrument}) => instrument.inputNoteStop(id))
    activeNotes.clear()
  })
  .subscribe(({
    notes,
    octave,
    position,
    rootNote,
    scale,
    yLength
  }) => transduce(
    compose(
      filter(({x}) => x === position),
      map(({x, y}) => {
        const {activePatternIndex, patterns, plugins} = store.getState()
        const {instrument, volume} = patterns[activePatternIndex]
        const id = `pattern-editor-${x}-${y}`
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
      })
    ),
    _ => null,
    null,
    notes
  ), ::console.error)

const stopVisuals = dispatch => {
  playStopSubject.onNext()
  dispatch(setActivePatternActivePosition(null))
}

const stopAudio = _ => {
  activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop(id))
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

export default rawConnect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  rootNote,
  scale
}) => {
  const activePattern = patterns[activePatternIndex]
  const {activePosition, notes, xLength, yLength} = activePattern
  const emptyPatternData = map(range(0), repeat(xLength, yLength))
  const patternData = mapIndexed(
    (x, i) => map(
      j => ({active: i === activePosition, selected: noteExists(notes, i, j)}),
      x
    ),
    emptyPatternData
  )

  return <div>
    <Pattern
      onClick={cellClickHandler(dispatch)}
      patternData={patternData}
      rootNote={rootNote}
      scale={scale}
      yLabel={yLabel(scale, yLength, rootNote)}
    />
    <PlayButton
      onPlay={partial(onPlay, [dispatch])}
      onStop={partial(onStop, [dispatch])}
    />
    <PatternMenu
      dispatch={dispatch}
      instrument={instrument}
      pattern={activePattern}
    />
  </div>
})
