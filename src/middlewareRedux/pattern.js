import {
  find,
  forEach,
  lensProp,
  map,
  none,
  over,
  reject,
} from 'ramda'
import {
  PATTERN_BEAT_CELL_CLICK,
  PATTERN_BEAT_PLAYING_START,
  PATTERN_BEAT_PLAYING_STOP,
  PATTERN_SYNTH_CELL_CLICK,
  PATTERN_SYNTH_PLAYING_START,
  PATTERN_SYNTH_PLAYING_STOP,
  patternActiveNotesSet,
  patternNextLoopEndTimeSet,
  SONG_PLAYING_START,
} from '../actions'
import {cellId} from '../reducers/patterns'
import {forEachIndexed} from '../utils/helpers'
import {instrumentInstance} from '../utils/derivedData'
import audioContext from '../audioContext'
import patternPitchOffset from '../constants/patternPitchOffset'
import pitchFromScaleIndex from '../audioHelpers/pitchFromScaleIndex'
import pitchToFrequency from '../audioHelpers/pitchToFrequency'
import sampleNames from '../constants/sampleNames'
import scales from '../constants/scales'

// schema:
// {
//   [patternId]: new Set([
//     {id, sourceNode},
//   ]),
// }
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

const playSample = (id, buffer, startTime, patternId) => {
  const sourceNode = audioContext.createBufferSource()
  const stopTime = startTime + buffer.duration + 0.1
  const overPatternId = over(lensProp(patternId))

  sourceNode.buffer = buffer
  sourceNode.connect(sampleGain)
  sourceNode.start(startTime)
  sourceNode.stop(stopTime)

  const data = {id, sourceNode}

  sourceNodes = overPatternId(
    sources => sources ? sources.add(data) : new Set([data]),
    sourceNodes
  )

  window.setTimeout(
    () => {
      sourceNode.disconnect()
      sourceNodes = overPatternId(
        sources => (sources.delete(data), sources),
        sourceNodes
      )
    },
    (stopTime - audioContext.currentTime) * 1000
  )
}

export default store => next => action => {
  switch (action.type) {
    case PATTERN_BEAT_CELL_CLICK: {
      const {patternId, x, y} = action.payload
      const {
        patterns,
        samples,
        settings: {noteDuration},
      } = store.getState()
      const {
        nextLoopEndTime,
        playing,
        xLength,
        steps,
      } = patterns[patternId]
      if (!playing) break
      const patternDuration = xLength * noteDuration
      const isAddedNote = none(note => note.x === x && note.y === y, steps)
      const id = cellId(patternId, x, y)
      if (isAddedNote) {
        playSample(
          id,
          samples[sampleNames[y]],
          nextLoopEndTime - patternDuration + noteDuration * x,
          patternId
        )
      } else {
        const set = sourceNodes[patternId]
        const entry = find(a => a.id === id, [...set])

        if (entry) {
          const {sourceNode} = entry
          set.delete(entry)
          sourceNode.stop()
          sourceNode.disconnect()
        }
      }
      break
    }
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
              cellId(patternId, x, y),
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
        forEach(({sourceNode}) => {
          sourceNode.stop()
          sourceNode.disconnect()
        }, sources)
        sources.clear()
      }, Object.keys(sourceNodes))
      clearTimeout(timeoutIds[patternId])
      delete timeoutIds[patternId]
      break
    }
    case PATTERN_SYNTH_CELL_CLICK: {
      const {patternId, x, y} = action.payload
      const {patterns, plugins, settings: {noteDuration, rootNote, selectedScale}} = store.getState()
      const {
        activeNotes,
        instrument,
        nextLoopEndTime,
        playing,
        steps,
        volume,
        xLength,
        yLength,
      } = patterns[patternId]
      if (!playing) break
      const isAddedNote = none(note => note.x === x && note.y === y, steps)
      if (isAddedNote) {
        const instrumentObj = instrumentInstance(instrument, plugins)
        const id = cellId(patternId, x, y)
        const note = {
          frequency: pitchToFrequency(pitchFromScaleIndex(
            scales[selectedScale],
            yLength - 1 - y
          ) + rootNote + patternPitchOffset),
          gain: volume,
          id,
          startTime: nextLoopEndTime + noteDuration * (x - xLength),
          stopTime: nextLoopEndTime + noteDuration * (x - xLength + 1),
        }
        instrumentObj.noteStart(note)
      } else {
        const {id, instrumentObj} = find(
          ({id}) => id.includes(cellId(patternId, x, y)),
          activeNotes
        )
        instrumentObj.noteStop(id)
      }
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
                if (id.includes(cellId(patternId, x, y))) return true
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
    case SONG_PLAYING_START:
      forEachIndexed(stopSynthPattern, store.getState().patterns)
  }
  next(action)
}
