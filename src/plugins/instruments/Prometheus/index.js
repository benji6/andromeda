import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'
import frequencyToPitch from '../../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../../audioHelpers/pitchToFrequency'
import ModuleRange from './components/ModuleRange'
import ModuleSelect from './components/ModuleSelect'
import Module from './components/Module'

const configs = new WeakMap()
const notes = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const osc = ({detune, frequency, gain, pan, pitch, startTime, stopTime, type}) => ({
  0: ['gain', 'output', {gain}],
  1: ['stereoPanner', 0, {pan}],
  2: ['oscillator', 1, {
    detune,
    frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
    startTime,
    stopTime,
    type,
  }],
})

const notesToGraph = function (notes) {
  const {filter, oscillators, masterGain, masterPan} = configs.get(this)
  return notes.reduce((acc, {frequency, gain, id, startTime, stopTime}) => {
    const noteGainId = `noteGain-${id}`
    acc[noteGainId] = ['gain', 'filter', {gain}]
    oscillators.forEach((oscParams, i) => {
      acc[`osc${i}${id}`] = [osc, noteGainId, {...oscParams, frequency, startTime, stopTime}]
    })
    return acc
  }, {
    masterGain: ['gain', 'output', {gain: masterGain}],
    masterPan: ['stereoPanner', 'masterGain', {pan: masterPan}],
    filter: ['biquadFilter', 'masterPan', {frequency: filter.frequency, Q: filter.Q}],
  })
}

const updateAudio = function () {
  virtualAudioGraphs.get(this).update(notesToGraph.call(this, notes.get(this)))
}

const OscSettings = function ({i, settings}) {
  const updateOsc = (key, val) => {
    const config = configs.get(this)
    configs.set(this, {
      ...config,
      oscillators: [
        ...config.oscillators.slice(0, i),
        {...config.oscillators[i], [key]: val},
        ...config.oscillators.slice(i + 1),
      ],
    })
    updateAudio.call(this)
  }
  return <Module {...{title: `Osc ${i + 1}`}} >
    <ModuleSelect
      defaultValue={settings.type}
      onChange={({target: {value}}) => updateOsc('type', value)}
      label='Type'
    >
      <option value='sawtooth'>Sawtooth</option>
      <option value='sine'>Sine</option>
      <option value='square'>Square</option>
      <option value='triangle'>Triangle</option>
    </ModuleSelect>
    <ModuleRange {...{
      defaultValue: settings.gain,
      label: 'Gain',
      max: 2,
      min: 0,
      onInput: e => updateOsc('gain', Number(e.target.value)),
      step: 0.01,
    }} />
    <ModuleRange {...{
      defaultValue: settings.pan,
      label: 'Pan',
      max: 1,
      min: -1,
      onInput: e => updateOsc('pan', Number(e.target.value)),
      step: 0.01,
    }} />
    <ModuleRange {...{
      defaultValue: settings.pitch,
      label: 'Pitch',
      max: 24,
      min: -24,
      onInput: e => updateOsc('pitch', Number(e.target.value)),
    }} />
    <ModuleRange {...{
      defaultValue: settings.detune,
      label: 'Detune',
      max: 50,
      min: -50,
      onInput: e => updateOsc('detune', Number(e.target.value)),
    }} />
  </Module>
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    notes.set(this, [])

    configs.set(this, {
      filter: {
        frequency: 4096,
        Q: 5,
      },
      masterGain: 0.75,
      masterPan: 0,
      oscillators: [
        {detune: 0, gain: 0.35, name: 1, pan: -0.3, pitch: 0, type: 'triangle'},
        {detune: 13, gain: 0.5, name: 2, pan: 0.6, pitch: 7, type: 'sine'},
        {detune: -7, gain: 0.9, name: 3, pan: 0.1, pitch: -24, type: 'sine'},
        {detune: 10, gain: 0.2, name: 4, pan: -0.4, pitch: 12, type: 'square'},
      ]
    })

    outputs.set(this, output)

    virtualAudioGraphs.set(this, virtualAudioGraph)
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect(destination)
  }
  noteStart (note) {
    const newNotes = [...notes.get(this), note]
    notes.set(this, newNotes)
    updateAudio.call(this)
  }
  noteModify (note) {
    const currentNotes = notes.get(this)
    const extantNoteIdx = currentNotes.findIndex(({id}) => id === note.id)
    notes.set(this, [
      ...currentNotes.slice(0, extantNoteIdx),
      note,
      ...currentNotes.slice(extantNoteIdx + 1),
    ])
    updateAudio.call(this)
  }
  noteStop (id) {
    const newNotes = notes.get(this).filter(note => note.id !== id)
    notes.set(this, newNotes)
    updateAudio.call(this)
  }
  render (containerEl) {
    const {filter, masterGain, masterPan, oscillators} = configs.get(this)
    ReactDOM.render(
      <div {...{style: {color: '#ace', textAlign: 'center'}}}>
        <h2 {...{style: {
            fontSize: '1.3rem',
            margin: '1rem',
          }}}>PROMETHEUS</h2>
        <div>
          <Module title='Master'>
            <ModuleRange {...{
              defaultValue: masterGain,
              label: 'Gain',
              max: 1.5,
              min: 0,
              onInput: e => {
                configs.set(this, {...configs.get(this), masterGain: e.target.value})
                updateAudio.call(this)
              },
              step: 0.01,
            }} />
            <ModuleRange {...{
              defaultValue: masterPan,
              label: 'Pan',
              max: 1,
              min: -1,
              onInput: e => {
                configs.set(this, {...configs.get(this), masterPan: e.target.value})
                updateAudio.call(this)
              },
              step: 0.01,
            }} />
          </Module>
        </div>
        <div>
          <Module title='Filter'>
            <ModuleRange {...{
              defaultValue: Math.log(filter.frequency),
              label: 'Frequency',
              max: Math.log(20000),
              min: Math.log(20),
              onInput: e => {
                configs.set(this, {
                  ...configs.get(this),
                  filter: {...configs.get(this).filter, frequency: Math.exp(Number(e.target.value))},
                })
                updateAudio.call(this)
              },
              step: 0.01,
            }} />
            <ModuleRange {...{
              defaultValue: Math.log(filter.Q),
              label: 'Resonance',
              max: 20,
              min: 0,
              onInput: e => {
                configs.set(this, {
                  ...configs.get(this),
                  filter: {...configs.get(this).filter, Q: Number(e.target.value)},
                })
                updateAudio.call(this)
              },
              step: 0.1,
            }} />
          </Module>
        </div>
        {oscillators.map((oscSettings, i) => <span key={i}>{OscSettings.call(this, {
          i,
          settings: oscSettings
        })}</span>)}
      </div>,
      containerEl
    )
  }
}
