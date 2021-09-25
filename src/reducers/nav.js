import { assoc } from "ramda";
import { NAV_LAST_DIRECTION_SET } from "../actions";

export const initialState = { lastDirection: "right" };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case NAV_LAST_DIRECTION_SET:
      return assoc("lastDirection", payload, state);
    default:
      return state;
  }
};
