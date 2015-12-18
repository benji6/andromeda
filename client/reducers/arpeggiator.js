import {UPDATE_ARPEGGIATOR_IS_ON,
        UPDATE_SELECTED_PATTERN} from '../actions'

export const initialState = {
  arpeggiatorIsOn: false,
  patterns: [
    'random',
    'up',
    'down',
    'up and down',
  ],
  selectedPattern: 'up and down',
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_ARPEGGIATOR_IS_ON:
      return {...state, arpeggiatorIsOn: payload}
    case UPDATE_SELECTED_PATTERN:
      return {...state, selectedPattern: payload}
    default:
      return state
  }
}
