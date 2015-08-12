/* global R */
import {
  UPDATE_ARPEGGIATOR_IS_ON,
  UPDATE_SELECTED_PATTERN
} from '../actions/types';
const {merge} = R;

const initialState = {
  arpeggiatorIsOn: false,
  patterns: [
    'random',
    'up',
    'down',
    'up and down',
  ],
  selectedPattern: 'up and down',
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_ARPEGGIATOR_IS_ON:
      return merge(state, {arpeggiatorIsOn: value});
    case UPDATE_SELECTED_PATTERN:
      return merge(state, {selectedPattern: value});
    default:
      return state;
  }
};
