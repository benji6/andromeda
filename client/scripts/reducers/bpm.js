import {UPDATE_BPM} from '../actions';

export const initialState = 140;

export default (state = initialState, {type, value}) => type === UPDATE_BPM ?
  value :
  state;
