import React from 'react'
import ReactDOM from 'react-dom'

const gainNodes = new WeakMap()
const gainValues = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const gainValue = 0.2
    const gainNode = audioContext.createGain()
    gainNode.gain.value = gainValue
    gainValues.set(this, gainValue)
    gainNodes.set(this, gainNode)
  }
  connect (destination) {
    gainNodes.get(this).connect(destination)
  }
  disconnect (destination) {
    gainNodes.get(this).disconnect()
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Gain</h2>
        <label>
          Amount&nbsp;
          <input
            defaultValue={gainValues.get(this)}
            max='1'
            min='0'
            onInput={e => {
              const value = Number(e.target.value)
              gainNodes.get(this).gain.value = value
              gainValues.set(this, value)
            }}
            step='0.05'
            type='range'
          />
        </label>
      </div>,
      containerEl
    )
  }
}
