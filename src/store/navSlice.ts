import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { lastDirection: "right" };

export default createSlice({
  name: "nav",
  initialState,
  reducers: {
    lastDirectionSet: (state, action: PayloadAction<string>) => {
      state.lastDirection = action.payload;
    },
  },
  selectors: {
    lastDirection: (state) => state.lastDirection,
  },
});
