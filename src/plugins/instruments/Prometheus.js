import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'
import frequencyToPitch from '../../audioHelpers/frequencyToPitch'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'

const configs = new WeakMap()
const notes = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const osc = ({detune, frequency, gain, pitch, startTime, stopTime, type}) => ({
  0: ['gain', 'output', {gain}],
  1: ['oscillator', 0, {
    detune,
    frequency: pitchToFrequency(frequencyToPitch(frequency) + pitch),
    startTime,
    stopTime,
    type,
  }],
})

const notesToGraph = function (notes) {
  const {filter, oscillators, masterGain} = configs.get(this)
  return notes.reduce((acc, {frequency, gain, id, startTime, stopTime}) => {
    const noteGainId = `noteGain-${id}`
    acc[noteGainId] = ['gain', 'filter', {gain}]
    oscillators.forEach((oscParams, i) => {
      acc[`osc${i}${id}`] = [osc, noteGainId, {...oscParams, frequency, startTime, stopTime}]
    })
    return acc
  }, {
    masterGain: ['gain', 'output', {gain: masterGain}],
    filter: ['biquadFilter', 'masterGain', {frequency: filter.frequency, Q: filter.Q}],
  })
}

const updateAudio = function () {
  virtualAudioGraphs.get(this).update(notesToGraph.call(this, notes.get(this)))
}

const ControlContainer = ({children}) => <div style={{padding: '0.25rem'}}>
  <label>
    {children}
  </label>
</div>

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
  return <div {...{style: {display: 'inline-block'}}}>
    <h3>Osc {i}</h3>
    <ControlContainer>
      Type&nbsp;
      <select
        defaultValue={settings.type}
        onChange={({target: {value}}) => updateOsc('type', value)}
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
        defaultValue={settings.gain}
        max='2'
        min='0'
        onInput={e => updateOsc('gain', Number(e.target.value))}
        step='0.01'
        type='range'
      />
    </ControlContainer>
    <ControlContainer>
      Pitch&nbsp;
      <input
        defaultValue={settings.pitch}
        max='24'
        min='-24'
        onInput={e => updateOsc('pitch', Number(e.target.value))}
        type='range'
      />
    </ControlContainer>
    <ControlContainer>
      Detune&nbsp;
      <input
        defaultValue={settings.detune}
        max='50'
        min='-50'
        onInput={e => updateOsc('detune', Number(e.target.value))}
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

    configs.set(this, {
      filter: {
        frequency: 8192,
        Q: 1,
      },
      masterGain: 0.75,
      oscillators: [
        {detune: 0, gain: 0.35, name: 1, pitch: 0, type: 'triangle'},
        {detune: 13, gain: 0.5, name: 2, pitch: 7, type: 'sine'},
        {detune: -7, gain: 0.9, name: 3, pitch: -24, type: 'sine'},
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
    const {filter, masterGain, oscillators} = configs.get(this)
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Prometheus</h2>
        <ControlContainer>
          Master gain&nbsp;
          <input
            defaultValue={masterGain}
            max='1.5'
            min='0'
            onInput={e => {
              configs.set(this, {...configs.get(this), masterGain: e.target.value})
              updateAudio.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Filter frequency&nbsp;
          <input
            defaultValue={Math.log(filter.frequency)}
            max={Math.log(20000)}
            min={Math.log(20)}
            onInput={e => {
              configs.set(this, {
                ...configs.get(this),
                filter: {...configs.get(this).filter, frequency: Math.exp(Number(e.target.value))},
              })
              updateAudio.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Filter resonance&nbsp;
          <input
            defaultValue={filter.Q}
            max='20'
            min='0'
            onInput={e => {
              configs.set(this, {
                ...configs.get(this),
                filter: {...configs.get(this).filter, Q: Number(e.target.value)},
              })
              updateAudio.call(this)
            }}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        {oscillators.map((oscSettings, i) => <span key={i}>{OscSettings.call(this, {
          i,
          settings: oscSettings
        })}</span>)}
      </div>,
      containerEl
    )
  }
}
