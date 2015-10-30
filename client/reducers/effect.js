import {ADD_EFFECT,
        UPDATE_SELECTED_EFFECT} from '../actions';

export const initialState = {
  effects: [
    'pingPongDelay',
    'none',
  ],
  selectedEffect: 'pingPongDelay',
};

const actions = {[UPDATE_SELECTED_EFFECT]: (state, value) => ({...state, selectedEffect: value}),
                 [ADD_EFFECT]: (state, value) => ({...state, effects: [...state.effects, value]})};

export default (state = initialState, {type, value}) =>
  actions[type] ? actions[type](state, value) : state;
