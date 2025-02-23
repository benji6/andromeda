import { NAV_LAST_DIRECTION_SET } from "../actions";

export const initialState = { lastDirection: "right" };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case NAV_LAST_DIRECTION_SET:
      return { ...state, lastDirection: payload };
    default:
      return state;
  }
};
