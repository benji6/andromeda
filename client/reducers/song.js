import {UPDATE_SONG_NOTES} from '../actions';

export const initialState = {
  activePosition: null,
  xLength: 8,
  yLength: 3,
  steps: [],
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_SONG_NOTES:
      return {...state, notes: value};
    default:
      return state;
  }
};
