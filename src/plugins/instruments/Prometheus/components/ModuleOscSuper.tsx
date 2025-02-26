import ControlModule, {
  Range,
  Select,
} from "../../../../components/organisms/ControlModule";

const SelectOscType = ({ defaultValue, onChange }) => (
  <Select defaultValue={defaultValue} label="Type" onChange={onChange}>
    <option value="random">Random</option>
    <option value="sawtooth">Sawtooth</option>
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </Select>
);

const ModuleOscSuper = ({
  detune,
  gain,
  id,
  numberOfOscillators,
  pan,
  pitch,
  spread,
  type,
  updateOsc,
}) => (
  <ControlModule title={`SuperOsc ${id + 1}`}>
    <SelectOscType
      defaultValue={type}
      onChange={({ target: { value } }) => updateOsc("type", value)}
    />
    <Range
      defaultValue={numberOfOscillators}
      displayValue={numberOfOscillators}
      label="Oscillators"
      max={9}
      min={1}
      onInput={(e) => updateOsc("numberOfOscillators", Number(e.target.value))}
      step={1}
    />
    <Range
      defaultValue={spread}
      displayValue={spread}
      label="Spread"
      max={50}
      min={0}
      onInput={(e) => updateOsc("spread", Number(e.target.value))}
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

export default ModuleOscSuper;
