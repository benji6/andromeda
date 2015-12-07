import {UPDATE_PLAYING} from '../actions';

export const initialState = false;

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_PLAYING:
      return payload;
    default:
      return state;
  }
};
