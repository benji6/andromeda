import {
  forEach,
  map,
  reject,
} from 'ramda'
import {
  PATTERN_PLAYING_START,
  PATTERN_PLAYING_STOP,
  patternActiveNotesSet,
  setPatternNextLoopEndTime,
} from '../actions'
import audioContext from '../audioContext'
import {instrumentInstance} from '../utils/derivedData'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import scales from '../constants/scales'
import patternPitchOffset from '../constants/patternPitchOffset'

const timeoutIds = {}

export default store => next => action => {
  switch (action.type) {
    case PATTERN_PLAYING_START: {
      setTimeout(() => {
        const {currentTime, patternId} = action.payload
        store.dispatch(setPatternNextLoopEndTime({patternId, value: currentTime}))
        const audioLoop = (i = 0) => {
          const state = store.getState()
          const {patterns, plugins, settings: {bpm, rootNote, selectedScale}} = state
          const {
            activeNotes,
            instrument,
            nextLoopEndTime,
            steps,
            volume,
            xLength,
            yLength,
          } = patterns[patternId]
          const instrumentObj = instrumentInstance(instrument, plugins)
          const noteDuration = 60 / bpm
          const patternDuration = xLength * noteDuration
          const currentLoopEndTime = nextLoopEndTime
          const newLoopEndTime = nextLoopEndTime + patternDuration

          store.dispatch(setPatternNextLoopEndTime({
            patternId,
            value: newLoopEndTime,
          }))

          timeoutIds[patternId] = setTimeout(
            _ => audioLoop(i + 1),
            (newLoopEndTime - audioContext.currentTime - 0.1) * 1000
          )

          store.dispatch(patternActiveNotesSet({
            patternId,
            value: reject(({id}) => {
              for (const {x, y} of steps) {
                if (id.indexOf(`pattern-${patternId}-${x}-${y}`) !== -1) return true
              }
            }, activeNotes).concat(map(({x, y}) => ({
              id: `pattern-${patternId}-${x}-${y}-${i}`,
              instrumentObj,
            }), steps))}))

          const notes = map(({x, y}) => ({
            frequency: pitchToFrequency(pitchFromScaleIndex(
              scales[selectedScale],
              yLength - 1 - y + scales[selectedScale].length
            ) + rootNote + patternPitchOffset),
            gain: volume,
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
    case PATTERN_PLAYING_STOP: {
      const {animationFrameRequest, activeNotes, patternId} = action.payload
      forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes)
      clearTimeout(timeoutIds[patternId])
      delete timeoutIds[patternId]
      cancelAnimationFrame(animationFrameRequest)
    }
  }
  next(action)
}
