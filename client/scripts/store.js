import {combineReducers, createStore} from 'redux';
import arpeggiator from './reducers/arpeggiator';
import effect from './reducers/effect';
import instrument from './reducers/instrument';
import rootNote from './reducers/rootNote';
import scale from './reducers/scale';

export default createStore(combineReducers({
  arpeggiator,
  effect,
  instrument,
  rootNote,
  scale,
}));
