import {ADD_EFFECT} from '../actions';

export const initialState = [
  'pingPongDelay',
  'none',
];

const actions = {[ADD_EFFECT]: (state, value) => ([...state, value])};

export default (state = initialState, {type, value}) =>
  actions[type] ? actions[type](state, value) : state;
