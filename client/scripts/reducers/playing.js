import {UPDATE_PLAYING} from '../actions';

export default (state = false, {type, value}) => {
  switch (type) {
    case UPDATE_PLAYING:
      return value;
    default:
      return state;
  }
};
