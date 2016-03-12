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
  UPDATE_ACTIVE_PATTERN_INSTRUMENT,
  UPDATE_ACTIVE_PATTERN_OCTAVE,
  UPDATE_ACTIVE_PATTERN_X_LENGTH,
  UPDATE_ACTIVE_PATTERN_VOLUME
} from '../actions'
import store from '../store'

const overNotes = over(lensProp('notes'))

export const initialState = [{
  activePosition: null,
  instrument: 'Prometheus',
  notes: [],
  octave: 0,
  xLength: 8,
  yLength: 8,
  volume: 1 / 3
}]

export const noteExists = (notes, x, y) => any(both(propEq('x', x), propEq('y', y)), notes)

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTIVE_PATTERN_CELL_CLICK: {
      const {x, y} = payload
      const {activePatternIndex} = store.getState()
      const {notes} = state[activePatternIndex]
      return adjust(
        overNotes(
          noteExists(notes, x, y) ? reject(equals(payload)) : append(payload)
        ),
        store.getState().activePatternIndex,
        state
      )
    }
    case SET_ACTIVE_PATTERN_ACTIVE_POSITION:
      return adjust(
        assoc('activePosition', payload),
        store.getState().activePatternIndex,
        state
      )
    case UPDATE_ACTIVE_PATTERN_INSTRUMENT:
      return adjust(
        assoc('instrument', payload),
        store.getState().activePatternIndex,
        state
      )
    case UPDATE_ACTIVE_PATTERN_OCTAVE: {
      return adjust(
        assoc('octave', payload),
        store.getState().activePatternIndex,
        state
      )
    }
    case UPDATE_ACTIVE_PATTERN_X_LENGTH: {
      return adjust(
        assoc('xLength', payload),
        store.getState().activePatternIndex,
        state
      )
    }
    case UPDATE_ACTIVE_PATTERN_VOLUME: {
      return adjust(
        assoc('volume', payload),
        store.getState().activePatternIndex,
        state
      )
    }
    default:
      return state
  }
}
