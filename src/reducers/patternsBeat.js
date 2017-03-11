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
  PATTERN_BEAT_ADD,
  PATTERN_BEAT_DELETE,
  PATTERN_BEAT_MARKER_POSITION_SET,
  PATTERN_BEAT_PLAYING_START,
  PATTERN_BEAT_PLAYING_STOP,
  PATTERN_BEAT_STEP_VELOCITY_SET,
  PATTERN_BEAT_STEPS_ADD,
  PATTERN_BEAT_STEPS_REMOVE,
  SONG_PLAYING_START,
} from '../actions'
import sampleNames from '../constants/sampleNames'
import {patternXLength as xLength} from '../constants/misc'
import {newId} from '../utils/helpers'

export const cellId = (patternId, x, y) => `pattern-${patternId}-${x}-${y}`

const overSteps = over(lensProp('steps'))

const defaults = merge({
  markerPosition: 0,
  playing: false,
  playStartTime: null,
  stepVelocity: 1,
  xLength,
  yLength: sampleNames.length,
})

export const beatPattern = id => defaults({
  id,
  steps: [],
})

export const initialState = [
  overSteps(concat([
    {velocity: 1, x: 0, y: 0},
    {velocity: 1 / 3, x: 1, y: 0},
    {velocity: 2 / 3, x: 2, y: 0},
    {velocity: 1 / 3, x: 3, y: 0},
    {velocity: 1, x: 4, y: 0},
    {velocity: 1 / 3, x: 5, y: 0},
    {velocity: 2 / 3, x: 6, y: 0},
    {velocity: 1 / 3, x: 7, y: 0},
    {velocity: 1, x: 0, y: 8},
    {velocity: 1, x: 4, y: 8},
    {velocity: 1, x: 2, y: 13},
    {velocity: 1, x: 6, y: 13},
  ]), beatPattern(0)),
]

const flipMerge = flip(merge)
const overPattern = curry((f, id, patterns) => map(pattern => pattern.id === id ? f(pattern) : pattern, patterns))
const mergeIntoPattern = (patternId, obj, state) => overPattern(flipMerge(obj), patternId, state)
const setPatternProp = (key, {patternId, value}, state) => overPattern(assoc(key, value), patternId, state)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case REHYDRATE: return payload.patternsBeat ? map(defaults, payload.patternsBeat) : state
    case PATTERN_BEAT_ADD: return append(beatPattern(newId(state)), state)
    case PATTERN_BEAT_DELETE: return reject(({id}) => id === payload, state)
    case PATTERN_BEAT_STEPS_ADD: {
      const {patternId, x, y} = payload
      return overPattern(pattern => overSteps(append({velocity: pattern.stepVelocity, x, y}), pattern), patternId, state)
    }
    case PATTERN_BEAT_STEPS_REMOVE: {
      const {patternId, x, y} = payload
      return overPattern(overSteps(reject(step => step.x === x && step.y === y)), patternId, state)
    }
    case PATTERN_BEAT_MARKER_POSITION_SET: return setPatternProp('markerPosition', payload, state)
    case PATTERN_BEAT_PLAYING_START:
      return mergeIntoPattern(payload.patternId, {playing: true, playStartTime: payload.currentTime}, state)
    case PATTERN_BEAT_PLAYING_STOP:
      return mergeIntoPattern(payload, {markerPosition: 0, playing: false}, state)
    case PATTERN_BEAT_STEP_VELOCITY_SET: return setPatternProp('stepVelocity', payload, state)
    case SONG_PLAYING_START:
      return map(flipMerge({markerPosition: 0, playing: false}), state)
    default: return state
  }
}
