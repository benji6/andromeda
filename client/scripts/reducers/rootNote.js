import {UPDATE_ROOT_NOTE} from '../actions';
export default (state = 0, {type, value}) => type === UPDATE_ROOT_NOTE ? value : state;
