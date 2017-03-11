import {
  concat,
  contains,
  forEach,
  map,
  partition,
  reject,
} from 'ramda'
import {
  PATTERN_BEAT_DELETE,
  PATTERN_BEAT_STEPS_ADD,
  PATTERN_BEAT_STEPS_REMOVE,
  PATTERN_SYNTH_DELETE,
  PATTERN_SYNTH_STEPS_ADD,
  PATTERN_SYNTH_STEPS_REMOVE,
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
  SONG_STEPS_ADD,
  SONG_STEPS_REMOVE,
} from '../actions'
import {findById} from '../utils/helpers'
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
} from './patternsBeat'
import {stopSynthPattern} from './patternsSynth'
import sampleNames from '../constants/sampleNames'
import {patternXLength} from '../constants/misc'

// schema:
// [
//   {id, instrumentObj},
// ]
let activeNotes = []
let songLoopCount = 0

const noteId = (songStep, patternStep, i) => `song-patternId:${songStep.patternId}-songStepX:${songStep.x}-songStepY:${songStep.y}-patternStepX:${patternStep.x}-patternStepY:${patternStep.y}-i:${i}`

const stopInstrumentNotes = forEach(({id, instrumentObj}) => instrumentObj.noteStop(id))

let timeoutId

export default store => next => action => {
  switch (action.type) {
    case PATTERN_BEAT_STEPS_ADD: {
      const {
        patternsBeat,
        settings: {noteDuration},
        samples,
        song: {isPlaying, playStartTime, xLength, steps},
      } = store.getState()
      if (!isPlaying) break
      const {patternId, x, y} = action.payload
      const {currentTime} = audioContext
      const pattern = findById(patternId, patternsBeat)
      const songDuration = xLength * patternXLength * noteDuration
      const currentSongLoopStartTime = playStartTime + songDuration * songLoopCount

      forEach(
        songStep => {
          if (songStep.patternId !== patternId) return
          const noteStartTime = currentSongLoopStartTime + (songStep.x * pattern.xLength + x) * noteDuration
          if (currentTime > noteStartTime) return
          playSample(
            noteId(songStep, action.payload),
            samples[sampleNames[y]],
            noteStartTime,
            patternId,
            pattern.stepVelocity
          )
        },
        steps
      )
      break
    }
    case PATTERN_BEAT_STEPS_REMOVE: {
      if (!store.getState().song.isPlaying) break
      const {patternId, x, y} = action.payload
      const idCheck = id => contains(`patternStepX:${x}`, id) && contains(`patternStepY:${y}`, id)
      stopBeatNotesWhere(idCheck, patternId)
      break
    }
    case PATTERN_BEAT_DELETE: {
      if (!store.getState().song.isPlaying) break
      stopBeatPattern(action.payload)
      break
    }
    case PATTERN_SYNTH_DELETE: {
      if (!store.getState().song.isPlaying) break
      forEach(({id, instrumentObj}) => {
        if (id.includes(`patternId:${action.payload}`)) instrumentObj.noteStop(id)
      }, activeNotes)
      break
    }
    case PATTERN_SYNTH_STEPS_ADD: {
      const {
        patternsSynth,
        plugins,
        settings: {noteDuration, rootNote, selectedScale},
        song: {isPlaying, playStartTime, steps, xLength},
      } = store.getState()
      if (!isPlaying) break
      const {patternId, x, y} = action.payload
      const {currentTime} = audioContext
      const pattern = findById(patternId, patternsSynth)
      const instrumentObj = instrumentInstance(pattern.instrument, plugins)
      const activeNotesToAdd = []
      const newNotes = []
      const songDuration = xLength * patternXLength * noteDuration

      forEach(
        songStep => {
          if (songStep.patternId !== patternId) return
          const startTime = playStartTime + songDuration * songLoopCount + (songStep.x * pattern.xLength + x) * noteDuration
          const stopTime = startTime + noteDuration
          if (currentTime > stopTime) return
          const id = noteId(songStep, action.payload)

          activeNotesToAdd.push({
            id,
            instrumentObj,
          })
          newNotes.push({
            frequency: pitchToFrequency(pitchFromScaleIndex(
              scales[selectedScale],
              pattern.yLength - 1 - y
            ) + rootNote + patternPitchOffset),
            gain: pattern.stepVelocity,
            id,
            startTime,
            stopTime,
          })
        },
        steps
      )
      instrumentObj.notesStart(newNotes)
      activeNotes = concat(activeNotes, activeNotesToAdd)
      break
    }
    case PATTERN_SYNTH_STEPS_REMOVE: {
      const {song: {isPlaying}} = store.getState()
      if (!isPlaying) break
      const {patternId, x, y} = action.payload
      const idCheck = ({id}) => contains(`patternStepX:${x}`, id) && contains(`patternStepY:${y}`, id) && contains(`patternId:${patternId}`, id)
      const [notesToStop, notesToKeep] = partition(idCheck, activeNotes)
      stopInstrumentNotes(notesToStop)
      activeNotes = notesToKeep
      break
    }
    case SONG_PLAYING_START: {
      const playStartTime = audioContext.currentTime
      songLoopCount = 0

      forEach(({id}) => stopBeatPattern(id), store.getState().patternsBeat)
      forEach(stopSynthPattern, store.getState().patternsSynth)

      const songLoop = () => {
        const {
          patternsBeat,
          patternsSynth,
          plugins,
          samples,
          settings: {noteDuration, rootNote, selectedScale},
          song,
        } = store.getState()

        const songDuration = song.xLength * patternXLength * noteDuration
        const songLoopStartTime = playStartTime + songDuration * songLoopCount

        let newActiveNotes = []

        forEach(step => {
          const {patternId, patternType} = step
          if (patternType === 'beat') {
            const {
              xLength,
              steps,
            } = findById(patternId, patternsBeat)
            const time = songLoopStartTime + step.x * xLength * noteDuration
            forEach(
              ({velocity, x, y}) => playSample(
                noteId(step, {x, y}, songLoopCount),
                samples[sampleNames[y]],
                time + noteDuration * x,
                patternId,
                velocity
              ),
              steps
            )
          } else {
            const {
              instrument,
              steps,
              xLength,
              yLength,
            } = findById(patternId, patternsSynth)
            const time = songLoopStartTime + step.x * xLength * noteDuration
            const instrumentObj = instrumentInstance(instrument, plugins)
            newActiveNotes = newActiveNotes.concat(reject(({id}) => {
              if (id.includes(`i:${songLoopCount - 1}`)) return true
            }, activeNotes).concat(map(patternStep => ({
              id: noteId(step, patternStep, songLoopCount),
              instrumentObj,
            }), steps)))
            const notes = map(({velocity, x, y}) => ({
              frequency: pitchToFrequency(pitchFromScaleIndex(
                scales[selectedScale],
                yLength - 1 - y
              ) + rootNote + patternPitchOffset),
              gain: velocity,
              id: noteId(step, {x, y}, songLoopCount),
              startTime: time + noteDuration * x,
              stopTime: time + noteDuration * (x + 1),
            }), steps)
            instrumentObj.notesStart(notes)
          }
        }, song.steps)

        activeNotes = newActiveNotes

        timeoutId = setTimeout(
          () => (songLoopCount++, songLoop()),
          (songLoopStartTime + songDuration - audioContext.currentTime) * 900
        )
      }
      songLoop()
      break
    }
    case SONG_PLAYING_STOP: {
      clearTimeout(timeoutId)
      forEach(({id}) => stopBeatPattern(id), store.getState().patternsBeat)
      stopInstrumentNotes(activeNotes)
      activeNotes = []
      break
    }
    case SONG_STEPS_ADD: {
      const {
        patternsBeat,
        patternsSynth,
        plugins,
        settings: {noteDuration},
        samples,
        settings: {rootNote, selectedScale},
        song: {isPlaying, playStartTime, xLength},
      } = store.getState()
      if (!isPlaying) break
      const {patternId, patternType, x} = action.payload
      const {currentTime} = audioContext
      const songDuration = xLength * patternXLength * noteDuration
      const currentSongLoopStartTime = playStartTime + songDuration * songLoopCount
      if (patternType === 'beat') {
        const pattern = findById(patternId, patternsBeat)
        const songStepEndTime = currentSongLoopStartTime + (x + 1) * pattern.xLength * noteDuration
        if (currentTime > songStepEndTime) break
        const songStepStartTime = currentSongLoopStartTime + x * pattern.xLength * noteDuration
        forEach(
          ({velocity, x, y}) => {
            const t = songStepStartTime + noteDuration * x
            if (currentTime > t) return
            playSample(
              noteId(action.payload, {x, y}),
              samples[sampleNames[y]],
              t,
              patternId,
              velocity
            )
          },
          pattern.steps
        )
      } else {
        const pattern = findById(patternId, patternsSynth)
        const songStepEndTime = currentSongLoopStartTime + (x + 1) * pattern.xLength * noteDuration
        if (currentTime > songStepEndTime) break
        const songStepStartTime = currentSongLoopStartTime + x * pattern.xLength * noteDuration
        const instrumentObj = instrumentInstance(pattern.instrument, plugins)
        const activeNotesToAdd = map(patternStep => ({
          id: noteId(action.payload, patternStep),
          instrumentObj,
        }), pattern.steps)
        const newActiveNotes = concat(activeNotes, activeNotesToAdd)
        const notes = map(({velocity, x, y}) => ({
          frequency: pitchToFrequency(pitchFromScaleIndex(
              scales[selectedScale],
              pattern.yLength - 1 - y
            ) + rootNote + patternPitchOffset),
          gain: velocity,
          id: noteId(action.payload, {x, y}),
          startTime: songStepStartTime + noteDuration * x,
          stopTime: songStepStartTime + noteDuration * (x + 1),
        }), pattern.steps)
        instrumentObj.notesStart(notes)
        activeNotes = newActiveNotes
      }
      break
    }
    case SONG_STEPS_REMOVE: {
      const {
        patternsBeat,
        patternsSynth,
        settings: {noteDuration},
        song: {isPlaying, playStartTime, xLength},
      } = store.getState()
      if (!isPlaying) break
      const {patternId, patternType, x} = action.payload
      const {currentTime} = audioContext
      const songDuration = xLength * patternXLength * noteDuration
      const currentSongLoopStartTime = playStartTime + songDuration * songLoopCount
      if (patternType === 'beat') {
        const pattern = findById(patternId, patternsBeat)
        const stepEndTime = currentSongLoopStartTime + (x + 1) * pattern.xLength * noteDuration
        if (currentTime > stepEndTime) break
        stopBeatNotesWhere(contains(`songStepX:${x}`), patternId)
      } else {
        const pattern = findById(patternId, patternsSynth)
        const stepEndTime = currentSongLoopStartTime + (x + 1) * pattern.xLength * noteDuration
        if (currentTime > stepEndTime) break
        const idCheck = ({id}) => contains(`songStepX:${x}`, id) && contains(`patternId:${patternId}`, id)
        const [notesToStop, notesToKeep] = partition(idCheck, activeNotes)
        stopInstrumentNotes(notesToStop)
        activeNotes = notesToKeep
      }
      break
    }
  }
  next(action)
}
