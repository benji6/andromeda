import {fromPairs} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

let reverbGraphs = {}
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

import audioContext from '../../audioContext'

const loadReverb = (uri, name) => window.fetch(uri)
  .then(response => response.arrayBuffer())
  .then(data => new Promise(
    // word is audioContext.decodeAudioData will one day return a promise...
    resolve => audioContext.decodeAudioData(data, resolve)
  ))
  .then(buffer => _ => ({
    0: ['gain', 'output', {gain: 0.5}],
    1: ['convolver', 0, {buffer}, 'input']
  }))
  .then(reverb => [name, reverb])

const loadAllReverbs = Promise.all([
  loadReverb('assets/sb.wav', 'reverb chapel'),
  loadReverb('assets/h.wav', 'reverb mausoleum'),
  loadReverb('assets/st.wav', 'reverb stairwell')
]).then(fromPairs)

loadAllReverbs.then(x => reverbGraphs = x)

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
    virtualAudioGraph.update({
      1: ['gain', 'output']
    })
    loadAllReverbs
      .then(x => virtualAudioGraph.defineNodes(x))
      .then(x => virtualAudioGraph.update({
        0: ['reverb chapel', 'output'],
        1: ['gain', 0]
      }))
    virtualAudioGraphs.set(this, virtualAudioGraph)
    this.destination = virtualAudioGraph.getAudioNodeById(1)
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
        <h2>Reverb</h2>
        <select
          onChange={e => {
            virtualAudioGraphs.get(this).update({
              0: [e.target.value, 'output'],
              1: ['gain', 0]
            })
          }}
        >
          {Object.keys(reverbGraphs).map((x, i) =>
            <option key={i}>
              {x}
            </option>)}
        </select>
      </div>,
      containerEl
    )
  }
}
