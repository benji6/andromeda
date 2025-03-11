import { useDispatch } from "react-redux";
import ControlModule, { Range } from "../../organisms/ControlModule";
import prometheusSlice from "../../../store/prometheusSlice";
import SelectOscType from "../../shared/SelectOscType";

interface Props {
  detune: number;
  gain: number;
  id: number;
  pan: number;
  pitch: number;
  type: OscillatorType;
}

export default function ModuleOscSingle({
  detune,
  gain,
  id,
  pan,
  pitch,
  type,
}: Props) {
  const dispatch = useDispatch();

  return (
    <ControlModule title={`Osc ${id + 1}`}>
      <SelectOscType
        defaultValue={type}
        onChange={(e) =>
          dispatch(
            prometheusSlice.actions.oscillatorSinglesPatch({
              id,
              type: e.target.value as OscillatorType,
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
        displayValue={String(pitch)}
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
        displayValue={String(detune)}
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
