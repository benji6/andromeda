import {combineReducers, createStore} from 'redux';
import activePatternIndex from './reducers/activePatternIndex';
import arpeggiator from './reducers/arpeggiator';
import audioGraph from './reducers/audioGraph';
import bpm from './reducers/bpm';
import channels from './reducers/channels';
import controlPad from './reducers/controlPad';
import effects from './reducers/effects';
import instruments from './reducers/instruments';
import keyboard from './reducers/keyboard';
import microphone from './reducers/microphone';
import patterns from './reducers/patterns';
import playing from './reducers/playing';
import rootNote from './reducers/rootNote';
import scale from './reducers/scale';
import song from './reducers/song';

export default createStore(combineReducers({
  activePatternIndex,
  arpeggiator,
  audioGraph,
  bpm,
  channels,
  controlPad,
  effects,
  instruments,
  keyboard,
  microphone,
  patterns,
  playing,
  rootNote,
  scale,
  song,
}));
