import { createElement } from "react";
import { connect } from "react-redux";
import { controllableInstrumentInstanceNames } from "../../utils/derivedData";
import {
  controlPadInstrumentSet,
  controlPadNoScaleSet,
  controlPadOctaveSet,
  controlPadRangeSet,
} from "../../actions";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import InstrumentSelector from "../molecules/InstrumentSelector";
import { capitalizeWords } from "../../utils/helpers";

const mapStateToProps = ({ controlPad, dispatch, plugins }) => ({
  controlPad,
  dispatch,
  plugins,
});

export default connect(mapStateToProps)(({ controlPad, dispatch, plugins }) =>
  createElement(
    "div",
    { className: "ControlPadSettings" },
    createElement("h2", null, "Control Pad Settings"),
    createElement(InstrumentSelector, {
      defaultValue: controlPad.instrument,
      handleChange: (e) =>
        dispatch(controlPadInstrumentSet(e.currentTarget.value)),
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
        max: 2,
        min: -3,
        onChange: (e) =>
          dispatch(controlPadOctaveSet(Number(e.currentTarget.value))),
        output: controlPad.octave,
        value: controlPad.octave,
      },
      "Octave",
    ),
    createElement(
      RangeLabelled,
      {
        max: 3,
        min: 1,
        onChange: (e) =>
          dispatch(controlPadRangeSet(Number(e.currentTarget.value))),
        output: controlPad.range,
        value: controlPad.range,
      },
      "Range",
    ),
    createElement(
      CheckboxLabelled,
      {
        checked: controlPad.noScale,
        onChange: (e) =>
          dispatch(controlPadNoScaleSet(e.currentTarget.checked)),
      },
      "No Scale",
    ),
    createElement(
      "div",
      null,
      createElement(InputLabel),
      createElement(ButtonPrimary, { to: "/controllers/control-pad" }, "OK"),
    ),
  ),
);
