import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScaleName } from "../constants/scales";

export type Instrument = "Ariadne" | "Prometheus";

interface CurrentCoordinateRatios {
  x: number;
  y: number;
}

interface ControlPadState {
  currentCoordinateRatios: CurrentCoordinateRatios | undefined;
  hasBeenTouched: boolean;
  instrument: Instrument;
  noScale: boolean;
  octave: number;
  range: number;
  rootNote: number;
  selectedScale: ScaleName;
}

const initialState: ControlPadState = {
  currentCoordinateRatios: undefined,
  hasBeenTouched: false,
  instrument: "Ariadne",
  noScale: false,
  octave: 0,
  range: 1,
  rootNote: 0,
  selectedScale: "pentatonic",
};

export default createSlice({
  name: "controlPad",
  initialState,
  reducers: {
    instrumentSet: (state, action: PayloadAction<Instrument>) => {
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
    rootNoteSet: (state, action: PayloadAction<number>) => {
      state.rootNote = action.payload;
    },
    selectedScaleSet: (state, action: PayloadAction<ScaleName>) => {
      state.selectedScale = action.payload;
    },
    setCurrentCoordinateRatios: (
      state,
      action: PayloadAction<CurrentCoordinateRatios | undefined>,
    ) => {
      state.currentCoordinateRatios = action.payload;
      if (!state.hasBeenTouched) state.hasBeenTouched = true;
    },
  },
  selectors: {
    hasBeenTouched: (state) => state.hasBeenTouched,
    instrument: (state) => state.instrument,
    noScale: (state) => state.noScale,
    octave: (state) => state.octave,
    range: (state) => state.range,
    rootNote: (state) => state.rootNote,
    selectedScale: (state) => state.selectedScale,
  },
});
