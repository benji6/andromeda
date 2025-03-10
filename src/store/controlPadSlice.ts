import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SCALES } from "../constants";
import pitchToFrequency from "../audioHelpers/pitchToFrequency";
import { Instrument, Note, ScaleName } from "../types";

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
    currentNote: (state): Note | undefined => {
      if (!state.currentCoordinateRatios) return undefined;

      let pitch: number;
      if (state.noScale)
        pitch = 12 * state.range * state.currentCoordinateRatios.x;
      else {
        const scale = SCALES[state.selectedScale];
        const { length } = scale;
        const i = Math.floor(
          (length + 1) * state.range * state.currentCoordinateRatios.x,
        );
        pitch =
          scale[((i % length) + length) % length] + 12 * Math.floor(i / length);
      }

      return {
        frequency: pitchToFrequency(pitch + 12 * state.octave + state.rootNote),
        gain: state.currentCoordinateRatios.y,
        id: "CONTROL_PAD",
      };
    },
    hasBeenTouched: (state) => state.hasBeenTouched,
    instrument: (state) => state.instrument,
    noScale: (state) => state.noScale,
    octave: (state) => state.octave,
    range: (state) => state.range,
    rootNote: (state) => state.rootNote,
    selectedScale: (state) => state.selectedScale,
  },
});
