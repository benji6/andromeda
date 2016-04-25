import React from 'react'
import ModuleAdsr from './ModuleAdsr'
import ModuleFilter from './ModuleFilter'
import ModuleLfo from './ModuleLfo'
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
      updateAdsr,
      updateFilter,
      updateLfo,
      updateMaster,
      updateOsc,
    } = this.props

    const {
      adsr,
      filter,
      lfo,
      master,
      oscillators,
    } = this.state

    return <div {...{style: {color: blue, textAlign: 'center'}}}>
      <h2 {...{style: {fontSize: size6, margin: size5}}}>PROMETHEUS</h2>
      <ModuleMaster {...{master, updateMaster}} />
      <ModuleFilter {...{
        frequency: filter.frequency,
        gain: filter.gain,
        Q: filter.Q,
        type: filter.type,
        updateFilter,
      }}/>
      <div>
        <ModuleAdsr {...{adsr, updateAdsr}} />
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
