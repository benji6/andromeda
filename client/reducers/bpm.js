import {UPDATE_BPM} from '../actions';

export const initialState = 140;

export default (state = initialState, {type, payload}) => type === UPDATE_BPM ?
  payload :
  state;
