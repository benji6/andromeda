import { createElement } from "react";
import { connect } from "react-redux";
import { controllableInstrumentInstanceNames } from "../../utils/derivedData";
import InstrumentSelector from "../molecules/InstrumentSelector";
import {
  keyboardMonophonicSet,
  keyboardInstrumentSet,
  keyboardOctaveSet,
  keyboardVolumeSet,
} from "../../actions";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import { capitalizeWords } from "../../utils/helpers";

const mapStateToProps = ({ keyboard, plugins }) => ({ keyboard, plugins });

export default connect(mapStateToProps)(({ keyboard, dispatch, plugins }) =>
  createElement(
    "div",
    { className: "KeyboardSettings" },
    createElement("h2", null, "Keyboard Settings"),
    createElement(InstrumentSelector, {
      defaultValue: keyboard.instrument,
      handleChange: (e) =>
        dispatch(keyboardInstrumentSet(e.currentTarget.value)),
      label: "Instrument",
      options: controllableInstrumentInstanceNames(plugins).map(
        (instrument) => ({
          text: capitalizeWords(instrument),
          value: instrument,
        }),
      ),
    }),
    createElement(
      RangeLabelled,
      {
        max: 1,
        min: 0,
        onChange: (e) =>
          dispatch(keyboardVolumeSet(Number(e.currentTarget.value))),
        output: Math.round(keyboard.volume * 100),
        step: 0.01,
        value: keyboard.volume,
      },
      "Volume",
    ),
    createElement(
      RangeLabelled,
      {
        max: 2,
        min: -3,
        onChange: (e) =>
          dispatch(keyboardOctaveSet(Number(e.currentTarget.value))),
        output: keyboard.octave,
        value: keyboard.octave,
      },
      "Octave",
    ),
    createElement(
      CheckboxLabelled,
      {
        checked: keyboard.monophonic,
        onChange: (e) => dispatch(keyboardMonophonicSet(e.target.checked)),
      },
      "Monophonic",
    ),
    createElement(
      "div",
      null,
      createElement(InputLabel),
      createElement(ButtonPrimary, { to: "/settings" }, "OK"),
    ),
  ),
);
