import {
  forEach,
  map,
  reject,
} from 'ramda'
import {
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
  songActiveNotesSet,
} from '../actions'
import {cellId} from '../reducers/patterns'
import {forEachIndexed} from '../utils/helpers'
import {instrumentInstance} from '../utils/derivedData'
import audioContext from '../audioContext'
import patternPitchOffset from '../constants/patternPitchOffset'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import scales from '../constants/scales'
import {
  stopBeatPattern,
  stopSynthPattern,
} from './pattern'

export default store => next => action => {
  switch (action.type) {
    case SONG_PLAYING_START: {
      const {
        patterns,
        plugins,
        settings: {noteDuration, rootNote, selectedScale},
        song,
      } = store.getState()

      let newActiveNotes = []

      forEachIndexed(
        ({
          beatPattern,
          instrument,
          steps,
          volume,
          xLength,
          yLength,
        }, patternId) => {
          if (beatPattern) {
            stopBeatPattern(patternId)
          } else {
            stopSynthPattern(patternId)
            const {currentTime} = audioContext
            const instrumentObj = instrumentInstance(instrument, plugins)

            newActiveNotes = newActiveNotes.concat(reject(({id}) => {
                for (const {x, y} of steps) {
                  if (id.indexOf(cellId(patternId, x, y)) !== -1) {
                    return true
                  }
                }
              }, song.activeNotes).concat(map(({x, y}) => ({
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
          }
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
