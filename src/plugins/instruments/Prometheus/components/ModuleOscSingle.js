import { createElement } from "react";
import ControlModule, {
  Range,
  Select,
} from "../../../../components/organisms/ControlModule";

const SelectOscType = ({ defaultValue, onChange }) =>
  createElement(
    Select,
    {
      defaultValue,
      label: "Type",
      onChange,
    },
    createElement("option", { value: "sawtooth" }, "Sawtooth"),
    createElement("option", { value: "sine" }, "Sine"),
    createElement("option", { value: "square" }, "Square"),
    createElement("option", { value: "triangle" }, "Triangle")
  );

export default ({ detune, gain, id, pan, pitch, type, updateOsc }) =>
  createElement(
    ControlModule,
    { title: `Osc ${id + 1}` },
    createElement(SelectOscType, {
      defaultValue: type,
      onChange: ({ target: { value } }) => updateOsc("type", value),
    }),
    createElement(Range, {
      defaultValue: gain,
      label: "Gain",
      max: 2,
      onInput: (e) => updateOsc("gain", Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: pan,
      label: "Pan",
      min: -1,
      onInput: (e) => updateOsc("pan", Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: pitch,
      displayValue: pitch,
      label: "Pitch",
      max: 24,
      min: -24,
      onInput: (e) => updateOsc("pitch", Number(e.target.value)),
      step: 1,
    }),
    createElement(Range, {
      defaultValue: detune,
      displayValue: detune,
      label: "Detune",
      max: 50,
      min: -50,
      onInput: (e) => updateOsc("detune", Number(e.target.value)),
    })
  );
