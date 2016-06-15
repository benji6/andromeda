import {assoc} from 'ramda'
import {
  KEYBOARD_MONOPHONIC_SET,
  UPDATE_KEYBOARD_INSTRUMENT,
  UPDATE_KEYBOARD_OCTAVE,
  UPDATE_KEYBOARD_VOLUME
} from '../actions'

export const initialState = {
  instrument: 'Fate',
  monophonic: false,
  octave: 0,
  volume: 1 / 4
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case KEYBOARD_MONOPHONIC_SET: return assoc('monophonic', payload, state)
    case UPDATE_KEYBOARD_INSTRUMENT: return {...state, instrument: payload}
    case UPDATE_KEYBOARD_OCTAVE: return {...state, octave: payload}
    case UPDATE_KEYBOARD_VOLUME: return {...state, volume: payload}
    default: return state
  }
}
