import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {findById} from '../../../utils/helpers'
import {patternSynthInstrumentSet} from '../../../actions'
import PatternSynthSettings from './PatternSynthSettings'

const mapDispatchToProps = {
  patternSynthInstrumentSet,
}

const mapStateToProps = ({
  activePatternIndex,
  dispatch,
  patternsSynth,
  plugins,
}, {params: {patternId}}) => {
  const {instrument} = findById(Number(patternId), patternsSynth)
  return {
    dispatch,
    instrument,
    patternId: Number(patternId),
    plugins,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PatternSynthSettings))
