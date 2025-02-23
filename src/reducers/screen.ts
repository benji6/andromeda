import { SCREEN_RESIZE } from "../actions";

const initialState = {
  sideLength: 0,
  width: 0,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case SCREEN_RESIZE:
      return { ...state, ...payload };
    default:
      return state;
  }
};
