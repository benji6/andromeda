import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const bpm = 140;

const initialState = {
  bpm,
  rootNote: 0,
  selectedScale: "pentatonic",
};

export default createSlice({
  name: "settings",
  initialState,
  reducers: {
    bpmSet: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },
    rootNoteSet: (state, action: PayloadAction<number>) => {
      state.rootNote = action.payload;
    },
    selectedScaleSet: (state, action: PayloadAction<string>) => {
      state.selectedScale = action.payload;
    },
  },
  selectors: {
    bpm: (state) => state.bpm,
    rootNote: (state) => state.rootNote,
    selectedScale: (state) => state.selectedScale,
  },
});
