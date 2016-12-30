import {
  any,
  assoc,
  merge,
  reject,
} from 'ramda'
import {
  PATTERN_DELETE,
  SONG_ACTIVE_NOTES_SET,
  SONG_MARKER_POSITION_SET,
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
  SONG_STEPS_ADD,
  SONG_STEPS_REMOVE,
} from '../actions'

const setSteps = assoc('steps')

export const stepExists = (x0, y0, steps) => any(({x, y}) => x === x0 && y === y0, steps)

const initialState = {
  activeNotes: [],
  isPlaying: false,
  markerPosition: 0,
  playStartTime: null,
  steps: [
    {patternId: 0, x: 0, y: 0},
    {patternId: 0, x: 1, y: 0},
    {patternId: 0, x: 2, y: 0},
    {patternId: 0, x: 3, y: 0},
    {patternId: 0, x: 4, y: 0},
    {patternId: 0, x: 5, y: 0},
    {patternId: 0, x: 6, y: 0},
    {patternId: 0, x: 7, y: 0},
    {patternId: 1, x: 0, y: 1},
    {patternId: 1, x: 1, y: 1},
    {patternId: 1, x: 2, y: 1},
    {patternId: 1, x: 3, y: 1},
    {patternId: 1, x: 4, y: 1},
    {patternId: 1, x: 5, y: 1},
    {patternId: 1, x: 6, y: 1},
    {patternId: 1, x: 7, y: 1},
  ],
  xLength: 8,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case PATTERN_DELETE:
      return setSteps(
        reject(step => step.patternId === payload, state.steps),
        state
      )
    case SONG_ACTIVE_NOTES_SET:
      return assoc('activeNotes', payload, state)
    case SONG_MARKER_POSITION_SET:
      return assoc('markerPosition', payload, state)
    case SONG_PLAYING_START:
      return merge(state, {isPlaying: true, playStartTime: payload})
    case SONG_PLAYING_STOP:
      return merge(state, {activeNotes: [], isPlaying: false, markerPosition: 0, playStartTime: null})
    case SONG_STEPS_ADD:
      return setSteps(
        [...state.steps, {patternId: payload.patternId, x: payload.x, y: payload.patternId}],
        state
      )
    case SONG_STEPS_REMOVE:
      return setSteps(
        reject(({patternId, x}) => x === payload.x && patternId === payload.patternId, state.steps),
        state
      )
    default: return state
  }
}
