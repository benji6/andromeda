import {dissoc} from 'ramda'
import createVirtualAudioGraph from 'virtual-audio-graph'

const outputs = new WeakMap()
const nodes = new WeakMap()
const virtualAudioGraph = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    nodes.set(this, {})
    virtualAudioGraph.set(this, createVirtualAudioGraph({
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
      ...nodes.get(this),
      0: ['gain', 'output', {gain}],
      [id]: ['oscillator', 0, {
        frequency,
        type: 'sine',
        startTime,
        stopTime
      }]
    }
    nodes.set(this, newNodes)
    virtualAudioGraph.get(this).update(newNodes)
  }
  inputNoteStop (id) {
    const newNodes = dissoc(id, nodes.get(this))
    nodes.set(this, newNodes)
    virtualAudioGraph.get(this).update(newNodes)
  }
}
