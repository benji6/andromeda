import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Instrument, Note } from "../types";

interface KeyboardState {
  instrument: Instrument;
  monophonic: boolean;
  octave: number;
  volume: number;
  currentNotes: Note[];
}

const initialState: KeyboardState = {
  instrument: "Prometheus",
  monophonic: false,
  octave: 0,
  volume: 0.2,
  currentNotes: [],
};

export default createSlice({
  name: "keyboard",
  initialState,
  reducers: {
    currentNotesSet: (state, action: PayloadAction<Note[]>) => {
      state.currentNotes = action.payload;
    },
    instrumentSet: (state, action: PayloadAction<Instrument>) => {
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
    currentNotes: (state) => state.currentNotes,
    instrument: (state) => state.instrument,
    monophonic: (state) => state.monophonic,
    octave: (state) => state.octave,
    volume: (state) => state.volume,
  },
});
