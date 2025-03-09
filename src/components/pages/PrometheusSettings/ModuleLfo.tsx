import { useDispatch, useSelector } from "react-redux";
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

export default function ModuleLfo() {
  const { gain, frequency, type } = useSelector(prometheusSlice.selectors.lfo);
  const dispatch = useDispatch();

  return (
    <ControlModule title="LFO">
      <SelectOscType
        defaultValue={type}
        onChange={(e) =>
          dispatch(prometheusSlice.actions.lfoTypeSet(e.target.value))
        }
      />
      <Range
        defaultValue={frequency}
        label="Rate"
        max={16}
        min={0.01}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.lfoFrequencySet(
              Number(e.currentTarget.value),
            ),
          )
        }
      />
      <Range
        defaultValue={gain}
        displayValue={gain.toFixed()}
        label="Amount"
        max={1024}
        onInput={(e) =>
          dispatch(
            prometheusSlice.actions.lfoGainSet(Number(e.currentTarget.value)),
          )
        }
      />
    </ControlModule>
  );
}
