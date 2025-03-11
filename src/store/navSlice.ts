import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  lastDirection: "left" | "right";
}

const initialState: NavState = { lastDirection: "right" };

export default createSlice({
  name: "nav",
  initialState,
  reducers: {
    lastDirectionSet: (
      state,
      action: PayloadAction<NavState["lastDirection"]>,
    ) => {
      state.lastDirection = action.payload;
    },
  },
  selectors: {
    lastDirection: (state) => state.lastDirection,
  },
});
