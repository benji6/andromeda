import {UPDATE_SELECTED_INSTRUMENT} from '../actions';

export const initialState = {
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
      return {...state, selectedInstrument: value};
    default:
      return state;
  }
};
