import {assoc} from 'ramda'
import {SAMPLE_FETCHED} from '../actions'

const initialState = {}

export default (state = initialState, {payload, type}) => {
  switch (type) {
    case SAMPLE_FETCHED:
      return assoc(...payload, state)
    default: return state
  }
}
