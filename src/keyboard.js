import {compose, flip, identity, isNil, map, prop, reject, tap} from 'ramda'
import {Observable} from 'rx'
import {dispatch, getState} from './store'
import pitchToFrequency from './audioHelpers/pitchToFrequency'
import {
  addAudioGraphSource,
  removeKeysFromAudioGraphContaining
} from './actions'
const {fromEvent} = Observable
const keyCodesToPitches = {
  220: -10,
  90: -9,
  83: -8,
  88: -7,
  68: -6,
  67: -5,
  86: -4,
  71: -3,
  66: -2,
  72: -1,
  78: 0,
  74: 1,
  49: 1,
  77: 2,
  81: 2,
  87: 3,
  188: 3,
  51: 4,
  76: 4,
  69: 5,
  190: 5,
  186: 6,
  52: 6,
  59: 6,
  82: 7,
  191: 7,
  84: 8,
  222: 9,
  54: 9,
  89: 10,
  55: 11,
  85: 12,
  56: 13,
  73: 14,
  79: 15,
  48: 16,
  80: 17,
  189: 18,
  219: 19,
  221: 20
}

const pressedKeys = new Set()

const computeId = pitch => `keyboard: ${pitch}`

const computeNoteParams = pitch => {
  const {keyboard} = getState()
  return {
    id: computeId(pitch),
    instrument: keyboard.instrument,
    params: {
      gain: keyboard.volume,
      frequency: pitchToFrequency(pitch + 12 * keyboard.octave)
    }
  }
}

fromEvent(document.body, 'keydown')
  .transduce(compose(
    map(tap(e => e.keyCode === 191 && e.preventDefault())),
    map(prop('keyCode')),
    reject(::pressedKeys.has),
    map(tap(::pressedKeys.add)),
    map(flip(prop)(keyCodesToPitches)),
    reject(isNil),
    map(computeNoteParams),
    map(addAudioGraphSource),
    map(dispatch)
  ))
  .subscribe(identity, ::console.error)

fromEvent(document.body, 'keyup')
  .transduce(compose(
    map(prop('keyCode')),
    map(tap(::pressedKeys.delete)),
    map(flip(prop)(keyCodesToPitches)),
    reject(isNil),
    map(computeId),
    map(removeKeysFromAudioGraphContaining),
    map(dispatch)
  ))
  .subscribe(identity, ::console.error)
