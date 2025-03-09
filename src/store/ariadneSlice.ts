import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AriadneState {
  carrierDetune: number;
  carrierOscType: OscillatorType;
  masterGain: number;
  masterPan: number;
  modulatorDetune: number;
  modulatorOscType: OscillatorType;
  modulatorRatio: number;
}

const initialState: AriadneState = {
  carrierDetune: 0,
  carrierOscType: "sine",
  masterGain: 1,
  masterPan: 0,
  modulatorDetune: 0,
  modulatorOscType: "sine",
  modulatorRatio: 2.5,
};

export default createSlice({
  name: "ariadne",
  initialState,
  reducers: {
    carrierDetuneSet: (state, action: PayloadAction<number>) => {
      state.carrierDetune = action.payload;
    },
    carrierOscTypeSet: (state, action: PayloadAction<OscillatorType>) => {
      state.carrierOscType = action.payload;
    },
    masterGainSet: (state, action: PayloadAction<number>) => {
      state.masterGain = action.payload;
    },
    masterPanSet: (state, action: PayloadAction<number>) => {
      state.masterPan = action.payload;
    },
    modulatorDetuneSet: (state, action: PayloadAction<number>) => {
      state.modulatorDetune = action.payload;
    },
    modulatorOscTypeSet: (state, action: PayloadAction<OscillatorType>) => {
      state.modulatorOscType = action.payload;
    },
    modulatorRatioSet: (state, action: PayloadAction<number>) => {
      state.modulatorRatio = action.payload;
    },
  },
  selectors: {
    carrierDetune: (state) => state.carrierDetune,
    carrierOscType: (state) => state.carrierOscType,
    masterGain: (state) => state.masterGain,
    masterPan: (state) => state.masterPan,
    modulatorDetune: (state) => state.modulatorDetune,
    modulatorOscType: (state) => state.modulatorOscType,
    modulatorRatio: (state) => state.modulatorRatio,
  },
});
