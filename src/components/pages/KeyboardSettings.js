import capitalize from "capitalize";
import { compose, map } from "ramda";
import { createElement } from "react";
import { connect } from "react-redux";
import { controllableInstrumentInstanceNames } from "../../utils/derivedData";
import { eventValuePath } from "../../utils/dom";
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

const mapStateToProps = ({ keyboard, plugins }) => ({ keyboard, plugins });

export default connect(mapStateToProps)(({ keyboard, dispatch, plugins }) =>
  createElement(
    "div",
    { className: "KeyboardSettings" },
    createElement("h2", null, "Keyboard Settings"),
    createElement(InstrumentSelector, {
      defaultValue: keyboard.instrument,
      handleChange: compose(dispatch, keyboardInstrumentSet, eventValuePath),
      label: "Instrument",
      options: map(
        (instrument) => ({
          text: capitalize.words(instrument),
          value: instrument,
        }),
        controllableInstrumentInstanceNames(plugins)
      ),
    }),
    createElement(
      RangeLabelled,
      {
        max: 1,
        min: 0,
        onChange: compose(dispatch, keyboardVolumeSet, Number, eventValuePath),
        output: Math.round(keyboard.volume * 100),
        step: 0.01,
        value: keyboard.volume,
      },
      "Volume"
    ),
    createElement(
      RangeLabelled,
      {
        max: 2,
        min: -3,
        onChange: compose(dispatch, keyboardOctaveSet, Number, eventValuePath),
        output: keyboard.octave,
        value: keyboard.octave,
      },
      "Octave"
    ),
    createElement(
      CheckboxLabelled,
      {
        checked: keyboard.monophonic,
        onChange: (e) => dispatch(keyboardMonophonicSet(e.target.checked)),
      },
      "Monophonic"
    ),
    createElement(
      "div",
      null,
      createElement(InputLabel),
      createElement(ButtonPrimary, { to: "/settings" }, "OK")
    )
  )
);
