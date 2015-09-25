import {UPDATE_ACTIVE_PATTERN} from '../actions';
import {repeat, update} from 'ramda';

export const initialState = {
  patterns: [repeat(repeat({selected: false,
                            active: false}, 8), 8)],
  activePattern: 0,
};

export default (state = initialState,
                {type, value}) => type === UPDATE_ACTIVE_PATTERN ?
                {...state, patterns: update(state.activePattern, value, state.patterns)} :
                state;
