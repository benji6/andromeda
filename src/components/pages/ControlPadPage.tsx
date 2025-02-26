import { connect } from "react-redux";
import { controlPadTouched } from "../../actions";
import { instrumentInstance } from "../../utils/derivedData";
import ControlPad from "../organisms/ControlPad";
import ButtonPrimary from "../atoms/ButtonPrimary";
import pitchToFrequency from "../../audioHelpers/pitchToFrequency";
import scales from "../../constants/scales";
import store from "../../store";
import { makeClassName } from "../../utils/dom";

const controlPadId = "controlPad";

let currentlyPlayingPitch: number = null;

const calculatePitch = (ratio: number) => {
  const scale = scales[store.getState().settings.selectedScale];
  const { length } = scale;
  const i = Math.floor((length + 1) * ratio);
  return scale[((i % length) + length) % length] + 12 * Math.floor(i / length);
};

const mapStateToProps = ({
  controlPad: { instrument, noScale, octave, range, isTouched },
  nav: { lastDirection },
  plugins,
  screen: { sideLength },
  settings: { rootNote },
}) => ({
  instrument,
  isTouched,
  lastDirection,
  noScale,
  octave,
  plugins,
  range,
  rootNote,
  sideLength,
});

const mapDispatchToProps = { controlPadTouched };

const ControlPadPage = ({
  controlPadTouched,
  instrument,
  lastDirection,
  noScale,
  octave,
  plugins,
  range,
  rootNote,
  sideLength,
  isTouched,
}) => (
  <div
    className={makeClassName(
      "ControlPadPage",
      lastDirection === "left" ? "slide-in-left" : "slide-in-right",
    )}
  >
    <div>
      <ControlPad
        controlPadTouched={controlPadTouched}
        inputModifyHandler={({ xRatio, yRatio }) => {
          const pitch: number = noScale
            ? 12 * range * xRatio
            : calculatePitch(range * xRatio);
          const instance = instrumentInstance(instrument, plugins);

          currentlyPlayingPitch = pitch;
          const note = {
            frequency: pitchToFrequency(pitch + 12 * octave + rootNote),
            gain: (1 - yRatio) / 2,
            id: controlPadId,
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
            id: controlPadId,
          });
        }}
        inputStopHandler={() => {
          currentlyPlayingPitch = null;
          const instance = instrumentInstance(instrument, plugins);
          instance.noteStop(controlPadId);
        }}
        isTouched={isTouched}
        sideLength={sideLength}
      />
    </div>
    <ButtonPrimary to="/controllers/control-pad/settings">
      Options
    </ButtonPrimary>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ControlPadPage);
