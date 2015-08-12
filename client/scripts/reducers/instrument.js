/* global R */
import {UPDATE_SELECTED_INSTRUMENT} from '../actions/types';
const {merge} = R;

const initialState = {
  instruments: [
    'detuned',
    'fm',
    'sine',
    'supersaw',
  ],
  selectedInstrument: 'sine',
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_SELECTED_INSTRUMENT:
      return merge(state, {selectedInstrument: value});
    default:
      return state;
  }
};
