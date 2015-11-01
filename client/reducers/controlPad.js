import {UPDATE_CONTROL_PAD_INSTRUMENT} from '../actions';
import {initialState as instrumentInitialState} from './instruments';

export const initialState = {instrument: instrumentInitialState[0]};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_CONTROL_PAD_INSTRUMENT:
      return {...state, instrument: value};
    default:
      return state;
  }
};
