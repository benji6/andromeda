import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const bpm = 140;

interface SettingsState {
  bpm: number;
}

const initialState: SettingsState = {
  bpm,
};

export default createSlice({
  name: "settings",
  initialState,
  reducers: {
    bpmSet: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },
  },
  selectors: {
    bpm: (state) => state.bpm,
  },
});
