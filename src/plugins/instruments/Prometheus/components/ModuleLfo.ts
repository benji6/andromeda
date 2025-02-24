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
    createElement("option", { value: "triangle" }, "Triangle"),
  );

export default ({ lfo: { gain, frequency, type }, updateLfo }) =>
  createElement(
    ControlModule,
    { title: "LFO" },
    createElement(SelectOscType, {
      defaultValue: type,
      onChange: (e) => updateLfo("type", e.target.value),
    }),
    createElement(Range, {
      defaultValue: frequency,
      label: "Rate",
      max: 16,
      min: 0.01,
      onInput: (e) => updateLfo("frequency", Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: gain,
      displayValue: Math.round(gain),
      label: "Amount",
      max: 1024,
      onInput: (e) => updateLfo("gain", Number(e.target.value)),
    }),
  );
