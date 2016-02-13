import {
  compose,
  curry,
  filter,
  identity,
  inc,
  map,
  partial,
  prop,
  range,
  repeat,
  T,
  transduce
} from 'ramda'
import React from 'react'
import {Subject, Observable} from 'rx'
import store from '../../store'
import {
  activePatternCellClick,
  updateActivePatternActivePosition
} from '../../actions'
import {mapIndexed, rawConnect} from '../../utils/helpers'
import Pattern from '../organisms/Pattern'
import PlayButton from '../atoms/PlayButton'
import Navigation from '../organisms/Navigation'
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
  .do(compose(
    dispatch,
    updateActivePatternActivePosition,
    prop('position')
  )
)
  .do(_ => {
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
      filter(({y}) => y === position),
      map(({x, y}) => {
        const {activePatternIndex, patterns, plugins} = store.getState()
        const {instrument, volume} = patterns[activePatternIndex]
        const id = `pattern-editor-${y}-${x}`
        const instumentObj = instrumentInstance(instrument, plugins)
        activeNotes.add({instrument: instumentObj, id})
        instumentObj.inputNoteStart({
          frequency: pitchToFrequency(pitchFromScaleIndex(
            scale.scales[scale.scaleName],
            yLength - 1 - x + scale.scales[scale.scaleName].length * octave
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

const onStop = dispatch => {
  playStopSubject.onNext()
  activeNotes.forEach(({id, instrument}) => instrument.inputNoteStop(id))
  activeNotes.clear()
  dispatch(updateActivePatternActivePosition(null))
}

const yLabel = curry(
  (scale, yLength, rootNote, i) => noteNameFromPitch(pitchFromScaleIndex(
    scale.scales[scale.scaleName],
    yLength - i - 1
  ) + rootNote)
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
      j => ({active: j === activePosition, selected: noteExists(notes, i, j)}),
      x
    ),
    emptyPatternData
  )
  const onClick = x => y => _ => dispatch(activePatternCellClick({x, y}))

  return <div>
    <Navigation />
    <Pattern
      onClick={onClick}
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
