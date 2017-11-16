import {applyMiddleware} from 'redux'
import createActionBuffer from 'redux-action-buffer'
import {REHYDRATE} from 'redux-persist/constants'
import bpm from '../middlewareRedux/bpm'
import samples from '../middlewareRedux/samples'

export default applyMiddleware(
  createActionBuffer(REHYDRATE),
  bpm,
  samples,
)
