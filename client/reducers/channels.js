import {UPDATE_BPM} from '../actions';

export const initialState = [
  {
    sources: [
      'sine',
    ],
    effects: [
      'pingPongDelay',
    ],
  },
  {
    sources: [
      'sine',
    ],
    effects: [
      'pingPongDelay',
    ],
  },
];

export default (state = initialState, {type, value}) => {
  switch (type) {
    case 'ghaffs':
      return {...state, value};
    default:
      return state;
  }
};
