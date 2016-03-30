import {lensProp, set} from 'ramda'
import {
  SET_SONG_ACTIVE_POSITION
} from '../actions'

export const initialState = {
  activePosition: null,
  xLength: 4,
  yLength: 1,
  steps: []
}

const setActivePosition = set(lensProp('activePosition'))

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_SONG_ACTIVE_POSITION: return setActivePosition(payload, state)
    default: return state
  }
}
