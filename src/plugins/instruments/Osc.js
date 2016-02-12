import {dissoc} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const graphs = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    graphs.set(this, {})
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
        type: 'sawtooth',
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
      <div>
        <h2>This is Osc</h2>
        <p>Tremble ye mighty and despair</p>
      </div>,
      containerEl
    )
  }
}
