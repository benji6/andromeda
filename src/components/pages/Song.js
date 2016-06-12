import {forEach, map, reject} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import audioContext from '../../audioContext'
import {
  addNewPattern,
  deletePattern,
  songActiveNotesSet,
  songPlayingStart,
  songPlayingStop,
} from '../../actions'
import ButtonPlay from '../atoms/ButtonPlay'
import ButtonPrimarySmall from '../atoms/ButtonPrimarySmall'
import ButtonPrimary from '../atoms/ButtonPrimary'
import {Cross, Plus} from '../atoms/ButtonIcons'
import {mapIndexed} from '../../utils/helpers'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../../audioHelpers/pitchFromScaleIndex'
import scales from '../../constants/scales'
import patternPitchOffset from '../../constants/patternPitchOffset'
import {instrumentInstance} from '../../utils/derivedData'
import {forEachIndexed} from '../../utils/helpers'
import PatternSvg from '../organisms/PatternSvg'

const connectComponent = connect(({
  activePatternIndex,
  dispatch,
  instrument,
  patterns,
  plugins,
  settings: {bpm, rootNote, selectedScale},
  song: {activeNotes, playing},
}) => ({
  activeNotes,
  activePatternIndex,
  bpm,
  dispatch,
  instrument,
  patterns,
  playing,
  plugins,
  rootNote,
  selectedScale,
}))

export default connectComponent(({
  activeNotes,
  bpm,
  dispatch,
  patterns,
  playing,
  plugins,
  rootNote,
  selectedScale,
}) =>
  <div>
    {patterns.length
      ? mapIndexed((_, i) =>
        <div className='Song__Pattern' key={i}>
          <Cross onClick={comp(dispatch, deletePattern, K(i))} />
          <ButtonPrimarySmall to={`/controllers/pattern/${i}`}>
            {`Pattern ${i}`}
          </ButtonPrimarySmall>
          <PatternSvg {...patterns[i]} to={`/controllers/pattern/${i}`} />
        </div>, patterns)
      : null}
    <div className='text-center padding-1'>
      <Plus onClick={comp(dispatch, addNewPattern)}>New pattern</Plus>
    </div>
    <ButtonPlay {...{
      onPlay: () => {
        const noteDuration = 60 / bpm

        dispatch(songPlayingStart())

        let newActiveNotes = []

        forEachIndexed(
          ({instrument, steps, volume, xLength, yLength}, patternId) => {
            const {currentTime} = audioContext
            const instrumentObj = instrumentInstance(instrument, plugins)

            newActiveNotes = newActiveNotes.concat(reject(({id}) => {
                for (const {x, y} of steps) {
                  if (id.indexOf(`pattern-${patternId}-${x}-${y}`) !== -1) {
                    return true
                  }
                }
              }, activeNotes).concat(map(({x, y}) => ({
                id: `song-${patternId}-${x}-${y}`,
                instrumentObj,
              }), steps)))

            const notes = map(({x, y}) => ({
              frequency: pitchToFrequency(pitchFromScaleIndex(
                scales[selectedScale],
                yLength - 1 - y
              ) + rootNote + patternPitchOffset),
              gain: volume,
              id: `song-${patternId}-${x}-${y}`,
              startTime: currentTime + noteDuration * x,
              stopTime: currentTime + noteDuration * (x + 1),
            }), steps)

            instrumentObj.notesStart(notes)
          },
          patterns
        )

        dispatch(songActiveNotesSet(newActiveNotes))
      },
      onStop: () => {
        forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes)
        dispatch(songPlayingStop())
      },
      playing,
    }}/>
    <nav>
      <ButtonPrimary to='/controllers/song/settings'>Options</ButtonPrimary>
    </nav>
  </div>
)
