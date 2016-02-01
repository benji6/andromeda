import {dissoc} from 'ramda'
import createVirtualAudioGraph from 'virtual-audio-graph'

const nodes = new WeakMap()
const virtualAudioGraph = new WeakMap()

export default class {
  constructor ({audioContext}) {
    nodes.set(this, {})
    virtualAudioGraph.set(this, createVirtualAudioGraph({audioContext}))
  }
  startNote ({frequency, gain, id, startTime, stopTime}) {
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
  stopNote (id) {
    const newNodes = dissoc(id, nodes.get(this))
    nodes.set(this, newNodes)
    virtualAudioGraph.get(this).update(newNodes)
  }
}
