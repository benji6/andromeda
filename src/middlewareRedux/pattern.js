import {
  forEach,
  map,
  reject,
} from 'ramda'
import {
  PATTERN_PLAYING_START,
  PATTERN_PLAYING_STOP,
  PATTERNS_ALL_PLAYING_STOP,
  patternActiveNotesSet,
  patternNextLoopEndTimeSet,
} from '../actions'
import audioContext from '../audioContext'
import {instrumentInstance} from '../utils/derivedData'
import {forEachIndexed} from '../utils/helpers'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import scales from '../constants/scales'
import patternPitchOffset from '../constants/patternPitchOffset'
import sampleNames from '../constants/sampleNames'

const timeoutIds = {}

const stopPattern = ({activeNotes}, patternId) => {
  forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes)
  clearTimeout(timeoutIds[patternId])
  delete timeoutIds[patternId]
}

const sampleGain = audioContext.createGain()
sampleGain.gain.value = 0.5
sampleGain.connect(audioContext.destination)

const playSample = (buffer, startTime) => {
  const source = audioContext.createBufferSource()
  const stopTime = startTime + buffer.duration + 0.1

  source.buffer = buffer
  source.connect(sampleGain)
  source.start(startTime)
  source.stop(stopTime)

  window.setTimeout(
    () => source.disconnect(),
    (stopTime - audioContext.currentTime) * 1000
  )
}

export default store => next => action => {
  switch (action.type) {
    case PATTERN_PLAYING_START: {
      setTimeout(() => {
        const {currentTime, patternId} = action.payload
        store.dispatch(patternNextLoopEndTimeSet({patternId, value: currentTime}))
        const audioLoop = (i = 0) => {
          const state = store.getState()
          const {
            patterns,
            plugins,
            samples,
            settings: {bpm, rootNote, selectedScale}
          } = state
          const {
            activeNotes,
            beatPattern,
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

          store.dispatch(patternNextLoopEndTimeSet({
            patternId,
            value: newLoopEndTime,
          }))

          timeoutIds[patternId] = setTimeout(
            () => audioLoop(i + 1),
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

          if (beatPattern) {
            forEach(
              ({x, y}) => playSample(
                samples[sampleNames[y]],
                currentLoopEndTime + noteDuration * x
              ),
              steps
            )
            return
          } else {
            const notes = map(({x, y}) => ({
              frequency: pitchToFrequency(pitchFromScaleIndex(
                scales[selectedScale],
                yLength - 1 - y
              ) + rootNote + patternPitchOffset),
              gain: volume,
              id: `pattern-${patternId}-${x}-${y}-${i}`,
              startTime: currentLoopEndTime + noteDuration * x,
              stopTime: currentLoopEndTime + noteDuration * (x + 1),
            }), steps)
            instrumentObj.notesStart(notes)
          }
          i++
        }

        audioLoop()
      })
      break
    }
    case PATTERN_PLAYING_STOP: {
      const patternId = action.payload
      stopPattern(store.getState().patterns[patternId], patternId)
      break
    }
    case PATTERNS_ALL_PLAYING_STOP:
      forEachIndexed(stopPattern, store.getState().patterns)
  }
  next(action)
}
