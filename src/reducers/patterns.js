import {both, equals, find, propEq, reject} from 'ramda'
import {
  ACTIVE_PATTERN_CELL_CLICK,
  UPDATE_ACTIVE_PATTERN_ACTIVE_POSITION,
  UPDATE_ACTIVE_PATTERN_INSTRUMENT,
  UPDATE_ACTIVE_PATTERN_OCTAVE,
  UPDATE_ACTIVE_PATTERN_X_LENGTH,
  UPDATE_ACTIVE_PATTERN_VOLUME
} from '../actions'
import store from '../store'

export const initialState = [{
  activePosition: null,
  instrument: 'prometheus',
  notes: [],
  octave: 0,
  xLength: 8,
  yLength: 8,
  volume: 1 / 3
}]

export const noteExists = (notes, x, y) => Boolean(find(both(propEq('x', x), propEq('y', y)), notes))

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTIVE_PATTERN_CELL_CLICK: {
      const {x, y} = payload
      const {activePatternIndex} = store.getState()
      const activePattern = state[activePatternIndex]
      const {notes} = activePattern
      return noteExists(notes, x, y)
        ? [...state.slice(0, activePatternIndex),
         {...activePattern, notes: reject(equals(payload), notes)},
         ...state.slice(activePatternIndex + 1)]
        : [...state.slice(0, activePatternIndex),
         {...activePattern, notes: [...notes, payload]},
         ...state.slice(activePatternIndex + 1)]
    }
    case UPDATE_ACTIVE_PATTERN_ACTIVE_POSITION: {
      const {activePatternIndex} = store.getState()
      const activePattern = state[activePatternIndex]
      return [...state.slice(0, activePatternIndex),
              {...activePattern, activePosition: payload},
              ...state.slice(activePatternIndex + 1)]
    }
    case UPDATE_ACTIVE_PATTERN_INSTRUMENT: {
      const {activePatternIndex} = store.getState()
      const activePattern = state[activePatternIndex]
      return [...state.slice(0, activePatternIndex),
              {...activePattern, instrument: payload},
              ...state.slice(activePatternIndex + 1)]
    }
    case UPDATE_ACTIVE_PATTERN_OCTAVE: {
      const {activePatternIndex} = store.getState()
      const activePattern = state[activePatternIndex]
      return [...state.slice(0, activePatternIndex),
              {...activePattern, octave: payload},
              ...state.slice(activePatternIndex + 1)]
    }
    case UPDATE_ACTIVE_PATTERN_X_LENGTH: {
      const {activePatternIndex} = store.getState()
      const activePattern = state[activePatternIndex]
      return [...state.slice(0, activePatternIndex),
              {...activePattern, xLength: payload},
              ...state.slice(activePatternIndex + 1)]
    }
    case UPDATE_ACTIVE_PATTERN_VOLUME: {
      const {activePatternIndex} = store.getState()
      const activePattern = state[activePatternIndex]
      return [...state.slice(0, activePatternIndex),
              {...activePattern, volume: payload},
              ...state.slice(activePatternIndex + 1)]
    }
    default:
      return state
  }
}
