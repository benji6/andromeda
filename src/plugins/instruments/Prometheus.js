import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'
import frequencyToPitch from '../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'

const notes = new WeakMap()
const osc1Settings = new WeakMap()
const osc2Settings = new WeakMap()
const osc3Settings = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const osc = ({detune, gain, frequency, pitch, startTime, stopTime, type}) => ({
  0: ['gain', 'output', {gain}],
  1: ['oscillator', 0, {
    detune,
    frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
    startTime,
    stopTime,
    type,
  }],
})
const oscBank = ({gain, frequency, osc1, osc2, osc3, startTime, stopTime}) => ({
  0: ['gain', 'output', {gain}],
  1: [osc, 0, {
    ...osc1,
    frequency,
    startTime,
    stopTime
  }],
  2: [osc, 0, {
    ...osc2,
    frequency,
    startTime,
    stopTime
  }],
  3: [osc, 0, {
    ...osc3,
    frequency,
    startTime,
    stopTime
  }],
})

const notesToGraph = function (notes) {
  return notes.reduce((acc, {
    frequency, gain, id, startTime, stopTime
  }) => ({
    ...acc,
    0: ['gain', 'output', {gain}],
    [id]: [oscBank, 0, {
      frequency,
      gain,
      osc1: osc1Settings.get(this),
      osc2: osc2Settings.get(this),
      osc3: osc3Settings.get(this),
      startTime,
      stopTime,
    }],
  }), {})
}

const updateAudio = function () {
  virtualAudioGraphs.get(this).update(notesToGraph.call(this, notes.get(this)))
}

const ControlContainer = ({children}) => <div style={{padding: '0.25rem'}}>
  <label>
    {children}
  </label>
</div>

const OscSettings = function ({settingsRef}) {
  return <div {...{style: {display: 'inline-block'}}}>
    <h3>Osc {settingsRef.get(this).name}</h3>
    <ControlContainer>
      Type&nbsp;
      <select
        defaultValue={settingsRef.get(this).type}
        onChange={({target: {value}}) => {
          settingsRef.set(this, {
            ...settingsRef.get(this),
            type: value
          })
          updateAudio.call(this)
        }}
      >
        <option value='sawtooth'>Sawtooth</option>
        <option value='sine'>Sine</option>
        <option value='square'>Square</option>
        <option value='triangle'>Triangle</option>
      </select>
    </ControlContainer>
    <ControlContainer>
      Gain&nbsp;
      <input
        defaultValue={settingsRef.get(this).gain}
        max='2'
        min='0'
        onInput={e => {
          settingsRef.set(this, {
            ...settingsRef.get(this),
            gain: Number(e.target.value)
          })
          updateAudio.call(this)
        }}
        step='0.01'
        type='range'
      />
    </ControlContainer>
    <ControlContainer>
      Pitch&nbsp;
      <input
        defaultValue={settingsRef.get(this).pitch}
        max='24'
        min='-24'
        onInput={e => {
          settingsRef.set(this, {
            ...settingsRef.get(this),
            pitch: Number(e.target.value)
          })
          updateAudio.call(this)
        }}
        type='range'
      />
    </ControlContainer>
    <ControlContainer>
      Detune&nbsp;
      <input
        defaultValue={settingsRef.get(this).detune}
        max='50'
        min='-50'
        onInput={e => {
          settingsRef.set(this, {
            ...settingsRef.get(this),
            detune: Number(e.target.value)
          })
          updateAudio.call(this)
        }}
        type='range'
      />
    </ControlContainer>
  </div>
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    notes.set(this, [])
    osc1Settings.set(this, {detune: 0, gain: 0.6, name: 1, pitch: 0, type: 'triangle'})
    osc2Settings.set(this, {detune: 13, gain: 0.8, name: 2, pitch: 7, type: 'sine'})
    osc3Settings.set(this, {detune: -7, gain: 1.2, name: 3, pitch: -24, type: 'sine'})
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
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Prometheus</h2>
        {OscSettings.call(this, {settingsRef: osc1Settings})}
        {OscSettings.call(this, {settingsRef: osc2Settings})}
        {OscSettings.call(this, {settingsRef: osc3Settings})}
      </div>,
      containerEl
    )
  }
}
