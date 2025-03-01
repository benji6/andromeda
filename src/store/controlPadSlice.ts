import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  instrument: "Ariadne",
  isTouched: false,
  noScale: false,
  octave: 0,
  range: 1,
};

export default createSlice({
  name: "controlPad",
  initialState,
  reducers: {
    instrumentSet: (state, action: PayloadAction<string>) => {
      state.instrument = action.payload;
    },
    noScaleSet: (state, action: PayloadAction<boolean>) => {
      state.noScale = action.payload;
    },
    octaveSet: (state, action: PayloadAction<number>) => {
      state.octave = action.payload;
    },
    rangeSet: (state, action: PayloadAction<number>) => {
      state.range = action.payload;
    },
    isTouched: (state) => {
      state.isTouched = true;
    },
  },
  selectors: {
    instrument: (state) => state.instrument,
    isTouched: (state) => state.isTouched,
    noScale: (state) => state.noScale,
    octave: (state) => state.octave,
    range: (state) => state.range,
  },
});
