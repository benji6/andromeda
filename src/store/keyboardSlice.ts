import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Instrument, Note } from "../types";
import { KEY_CODES_TO_PITCHES } from "../constants";
import pitchToFrequency from "../audioHelpers/pitchToFrequency";

interface KeyboardState {
  instrument: Instrument;
  monophonic: boolean;
  octave: number;
  pressedKeyCodes: number[];
  volume: number;
}

const initialState: KeyboardState = {
  instrument: "Prometheus",
  monophonic: false,
  octave: 0,
  pressedKeyCodes: [],
  volume: 0.2,
};

const isValidKeyCode = (
  keyCode: number,
): keyCode is keyof typeof KEY_CODES_TO_PITCHES =>
  keyCode in KEY_CODES_TO_PITCHES;

export default createSlice({
  name: "keyboard",
  initialState,
  reducers: {
    instrumentSet: (state, action: PayloadAction<Instrument>) => {
      state.instrument = action.payload;
    },
    monophonicSet: (state, action: PayloadAction<boolean>) => {
      state.monophonic = action.payload;
    },
    octaveSet: (state, action: PayloadAction<number>) => {
      state.octave = action.payload;
    },
    pressedKeyCodesAdd: (state, action: PayloadAction<number>) => {
      state.pressedKeyCodes.push(action.payload);
    },
    pressedKeyCodesRemove: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        pressedKeyCodes: state.pressedKeyCodes.filter(
          (keyCode) => keyCode !== action.payload,
        ),
      };
    },
    volumeSet: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
  selectors: {
    currentNotes: (state): Note[] => {
      // TODO add monophony
      // if (state.keyboard.monophonic) {
      //   for (const code of pressedKeyCodes)
      //     if (isValidKeyCode(code) && code !== keyCode) stopAndRemoveNote(code);
      // }
      return state.pressedKeyCodes.filter(isValidKeyCode).map((keyCode) => {
        const pitch = KEY_CODES_TO_PITCHES[keyCode];
        return {
          frequency: pitchToFrequency(pitch + 12 * state.octave),
          gain: state.volume,
          id: `keyboard-pitch:${pitch}`,
        };
      });
    },
    instrument: (state) => state.instrument,
    monophonic: (state) => state.monophonic,
    octave: (state) => state.octave,
    pressedKeyCodes: (state) => state.pressedKeyCodes,
    volume: (state) => state.volume,
  },
});
