import {combineReducers} from 'redux'
import controlPad from '../reducers/controlPad'
import keyboard from '../reducers/keyboard'
import nav from '../reducers/nav'
import patternsBeat from '../reducers/patternsBeat'
import patternsSynth from '../reducers/patternsSynth'
import plugins from '../reducers/plugins'
import samples from '../reducers/samples'
import screen from '../reducers/screen'
import settings from '../reducers/settings'
import song from '../reducers/song'

export default combineReducers({
  controlPad,
  keyboard,
  nav,
  patternsBeat,
  patternsSynth,
  plugins,
  samples,
  screen,
  settings,
  song,
})
