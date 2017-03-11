import {assoc} from 'ramda'
import {
  KEYBOARD_MONOPHONIC_SET,
  KEYBOARD_INSTRUMENT_SET,
  KEYBOARD_OCTAVE_SET,
  KEYBOARD_VOLUME_SET,
} from '../actions'

export const initialState = {
  instrument: 'Prometheus',
  monophonic: false,
  octave: 0,
  volume: 0.2,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case KEYBOARD_INSTRUMENT_SET: return assoc('instrument', payload, state)
    case KEYBOARD_MONOPHONIC_SET: return assoc('monophonic', payload, state)
    case KEYBOARD_OCTAVE_SET: return assoc('octave', payload, state)
    case KEYBOARD_VOLUME_SET: return assoc('volume', payload, state)
    default: return state
  }
}
