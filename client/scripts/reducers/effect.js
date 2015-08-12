import {UPDATE_SELECTED_EFFECT} from '../actions/types';

const initialState = {
  effects: [
    'pingPongDelay',
    'none',
  ],
  selectedEffect: 'pingPongDelay',
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case UPDATE_SELECTED_EFFECT:
      return {...state, selectedEffect: value};
    default:
      return state;
  }
};
