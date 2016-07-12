import {applyMiddleware, combineReducers, createStore} from 'redux'
import middleWareBpm from './middlewareRedux/bpm'
import middlewarePattern from './middlewareRedux/pattern'
import middlewareSamples from './middlewareRedux/samples'
import middlewareSong from './middlewareRedux/song'
import controlPad from './reducers/controlPad'
import keyboard from './reducers/keyboard'
import patterns from './reducers/patterns'
import plugins from './reducers/plugins'
import samples from './reducers/samples'
import settings from './reducers/settings'
import song from './reducers/song'

export default createStore(combineReducers({
  controlPad,
  keyboard,
  patterns,
  plugins,
  samples,
  settings,
  song,
}), applyMiddleware(
  middleWareBpm,
  middlewarePattern,
  middlewareSamples,
  middlewareSong,
))
