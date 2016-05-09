import {fromPairs} from 'ramda'
import audioContext from '../../audioContext'
import createVirtualAudioGraph from 'virtual-audio-graph'
import React from 'react'
import ReactDOM from 'react-dom'
import ControlModule, {Range, Select} from '../../components/organisms/ControlModule'
import {createStore, connect} from 'st88'

let reverbGraphs = {}

const reverbBucket = 'buckets/elemental-reverb'

const containerEls = new WeakMap()
const outputs = new WeakMap()
const stores = new WeakMap()
const virtualAudioGraphs = new WeakMap()

let reverbsFactories

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

const updateAudioGraph = virtualAudioGraph => ({
  dryLevel,
  highCut,
  lowCut,
  reverbType,
  wetLevel,
}) => virtualAudioGraph.update({
  0: ['gain', 'output', {gain: dryLevel}],
  1: ['biquadFilter', 'output', {frequency: highCut}],
  2: ['biquadFilter', 1, {frequency: lowCut, type: 'highpass'}],
  3: ['gain', 2, {gain: wetLevel}],
  4: [reverbsFactories[reverbType], 3],
  input: ['gain', [0, 4]]
})

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
    const store = createStore({
      dryLevel: 0.35,
      highCut: 8000,
      lowCut: 50,
      reverbType: 'reverb chapel',
      wetLevel: 0.8,
    })

    store.subscribe(updateAudioGraph(virtualAudioGraph))

    stores.set(this, store)
    outputs.set(this, output)

    virtualAudioGraph.update({
      input: ['gain', 'output']
    })
    loadAllReverbs
      .then(x => {
        reverbsFactories = x
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
    const store = stores.get(this)
    const setProp = (prop, val) => store.dispatch(state => ({...state, [prop]: val}))
    containerEls.set(this, containerEl)
    ReactDOM.render(
      connect(store)(({
        dryLevel,
        highCut,
        lowCut,
        reverbType,
        wetLevel,
      }) => <div style={{textAlign: 'center'}}>
        <h2>Reverb</h2>
        <ControlModule>
          <Select {...{
              defaultValue: reverbType,
              label: 'Type',
              onChange: e => setProp('reverbType', e.target.value),
            }}>
            {Object.keys(reverbGraphs).map((x, i) => <option key={i} value={x}>
              {x}
            </option>)}
          </Select>
          <Range {...{
            label: 'Dry level',
            defaultValue: dryLevel,
            onInput: e => setProp('dryLevel', Number(e.target.value)),
          }}/>
          <Range {...{
            label: 'Wet level',
            defaultValue: wetLevel,
            onInput: e => setProp('wetLevel', Number(e.target.value)),
          }}/>
          <Range {...{
            label: 'Low cutoff',
            defaultValue: Math.log(lowCut),
            max: Math.log(20000),
            min: Math.log(20),
            onInput: e => setProp('lowCut', Math.exp(Number(e.target.value))),
          }}/>
          <Range {...{
            label: 'High cutoff',
            defaultValue: Math.log(highCut),
            max: Math.log(20000),
            min: Math.log(20),
            onInput: e => setProp('highCut', Math.exp(Number(e.target.value))),
          }}/>
        </ControlModule>
      </div>),
      containerEl
    )
  }
}
