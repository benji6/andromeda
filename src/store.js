import {combineReducers, createStore} from 'redux'
import arpeggiatorPatterns from './reducers/arpeggiatorPatterns'
import bpm from './reducers/bpm'
import controlPad from './reducers/controlPad'
import effects from './reducers/effects'
import keyboard from './reducers/keyboard'
import patterns from './reducers/patterns'
import plugins from './reducers/plugins'
import rootNote from './reducers/rootNote'
import scale from './reducers/scale'
import song from './reducers/song'

export default createStore(combineReducers({
  arpeggiatorPatterns,
  bpm,
  controlPad,
  effects,
  keyboard,
  patterns,
  plugins,
  rootNote,
  scale,
  song
}))
