import {UPDATE_PATTERN} from '../actions';

const {repeat} = R;

export default (state = repeat(repeat({selected: false,
                                       active: false}, 8), 8), {type, value}) =>
  type === UPDATE_PATTERN ? value : state;
