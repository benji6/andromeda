import {connect} from 'react-redux'
import {bpmSet, rootHueSet, rootNoteSet, selectedScaleSet} from '../../../actions'
import Settings from './Settings'

const mapStateToProps = ({
  nav: {lastDirection},
  microphone,
  settings: {bpm, rootHue, rootNote, selectedScale},
}) => ({
  bpm,
  lastDirection,
  microphone,
  rootHue,
  rootNote,
  selectedScale,
})

const mapDispatchToProps = {
  bpmSet,
  rootHueSet,
  rootNoteSet,
  selectedScaleSet,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
