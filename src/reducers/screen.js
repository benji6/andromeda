import {merge} from 'ramda'
import {SCREEN_RESIZE} from '../actions'

const initialState = {
  sideLength: null,
  width: null,
}

export default (state = initialState, {payload, type}) => {
  switch (type) {
    case SCREEN_RESIZE: return merge(state, payload)
    default: return state
  }
}
