import pitchFromScaleIndex from './pitchFromScaleIndex'
import pitchToFrequency from './pitchToFrequency'
import {compose} from 'ramda'

export default compose(pitchToFrequency, pitchFromScaleIndex)
