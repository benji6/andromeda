/* global R */
const {merge} = R;

const initialState = {
  effects: [
    'pingPongDelay',
    'none',
  ],
  selectedEffect: 'pingPongDelay',
};

export default (state = initialState, {type, value}) => {
  switch (type) {
    case 'UPDATE_SELECTED_EFFECT':
      return merge(state, {selectedEffect: value});
    default:
      return state;
  }
};
