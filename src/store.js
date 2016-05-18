import {applyMiddleware, combineReducers, createStore} from 'redux'
import actionSideEffects from './actionSideEffects'
import controlPad from './reducers/controlPad'
import keyboard from './reducers/keyboard'
import patterns from './reducers/patterns'
import plugins from './reducers/plugins'
import settings from './reducers/settings'

export default createStore(combineReducers({
  controlPad,
  keyboard,
  patterns,
  plugins,
  settings,
}), applyMiddleware(actionSideEffects))
