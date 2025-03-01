import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  instrument: "Prometheus",
  monophonic: false,
  octave: 0,
  volume: 0.2,
};

export default createSlice({
  name: "keyboard",
  initialState,
  reducers: {
    instrumentSet: (state, action: PayloadAction<string>) => {
      state.instrument = action.payload;
    },
    monophonicSet: (state, action: PayloadAction<boolean>) => {
      state.monophonic = action.payload;
    },
    octaveSet: (state, action: PayloadAction<number>) => {
      state.octave = action.payload;
    },
    volumeSet: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
  selectors: {
    instrument: (state) => state.instrument,
    monophonic: (state) => state.monophonic,
    octave: (state) => state.octave,
    volume: (state) => state.volume,
  },
});
