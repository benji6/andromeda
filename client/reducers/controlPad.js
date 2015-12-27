import {
  UPDATE_CONTROL_PAD_ARPEGGIATOR_IS_ON,
  UPDATE_CONTROL_PAD_INSTRUMENT,
  UPDATE_CONTROL_PAD_NO_SCALE,
  UPDATE_CONTROL_PAD_OCTAVE,
  UPDATE_CONTROL_PAD_PORTAMENTO,
  UPDATE_CONTROL_PAD_RANGE,
  UPDATE_CONTROL_PAD_SELECTED_ARPEGGIATOR_PATTERN
} from '../actions'
import {initialState as instrumentInitialState} from './instruments'

export const initialState = {
  arpeggiatorIsOn: true,
  instrument: instrumentInitialState[2],
  noScale: false,
  octave: 0,
  portamento: false,
  range: 1,
  selectedArpeggiatorPattern: 'up and down'
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_CONTROL_PAD_ARPEGGIATOR_IS_ON:
      return {...state, arpeggiatorIsOn: payload}
    case UPDATE_CONTROL_PAD_INSTRUMENT: return {...state, instrument: payload}
    case UPDATE_CONTROL_PAD_NO_SCALE: return {...state, noScale: payload}
    case UPDATE_CONTROL_PAD_OCTAVE: return {...state, octave: payload}
    case UPDATE_CONTROL_PAD_PORTAMENTO: return {...state, portamento: payload}
    case UPDATE_CONTROL_PAD_RANGE: return {...state, range: payload}
    case UPDATE_CONTROL_PAD_SELECTED_ARPEGGIATOR_PATTERN:
      return {...state, selectedArpeggiatorPattern: payload}
    default: return state
  }
}
