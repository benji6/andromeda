import { useDispatch } from "react-redux";
import ControlModule, { Range, Select } from "../../organisms/ControlModule";
import prometheusSlice from "../../../store/prometheusSlice";

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
}) {
  const dispatch = useDispatch();

  return (
    <ControlModule title={`Osc ${id + 1}`}>
      <SelectOscType
        defaultValue={type}
        onChange={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSinglesPatch({
              id,
              type: e.target.value,
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
            prometheusSlice.actions.oscillatorSinglesPatch({
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
            prometheusSlice.actions.oscillatorSinglesPatch({
              id,
              pan: Number(e.currentTarget.value),
            }),
          )
        }
      />
      <Range
        defaultValue={pitch}
        displayValue={pitch}
        label="Pitch"
        max={24}
        min={-24}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSinglesPatch({
              id,
              pitch: Number(e.currentTarget.value),
            }),
          )
        }
        step={1}
      />
      <Range
        defaultValue={detune}
        displayValue={detune}
        label="Detune"
        max={50}
        min={-50}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSinglesPatch({
              id,
              detune: Number(e.currentTarget.value),
            }),
          )
        }
      />
    </ControlModule>
  );
}
