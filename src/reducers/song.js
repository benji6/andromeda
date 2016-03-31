import {
  append,
  contains,
  equals,
  ifElse,
  lensProp,
  over,
  reject,
  set
} from 'ramda'
import {
  SET_SONG_ACTIVE_POSITION,
  SONG_CELL_CLICK
} from '../actions'

export const initialState = {
  activePosition: null,
  xLength: 4,
  yLength: 1,
  steps: []
}

const setActivePosition = set(lensProp('activePosition'))
const overSteps = over(lensProp('steps'))

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_SONG_ACTIVE_POSITION: return setActivePosition(payload, state)
    case SONG_CELL_CLICK: return overSteps(ifElse(
      contains(payload),
      reject(equals(payload)),
      append(payload)
    ), state)
    default: return state
  }
}
