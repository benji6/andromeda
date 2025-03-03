import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Instruments = "Ariadne" | "Prometheus";

interface ControlPadState {
  instrument: Instruments;
  hasBeenTouched: boolean;
  noScale: boolean;
  octave: number;
  range: number;
}

const initialState: ControlPadState = {
  instrument: "Ariadne",
  hasBeenTouched: false,
  noScale: false,
  octave: 0,
  range: 1,
};

export default createSlice({
  name: "controlPad",
  initialState,
  reducers: {
    instrumentSet: (state, action: PayloadAction<Instruments>) => {
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
    setHasBeenTouched: (state) => {
      state.hasBeenTouched = true;
    },
  },
  selectors: {
    instrument: (state) => state.instrument,
    hasBeenTouched: (state) => state.hasBeenTouched,
    noScale: (state) => state.noScale,
    octave: (state) => state.octave,
    range: (state) => state.range,
  },
});
