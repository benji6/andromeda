import {combineReducers, createStore} from 'redux';
import arpeggiator from './reducers/arpeggiator';
import bpm from './reducers/bpm';
import effect from './reducers/effect';
import instrument from './reducers/instrument';
import keyboardActive from './reducers/keyboardActive';
import patterns from './reducers/patterns';
import playing from './reducers/playing';
import rootNote from './reducers/rootNote';
import scale from './reducers/scale';

export default createStore(combineReducers({
  arpeggiator,
  bpm,
  effect,
  instrument,
  keyboardActive,
  patterns,
  playing,
  rootNote,
  scale,
}));
