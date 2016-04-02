import {
  adjust,
  any,
  append,
  assoc,
  both,
  equals,
  lensProp,
  over,
  propEq,
  reject
} from 'ramda'
import {
  ACTIVE_PATTERN_CELL_CLICK,
  SET_ACTIVE_PATTERN_ACTIVE_POSITION,
  SET_ACTIVE_PATTERN_Y_LENGTH,
  UPDATE_ACTIVE_PATTERN_INSTRUMENT,
  UPDATE_ACTIVE_PATTERN_OCTAVE,
  UPDATE_ACTIVE_PATTERN_VOLUME,
  UPDATE_ACTIVE_PATTERN_X_LENGTH
} from '../actions'
import store from '../store'

const overNotes = over(lensProp('steps'))

export const initialState = [{
  activePosition: null,
  instrument: 'Prometheus',
  steps: [],
  octave: 0,
  xLength: 8,
  yLength: 8,
  volume: 1 / 3
}]

export const stepExists = (steps, x, y) => any(both(propEq('x', x), propEq('y', y)), steps)
const setActivePatternProp = (
  key, val, store, state
) => adjust(assoc(key, val), store.getState().activePatternIndex, state)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTIVE_PATTERN_CELL_CLICK: {
      const {x, y} = payload
      const {activePatternIndex} = store.getState()
      const {steps} = state[activePatternIndex]
      return adjust(
        overNotes(stepExists(steps, x, y)
          ? reject(equals(payload))
          : append(payload)),
        store.getState().activePatternIndex,
        state
      )
    }
    case SET_ACTIVE_PATTERN_ACTIVE_POSITION:
      return setActivePatternProp('activePosition', payload, store, state)
    case SET_ACTIVE_PATTERN_Y_LENGTH:
      return setActivePatternProp('yLength', payload, store, state)
    case UPDATE_ACTIVE_PATTERN_INSTRUMENT:
      return setActivePatternProp('instrument', payload, store, state)
    case UPDATE_ACTIVE_PATTERN_OCTAVE:
      return setActivePatternProp('octave', payload, store, state)
    case UPDATE_ACTIVE_PATTERN_X_LENGTH:
      return setActivePatternProp('xLength', payload, store, state)
    case UPDATE_ACTIVE_PATTERN_VOLUME:
      return setActivePatternProp('volume', payload, store, state)
    default: return state
  }
}
