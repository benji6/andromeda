import {assoc, merge} from 'ramda'
import {
  BPM_SET,
  UPDATE_ROOT_NOTE,
  UPDATE_SELECTED_SCALE,
} from '../actions'

const bpm = 140

const initialState = {
  bpm: 140,
  noteDuration: 60 / bpm,
  rootNote: 0,
  selectedScale: 'pentatonic',
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case BPM_SET: return merge(state, {bpm: payload, noteDuration: 60 / payload})
    case UPDATE_ROOT_NOTE: return assoc('rootNote', payload, state)
    case UPDATE_SELECTED_SCALE: return assoc('selectedScale', payload, state)
    default: return state
  }
}
