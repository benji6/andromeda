import { createElement } from "react";
import ControlModule, {
  Range,
  Select,
} from "../../../../components/organisms/ControlModule";
import capitalize from "capitalize";

const paramsAll = ["frequency", "gain", "Q"];
const paramsFrequencyGain = ["frequency", "gain"];
const paramsFrequencyQ = ["frequency", "Q"];

const typesToParams = {
  allpass: paramsFrequencyQ,
  bandpass: paramsFrequencyQ,
  highpass: paramsFrequencyQ,
  highshelf: paramsFrequencyGain,
  lowpass: paramsFrequencyQ,
  lowshelf: paramsFrequencyGain,
  notch: paramsFrequencyQ,
  peaking: paramsAll,
};

const ControlFrequency = ({ frequency, updateFilter }) =>
  createElement(Range, {
    defaultValue: Math.log(frequency),
    displayValue: Math.round(frequency),
    label: "Frequency",
    max: Math.log(20000),
    min: Math.log(20),
    onInput: (e) => updateFilter("frequency", Math.exp(Number(e.target.value))),
  });

const ControlGain = ({ gain, updateFilter }) =>
  createElement(Range, {
    defaultValue: gain,
    label: "Gain",
    max: 20,
    min: -20,
    onInput: (e) => updateFilter("gain", Number(e.target.value)),
  });

const ControlQ = ({ Q, updateFilter }) =>
  createElement(Range, {
    defaultValue: Q,
    label: "Q",
    max: 24,
    onInput: (e) => updateFilter("Q", Number(e.target.value)),
  });

export default ({ frequency, gain, Q, type, updateFilter }) =>
  createElement(
    ControlModule,
    { title: "Filter" },
    createElement(
      Select,
      {
        defaultValue: type,
        label: "Type",
        onChange: (e) => updateFilter("type", e.target.value),
      },
      Object.keys(typesToParams).map((type) =>
        createElement(
          "option",
          {
            key: type,
            value: type,
          },
          capitalize(type)
        )
      )
    ),
    typesToParams[type].map((param) =>
      param === "frequency"
        ? createElement(ControlFrequency, {
            frequency,
            key: param,
            updateFilter,
          })
        : param === "gain"
        ? createElement(ControlGain, { gain, key: param, updateFilter })
        : createElement(ControlQ, { key: param, Q, updateFilter })
    )
  );
