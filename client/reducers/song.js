import {UPDATE_SONG_NOTES} from '../actions';
import {repeat} from 'ramda';

export const initialState = {
  notes: repeat(repeat({selected: false, active: false}, 8), 1),
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_SONG_NOTES:
      return {...state, notes: value};
    default:
      return state;
  }
};
