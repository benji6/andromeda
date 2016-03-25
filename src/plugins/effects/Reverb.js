import {fromPairs} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

let reverbGraphs = {}

const containerEls = new WeakMap()
const dryLevels = new WeakMap()
const lowCuts = new WeakMap()
const outputs = new WeakMap()
const reverbTypes = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const wetLevels = new WeakMap()

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

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

const updateAudioGraph = function () {
  virtualAudioGraphs.get(this).update({
    0: ['gain', 'output', {gain: dryLevels.get(this)}],
    1: ['biquadFilter', 'output', {frequency: lowCuts.get(this), type: 'highpass'}],
    2: ['gain', 1, {gain: wetLevels.get(this)}],
    3: [reverbTypes.get(this), 2],
    input: ['gain', [0, 3]]
  })
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    dryLevels.set(this, 0.35)
    lowCuts.set(this, 50)
    wetLevels.set(this, 1)
    reverbTypes.set(this, 'reverb chapel')
    outputs.set(this, output)

    virtualAudioGraph.update({
      input: ['gain', 'output']
    })
    loadAllReverbs
      .then(x => virtualAudioGraph.defineNodes(x))
      .then(x => updateAudioGraph.call(this))
      .then(_ => {
        const containerEl = containerEls.get(this)
        if (containerEl) this.render(containerEls.get(this))
      })
    virtualAudioGraphs.set(this, virtualAudioGraph)
    this.destination = virtualAudioGraph.getAudioNodeById('input')
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect()
  }
  render (containerEl) {
    containerEls.set(this, containerEl)
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Reverb</h2>
        <ControlContainer>
          Type&nbsp;
          <select onChange={e => {
            reverbTypes.set(this, e.target.value)
            updateAudioGraph.call(this)
          }}>
            {Object.keys(reverbGraphs).map((x, i) => <option key={i}>{x}</option>)}
          </select>
        </ControlContainer>
        <ControlContainer>
          Dry level&nbsp;
          <input
            defaultValue={dryLevels.get(this)}
            max='1'
            min='0'
            onInput={e => {
              dryLevels.set(this, Number(e.target.value))
              updateAudioGraph.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Wet level&nbsp;
          <input
            defaultValue={wetLevels.get(this)}
            max='1'
            min='0'
            onInput={e => {
              wetLevels.set(this, Number(e.target.value))
              updateAudioGraph.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Low cutoff&nbsp;
          <input
            defaultValue={Math.log(lowCuts.get(this))}
            max={Math.log(20000)}
            min={Math.log(20)}
            onInput={e => {
              lowCuts.set(this, Math.exp(Number(e.target.value)))
              updateAudioGraph.call(this)
            }}
            step='0.1'
            type='range'
          />
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
