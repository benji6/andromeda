import {UPDATE_ACTIVE_PATTERN_NOTES} from '../actions';
import {repeat, update} from 'ramda';
import {initialState as instrumentInitialState} from './instrument';

export const initialState = {
  patterns: [{
    instrument: instrumentInitialState.selectedInstrument,
    notes: repeat(repeat({selected: false, active: false}, 8), 8),
  }],
  activePattern: 0,
};

export default (state = initialState,
                {type, value}) => type === UPDATE_ACTIVE_PATTERN_NOTES ?
                {...state, patterns: update(state.activePattern, {...state.patterns[state.activePattern], notes: value}, state.patterns)} :
                state;
