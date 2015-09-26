import {UPDATE_ACTIVE_PATTERN_INSTRUMENT,
        UPDATE_ACTIVE_PATTERN_NOTES} from '../actions';
import {repeat, update} from 'ramda';
import {initialState as instrumentInitialState} from './instrument';

export const initialState = {
  patterns: [{
    instrument: instrumentInitialState.selectedInstrument,
    notes: repeat(repeat({selected: false, active: false}, 8), 8),
  }],
  activePattern: 0,
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_ACTIVE_PATTERN_NOTES:
      return {...state, patterns: update(state.activePattern, {...state.patterns[state.activePattern], notes: value}, state.patterns)};
    case UPDATE_ACTIVE_PATTERN_INSTRUMENT:
      return {...state, patterns: update(state.activePattern, {...state.patterns[state.activePattern], instrument: value}, state.patterns)};
    default:
      return state;
  }
};
