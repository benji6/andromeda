import { BPM_SET, ROOT_NOTE_SET, SELECTED_SCALE_SET } from "../actions";

const bpm = 140;

const initialState = {
  bpm,
  noteDuration: 60 / bpm,
  rootNote: 0,
  selectedScale: "pentatonic",
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case BPM_SET:
      return { ...state, bpm: payload, noteDuration: 60 / payload };
    case ROOT_NOTE_SET:
      return { ...state, rootNote: payload };
    case SELECTED_SCALE_SET:
      return { ...state, selectedScale: payload };
    default:
      return state;
  }
};
