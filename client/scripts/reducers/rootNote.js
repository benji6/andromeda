import {UPDATE_ROOT_NOTE} from '../actions/types';

export default (state = 0, {type, value}) => {
  switch (type) {
    case UPDATE_ROOT_NOTE:
      return value;
    default:
      return state;
  }
};
