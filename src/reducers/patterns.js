import {
  any,
  append,
  assoc,
  compose,
  concat,
  curry,
  equals,
  flip,
  lensProp,
  map,
  merge,
  none,
  over,
  reject,
} from 'ramda'
import {
  PATTERN_ACTIVE_NOTES_SET,
  PATTERN_BEAT_ADD,
  PATTERN_BEAT_CELL_CLICK,
  PATTERN_BEAT_PLAYING_START,
  PATTERN_BEAT_PLAYING_STOP,
  PATTERN_DELETE,
  PATTERN_INSTRUMENT_SET,
  PATTERN_MARKER_POSITION_SET,
  PATTERN_NEXT_LOOP_END_TIME_SET,
  PATTERN_SYNTH_ADD,
  PATTERN_SYNTH_CELL_CLICK,
  PATTERN_SYNTH_PLAYING_START,
  PATTERN_SYNTH_PLAYING_STOP,
  PATTERN_VOLUME_SET,
  SONG_PLAYING_START,
} from '../actions'
import sampleNames from '../constants/sampleNames'
import {patternXLength as xLength} from '../constants/misc'
import {instrumentInstance} from '../utils/derivedData'
import {findById, newId} from '../utils/helpers'
import store from '../store'

export const cellId = (patternId, x, y) => `pattern-${patternId}-${x}-${y}`

const overActiveNotes = over(lensProp('activeNotes'))
const overSteps = over(lensProp('steps'))

export const beatPattern = id => ({
  beatPattern: true,
  id,
  markerPosition: 0,
  playing: false,
  playStartTime: null,
  steps: [],
  volume: 0.5,
  xLength,
  yLength: sampleNames.length,
})

export const synthPattern = id => ({
  activeNotes: [],
  id,
  instrument: 'Prometheus',
  markerPosition: 0,
  playing: false,
  playStartTime: null,
  steps: [],
  synthPattern: true,
  volume: 1 / 3,
  xLength,
  yLength: 16,
})

export const initialState = [
  overSteps(concat([
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 3, y: 0},
    {x: 4, y: 0},
    {x: 5, y: 0},
    {x: 6, y: 0},
    {x: 7, y: 0},
    {x: 0, y: 8},
    {x: 4, y: 8},
    {x: 2, y: 13},
    {x: 6, y: 13},
  ]), beatPattern(0)),
  overSteps(concat([
    {x: 0, y: 15},
    {x: 1, y: 10},
    {x: 2, y: 15},
    {x: 3, y: 9},
    {x: 4, y: 15},
    {x: 5, y: 12},
    {x: 6, y: 15},
    {x: 7, y: 11},
]), synthPattern(1)),
]

export const stepExists = (x0, y0, steps) => any(({x, y}) => x === x0 && y === y0, steps)
const overPattern = curry((f, id, patterns) => map(pattern => pattern.id === id ? f(pattern) : pattern, patterns))
const mergeIntoPattern = (patternId, obj, state) => overPattern(flip(merge)(obj), patternId, state)
const setPatternProp = (key, {patternId, value}, state) => overPattern(assoc(key, value), patternId, state)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case PATTERN_ACTIVE_NOTES_SET: return setPatternProp('activeNotes', payload, state)
    case PATTERN_BEAT_ADD: return append(beatPattern(newId(state)), state)
    case PATTERN_BEAT_CELL_CLICK: {
      const {patternId, x, y} = payload
      const xy = {x, y}
      const {steps} = findById(patternId, state)
      return overPattern(
        overSteps(stepExists(x, y, steps)
          ? reject(equals(xy))
          : append(xy)),
        patternId,
        state
      )
    }
    case PATTERN_SYNTH_CELL_CLICK: {
      const {patternId, x, y} = payload
      const xy = {x, y}
      const {instrument, steps} = findById(patternId, state)
      const id = cellId(patternId, x, y)
      const instrumentObj = instrumentInstance(instrument, store.getState().plugins)
      const isAddedNote = none(note => note.x === x && note.y === y, steps)

      return overPattern(
        compose(
          overSteps(stepExists(x, y, steps) ? reject(equals(xy)) : append(xy)),
          overActiveNotes(isAddedNote ? append({id, instrumentObj}) : reject(x => x.id === id))
        ),
        patternId,
        state
      )
    }
    case PATTERN_DELETE: return reject(({id}) => id === payload, state)
    case PATTERN_INSTRUMENT_SET:
      return setPatternProp('instrument', payload, state)
    case PATTERN_MARKER_POSITION_SET:
      return setPatternProp('markerPosition', payload, state)
    case PATTERN_NEXT_LOOP_END_TIME_SET:
      return setPatternProp('nextLoopEndTime', payload, state)
    case PATTERN_BEAT_PLAYING_START:
    case PATTERN_SYNTH_PLAYING_START:
      return mergeIntoPattern(
        payload.patternId,
        {playing: true, playStartTime: payload.currentTime},
        state,
      )
    case PATTERN_BEAT_PLAYING_STOP:
    case PATTERN_SYNTH_PLAYING_STOP:
      return mergeIntoPattern(payload, {
        activeNotes: [],
        markerPosition: 0,
        playing: false,
      }, state)
    case PATTERN_SYNTH_ADD: return append(synthPattern(newId(state)), state)
    case PATTERN_VOLUME_SET:
      return setPatternProp('volume', payload, state)
    case SONG_PLAYING_START:
      return map(
        pattern => merge(pattern, {
          activeNotes: [],
          markerPosition: 0,
          playing: false,
        }),
        state
      )
    default: return state
  }
}
