import { useSelector } from "react-redux";
import { instrumentInstance } from "../../utils/derivedData";
import ControlPad from "../organisms/ControlPad";
import ButtonPrimary from "../atoms/ButtonPrimary";
import pitchToFrequency from "../../audioHelpers/pitchToFrequency";
import scales from "../../constants/scales";
import store from "../../store";
import { makeClassName } from "../../utils/dom";
import controlPadSlice from "../../store/controlPadSlice";
import settingsSlice from "../../store/settingsSlice";
import screenSlice from "../../store/screenSlice";
import pluginsSlice from "../../store/pluginsSlice";
import navSlice from "../../store/navSlice";

const CONTROL_PAD_ID = "controlPad";

let currentlyPlayingPitch: number = null;

const calculatePitch = (ratio: number) => {
  const scale = scales[store.getState().settings.selectedScale];
  const { length } = scale;
  const i = Math.floor((length + 1) * ratio);
  return scale[((i % length) + length) % length] + 12 * Math.floor(i / length);
};

export default function ControlPadPage() {
  const instrument = useSelector(controlPadSlice.selectors.instrument);
  const hasBeenTouched = useSelector(controlPadSlice.selectors.hasBeenTouched);
  const noScale = useSelector(controlPadSlice.selectors.noScale);
  const octave = useSelector(controlPadSlice.selectors.octave);
  const range = useSelector(controlPadSlice.selectors.range);
  const rootNote = useSelector(settingsSlice.selectors.rootNote);
  const sideLength = useSelector(screenSlice.selectors.sideLength);
  const plugins = useSelector(pluginsSlice.selectors.plugins);
  const lastDirection = useSelector(navSlice.selectors.lastDirection);

  return (
    <div
      className={makeClassName(
        "ControlPadPage",
        lastDirection === "left" ? "slide-in-left" : "slide-in-right",
      )}
    >
      <div>
        <ControlPad
          inputModifyHandler={({ xRatio, yRatio }) => {
            const pitch: number = noScale
              ? 12 * range * xRatio
              : calculatePitch(range * xRatio);
            const instance = instrumentInstance(instrument, plugins);

            currentlyPlayingPitch = pitch;
            const note = {
              frequency: pitchToFrequency(pitch + 12 * octave + rootNote),
              gain: (1 - yRatio) / 2,
              id: CONTROL_PAD_ID,
            };
            instance.noteModify(note);
          }}
          inputStartHandler={({ xRatio, yRatio }) => {
            const instance = instrumentInstance(instrument, plugins);

            currentlyPlayingPitch = noScale
              ? 12 * range * xRatio
              : calculatePitch(range * xRatio);

            instance.noteStart({
              frequency: pitchToFrequency(
                currentlyPlayingPitch + 12 * octave + rootNote,
              ),
              gain: (1 - yRatio) / 2,
              id: CONTROL_PAD_ID,
            });
          }}
          inputStopHandler={() => {
            currentlyPlayingPitch = null;
            const instance = instrumentInstance(instrument, plugins);
            instance.noteStop(CONTROL_PAD_ID);
          }}
          hasBeenTouched={hasBeenTouched}
          sideLength={sideLength}
        />
      </div>
      <ButtonPrimary to="/controllers/control-pad/settings">
        Options
      </ButtonPrimary>
    </div>
  );
}
