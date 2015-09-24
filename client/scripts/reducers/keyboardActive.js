import {UPDATE_KEYBOARD_ACTIVE} from '../actions';
// the idea is that you can disable the keyboard when you know the user
// is using the keyboard for inputting data, but it's not currently implemented
export default (state = true, {type, value}) => type === UPDATE_KEYBOARD_ACTIVE ? value : state;
