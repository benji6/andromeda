import {
  CONTROL_PAD_TOUCHED,
  CONTROL_PAD_INSTRUMENT_SET,
  CONTROL_PAD_NO_SCALE_SET,
  CONTROL_PAD_OCTAVE_SET,
  CONTROL_PAD_RANGE_SET,
} from "../actions";

export const initialState = {
  instrument: "Ariadne",
  isTouched: false,
  noScale: false,
  octave: 0,
  range: 1,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CONTROL_PAD_INSTRUMENT_SET:
      return { ...state, instrument: payload };
    case CONTROL_PAD_NO_SCALE_SET:
      return { ...state, noScale: payload };
    case CONTROL_PAD_OCTAVE_SET:
      return { ...state, octave: payload };
    case CONTROL_PAD_RANGE_SET:
      return { ...state, range: payload };
    case CONTROL_PAD_TOUCHED:
      return { ...state, isTouched: true };
    default:
      return state;
  }
};
