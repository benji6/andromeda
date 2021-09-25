import { connect } from "react-redux";
import { bpmSet, rootNoteSet, selectedScaleSet } from "../../../actions";
import Settings from "./Settings";

const mapStateToProps = ({
  nav: { lastDirection },
  microphone,
  settings: { bpm, rootNote, selectedScale },
}) => ({
  bpm,
  lastDirection,
  microphone,
  rootNote,
  selectedScale,
});

const mapDispatchToProps = {
  bpmSet,
  rootNoteSet,
  selectedScaleSet,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
