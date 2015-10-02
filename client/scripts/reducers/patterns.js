import {UPDATE_ACTIVE_PATTERN_INSTRUMENT,
        UPDATE_ACTIVE_PATTERN_NOTES} from '../actions';
import {update} from 'ramda';
import {initialState as instrumentInitialState} from './instrument';
// circular-iterable causing serious issues for testing etc...
import store from '../store';

export const initialState = [{
  instrument: instrumentInitialState.selectedInstrument,
  notes: [],
}];

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_ACTIVE_PATTERN_NOTES:
      const {activePattern} = store.getState();
      return update(activePattern, {...state[activePattern], notes: value}, state);
    case UPDATE_ACTIVE_PATTERN_INSTRUMENT:
      return update(activePattern, {...state[activePattern], instrument: value}, state);
    default:
      return state;
  }
};
