import { assoc } from "ramda";
import {
  CONTROL_PAD_TOUCHED,
  CONTROL_PAD_INSTRUMENT_SET,
  CONTROL_PAD_NO_SCALE_SET,
  CONTROL_PAD_OCTAVE_SET,
  CONTROL_PAD_PORTAMENTO_SET,
  CONTROL_PAD_RANGE_SET,
} from "../actions";

export const initialState = {
  instrument: "Ariadne",
  isTouched: false,
  noScale: false,
  octave: 0,
  portamento: false,
  range: 1,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CONTROL_PAD_INSTRUMENT_SET:
      return assoc("instrument", payload, state);
    case CONTROL_PAD_NO_SCALE_SET:
      return assoc("noScale", payload, state);
    case CONTROL_PAD_OCTAVE_SET:
      return assoc("octave", payload, state);
    case CONTROL_PAD_PORTAMENTO_SET:
      return assoc("portamento", payload, state);
    case CONTROL_PAD_RANGE_SET:
      return assoc("range", payload, state);
    case CONTROL_PAD_TOUCHED:
      return assoc("isTouched", true, state);
    default:
      return state;
  }
};
