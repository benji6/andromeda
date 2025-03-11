import { useDispatch, useSelector } from "react-redux";
import ControlModule, { Range } from "../../organisms/ControlModule";
import prometheusSlice from "../../../store/prometheusSlice";
import SelectOscType from "../../shared/SelectOscType";

export default function ModuleLfo() {
  const { gain, frequency, type } = useSelector(prometheusSlice.selectors.lfo);
  const dispatch = useDispatch();

  return (
    <ControlModule title="LFO">
      <SelectOscType
        defaultValue={type}
        onChange={(e) =>
          dispatch(
            prometheusSlice.actions.lfoTypeSet(
              e.target.value as OscillatorType,
            ),
          )
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
