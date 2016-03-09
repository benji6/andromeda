import {
  compose,
  curry,
  flip,
  identity,
  inc,
  lensProp,
  map,
  modulo,
  over,
  partial,
  range,
  repeat,
  T,
  tap,
  transduce
} from 'ramda'
import React from 'react'
import {Observable, Subject} from 'rx'
import store from '../../store'
import {
  activePatternCellClick,
  updateActivePatternActivePosition
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
import audioContext from '../../audioContext'

const playStopSubject = new Subject()
const activeNotes = new Set()

let timeoutId = null
const overX = over(lensProp('x'))

const onPlay = dispatch => {
  const {
    activePatternIndex,
    bpm,
    patterns,
    plugins,
    rootNote,
    scale
  } = store.getState()
  const {
    instrument,
    notes,
    octave,
    volume,
    xLength,
    yLength
  } = patterns[activePatternIndex]
  const dispatchUpdateActivePatternActivePosition = compose(
    dispatch,
    updateActivePatternActivePosition
  )

  dispatchUpdateActivePatternActivePosition(0)

  map(
    flip(modulo)(xLength),
    Observable.generateWithRelativeTime(1, T, inc, identity, _ => 60000 / bpm)
  )
    .takeUntil(playStopSubject)
    .subscribe(dispatchUpdateActivePatternActivePosition)
  const {currentTime} = audioContext
  const noteLength = 60 / bpm
  const note = ({x, y}) => ({
    frequency: pitchToFrequency(pitchFromScaleIndex(
      scale.scales[scale.scaleName],
      yLength - 1 - y + scale.scales[scale.scaleName].length * octave
    ) + rootNote),
    gain: volume,
    id: `pattern-editor-${y}-${x}`,
    startTime: noteLength * x + currentTime,
    stopTime: noteLength * (x + 1) + currentTime
  })

  const instrumentObj = instrumentInstance(instrument, plugins)

  const createTransducer = i => compose(
    map(overX(a => a + xLength * i)),
    map(note),
    map(tap(({id}) => activeNotes.add({instrumentObj, id}))),
    map(instrumentObj.inputNoteStart.bind(instrumentObj))
  )

  let i = 0

  const schedule = _ => transduce(createTransducer(i++), _ => null, null, notes)
  const repeatSchedule = _ => {
    schedule()
    timeoutId = setTimeout(repeatSchedule, 1000 * xLength * noteLength)
  }
  schedule()
  timeoutId = setTimeout(repeatSchedule, 1000 * (xLength - 0.5) * noteLength)
}

const onStop = dispatch => {
  clearTimeout(timeoutId)
  playStopSubject.onNext()
  activeNotes.forEach(({id, instrumentObj}) => instrumentObj.inputNoteStop(id))
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
      j => ({active: i === activePosition, selected: noteExists(notes, i, j)}),
      x
    ),
    emptyPatternData
  )
  const onClick = y => x => _ => dispatch(activePatternCellClick({x, y}))

  return <div>
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
