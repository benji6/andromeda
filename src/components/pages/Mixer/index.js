import {connect} from 'react-redux'
import Mixer from './Mixer'

const mapStateToProps = ({
  nav: {lastDirection},
  plugins: {channels},
}) => ({
  channels,
  lastDirection,
})

export default connect(mapStateToProps)(Mixer)
