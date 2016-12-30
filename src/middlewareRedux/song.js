import {
  concat,
  contains,
  forEach,
  map,
  partition,
  reject,
} from 'ramda'
import {
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
  SONG_STEPS_ADD,
  SONG_STEPS_REMOVE,
  songActiveNotesSet,
} from '../actions'
import {findById, forEachIndexed} from '../utils/helpers'
import {instrumentInstance} from '../utils/derivedData'
import audioContext from '../audioContext'
import patternPitchOffset from '../constants/patternPitchOffset'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import scales from '../constants/scales'
import {
  playSample,
  stopBeatNotesWhere,
  stopBeatPattern,
  stopSynthPattern,
} from './pattern'
import sampleNames from '../constants/sampleNames'

const noteId = (step, patternStep) => `song-patternId:${step.patternId}-stepX:${step.x}-stepY:${step.y}-${patternStep.x}-${patternStep.y}`

const stopInstrumentNotes = forEach(({id, instrumentObj}) => instrumentObj.noteStop(id))

const stopPattern = (pattern, patternId) => pattern.beatPattern
  ? stopBeatPattern(patternId)
  : stopSynthPattern(patternId)

export default store => next => action => {
  switch (action.type) {
    case SONG_PLAYING_START: {
      const {
        patterns,
        plugins,
        samples,
        settings: {noteDuration, rootNote, selectedScale},
        song,
      } = store.getState()
      const {currentTime} = audioContext

      let newActiveNotes = []

      forEachIndexed(stopPattern, patterns)

      forEach(step => {
        const {patternId} = step
        const pattern = findById(patternId, patterns)
        const {
          beatPattern,
          instrument,
          steps,
          volume,
          yLength,
        } = pattern
        const time = currentTime + step.x * pattern.xLength * noteDuration

        if (beatPattern) {
          forEach(
            ({x, y}) => playSample(
              noteId(step, {x, y}),
              samples[sampleNames[y]],
              time + noteDuration * x,
              patternId,
              volume
            ),
            steps
          )
        } else {
          const instrumentObj = instrumentInstance(instrument, plugins)

          newActiveNotes = newActiveNotes.concat(reject(({id}) => {
            for (const patternStep of steps) {
              if (id.indexOf(noteId(step, patternStep)) !== -1) return true
            }
          }, song.activeNotes).concat(map(patternStep => ({
            id: noteId(step, patternStep),
            instrumentObj,
          }), steps)))

          const notes = map(({x, y}) => ({
            frequency: pitchToFrequency(pitchFromScaleIndex(
              scales[selectedScale],
              yLength - 1 - y
            ) + rootNote + patternPitchOffset),
            gain: volume,
            id: noteId(step, {x, y}),
            startTime: time + noteDuration * x,
            stopTime: time + noteDuration * (x + 1),
          }), steps)

          instrumentObj.notesStart(notes)
        }
      }, song.steps)

      store.dispatch(songActiveNotesSet(newActiveNotes))
      break
    }
    case SONG_PLAYING_STOP: {
      const {patterns, song} = store.getState()
      forEachIndexed(
        ({beatPattern}, patternId) => beatPattern && stopBeatPattern(patternId),
        patterns
      )
      stopInstrumentNotes(song.activeNotes)
      break
    }
    case SONG_STEPS_ADD: {
      const {
        patterns,
        plugins,
        settings: {noteDuration},
        samples,
        settings: {rootNote, selectedScale},
        song: {activeNotes, isPlaying, playStartTime},
      } = store.getState()
      if (!isPlaying) break
      const {patternId, x} = action.payload
      const {currentTime} = audioContext
      const pattern = findById(patternId, patterns)
      const stepEndTime = playStartTime + (x + 1) * pattern.xLength * noteDuration
      if (currentTime > stepEndTime) break

      const time = playStartTime + x * pattern.xLength * noteDuration

      if (pattern.beatPattern) {
        forEach(
          ({x, y}) => {
            const t = time + noteDuration * x
            if (currentTime > t) return
            playSample(
              noteId(action.payload, {x, y}),
              samples[sampleNames[y]],
              t,
              patternId,
              pattern.volume
            )
          },
          pattern.steps
        )
      } else {
        const instrumentObj = instrumentInstance(pattern.instrument, plugins)
        const activeNotesToAdd = map(patternStep => ({
          id: noteId(action.payload, patternStep),
          instrumentObj,
        }), pattern.steps)
        const newActiveNotes = concat(activeNotes, activeNotesToAdd)

        const notes = map(({x, y}) => ({
          frequency: pitchToFrequency(pitchFromScaleIndex(
            scales[selectedScale],
            pattern.yLength - 1 - y
          ) + rootNote + patternPitchOffset),
          gain: pattern.volume,
          id: noteId(action.payload, {x, y}),
          startTime: time + noteDuration * x,
          stopTime: time + noteDuration * (x + 1),
        }), pattern.steps)

        instrumentObj.notesStart(notes)
        store.dispatch(songActiveNotesSet(newActiveNotes))
      }
      break
    }
    case SONG_STEPS_REMOVE: {
      const {
        patterns,
        settings: {noteDuration},
        song: {activeNotes, isPlaying, playStartTime},
      } = store.getState()
      if (!isPlaying) break
      const {patternId, x} = action.payload
      const {currentTime} = audioContext
      const pattern = findById(patternId, patterns)
      const stepEndTime = playStartTime + (x + 1) * pattern.xLength * noteDuration
      if (currentTime > stepEndTime) break
      if (pattern.beatPattern) {
        const idCheck = id => contains(`-stepX:${x}-`, id) && contains(`-patternId:${patternId}-`, id)
        stopBeatNotesWhere(idCheck, patternId)
      } else {
        const idCheck = ({id}) => contains(`-stepX:${x}-`, id) && contains(`-patternId:${patternId}-`, id)
        const [notesToStop, notesToKeep] = partition(idCheck, activeNotes)
        stopInstrumentNotes(notesToStop)
        store.dispatch(songActiveNotesSet(notesToKeep))
      }
      break
    }
  }
  next(action)
}
