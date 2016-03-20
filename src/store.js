import {combineReducers, createStore} from 'redux'
import activePatternIndex from './reducers/activePatternIndex'
import arpeggiatorPatterns from './reducers/arpeggiatorPatterns'
import bpm from './reducers/bpm'
import controlPad from './reducers/controlPad'
import effects from './reducers/effects'
import keyboard from './reducers/keyboard'
import patterns from './reducers/patterns'
import playing from './reducers/playing'
import plugins from './reducers/plugins'
import rootNote from './reducers/rootNote'
import scale from './reducers/scale'
import song from './reducers/song'

export default createStore(combineReducers({
  activePatternIndex,
  arpeggiatorPatterns,
  bpm,
  controlPad,
  effects,
  keyboard,
  patterns,
  playing,
  plugins,
  rootNote,
  scale,
  song
}))
