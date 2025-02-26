import ButtonPrimary from "../../atoms/ButtonPrimary";
import RangeLabelled from "../../molecules/RangeLabelled";
import noteNameFromPitch from "../../../audioHelpers/noteNameFromPitch";
import Selector from "../../molecules/Selector";
import scales from "../../../constants/scales";
import { makeClassName } from "../../../utils/dom";
import { capitalizeWords } from "../../../utils/helpers";

const Settings = ({
  bpm,
  bpmSet,
  lastDirection,
  rootNote,
  rootNoteSet,
  selectedScale,
  selectedScaleSet,
}) => (
  <div
    className={makeClassName(
      "Settings",
      lastDirection === "left" ? "slide-in-left" : "slide-in-right",
    )}
  >
    <RangeLabelled
      max={512}
      min={32}
      onChange={(e) => bpmSet(Number(e.currentTarget.value))}
      value={bpm}
    >
      BPM
    </RangeLabelled>
    <RangeLabelled
      max={24}
      min={-36}
      onChange={(e) => rootNoteSet(Number(e.currentTarget.value))}
      output={noteNameFromPitch(rootNote)}
      value={rootNote}
    >
      Root Note
    </RangeLabelled>
    <Selector
      defaultValue={selectedScale}
      handleChange={(e) => selectedScaleSet(e.currentTarget.value)}
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

export default Settings;
