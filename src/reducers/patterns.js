import {
  adjust,
  any,
  append,
  assoc,
  equals,
  lensProp,
  over,
  reject,
  remove
} from 'ramda'
import {
  ADD_NEW_PATTERN,
  DELETE_PATTERN,
  PATTERN_ACTIVE_NOTES_APPEND,
  PATTERN_ACTIVE_NOTES_CLEAR,
  PATTERN_ACTIVE_NOTES_REJECT,
  PATTERN_CELL_CLICK,
  SET_PATTERN_MARKER_POSITION,
  SET_PATTERN_NEXT_LOOP_END_TIME,
  SET_PATTERN_PLAY_START_TIME,
  SET_PATTERN_PLAYING,
  UPDATE_PATTERN_INSTRUMENT,
  UPDATE_PATTERN_OCTAVE,
  UPDATE_PATTERN_VOLUME,
  UPDATE_PATTERN_X_LENGTH,
} from '../actions'

const overActiveNotes = over(lensProp('activeNotes'))
const overSteps = over(lensProp('steps'))

const defaultPattern = () => ({
  activeNotes: [],
  instrument: 'Prometheus',
  steps: [],
  markerPosition: 0,
  octave: -1,
  playing: false,
  playStartTime: null,
  xLength: 8,
  yLength: 16,
  volume: 1 / 3
})
const initialState = [defaultPattern()]

export const stepExists = (x0, y0, steps) => any(({x, y}) => x === x0 && y === y0, steps)
const setPatternProp = (key, {patternId, value}, state) => adjust(assoc(key, value), patternId, state)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_NEW_PATTERN: return append(defaultPattern(), state)
    case DELETE_PATTERN: return remove(payload, 1, state)
    case PATTERN_ACTIVE_NOTES_APPEND: {
      const {patternId, value} = payload
      return adjust(
        overActiveNotes(append(value)),
        patternId,
        state
      )
    }
    case PATTERN_ACTIVE_NOTES_CLEAR:
      return setPatternProp('activeNotes', {patternId: payload, value: []}, state)
    case PATTERN_ACTIVE_NOTES_REJECT: {
      const {patternId, value} = payload
      return adjust(
        overActiveNotes(reject(value)),
        patternId,
        state
      )
    }
    case PATTERN_CELL_CLICK: {
      const {patternId, x, y} = payload
      const xy = {x, y}
      const {steps} = state[patternId]
      return adjust(
        overSteps(stepExists(x, y, steps)
          ? reject(equals(xy))
          : append(xy)),
        patternId,
        state
      )
    }
    case SET_PATTERN_MARKER_POSITION:
      return setPatternProp('markerPosition', payload, state)
    case SET_PATTERN_NEXT_LOOP_END_TIME:
      return setPatternProp('nextLoopEndTime', payload, state)
    case SET_PATTERN_PLAY_START_TIME:
      return setPatternProp('playStartTime', payload, state)
    case SET_PATTERN_PLAYING:
      return setPatternProp('playing', payload, state)
    case UPDATE_PATTERN_INSTRUMENT:
      return setPatternProp('instrument', payload, state)
    case UPDATE_PATTERN_OCTAVE:
      return setPatternProp('octave', payload, state)
    case UPDATE_PATTERN_X_LENGTH:
      return setPatternProp('xLength', payload, state)
    case UPDATE_PATTERN_VOLUME:
      return setPatternProp('volume', payload, state)
    default: return state
  }
}
