import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const graphConstructors = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
    virtualAudioGraphs.set(this, virtualAudioGraph)
    const graphConstructor = ({
      decay = 1 / 3,
      delayTime = 1 / 3,
      maxDelayTime = 1 / 3,
      mix = 1 / 3
    } = {}) => ({
      0: ['stereoPanner', 'output', {pan: -1}],
      1: ['stereoPanner', 'output', {pan: 1}],
      2: ['delay', [1, 5], {maxDelayTime, delayTime}],
      3: ['gain', 2, {gain: decay}],
      4: ['delay', [0, 3], {maxDelayTime, delayTime}],
      5: ['gain', 4, {gain: decay}],
      6: ['gain', 'output', {gain: 1 - mix}],
      7: ['gain', [5, 6], {gain: 1}, 'input']
    })
    graphConstructors.set(this, graphConstructor)
    virtualAudioGraph.update(graphConstructor())
    this.destination = virtualAudioGraph.getAudioNodeById(7)
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect()
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Delay</h2>
        <p>Customization coming soon!</p>
      </div>,
      containerEl
    )
  }
}
