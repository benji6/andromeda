import {assoc} from 'ramda'
import {
  KEYBOARD_MONOPHONIC_SET,
  KEYBOARD_INSTRUMENT_SET,
  KEYBOARD_OCTAVE_SET,
  KEYBOARD_VOLUME_SET,
} from '../actions'

export const initialState = {
  instrument: 'Fate',
  monophonic: false,
  octave: 0,
  volume: 1 / 4,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case KEYBOARD_INSTRUMENT_SET: return {...state, instrument: payload}
    case KEYBOARD_MONOPHONIC_SET: return assoc('monophonic', payload, state)
    case KEYBOARD_OCTAVE_SET: return {...state, octave: payload}
    case KEYBOARD_VOLUME_SET: return {...state, volume: payload}
    default: return state
  }
}
