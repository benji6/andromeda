import {combineReducers, createStore} from 'redux';
import activePatternIndex from './reducers/activePatternIndex';
import arpeggiator from './reducers/arpeggiator';
import bpm from './reducers/bpm';
import effect from './reducers/effect';
import instrument from './reducers/instrument';
import microphone from './reducers/microphone';
import patterns from './reducers/patterns';
import playing from './reducers/playing';
import rootNote from './reducers/rootNote';
import scale from './reducers/scale';
import song from './reducers/song';

export default createStore(combineReducers({
  activePatternIndex,
  arpeggiator,
  bpm,
  effect,
  instrument,
  microphone,
  patterns,
  playing,
  rootNote,
  scale,
  song,
}));
