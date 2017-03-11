import ReactDOM from 'react-dom'
import {createStore, connect} from 'st88'
import createVirtualAudioGraph from 'virtual-audio-graph'
import audioContext from '../../../audioContext'
import ReverbComponent from './ReverbComponent'

const reverbBucket = 'buckets/elemental-reverb'

const containerEls = new WeakMap()
const outputs = new WeakMap()
const stores = new WeakMap()

const reverbTypeToUri = {
  'reverb chapel': `${reverbBucket}/chapel.wav`,
  'reverb mausoleum': `${reverbBucket}/mausoleum.wav`,
  'reverb stairwell': `${reverbBucket}/stairwell.wav`,
}

const reverbTypeToBufferPromise = {}

const updateAudioGraph = virtualAudioGraph => ({
  dryLevel,
  highCut,
  lowCut,
  reverbType,
  wetLevel,
}) => {
  const bufferPromise = reverbTypeToBufferPromise[reverbType] || fetch(reverbTypeToUri[reverbType])
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))

  bufferPromise.then(buffer => virtualAudioGraph.update({
    0: ['gain', 'output', {gain: dryLevel}],
    1: ['biquadFilter', 'output', {frequency: highCut}],
    2: ['biquadFilter', 1, {frequency: lowCut, type: 'highpass'}],
    3: ['gain', 2, {gain: wetLevel}],
    4: ['gain', 3, {gain: 0.5}],
    5: ['convolver', 4, {buffer}, 'input'],
    input: ['gain', [0, 5]],
  }))
  reverbTypeToBufferPromise[reverbType] = bufferPromise
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
    const store = createStore({
      dryLevel: 0.35,
      highCut: 8000,
      lowCut: 50,
      reverbType: 'reverb chapel',
      reverbTypes: Object.keys(reverbTypeToUri),
      wetLevel: 0.8,
    })

    store.subscribe(updateAudioGraph(virtualAudioGraph))
    store.dispatch(x => x)

    stores.set(this, store)
    outputs.set(this, output)

    virtualAudioGraph.update({
      input: ['gain', 'output'],
    })

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
    const setProp = (prop, val) => store.dispatch(state => Object.assign({}, state, {[prop]: val}))

    store.dispatch(state => Object.assign({setProp}, state))
    containerEls.set(this, containerEl)
    ReactDOM.render(
      connect(store)(ReverbComponent),
      containerEl
    )
  }
}
