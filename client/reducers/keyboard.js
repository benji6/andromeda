import {
  UPDATE_KEYBOARD_INSTRUMENT,
  UPDATE_KEYBOARD_OCTAVE,
  UPDATE_KEYBOARD_VOLUME,
} from '../actions'
import {initialState as instrumentInitialState} from './instruments'

export const initialState = {
  instrument: instrumentInitialState[2],
  octave: 0,
  volume: 1 / 3,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_KEYBOARD_INSTRUMENT: return {...state, instrument: payload}
    case UPDATE_KEYBOARD_OCTAVE: return {...state, octave: payload}
    case UPDATE_KEYBOARD_VOLUME: return {...state, volume: payload}
    default: return state
  }
}
