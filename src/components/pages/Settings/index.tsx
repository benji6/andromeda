import ButtonPrimary from "../../atoms/ButtonPrimary";
import RangeLabelled from "../../molecules/RangeLabelled";
import navSlice from "../../../store/navSlice";
import { useDispatch, useSelector } from "react-redux";
import settingsSlice from "../../../store/settingsSlice";

export default function Settings() {
  const lastDirection = useSelector(navSlice.selectors.lastDirection);
  const bpm = useSelector(settingsSlice.selectors.bpm);
  const dispatch = useDispatch();

  return (
    <div className={`Settings slide-in-${lastDirection}`}>
      <RangeLabelled
        max={512}
        min={32}
        onChange={(e) =>
          dispatch(settingsSlice.actions.bpmSet(Number(e.currentTarget.value)))
        }
        value={bpm}
      >
        BPM
      </RangeLabelled>
      <div>
        <ButtonPrimary to="/controllers/keyboard/settings">
          Keyboard Settings
        </ButtonPrimary>
      </div>
    </div>
  );
}
