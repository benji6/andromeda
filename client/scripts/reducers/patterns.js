import {append, both, equals, find, propEq, reject, update} from 'ramda';
import {ACTIVE_PATTERN_CELL_CLICK,
        UPDATE_ACTIVE_PATTERN_INSTRUMENT} from '../actions';
import {initialState as instrumentInitialState} from './instrument';
import store from '../store';

export const initialState = [{
  instrument: instrumentInitialState.selectedInstrument,
  patternLength: 8,
  notes: [],
}];

export const noteExists = (notes, x, y) => Boolean(find(both(propEq('x', x), propEq('y', y)), notes));

export default (state = initialState, {type, value}) => {
  switch (type) {
    case ACTIVE_PATTERN_CELL_CLICK: {
      const {x, y} = value;
      const {activePatternIndex} = store.getState();
      const activePattern = state[activePatternIndex];
      const {notes} = activePattern;
      return noteExists(notes, x, y) ?
        update(activePatternIndex, {...activePattern, notes: reject(equals(value), notes)}, state) :
        update(activePatternIndex, {...activePattern, notes: append(value, notes)}, state);
    }
    case UPDATE_ACTIVE_PATTERN_INSTRUMENT: {
      const {activePatternIndex} = store.getState();
      const activePattern = state[activePatternIndex];
      return update(activePatternIndex, {...activePattern, instrument: value}, state);
    }
    default:
      return state;
  }
};
