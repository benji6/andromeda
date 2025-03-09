import { useDispatch, useSelector } from "react-redux";
import ControlModule, { Range } from "../../organisms/ControlModule";
import prometheusSlice from "../../../store/prometheusSlice";

export default function ModuleMaster() {
  const dispatch = useDispatch();
  const { gain, pan } = useSelector(prometheusSlice.selectors.master);

  return (
    <div>
      <ControlModule title="Master">
        <Range
          defaultValue={gain}
          label="Gain"
          max={1.5}
          onInput={(e) =>
            dispatch(
              prometheusSlice.actions.masterGainSet(
                Number(e.currentTarget.value),
              ),
            )
          }
        />
        <Range
          defaultValue={pan}
          label="Pan"
          min={-1}
          onInput={(e) =>
            dispatch(
              prometheusSlice.actions.masterPanSet(
                Number(e.currentTarget.value),
              ),
            )
          }
        />
      </ControlModule>
    </div>
  );
}
