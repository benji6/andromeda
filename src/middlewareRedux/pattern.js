import {
  forEach,
  lensProp,
  map,
  over,
  reject,
} from 'ramda'
import {
  PATTERN_BEAT_PLAYING_START,
  PATTERN_BEAT_PLAYING_STOP,
  PATTERN_SYNTH_PLAYING_START,
  PATTERN_SYNTH_PLAYING_STOP,
  patternActiveNotesSet,
  patternNextLoopEndTimeSet,
  PATTERNS_ALL_PLAYING_STOP,
} from '../actions'
import audioContext from '../audioContext'
import {instrumentInstance} from '../utils/derivedData'
import {forEachIndexed} from '../utils/helpers'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import scales from '../constants/scales'
import patternPitchOffset from '../constants/patternPitchOffset'
import sampleNames from '../constants/sampleNames'

let sourceNodes = {}
const timeoutIds = {}

const stopSynthPattern = ({activeNotes}, patternId) => {
  forEach(({id, instrumentObj}) => instrumentObj.noteStop(id), activeNotes)
  clearTimeout(timeoutIds[patternId])
  delete timeoutIds[patternId]
}

const sampleGain = audioContext.createGain()
sampleGain.gain.value = 0.5
sampleGain.connect(audioContext.destination)

const playSample = (buffer, startTime, patternId) => {
  const source = audioContext.createBufferSource()
  const stopTime = startTime + buffer.duration + 0.1
  const overPatternId = over(lensProp(patternId))

  source.buffer = buffer
  source.connect(sampleGain)
  source.start(startTime)
  source.stop(stopTime)

  sourceNodes = overPatternId(
    sources => sources ? sources.add(source) : new Set([source]),
    sourceNodes
  )

  window.setTimeout(
    () => {
      source.disconnect()
      sourceNodes = overPatternId(
        sources => (sources.delete(source), sources),
        sourceNodes
      )
    },
    (stopTime - audioContext.currentTime) * 1000
  )
}

export default store => next => action => {
  switch (action.type) {
    case PATTERN_BEAT_PLAYING_START: {
      setTimeout(() => {
        const {currentTime, patternId} = action.payload

        store.dispatch(patternNextLoopEndTimeSet({patternId, value: currentTime}))

        const audioLoop = (i = 0) => {
          const {
            patterns,
            samples,
            settings: {noteDuration},
          } = store.getState()
          const {
            nextLoopEndTime,
            steps,
            xLength,
          } = patterns[patternId]
          const patternDuration = xLength * noteDuration
          const currentLoopEndTime = nextLoopEndTime
          const newLoopEndTime = nextLoopEndTime + patternDuration

          store.dispatch(patternNextLoopEndTimeSet({patternId, value: newLoopEndTime}))

          timeoutIds[patternId] = setTimeout(
            () => audioLoop(i + 1),
            (newLoopEndTime - audioContext.currentTime - 0.1) * 1000
          )

          forEach(
            ({x, y}) => playSample(
              samples[sampleNames[y]],
              currentLoopEndTime + noteDuration * x,
              patternId
            ),
            steps
          )
        }

        audioLoop()
      })
      break
    }
    case PATTERN_BEAT_PLAYING_STOP: {
      const patternId = action.payload
      forEach(key => {
        const sources = sourceNodes[key]
        forEach(sourceNode => {
          sourceNode.stop()
          sourceNode.disconnect()
        }, sources)
        sources.clear()
      }, Object.keys(sourceNodes))
      clearTimeout(timeoutIds[patternId])
      delete timeoutIds[patternId]
      break
    }
    case PATTERN_SYNTH_PLAYING_START: {
      setTimeout(() => {
        const {currentTime, patternId} = action.payload
        store.dispatch(patternNextLoopEndTimeSet({patternId, value: currentTime}))
        const audioLoop = (i = 0) => {
          const {
            patterns,
            plugins,
            settings: {noteDuration, rootNote, selectedScale},
          } = store.getState()
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
          i++
        }

        audioLoop()
      })
      break
    }
    case PATTERN_SYNTH_PLAYING_STOP: {
      const patternId = action.payload
      stopSynthPattern(store.getState().patterns[patternId], patternId)
      break
    }
    case PATTERNS_ALL_PLAYING_STOP:
      forEachIndexed(stopSynthPattern, store.getState().patterns)
  }
  next(action)
}
