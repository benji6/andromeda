import {
  find,
  filter,
  forEach,
  lensProp,
  over,
  without,
} from 'ramda'
import {
  PATTERN_BEAT_PLAYING_START,
  PATTERN_BEAT_PLAYING_STOP,
  PATTERN_BEAT_STEPS_ADD,
  PATTERN_BEAT_STEPS_REMOVE,
  songPlayingStop,
} from '../actions'
import {cellId as beatCellId} from '../reducers/patternsBeat'
import {findById} from '../utils/helpers'
import audioContext from '../audioContext'
import sampleNames from '../constants/sampleNames'

// schema:
// {
//   [patternId]: time,
// }
const nextLoopEndTimes = {}
// schema:
// {
//   [patternId]: [
//     {id, sourceNode},
//   ],
// }
let sourceNodes = {}
const timeoutIds = {}

const stopBeatNote = ({sourceNode}) => {
  sourceNode.stop()
  sourceNode.disconnect()
}

export const stopBeatNotesWhere = (f, patternId) => {
  const sources = sourceNodes[patternId] || []
  const notes = filter(({id}) => f(id), sources)
  forEach(stopBeatNote, notes)
  sourceNodes[patternId] = without(notes, sources)
}

export const stopBeatPattern = patternId => {
  const sources = sourceNodes[patternId]
  if (sources) {
    forEach(stopBeatNote, sources)
    sourceNodes[patternId] = []
  }
  clearTimeout(timeoutIds[patternId])
  delete timeoutIds[patternId]
}

export const playSample = (id, buffer, startTime, patternId, gain) => {
  const gainNode = audioContext.createGain()
  const sourceNode = audioContext.createBufferSource()
  const stopTime = startTime + buffer.duration + 0.1
  const overPatternId = over(lensProp(patternId))

  gainNode.gain.value = gain
  sourceNode.buffer = buffer
  sourceNode.connect(gainNode).connect(audioContext.destination)
  sourceNode.start(startTime)
  sourceNode.stop(stopTime)

  const data = {id, sourceNode}

  sourceNodes = overPatternId(
    sources => sources ? (sources.push(data), sources) : [data],
    sourceNodes
  )

  setTimeout(
    () => {
      gainNode.disconnect()
      sourceNodes = overPatternId(
        sources => without([data], sources),
        sourceNodes
      )
    },
    (stopTime - audioContext.currentTime) * 1000
  )
}

export default store => next => action => {
  switch (action.type) {
    case PATTERN_BEAT_STEPS_ADD: {
      const {patternId, x, y} = action.payload
      const {
        patternsBeat,
        samples,
        settings: {noteDuration},
      } = store.getState()
      const {
        playing,
        stepVelocity,
        xLength,
      } = findById(patternId, patternsBeat)
      if (!playing) break
      const patternDuration = xLength * noteDuration
      const id = beatCellId(patternId, x, y)
      playSample(
        id,
        samples[sampleNames[y]],
        nextLoopEndTimes[patternId] - patternDuration + noteDuration * x,
        patternId,
        stepVelocity
      )
      break
    }
    case PATTERN_BEAT_STEPS_REMOVE: {
      const {patternId, x, y} = action.payload
      const {patternsBeat} = store.getState()
      const {playing} = findById(patternId, patternsBeat)
      if (!playing) break
      const id = beatCellId(patternId, x, y)
      const sources = sourceNodes[patternId]
      const entry = find(a => a.id === id, sources)
      if (entry) {
        const {sourceNode} = entry
        sourceNodes[patternId] = without([entry], sources)
        sourceNode.stop()
        sourceNode.disconnect()
      }
      break
    }
    case PATTERN_BEAT_PLAYING_START: {
      store.dispatch(songPlayingStop())
      setTimeout(() => {
        const {currentTime, patternId} = action.payload
        nextLoopEndTimes[patternId] = currentTime

        const audioLoop = (i = 0) => {
          const {
            patternsBeat,
            samples,
            settings: {noteDuration},
          } = store.getState()
          const {
            steps,
            xLength,
          } = findById(patternId, patternsBeat)
          const patternDuration = xLength * noteDuration
          const currentLoopEndTime = nextLoopEndTimes[patternId]
          const newLoopEndTime = currentLoopEndTime + patternDuration

          nextLoopEndTimes[patternId] = newLoopEndTime

          timeoutIds[patternId] = setTimeout(
            () => audioLoop(i + 1),
            (newLoopEndTime - audioContext.currentTime - 0.1) * 1000
          )

          forEach(
            ({velocity, x, y}) => playSample(
              beatCellId(patternId, x, y),
              samples[sampleNames[y]],
              currentLoopEndTime + noteDuration * x,
              patternId,
              velocity
            ),
            steps
          )
        }

        audioLoop()
      })
      break
    }
    case PATTERN_BEAT_PLAYING_STOP:
      stopBeatPattern(action.payload)
      break
  }
  next(action)
}
