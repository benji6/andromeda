import {
  any,
  assoc,
  merge,
  reject,
} from 'ramda'
import {
  PATTERN_BEAT_DELETE,
  PATTERN_SYNTH_DELETE,
  SONG_MARKER_POSITION_SET,
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
  SONG_STEPS_ADD,
  SONG_STEPS_REMOVE,
} from '../actions'

const setSteps = assoc('steps')

export const beatStepExists = (x0, id, steps) => any(
  ({patternId, patternType, x}) => patternType === 'beat' && x === x0 && patternId === id,
  steps
)
export const synthStepExists = (x0, id, steps) => any(
  ({patternId, patternType, x}) => patternType === 'synth' && x === x0 && patternId === id,
  steps
)

const initialState = {
  isPlaying: false,
  markerPosition: 0,
  playStartTime: null,
  steps: [
    {patternId: 0, patternType: 'beat', x: 0},
    {patternId: 0, patternType: 'beat', x: 1},
    {patternId: 0, patternType: 'beat', x: 2},
    {patternId: 0, patternType: 'beat', x: 3},
    {patternId: 0, patternType: 'beat', x: 4},
    {patternId: 0, patternType: 'beat', x: 5},
    {patternId: 0, patternType: 'beat', x: 6},
    {patternId: 0, patternType: 'beat', x: 7},
    {patternId: 0, patternType: 'synth', x: 0},
    {patternId: 0, patternType: 'synth', x: 1},
    {patternId: 0, patternType: 'synth', x: 2},
    {patternId: 0, patternType: 'synth', x: 3},
    {patternId: 0, patternType: 'synth', x: 4},
    {patternId: 0, patternType: 'synth', x: 5},
    {patternId: 0, patternType: 'synth', x: 6},
    {patternId: 0, patternType: 'synth', x: 7},
  ],
  xLength: 8,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case PATTERN_BEAT_DELETE:
      return setSteps(reject(step => step.patternType === 'beat' && step.patternId === payload, state.steps), state)
    case PATTERN_SYNTH_DELETE:
      return setSteps(reject(step => step.patternType === 'synth' && step.patternId === payload, state.steps), state)
    case SONG_MARKER_POSITION_SET:
      return assoc('markerPosition', payload, state)
    case SONG_PLAYING_START:
      return merge(state, {isPlaying: true, playStartTime: payload})
    case SONG_PLAYING_STOP:
      return merge(state, {isPlaying: false, markerPosition: 0, playStartTime: null})
    case SONG_STEPS_ADD:
      return setSteps(
        [...state.steps, payload],
        state
      )
    case SONG_STEPS_REMOVE:
      return setSteps(
        reject(({patternId, patternType, x}) => patternType === payload.patternType && x === payload.x && patternId === payload.patternId, state.steps),
        state
      )
    default: return state
  }
}
