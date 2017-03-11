import {
  append,
  assoc,
  concat,
  curry,
  flip,
  lensProp,
  map,
  merge,
  over,
  reject,
} from 'ramda'
import {REHYDRATE} from 'redux-persist/constants'
import {
  PATTERN_SYNTH_ADD,
  PATTERN_SYNTH_DELETE,
  PATTERN_SYNTH_INSTRUMENT_SET,
  PATTERN_SYNTH_MARKER_POSITION_SET,
  PATTERN_SYNTH_PLAYING_START,
  PATTERN_SYNTH_PLAYING_STOP,
  PATTERN_SYNTH_STEP_VELOCITY_SET,
  PATTERN_SYNTH_STEPS_ADD,
  PATTERN_SYNTH_STEPS_REMOVE,
  SONG_PLAYING_START,
} from '../actions'
import {patternXLength as xLength} from '../constants/misc'
import {newId} from '../utils/helpers'

export const cellId = (patternId, x, y) => `pattern-${patternId}-${x}-${y}`

const overSteps = over(lensProp('steps'))

const defaults = merge({
  instrument: 'Prometheus',
  markerPosition: 0,
  playing: false,
  playStartTime: null,
  stepVelocity: 1,
  xLength,
  yLength: 16,
})

export const synthPattern = id => defaults({
  id,
  steps: [],
})

export const initialState = [
  overSteps(concat([
    {velocity: 1, x: 0, y: 15},
    {velocity: 1, x: 1, y: 10},
    {velocity: 1, x: 2, y: 15},
    {velocity: 1, x: 3, y: 9},
    {velocity: 1, x: 4, y: 15},
    {velocity: 1, x: 5, y: 12},
    {velocity: 1, x: 6, y: 15},
    {velocity: 1, x: 7, y: 11},
  ]), synthPattern(0)),
]

const overPattern = curry((f, id, patterns) => map(pattern => pattern.id === id ? f(pattern) : pattern, patterns))
const mergeIntoPattern = (patternId, obj, state) => overPattern(flip(merge)(obj), patternId, state)
const setPatternProp = (key, {patternId, value}, state) => overPattern(assoc(key, value), patternId, state)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case REHYDRATE: return payload.patternsSynth ? map(defaults, payload.patternsSynth) : state
    case PATTERN_SYNTH_DELETE: return reject(({id}) => id === payload, state)
    case PATTERN_SYNTH_INSTRUMENT_SET: return setPatternProp('instrument', payload, state)
    case PATTERN_SYNTH_MARKER_POSITION_SET: return setPatternProp('markerPosition', payload, state)
    case PATTERN_SYNTH_PLAYING_START:
      return mergeIntoPattern(payload.patternId, {playing: true, playStartTime: payload.currentTime}, state)
    case PATTERN_SYNTH_STEPS_ADD: {
      const {patternId, x, y} = payload
      return overPattern(
        pattern => overSteps(append({velocity: pattern.stepVelocity, x, y}), pattern),
        patternId,
        state
      )
    }
    case PATTERN_SYNTH_STEPS_REMOVE: {
      const {patternId, x, y} = payload
      return overPattern(
        overSteps(reject(step => step.x === x && step.y === y)),
        patternId,
        state
      )
    }
    case PATTERN_SYNTH_PLAYING_STOP:
      return mergeIntoPattern(payload, {markerPosition: 0, playing: false}, state)
    case PATTERN_SYNTH_STEP_VELOCITY_SET: return setPatternProp('stepVelocity', payload, state)
    case PATTERN_SYNTH_ADD: return append(synthPattern(newId(state)), state)
    case SONG_PLAYING_START:
      return map(
        pattern => merge(pattern, {
          markerPosition: 0,
          playing: false,
        }),
        state
      )
    default: return state
  }
}
