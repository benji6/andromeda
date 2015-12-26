import { compose, curry, filter, identity, map, partial, prop, range, repeat, transduce } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import {Subject, Observable} from 'rx'
import store from '../../store'
import { activePatternCellClick, addAudioGraphSource, removeKeysFromAudioGraphContaining, updateActivePatternActivePosition } from '../../actions'
import { mapIndexed } from '../../tools/indexedIterators'
import Pattern from '../organisms/Pattern'
import PlayButton from '../atoms/PlayButton'
import Navigation from '../organisms/Navigation'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import PatternMenu from '../organisms/PatternMenu'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import { noteExists } from '../../reducers/patterns'
let lastPosition
const playStopSubject = new Subject()

const onPlay = dispatch => Observable
    .generateWithRelativeTime(0,
      () => true,
      x => x + 1,
      x => x,
      () => 60000 / store.getState().bpm)
    .takeUntil(playStopSubject)
    .map(count => {
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
    })
    .do(compose(
      dispatch,
      updateActivePatternActivePosition,
      prop('position')
    ))
    .do(compose(
      dispatch,
      removeKeysFromAudioGraphContaining,
      _ => `pattern-editor-${lastPosition}`)
    )
    .do(({position}) => lastPosition = position)
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
            const {instrument, volume} = store.getState().patterns[store.getState().activePatternIndex]
            return {
              id: `pattern-editor-${y}-${x}`,
              instrument,
              params: {
                gain: volume,
                frequency: pitchToFrequency(pitchFromScaleIndex(
                  scale.scales[scale.scaleName],
                  yLength - 1 - x + scale.scales[scale.scaleName].length * octave
                ) + rootNote)
              }
            }
          }),
          map(compose(dispatch, addAudioGraphSource))
        ),
        () => {
        },
        null,
        notes
    ), ::console.error)

const onStop = dispatch => {
  playStopSubject.onNext()
  dispatch(removeKeysFromAudioGraphContaining('pattern-editor'))
  dispatch(updateActivePatternActivePosition(null))
}

const yLabel = curry((scale, yLength, rootNote, i) => noteNameFromPitch(pitchFromScaleIndex(scale.scales[scale.scaleName],
      yLength - i - 1) + rootNote))

export default connect(identity)(({activePatternIndex, dispatch, instrument, patterns, rootNote, scale}) => {
  const activePattern = patterns[activePatternIndex]
  const {activePosition, notes, xLength, yLength} = activePattern
  const emptyPatternData = map(range(0), repeat(xLength, yLength))
  const patternData = mapIndexed((x, i) => map(j => ({active: j === activePosition,
      selected: noteExists(notes, i, j)}),
      x),
    emptyPatternData)
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
