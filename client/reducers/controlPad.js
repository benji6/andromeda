import {
  UPDATE_CONTROL_PAD_INSTRUMENT,
  UPDATE_CONTROL_PAD_OCTAVE,
  UPDATE_CONTROL_PAD_PORTAMENTO,
} from '../actions'
import {initialState as instrumentInitialState} from './instruments'

export const initialState = {
  instrument: instrumentInitialState[2],
  octave: 0,
  portamento: false,
}

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_CONTROL_PAD_INSTRUMENT:
      return {...state, instrument: value}
    case UPDATE_CONTROL_PAD_OCTAVE:
      return {...state, octave: value}
    case UPDATE_CONTROL_PAD_PORTAMENTO:
      return {...state, portamento: value}
    default:
      return state
  }
}
