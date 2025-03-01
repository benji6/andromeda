import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScreenSize {
  sideLength: number;
  width: number;
}

const initialState: ScreenSize = {
  sideLength: 0,
  width: 0,
};

export default createSlice({
  name: "screen",
  initialState,
  reducers: {
    screenResize: (state, action: PayloadAction<ScreenSize>) => {
      return { ...state, ...action.payload };
    },
  },
  selectors: {
    sideLength: (state: ScreenSize) => state.sideLength,
  },
});
