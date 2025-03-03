import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Instruments = "Ariadne" | "Prometheus";

interface CurrentCoordinateRatios {
  x: number;
  y: number;
}

interface ControlPadState {
  currentCoordinateRatios: CurrentCoordinateRatios | undefined;
  hasBeenTouched: boolean;
  instrument: Instruments;
  noScale: boolean;
  octave: number;
  range: number;
}

const initialState: ControlPadState = {
  currentCoordinateRatios: undefined,
  hasBeenTouched: false,
  instrument: "Ariadne",
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
    setCurrentCoordinateRatios: (
      state,
      action: PayloadAction<CurrentCoordinateRatios>,
    ) => {
      state.currentCoordinateRatios = action.payload;
      if (!state.hasBeenTouched) state.hasBeenTouched = true;
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
