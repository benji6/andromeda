import ControlModule, { Range, Select } from "../../organisms/ControlModule";
import { capitalizeFirst } from "../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import prometheusSlice from "../../../store/prometheusSlice";

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

export default function ModuleFilter() {
  const { frequency, gain, Q, type } = useSelector(
    prometheusSlice.selectors.filter,
  );
  const dispatch = useDispatch();

  return (
    <ControlModule title="Filter">
      <Select
        defaultValue={type}
        label="Type"
        onChange={(e) =>
          dispatch(prometheusSlice.actions.filterTypeSet(e.target.value))
        }
      >
        {Object.keys(typesToParams).map((type) => (
          <option key={type} value={type}>
            {capitalizeFirst(type)}
          </option>
        ))}
      </Select>
      {typesToParams[type].map((param) =>
        param === "frequency" ? (
          <Range
            defaultValue={Math.log(frequency)}
            displayValue={frequency.toFixed()}
            label="Frequency"
            max={Math.log(20000)}
            min={Math.log(20)}
            onInput={(e) =>
              dispatch(
                prometheusSlice.actions.filterFrequencySet(
                  Math.exp(Number(e.currentTarget.value)),
                ),
              )
            }
          />
        ) : param === "gain" ? (
          <Range
            defaultValue={gain}
            label="Gain"
            max={20}
            min={-20}
            onInput={(e) =>
              dispatch(
                prometheusSlice.actions.filterGainSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
        ) : (
          <Range
            defaultValue={Q}
            label="Q"
            max={24}
            onInput={(e) =>
              dispatch(
                prometheusSlice.actions.filterQSet(
                  Number(e.currentTarget.value),
                ),
              )
            }
          />
        ),
      )}
    </ControlModule>
  );
}
