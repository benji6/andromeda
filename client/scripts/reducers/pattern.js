import {UPDATE_PATTERN} from '../actions';

const initialState = Array.apply(0, {length:8})
  .map(() => Array.apply(0, {length:8}));

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_PATTERN:
      return value;
    default:
      return state;
  }
};
