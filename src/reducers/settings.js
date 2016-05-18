import {assoc} from 'ramda'
import {
  BPM_SET,
  UPDATE_ROOT_NOTE,
  UPDATE_SELECTED_SCALE,
} from '../actions'

const initialState = {
  bpm: 140,
  rootNote: 0,
  selectedScale: 'pentatonic',
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case BPM_SET: return assoc('bpm', payload, state)
    case UPDATE_ROOT_NOTE: return assoc('rootNote', payload, state)
    case UPDATE_SELECTED_SCALE: return assoc('selectedScale', payload, state)
    default: return state
  }
}
