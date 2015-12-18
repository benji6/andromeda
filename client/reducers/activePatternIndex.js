import {UPDATE_ACTIVE_PATTERN_INDEX} from '../actions'

export const initialState = 0

export default (state = initialState, {type, payload}) => type === UPDATE_ACTIVE_PATTERN_INDEX ?
  payload :
  state
