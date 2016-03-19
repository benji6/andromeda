import React from 'react'
import ReactDOM from 'react-dom'

const gainNodes = new WeakMap()
const panNodes = new WeakMap()
const gainValues = new WeakMap()
const panValues = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const gainNode = audioContext.createGain()
    const panNode = audioContext.createStereoPanner()
    gainValues.set(this, 1)
    panValues.set(this, 0)
    gainNodes.set(this, gainNode)
    panNodes.set(this, panNode)
    panNode.connect(gainNode)
    this.destination = panNode
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
        <h2>GainPan</h2>
        <div>
          <label>
            Gain&nbsp;
            <input
              defaultValue={gainValues.get(this)}
              max='2'
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
        </div>
        <div>
          <label>
            Pan&nbsp;
            <input
              defaultValue={panValues.get(this)}
              max='1'
              min='-1'
              onInput={e => {
                const value = Number(e.target.value)
                panNodes.get(this).pan.value = value
                panValues.set(this, value)
              }}
              step='0.05'
              type='range'
            />
          </label>
        </div>
      </div>,
      containerEl
    )
  }
}
