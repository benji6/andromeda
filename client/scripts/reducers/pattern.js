/* global R */
import {UPDATE_PATTERN} from '../actions';

const {repeat} = R;

export default (state = repeat(repeat(false, 8), 8), {type, value}) => {
  switch (type) {
    case UPDATE_PATTERN:
      return value;
    default:
      return state;
  }
};
