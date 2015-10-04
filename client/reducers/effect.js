import {ADD_EFFECT,
        UPDATE_SELECTED_EFFECT} from '../actions';

export const initialState = {
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
    case ADD_EFFECT:
      return {...state, effects: [...state.effects, value]};
    default:
      return state;
  }
};
