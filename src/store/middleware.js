import {applyMiddleware} from 'redux'
import createActionBuffer from 'redux-action-buffer'
import {REHYDRATE} from 'redux-persist/constants'
import bpm from '../middlewareRedux/bpm'
import cssVars from '../middlewareRedux/cssVars'
import patternsBeat from '../middlewareRedux/patternsBeat'
import patternsSynth from '../middlewareRedux/patternsSynth'
import samples from '../middlewareRedux/samples'
import song from '../middlewareRedux/song'

const noopMiddleware = () => next => action => next(action)

export default applyMiddleware(
  createActionBuffer(REHYDRATE),
  bpm,
  patternsBeat,
  patternsSynth,
  process.env.NODE_ENV === 'test' ? noopMiddleware : cssVars,
  samples,
  song,
)
