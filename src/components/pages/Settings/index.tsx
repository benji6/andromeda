import ButtonPrimary from "../../atoms/ButtonPrimary";
import RangeLabelled from "../../molecules/RangeLabelled";
import noteNameFromPitch from "../../../audioHelpers/noteNameFromPitch";
import Selector from "../../molecules/Selector";
import scales from "../../../constants/scales";
import { makeClassName } from "../../../utils/dom";
import { capitalizeWords } from "../../../utils/helpers";
import navSlice from "../../../store/navSlice";
import { useDispatch, useSelector } from "react-redux";
import settingsSlice from "../../../store/settingsSlice";

export default function Settings() {
  const lastDirection = useSelector(navSlice.selectors.lastDirection);
  const bpm = useSelector(settingsSlice.selectors.bpm);
  const rootNote = useSelector(settingsSlice.selectors.rootNote);
  const selectedScale = useSelector(settingsSlice.selectors.selectedScale);
  const dispatch = useDispatch();

  return (
    <div
      className={makeClassName(
        "Settings",
        lastDirection === "left" ? "slide-in-left" : "slide-in-right",
      )}
    >
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
      <RangeLabelled
        max={24}
        min={-36}
        onChange={(e) =>
          dispatch(
            settingsSlice.actions.rootNoteSet(Number(e.currentTarget.value)),
          )
        }
        output={noteNameFromPitch(rootNote)}
        value={rootNote}
      >
        Root Note
      </RangeLabelled>
      <Selector
        defaultValue={selectedScale}
        handleChange={(e) =>
          dispatch(
            settingsSlice.actions.selectedScaleSet(e.currentTarget.value),
          )
        }
        label="Scale"
        options={Object.keys(scales).map((value) => ({
          text: capitalizeWords(value),
          value,
        }))}
      />
      <div>
        <ButtonPrimary to="/controllers/keyboard/settings">
          Keyboard Settings
        </ButtonPrimary>
      </div>
    </div>
  );
}
