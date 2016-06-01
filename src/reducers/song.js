import {assoc} from 'ramda'
import {
  SONG_ACTIVE_NOTES_SET,
  SONG_PLAYING_START,
  SONG_PLAYING_STOP,
} from '../actions'

const initialState = {
  activeNotes: [],
  playing: false,
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SONG_ACTIVE_NOTES_SET: return assoc('activeNotes', payload, state)
    case SONG_PLAYING_START: return assoc('playing', true, state)
    case SONG_PLAYING_STOP: return {...state, activeNotes: [], playing: false}
    default: return state
  }
}
