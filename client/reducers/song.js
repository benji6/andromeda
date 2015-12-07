import {UPDATE_SONG_NOTES} from '../actions';

export const initialState = {
  activePosition: null,
  xLength: 8,
  yLength: 3,
  steps: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case UPDATE_SONG_NOTES:
      return {...state, notes: payload};
    default:
      return state;
  }
};
