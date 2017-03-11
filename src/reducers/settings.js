import {assoc, merge} from 'ramda'
import {
  BPM_SET,
  ROOT_HUE_SET,
  ROOT_NOTE_SET,
  SELECTED_SCALE_SET,
} from '../actions'

const bpm = 140

const initialState = {
  bpm,
  noteDuration: 60 / bpm,
  rootHue: 0,
  rootNote: 0,
  selectedScale: 'pentatonic',
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case BPM_SET: return merge(state, {bpm: payload, noteDuration: 60 / payload})
    case ROOT_HUE_SET: return assoc('rootHue', payload, state)
    case ROOT_NOTE_SET: return assoc('rootNote', payload, state)
    case SELECTED_SCALE_SET: return assoc('selectedScale', payload, state)
    default: return state
  }
}
