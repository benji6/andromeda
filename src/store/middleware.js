import {applyMiddleware} from 'redux'
import createActionBuffer from 'redux-action-buffer'
import {REHYDRATE} from 'redux-persist/constants'
import bpm from '../middlewareRedux/bpm'
import patternsBeat from '../middlewareRedux/patternsBeat'
import patternsSynth from '../middlewareRedux/patternsSynth'
import samples from '../middlewareRedux/samples'
import song from '../middlewareRedux/song'

export default applyMiddleware(
  createActionBuffer(REHYDRATE),
  bpm,
  patternsBeat,
  patternsSynth,
  samples,
  song,
)
