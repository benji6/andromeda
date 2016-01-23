import {ADD_EFFECT} from '../actions'

export const initialState = [
  'pingPongDelay',
  'none'
]

const actions = {[ADD_EFFECT]: (state, payload) => ([...state, payload])}

export default (state = initialState, {type, payload}) =>
  actions[type] ? actions[type](state, payload) : state
