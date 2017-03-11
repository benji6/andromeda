import {
  findIndex,
  forEach,
  map,
  reject,
} from 'ramda'
import {
  PATTERN_SYNTH_PLAYING_START,
  PATTERN_SYNTH_PLAYING_STOP,
  PATTERN_SYNTH_STEPS_ADD,
  PATTERN_SYNTH_STEPS_REMOVE,
  SONG_PLAYING_START,
  songPlayingStop,
} from '../actions'
import {cellId as synthCellId} from '../reducers/patternsSynth'
import {instrumentInstance} from '../utils/derivedData'
import {findById} from '../utils/helpers'
import audioContext from '../audioContext'
import patternPitchOffset from '../constants/patternPitchOffset'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import scales from '../constants/scales'
import store from '../store'

// schema:
// {
//   [patternId]: time,
// }
const nextLoopEndTimes = {}
// schema:
// {
//   [patternId]: [
//     {id, instrumentObj},
//   ],
// }
const activeNotes = {}
const timeoutIds = {}

export const stopSynthPattern = ({id}) => {
  forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes[id] || [])
  delete activeNotes[id]
  clearTimeout(timeoutIds[id])
  delete timeoutIds[id]
}

const stopSynthPatternWithId = id => stopSynthPattern(findById(id, store.getState().patternsSynth))

export default store => next => action => {
  switch (action.type) {
    case PATTERN_SYNTH_STEPS_ADD: {
      const {patternId, x, y} = action.payload
      const {patternsSynth, plugins, settings: {noteDuration, rootNote, selectedScale}} = store.getState()
      const {
        instrument,
        playing,
        stepVelocity,
        xLength,
        yLength,
      } = findById(patternId, patternsSynth)
      if (!playing) break
      const instrumentObj = instrumentInstance(instrument, plugins)
      const id = synthCellId(patternId, x, y)
      const note = {
        frequency: pitchToFrequency(pitchFromScaleIndex(
          scales[selectedScale],
          yLength - 1 - y
        ) + rootNote + patternPitchOffset),
        gain: stepVelocity,
        id,
        startTime: nextLoopEndTimes[patternId] + noteDuration * (x - xLength),
        stopTime: nextLoopEndTimes[patternId] + noteDuration * (x - xLength + 1),
      }
      instrumentObj.noteStart(note)
      activeNotes[patternId].push({id: synthCellId(patternId, x, y), instrumentObj})
      break
    }
    case PATTERN_SYNTH_STEPS_REMOVE: {
      const {patternId, x, y} = action.payload
      const {patternsSynth} = store.getState()
      const {playing} = findById(patternId, patternsSynth)
      if (!playing) break
      const activeNoteIndex = findIndex(
        ({id}) => id.includes(synthCellId(patternId, x, y)),
        activeNotes[patternId]
      )
      const {id, instrumentObj} = activeNotes[patternId].splice(activeNoteIndex, 1)[0]
      instrumentObj.noteStop(id)
      break
    }
    case PATTERN_SYNTH_PLAYING_START: {
      store.dispatch(songPlayingStop())
      setTimeout(() => {
        const {currentTime, patternId} = action.payload
        nextLoopEndTimes[patternId] = currentTime
        const audioLoop = (i = 0) => {
          const {
            patternsSynth,
            plugins,
            settings: {noteDuration, rootNote, selectedScale},
          } = store.getState()
          const {
            instrument,
            steps,
            xLength,
            yLength,
          } = findById(patternId, patternsSynth)
          const instrumentObj = instrumentInstance(instrument, plugins)
          const patternDuration = xLength * noteDuration
          const currentLoopEndTime = nextLoopEndTimes[patternId]
          const newLoopEndTime = currentLoopEndTime + patternDuration

          nextLoopEndTimes[patternId] = newLoopEndTime

          timeoutIds[patternId] = setTimeout(
            () => audioLoop(i + 1),
            (newLoopEndTime - audioContext.currentTime - 0.1) * 1000
          )

          activeNotes[patternId] = reject(({id}) => {
            for (const {x, y} of steps) {
              if (id.includes(synthCellId(patternId, x, y))) return true
            }
          }, activeNotes[patternId] || []).concat(map(({x, y}) => ({
            id: `pattern-${patternId}-${x}-${y}-${i}`,
            instrumentObj,
          }), steps))

          const notes = map(({velocity, x, y}) => ({
            frequency: pitchToFrequency(pitchFromScaleIndex(
              scales[selectedScale],
              yLength - 1 - y
            ) + rootNote + patternPitchOffset),
            gain: velocity,
            id: `pattern-${patternId}-${x}-${y}-${i}`,
            startTime: currentLoopEndTime + noteDuration * x,
            stopTime: currentLoopEndTime + noteDuration * (x + 1),
          }), steps)
          instrumentObj.notesStart(notes)
          i++
        }

        audioLoop()
      })
      break
    }
    case PATTERN_SYNTH_PLAYING_STOP: {
      stopSynthPatternWithId(action.payload)
      break
    }
    case SONG_PLAYING_START: {
      activeNotes[action.payload] = []
      break
    }
  }
  next(action)
}
