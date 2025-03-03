import ControlModule, {
  Range,
  Select,
} from "../../../../components/organisms/ControlModule";

const SelectOscType = ({ defaultValue, onChange }) => (
  <Select defaultValue={defaultValue} label="Type" onChange={onChange}>
    <option value="sawtooth">Sawtooth</option>
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </Select>
);

export default ({ lfo: { gain, frequency, type }, updateLfo }) => (
  <ControlModule title="LFO">
    <SelectOscType
      defaultValue={type}
      onChange={(e) => updateLfo("type", e.target.value)}
    />
    <Range
      defaultValue={frequency}
      label="Rate"
      max={16}
      min={0.01}
      onInput={(e) => updateLfo("frequency", Number(e.currentTarget.value))}
    />
    <Range
      defaultValue={gain}
      displayValue={gain.toFixed()}
      label="Amount"
      max={1024}
      onInput={(e) => updateLfo("gain", Number(e.currentTarget.value))}
    />
  </ControlModule>
);
