import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, connect} from 'st88'
import ControlModule, {Range} from '../../components/organisms/ControlModule'

const gainNodes = new WeakMap()
const panNodes = new WeakMap()
const stores = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const gainNode = audioContext.createGain()
    const panNode = audioContext.createStereoPanner()
    const store = createStore({gain: 1, pan: 0})

    store.subscribe(({gain, pan}) => {
      gainNodes.get(this).gain.value = gain
      panNodes.get(this).pan.value = pan
    })

    this.destination = panNode

    gainNodes.set(this, gainNode)
    panNodes.set(this, panNode)
    panNode.connect(gainNode)
    stores.set(this, store)
  }
  connect (destination) {
    gainNodes.get(this).connect(destination)
  }
  disconnect (destination) {
    gainNodes.get(this).disconnect(destination)
  }
  render (containerEl) {
    const store = stores.get(this)
    const setGain = gain => store.dispatch(state => ({...state, gain}))
    const setPan = pan => store.dispatch(state => ({...state, pan}))

    ReactDOM.render(
      connect(store)(({gain, pan}) => <div style={{textAlign: 'center'}}>
        <h2>GainPan</h2>
        <ControlModule>
          <Range {...{
            defaultValue: gain,
            label: 'Gain',
            max: 2,
            onInput: e => setGain(Number(e.target.value)),
          }}/>
          <Range {...{
            defaultValue: pan,
            label: 'Pan',
            min: -1,
            onInput: e => setPan(Number(e.target.value)),
          }}/>
        </ControlModule>
      </div>),
      containerEl
    )
  }
}
