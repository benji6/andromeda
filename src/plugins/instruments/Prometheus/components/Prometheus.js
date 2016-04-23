import React from 'react'
import ModuleFilter from './ModuleFilter'
import ModuleMaster from './ModuleMaster'
import ModuleOsc from './ModuleOsc'
import {blue, size5, size6} from './constants'

export default class extends React.Component {
  componentDidMount () {
    this.unsubscribe = this.props.store.subscribe(state => this.setState(state))
  }
  componentWillMount () {
    this.setState(this.props.store.getState())
  }
  componentWillUnmount () {
    this.unsubscribe()
    this.unsubscribe = null
  }
  render () {
    const {
      updateProp,
      updateOsc,
      updateFilterProp,
    } = this.props
    const {
      masterGain,
      masterPan,
      filter,
      oscillators,
    } = this.state
    return <div {...{style: {color: blue, textAlign: 'center'}}}>
      <h2 {...{style: {
        fontSize: size6,
        margin: size5,
      }}}>PROMETHEUS</h2>
      <ModuleMaster {...{
        masterGain,
        masterPan,
        updateProp,
      }} />
      <ModuleFilter {...{
          frequency: filter.frequency,
          gain: filter.gain,
          Q: filter.Q,
          type: filter.type,
          updateFilterProp,
      }}/>
      {oscillators.map((settings, i) => <ModuleOsc {...{
        i,
        key: i,
        settings,
        updateOsc: updateOsc(i),
      }} />)}
    </div>
  }
}
