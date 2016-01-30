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
    nodes.set(this, {
      ...nodes.get(this),
      0: ['gain', 'output', {gain}],
      [id]: ['oscillator', 0, {
        frequency,
        type: 'sine',
        startTime,
        stopTime
      }]
    })
    virtualAudioGraph.get(this).update(nodes.get(this))
  }
  stopNotes (id) {
    nodes.set(this, dissoc(id, nodes.get(this)))
    virtualAudioGraph.get(this).update(nodes.get(this))
  }
}
