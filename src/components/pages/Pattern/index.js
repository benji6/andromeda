import {createElement} from 'react'
import {connect} from 'react-redux'
import PatternBeat from './PatternBeat'
import PatternSynth from './PatternSynth'
import {findById} from '../../../utils/helpers'

const mapStateToProps = ({patterns, screen: {height, width}}, {params: {patternId}}) => ({
  beatPattern: findById(Number(patternId), patterns).beatPattern,
  height: height * 0.69,
  width,
})

export default connect(mapStateToProps)(
  props => props.beatPattern
    ? createElement(PatternBeat, props)
    : createElement(PatternSynth, props)
)
