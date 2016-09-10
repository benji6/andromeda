import {createElement} from 'react'
import {connect} from 'react-redux'
import PatternBeat from './PatternBeat'
import PatternSynth from './PatternSynth'

const mapStateToProps = ({patterns, screen: {height, width}}, {params: {patternId}}) => ({
  beatPattern: patterns[patternId].beatPattern,
  height: height * 0.8 * 0.69,
  width,
})

export default connect(mapStateToProps)(
  props => props.beatPattern
    ? createElement(PatternBeat, props)
    : createElement(PatternSynth, props)
)
