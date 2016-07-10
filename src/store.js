import {applyMiddleware, combineReducers, createStore} from 'redux'
import bpmMiddleware from './middlewareRedux/bpmMiddleware'
import patternMiddleware from './middlewareRedux/patternMiddleware'
import songMiddleware from './middlewareRedux/songMiddleware'
import controlPad from './reducers/controlPad'
import keyboard from './reducers/keyboard'
import patterns from './reducers/patterns'
import plugins from './reducers/plugins'
import settings from './reducers/settings'
import song from './reducers/song'

export default createStore(combineReducers({
  controlPad,
  keyboard,
  patterns,
  plugins,
  settings,
  song,
}), applyMiddleware(
  bpmMiddleware,
  patternMiddleware,
  songMiddleware
))
