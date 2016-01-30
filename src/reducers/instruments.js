import {assoc} from 'ramda'
import {ADD_INSTRUMENT} from '../actions'

export default (state = {}, {meta, payload, type}) => {
  switch (type) {
    case ADD_INSTRUMENT: return assoc(meta, payload, state)
    default: return state
  }
}
