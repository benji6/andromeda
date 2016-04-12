import {fromPairs} from 'ramda'
import audioContext from '../../audioContext'
import createVirtualAudioGraph from 'virtual-audio-graph'
import React from 'react'
import ReactDOM from 'react-dom'

let reverbGraphs = {}

const reverbBucket = 'buckets/elemental-reverb'

const containerEls = new WeakMap()
const dryLevels = new WeakMap()
const highCuts = new WeakMap()
const lowCuts = new WeakMap()
const outputs = new WeakMap()
const reverbTypes = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const wetLevels = new WeakMap()

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
  loadReverb(`${reverbBucket}/chapel.wav`, 'reverb chapel'),
  loadReverb(`${reverbBucket}/mausoleum.wav`, 'reverb mausoleum'),
  loadReverb(`${reverbBucket}/stairwell.wav`, 'reverb stairwell')
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
    1: ['biquadFilter', 'output', {frequency: highCuts.get(this)}],
    2: ['biquadFilter', 1, {frequency: lowCuts.get(this), type: 'highpass'}],
    3: ['gain', 2, {gain: wetLevels.get(this)}],
    4: [reverbTypes.get(this), 3],
    input: ['gain', [0, 4]]
  })
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    dryLevels.set(this, 0.35)
    highCuts.set(this, 8000)
    lowCuts.set(this, 50)
    outputs.set(this, output)
    reverbTypes.set(this, 'reverb chapel')
    wetLevels.set(this, 0.8)

    virtualAudioGraph.update({
      input: ['gain', 'output']
    })
    loadAllReverbs
      .then(x => virtualAudioGraph.defineNodes(x))
      .then(_ => updateAudioGraph.call(this))
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
    outputs.get(this).disconnect(destination)
  }
  render (containerEl) {
    containerEls.set(this, containerEl)
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Reverb</h2>
        <ControlContainer>
          Type&nbsp;
          <select defaultValue={reverbTypes.get(this)} onChange={e => {
            reverbTypes.set(this, e.target.value)
            updateAudioGraph.call(this)
          }}>
            {Object.keys(reverbGraphs).map((x, i) => <option key={i} value={x}>
              {x}
            </option>)}
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
        <ControlContainer>
          High cutoff&nbsp;
          <input
            defaultValue={Math.log(highCuts.get(this))}
            max={Math.log(20000)}
            min={Math.log(20)}
            onInput={e => {
              highCuts.set(this, Math.exp(Number(e.target.value)))
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
