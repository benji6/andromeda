import {
  UPDATE_CONTROL_PAD_INSTRUMENT,
  UPDATE_CONTROL_PAD_NO_SCALE,
  UPDATE_CONTROL_PAD_OCTAVE,
  UPDATE_CONTROL_PAD_PORTAMENTO,
  UPDATE_CONTROL_PAD_RANGE,
} from '../actions'

export const initialState = {
  instrument: 'Ariadne',
  noScale: false,
  octave: 0,
  portamento: false,
  range: 1,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_CONTROL_PAD_INSTRUMENT: return {...state, instrument: payload}
    case UPDATE_CONTROL_PAD_NO_SCALE: return {...state, noScale: payload}
    case UPDATE_CONTROL_PAD_OCTAVE: return {...state, octave: payload}
    case UPDATE_CONTROL_PAD_PORTAMENTO: return {...state, portamento: payload}
    case UPDATE_CONTROL_PAD_RANGE: return {...state, range: payload}
    default: return state
  }
}
