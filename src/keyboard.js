import {forEach} from 'ramda'
import {instrumentInstance} from './utils/derivedData'
import keyCodesToPitches from './constants/keyCodesToPitches'
import pitchToFrequency from './audioHelpers/pitchToFrequency'
import store from './store'

const pressedKeys = new Set()

const computeId = pitch => `keyboard: ${pitch}`

const computeNoteParams = pitch => {
  const {keyboard: {instrument, octave, volume}} = store.getState()
  return {
    frequency: pitchToFrequency(pitch + 12 * octave),
    id: computeId(pitch),
    instrument,
    gain: volume,
  }
}

const stopAndRemoveNote = keyCode => {
  pressedKeys.delete(keyCode)
  const pitch = keyCodesToPitches[keyCode]
  if (pitch === undefined) return
  const noteParams = computeNoteParams(pitch)
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    store.getState().plugins
  )
  instrumentObj.noteStop(noteParams.id)
}

document.addEventListener('keydown', e => {
  const {keyCode} = e
  if (keyCode === 191) e.preventDefault()
  if (pressedKeys.has(keyCode)) return
  pressedKeys.add(keyCode)
  const pitch = keyCodesToPitches[keyCode]
  if (pitch === undefined) return
  const state = store.getState()
  if (state.keyboard.monophonic) {
    forEach(
      code => code !== keyCode && stopAndRemoveNote(code),
      pressedKeys
    )
  }
  const noteParams = computeNoteParams(pitch)
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    state.plugins
  )
  instrumentObj.noteStart(noteParams)
})

document.addEventListener('keyup', ({keyCode}) => {
  pressedKeys.delete(keyCode)
  const pitch = keyCodesToPitches[keyCode]
  if (pitch === undefined) return
  const noteParams = computeNoteParams(pitch)
  const instrumentObj = instrumentInstance(
    noteParams.instrument,
    store.getState().plugins
  )
  instrumentObj.noteStop(noteParams.id)
})
