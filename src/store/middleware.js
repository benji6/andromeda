import {applyMiddleware} from 'redux'
import createActionBuffer from 'redux-action-buffer'
import {REHYDRATE} from 'redux-persist/constants'
import bpm from '../middlewareRedux/bpm'

export default applyMiddleware(
  createActionBuffer(REHYDRATE),
  bpm,
)
