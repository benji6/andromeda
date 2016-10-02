import {createElement} from 'react'
import ReactDOM from 'react-dom'
import {createStore, connect} from 'st88'
import createVirtualAudioGraph from 'virtual-audio-graph'
import ControlModule, {CheckBox, Range} from '../../../components/organisms/ControlModule'

const maxDelayTime = 1.2

const outputs = new WeakMap()
const stores = new WeakMap()

const updateAudioGraph = virtualAudioGraph => ({
  delayTime,
  dryLevel,
  feedback,
  highCut,
  lowCut,
  pingPong,
  wetLevel,
}) => virtualAudioGraph.update({
  0: ['gain', 'output', {gain: wetLevel}],
  1: ['stereoPanner', 0, {pan: -1}],
  2: ['stereoPanner', 0, {pan: 1}],
  3: ['delay', [2, 8], {delayTime, maxDelayTime}],
  4: ['gain', 3, {gain: feedback}],
  5: ['delay', pingPong ? [1, 3] : [0, 8], {delayTime, maxDelayTime}],
  6: ['biquadFilter', 5, {frequency: highCut}],
  7: ['biquadFilter', 6, {frequency: lowCut, type: 'highpass'}],
  8: ['gain', 7, {gain: feedback}],
  9: ['gain', 'output', {gain: dryLevel}],
  input: ['gain', [8, 9], {gain: 1}, 'input'],
})

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
    const store = createStore({
      delayTime: 1 / 3,
      dryLevel: 0.9,
      feedback: 0.25,
      highCut: 16000,
      lowCut: 50,
      pingPong: true,
      wetLevel: 0.6,
    })

    stores.set(this, store)

    store.subscribe(updateAudioGraph(virtualAudioGraph))
    store.dispatch(x => x)

    outputs.set(this, output)
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
    const setProp = (key, val) => store.dispatch(state => ({...state, [key]: val}))
    const setPropFromRangeEvent = key => e => store.dispatch(state => ({
      ...state,
      [key]: Number(e.target.value),
    }))

    ReactDOM.render(connect(store)(({
      delayTime,
      dryLevel,
      feedback,
      highCut,
      lowCut,
      pingPong,
      wetLevel,
    }) =>
      createElement('div', {style: {textAlign: 'center'}},
        createElement('h2', null, 'Delay'),
        createElement(ControlModule, null,
          createElement(CheckBox, {
            defaultChecked: pingPong,
            label: 'Ping pong',
            onChange: e => setProp('pingPong', e.target.checked),
          }),
          createElement(Range, {
            defaultValue: dryLevel,
            label: 'Dry level',
            max: '1.5',
            onInput: setPropFromRangeEvent('dryLevel'),
          }),
          createElement(Range, {
            defaultValue: wetLevel,
            label: 'Wet level',
            max: '1.5',
            onInput: setPropFromRangeEvent('wetLevel'),
          }),
          createElement(Range, {
            defaultValue: feedback,
            label: 'Feedback',
            max: '1.2',
            onInput: setPropFromRangeEvent('feedback'),
          }),
          createElement(Range, {
            defaultValue: delayTime,
            label: 'Delay time',
            max: maxDelayTime,
            min: 0.01,
            onInput: setPropFromRangeEvent('delayTime'),
          }),
          createElement(Range, {
            defaultValue: Math.log(lowCut),
            displayValue: lowCut.toFixed(2),
            label: 'Low cutoff',
            max: Math.log(20000),
            min: Math.log(20),
            onInput: e => setProp('lowCut', Math.exp(Number(e.target.value))),
          }),
          createElement(Range, {
            defaultValue: Math.log(highCut),
            displayValue: highCut.toFixed(2),
            label: 'High cutoff',
            max: Math.log(20000),
            min: Math.log(20),
            onInput: e => setProp('highCut', Math.exp(Number(e.target.value))),
          }),
        )
      )),
      containerEl
    )
  }
}
