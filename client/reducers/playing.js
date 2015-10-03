import {UPDATE_PLAYING} from '../actions';

export const initialState = false;

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_PLAYING:
      return value;
    default:
      return state;
  }
};
