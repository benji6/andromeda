import {UPDATE_SELECTED_SCALE} from '../actions';
import circularIterable from 'circular-iterable';

const initialState = {
  scales: {
    'harmonic minor': circularIterable(0, 2, 3, 5, 7, 8, 11),
    major: circularIterable(0, 2, 4, 5, 7, 9, 11),
    minor: circularIterable(0, 2, 3, 5, 7, 8, 10),
    none: null,
    pentatonic: circularIterable(0, 3, 5, 7, 10),
    phrygian: circularIterable(0, 1, 3, 5, 7, 8, 10),
    'phrygian dominant': circularIterable(0, 1, 4, 5, 7, 8, 10),
    wholetone: circularIterable(0, 2, 4, 6, 8, 10),
  },
  scaleName: 'pentatonic',
};

export default (state = initialState, {type, value}) =>
  type === UPDATE_SELECTED_SCALE ?
    {...state, scaleName: value} :
    state;
