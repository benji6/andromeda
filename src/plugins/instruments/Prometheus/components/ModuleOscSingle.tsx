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

export default function ModuleOscSingle({
  detune,
  gain,
  id,
  pan,
  pitch,
  type,
  updateOsc,
}) {
  return (
    <ControlModule title={`Osc ${id + 1}`}>
      <SelectOscType
        defaultValue={type}
        onChange={({ target: { value } }) => updateOsc("type", value)}
      />
      <Range
        defaultValue={gain}
        label="Gain"
        max={2}
        onInput={(e) => updateOsc("gain", Number(e.target.value))}
      />
      <Range
        defaultValue={pan}
        label="Pan"
        min={-1}
        onInput={(e) => updateOsc("pan", Number(e.target.value))}
      />
      <Range
        defaultValue={pitch}
        displayValue={pitch}
        label="Pitch"
        max={24}
        min={-24}
        onInput={(e) => updateOsc("pitch", Number(e.target.value))}
        step={1}
      />
      <Range
        defaultValue={detune}
        displayValue={detune}
        label="Detune"
        max={50}
        min={-50}
        onInput={(e) => updateOsc("detune", Number(e.target.value))}
      />
    </ControlModule>
  );
}
