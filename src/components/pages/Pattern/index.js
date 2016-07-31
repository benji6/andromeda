import {createElement} from 'react'
import {connect} from 'react-redux'
import PatternBeat from './PatternBeat'
import PatternSynth from './PatternSynth'

const mapStateToProps = ({patterns}, {params: {patternId}}) => ({
  beatPattern: patterns[patternId].beatPattern,
})

export default connect(mapStateToProps)(
  props => props.beatPattern
    ? createElement(PatternBeat, props)
    : createElement(PatternSynth, props)
)
