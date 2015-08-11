/* global R */
const {merge} = R;

const initialState = {
  scales: {
    'harmonic minor': [0, 2, 3, 5, 7, 8, 11, 12],
    major: [0, 2, 4, 5, 7, 9, 11, 12],
    minor: [0, 2, 3, 5, 7, 8, 10, 12],
    none: null,
    pentatonic: [0, 3, 5, 7, 10, 12],
    phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
    'phrygian dominant': [0, 1, 4, 5, 7, 8, 10, 12],
    wholetone: [0, 2, 4, 6, 8, 10, 12],
  },
  scaleName: 'major',
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case 'UPDATE_SELECTED_SCALE':
      return merge(state, {scaleName: value});
    default:
      return state;
  }
};
