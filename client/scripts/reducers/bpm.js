import {UPDATE_BPM} from '../actions';

export default (state = 140, {type, value}) => type === UPDATE_BPM ?
  value :
  state;
