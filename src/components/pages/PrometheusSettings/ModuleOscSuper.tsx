import { useDispatch } from "react-redux";
import ControlModule, { Range, Select } from "../../organisms/ControlModule";
import prometheusSlice from "../../../store/prometheusSlice";

const SelectOscType = ({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <Select defaultValue={defaultValue} label="Type" onChange={onChange}>
    <option value="random">Random</option>
    <option value="sawtooth">Sawtooth</option>
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </Select>
);

interface Props {
  detune: number;
  gain: number;
  id: number;
  numberOfOscillators: number;
  pan: number;
  pitch: number;
  spread: number;
  type: string;
}

export default function ModuleOscSuper({
  detune,
  gain,
  id,
  numberOfOscillators,
  pan,
  pitch,
  spread,
  type,
}: Props) {
  const dispatch = useDispatch();

  return (
    <ControlModule title={`SuperOsc ${id + 1}`}>
      <SelectOscType
        defaultValue={type}
        onChange={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              type: e.target.value as OscillatorType,
            }),
          )
        }
      />
      <Range
        defaultValue={numberOfOscillators}
        displayValue={String(numberOfOscillators)}
        label="Oscillators"
        max={9}
        min={1}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              numberOfOscillators: Number(e.currentTarget.value),
            }),
          )
        }
        step={1}
      />
      <Range
        defaultValue={spread}
        displayValue={String(spread)}
        label="Spread"
        max={50}
        min={0}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              spread: Number(e.currentTarget.value),
            }),
          )
        }
      />
      <Range
        defaultValue={gain}
        label="Gain"
        max={2}
        onChange={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              gain: Number(e.target.value),
            }),
          )
        }
      />
      <Range
        defaultValue={pan}
        label="Pan"
        min={-1}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              pan: Number(e.currentTarget.value),
            }),
          )
        }
      />
      <Range
        defaultValue={pitch}
        displayValue={String(pitch)}
        label="Pitch"
        max={24}
        min={-24}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              pitch: Number(e.currentTarget.value),
            }),
          )
        }
        step={1}
      />
      <Range
        defaultValue={detune}
        displayValue={String(detune)}
        label="Detune"
        max={50}
        min={-50}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSupersPatch({
              id,
              detune: Number(e.currentTarget.value),
            }),
          )
        }
      />
    </ControlModule>
  );
}
