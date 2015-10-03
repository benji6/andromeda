import {UPDATE_ACTIVE_PATTERN_INDEX} from '../actions';

export const initialState = 0;

export default (state = initialState, {type, value}) => type === UPDATE_ACTIVE_PATTERN_INDEX ?
  value :
  state;
