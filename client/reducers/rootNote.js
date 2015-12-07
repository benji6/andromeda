import {UPDATE_ROOT_NOTE} from '../actions';
export default (state = 0, {type, payload}) => type === UPDATE_ROOT_NOTE ? payload : state;
