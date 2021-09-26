import capitalize from "capitalize";
import { compose } from "ramda";
import { createElement } from "react";
import { connect } from "react-redux";
import { controllableInstrumentInstanceNames } from "../../utils/derivedData";
import { eventValuePath, eventCheckedPath } from "../../utils/dom";
import {
  controlPadInstrumentSet,
  controlPadNoScaleSet,
  controlPadOctaveSet,
  controlPadPortamentoSet,
  controlPadRangeSet,
} from "../../actions";
import ButtonPrimary from "../atoms/ButtonPrimary";
import InputLabel from "../atoms/InputLabel";
import CheckboxLabelled from "../molecules/CheckboxLabelled";
import RangeLabelled from "../molecules/RangeLabelled";
import InstrumentSelector from "../molecules/InstrumentSelector";

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
      handleChange: compose(dispatch, controlPadInstrumentSet, eventValuePath),
      label: "Instrument",
      options: controllableInstrumentInstanceNames(plugins).map(
        (instrument) => ({
          text: capitalize.words(instrument),
          value: instrument,
        })
      ),
    }),
    createElement(
      RangeLabelled,
      {
        max: 2,
        min: -3,
        onChange: compose(
          dispatch,
          controlPadOctaveSet,
          Number,
          eventValuePath
        ),
        output: controlPad.octave,
        value: controlPad.octave,
      },
      "Octave"
    ),
    createElement(
      RangeLabelled,
      {
        max: 3,
        min: 1,
        onChange: compose(dispatch, controlPadRangeSet, Number, eventValuePath),
        output: controlPad.range,
        value: controlPad.range,
      },
      "Range"
    ),
    createElement(
      CheckboxLabelled,
      {
        checked: controlPad.portamento,
        onChange: compose(dispatch, controlPadPortamentoSet, eventCheckedPath),
      },
      "Portamento"
    ),
    createElement(
      CheckboxLabelled,
      {
        checked: controlPad.noScale,
        onChange: compose(dispatch, controlPadNoScaleSet, eventCheckedPath),
      },
      "No Scale"
    ),
    createElement(
      "div",
      null,
      createElement(InputLabel),
      createElement(ButtonPrimary, { to: "/controllers/control-pad" }, "OK")
    )
  )
);
