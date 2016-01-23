import {combineReducers, createStore} from 'redux'
import activePatternIndex from './reducers/activePatternIndex'
import arpeggiatorPatterns from './reducers/arpeggiatorPatterns'
import audioGraphAndChannels from './reducers/audioGraphAndChannels'
import bpm from './reducers/bpm'
import controlPad from './reducers/controlPad'
import effects from './reducers/effects'
import instruments from './reducers/instruments'
import keyboard from './reducers/keyboard'
import microphone from './reducers/microphone'
import patterns from './reducers/patterns'
import playing from './reducers/playing'
import rootNote from './reducers/rootNote'
import scale from './reducers/scale'
import song from './reducers/song'

export default createStore(combineReducers({
  activePatternIndex,
  arpeggiatorPatterns,
  audioGraphAndChannels,
  bpm,
  controlPad,
  effects,
  instruments,
  keyboard,
  microphone,
  patterns,
  playing,
  rootNote,
  scale,
  song
}))
