import {
  CONTROL_PAD_TOUCHED,
  CONTROL_PAD_INSTRUMENT_SET,
  CONTROL_PAD_NO_SCALE_SET,
  CONTROL_PAD_OCTAVE_SET,
  CONTROL_PAD_PORTAMENTO_SET,
  CONTROL_PAD_RANGE_SET,
} from '../actions'

export const initialState = {
  instrument: 'Ariadne',
  noScale: false,
  octave: 0,
  portamento: false,
  range: 1,
  touched: false,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case CONTROL_PAD_INSTRUMENT_SET: return {...state, instrument: payload}
    case CONTROL_PAD_NO_SCALE_SET: return {...state, noScale: payload}
    case CONTROL_PAD_OCTAVE_SET: return {...state, octave: payload}
    case CONTROL_PAD_PORTAMENTO_SET: return {...state, portamento: payload}
    case CONTROL_PAD_RANGE_SET: return {...state, range: payload}
    case CONTROL_PAD_TOUCHED: return {...state, touched: true}
    default: return state
  }
}
