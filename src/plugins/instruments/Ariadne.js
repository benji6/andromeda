import {dissoc} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const graphs = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const oscTypes = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()

    outputs.set(this, output)
    graphs.set(this, {})
    oscTypes.set(this, 'sine')

    const virtualAudioGraph = createVirtualAudioGraph({
      audioContext,
      output
    })

    virtualAudioGraph.defineNodes({
      oscBank: ({gain, frequency, oscType, startTime, stopTime}) => ({
        0: ['gain', ['output'], {gain: 0.2}],
        1: ['oscillator', 0, {frequency, startTime, stopTime, type: oscType}],
        2: ['gain', {key: 1, destination: 'frequency'}, {gain: 1024}],
        3: ['oscillator', 2, {
          frequency: frequency * 2 * (4 - gain) / 4,
          startTime,
          stopTime
        }]
      })
    })
    virtualAudioGraphs.set(this, virtualAudioGraph)
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
      [id]: ['oscBank', 'output', {
        frequency,
        gain,
        oscType: oscTypes.get(this),
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
        <h2>Ariadne</h2>
        <label>
          Osc type&nbsp;
          <select
            defaultValue={oscTypes.get(this)}
            onChange={e => oscTypes.set(this, e.target.value)}
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
