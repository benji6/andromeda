import {
  forEach,
  map,
  reject,
} from 'ramda'
import {
  patternsAllPlayingStop,
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
  songActiveNotesSet,
} from '../actions'
import audioContext from '../audioContext'
import {instrumentInstance} from '../utils/derivedData'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import scales from '../constants/scales'
import patternPitchOffset from '../constants/patternPitchOffset'
import {forEachIndexed} from '../utils/helpers'

export default store => next => action => {
  switch (action.type) {
    case SONG_PLAYING_START: {
      store.dispatch(patternsAllPlayingStop())
      const {
        patterns,
        plugins,
        settings: {bpm, rootNote, selectedScale},
        song: {activeNotes},
      } = store.getState()
      const noteDuration = 60 / bpm

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

      store.dispatch(songActiveNotesSet(newActiveNotes))
      break
    }
    case SONG_PLAYING_STOP:
      forEach(
        ({id, instrumentObj}) => instrumentObj.noteStop(id),
        store.getState().song.activeNotes
      )
  }
  next(action)
}
