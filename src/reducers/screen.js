import { merge } from "ramda";
import { SCREEN_RESIZE } from "../actions";

const initialState = {
  sideLength: 0,
  width: 0,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case SCREEN_RESIZE:
      return merge(state, payload);
    default:
      return state;
  }
};
