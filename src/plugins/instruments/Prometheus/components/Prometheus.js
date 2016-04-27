import React from 'react'
import ModuleFilter from './ModuleFilter'
import ModuleLfo from './ModuleLfo'
import ModuleMaster from './ModuleMaster'
import ModuleOsc from './ModuleOsc'
import {blue, size5, size6} from '../../../../components/constants'

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
      updateFilter,
      updateLfo,
      updateMaster,
      updateOsc,
    } = this.props
    const {
      filter,
      lfo,
      master,
      oscillators,
    } = this.state
    return <div {...{style: {color: blue, textAlign: 'center'}}}>
      <h2 {...{style: {fontSize: size6, margin: size5}}}>PROMETHEUS</h2>
      <ModuleMaster {...{master, updateMaster}} />
      <div>
        <ModuleFilter {...{
          frequency: filter.frequency,
          gain: filter.gain,
          Q: filter.Q,
          type: filter.type,
          updateFilter,
        }}/>
        <ModuleLfo {...{lfo, updateLfo}} />
      </div>
      {oscillators.map((settings, i) => <ModuleOsc {...{
        i,
        key: i,
        settings,
        updateOsc: updateOsc(i),
      }} />)}
    </div>
  }
}
