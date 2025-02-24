import { connect } from "react-redux";
import { bpmSet, rootNoteSet, selectedScaleSet } from "../../../actions";
import Settings from "./Settings";

const mapStateToProps = ({
  nav: { lastDirection },
  settings: { bpm, rootNote, selectedScale },
}) => ({
  bpm,
  lastDirection,
  rootNote,
  selectedScale,
});

const mapDispatchToProps = {
  bpmSet,
  rootNoteSet,
  selectedScaleSet,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
