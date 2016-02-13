import {dissoc} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const graphs = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const types = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    graphs.set(this, {})
    types.set(this, 'sine')
    virtualAudioGraphs.set(this, createVirtualAudioGraph({
      audioContext,
      output
    }))
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect()
  }
  inputNoteStart ({frequency, gain, id, startTime, stopTime}) {
    const newNodes = {
      ...graphs.get(this),
      0: ['gain', 'output', {gain}],
      [id]: ['oscillator', 0, {
        frequency,
        type: types.get(this),
        startTime,
        stopTime
      }]
    }
    graphs.set(this, newNodes)
    virtualAudioGraphs.get(this).update(newNodes)
  }
  inputNoteStop (id) {
    const newGraph = dissoc(id, graphs.get(this))
    graphs.set(this, newGraph)
    virtualAudioGraphs.get(this).update(newGraph)
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Prometheus</h2>
        <label>
          Type&nbsp;
          <select
            defaultValue={types.get(this)}
            onChange={e => types.set(this, e.target.value)}
          >
            <option value='sawtooth'>Sawtooth</option>
            <option value='sine'>Sine</option>
            <option value='square'>Square</option>
            <option value='triangle'>Triangle</option>
          </select>
        </label>
      </div>,
      containerEl
    )
  }
}
