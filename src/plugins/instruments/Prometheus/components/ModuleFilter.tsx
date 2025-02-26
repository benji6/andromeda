import ControlModule, {
  Range,
  Select,
} from "../../../../components/organisms/ControlModule";
import { capitalizeFirst } from "../../../../utils/helpers";

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

const ControlFrequency = ({ frequency, updateFilter }) => (
  <Range
    defaultValue={Math.log(frequency)}
    displayValue={Math.round(frequency)}
    label="Frequency"
    max={Math.log(20000)}
    min={Math.log(20)}
    onInput={(e) => updateFilter("frequency", Math.exp(Number(e.target.value)))}
  />
);

const ControlGain = ({ gain, updateFilter }) => (
  <Range
    defaultValue={gain}
    label="Gain"
    max={20}
    min={-20}
    onInput={(e) => updateFilter("gain", Number(e.target.value))}
  />
);

const ControlQ = ({ Q, updateFilter }) => (
  <Range
    defaultValue={Q}
    label="Q"
    max={24}
    onInput={(e) => updateFilter("Q", Number(e.target.value))}
  />
);

export default function ModuleFilter({
  frequency,
  gain,
  Q,
  type,
  updateFilter,
}) {
  return (
    <ControlModule title="Filter">
      <Select
        defaultValue={type}
        label="Type"
        onChange={(e) => updateFilter("type", e.target.value)}
      >
        {Object.keys(typesToParams).map((type) => (
          <option key={type} value={type}>
            {capitalizeFirst(type)}
          </option>
        ))}
      </Select>
      {typesToParams[type].map((param) =>
        param === "frequency" ? (
          <ControlFrequency
            frequency={frequency}
            key={param}
            updateFilter={updateFilter}
          />
        ) : param === "gain" ? (
          <ControlGain gain={gain} key={param} updateFilter={updateFilter} />
        ) : (
          <ControlQ key={param} Q={Q} updateFilter={updateFilter} />
        ),
      )}
    </ControlModule>
  );
}
