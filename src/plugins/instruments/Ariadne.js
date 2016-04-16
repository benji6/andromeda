import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const carrierDetunes = new WeakMap()
const carrierOscTypes = new WeakMap()
const masterGains = new WeakMap()
const modulatorDetunes = new WeakMap()
const modulatorOscTypes = new WeakMap()
const modulatorRatios = new WeakMap()
const notes = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const oscBank = ({
  carrierDetune,
  carrierOscType,
  gain,
  frequency,
  masterGain,
  modulatorDetune,
  modulatorOscType,
  modulatorRatio,
  startTime,
  stopTime,
}) => ({
  masterGain: ['gain', ['output'], {gain: masterGain}],
  0: ['gain', ['masterGain'], {gain}],
  1: ['oscillator', 0, {
    detune: carrierDetune,
    frequency,
    startTime,
    stopTime,
    type: carrierOscType,
  }],
  2: ['gain', {key: 1, destination: 'frequency'}, {gain: 1024}],
  3: ['oscillator', 2, {
    detune: modulatorDetune,
    frequency: frequency * modulatorRatio,
    type: modulatorOscType,
    startTime,
    stopTime,
  }],
})

const notesToGraph = function (notes) {
  return notes.reduce((acc, {
    frequency, gain, id, startTime, stopTime
  }) => ({
    ...acc,
    [id]: [oscBank, 'output', {
      carrierDetune: carrierDetunes.get(this),
      carrierOscType: carrierOscTypes.get(this),
      masterGain: masterGains.get(this),
      modulatorDetune: modulatorDetunes.get(this),
      modulatorOscType: modulatorOscTypes.get(this),
      modulatorRatio: modulatorRatios.get(this),
      frequency,
      gain,
      startTime,
      stopTime
    }],
  }), {})
}

const updateAudio = function () {
  virtualAudioGraphs.get(this).update(notesToGraph.call(this, notes.get(this)))
}

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()

    carrierDetunes.set(this, 0)
    carrierOscTypes.set(this, 'sine')
    masterGains.set(this, 1)
    modulatorDetunes.set(this, 0)
    modulatorOscTypes.set(this, 'sine')
    modulatorRatios.set(this, 0.5)
    notes.set(this, [])
    outputs.set(this, output)

    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

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
        <h2>Ariadne</h2>
        <ControlContainer>
          Gain&nbsp;
          <input
            defaultValue={masterGains.get(this)}
            max='1.25'
            min='0'
            onInput={e => {
              masterGains.set(this, Number(e.target.value))
              updateAudio.call(this)
            }}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Carrier wave&nbsp;
          <select
            defaultValue={carrierOscTypes.get(this)}
            onChange={e => {
              carrierOscTypes.set(this, e.target.value)
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
          Modulator wave&nbsp;
          <select
            defaultValue={modulatorOscTypes.get(this)}
            onChange={e => {
              modulatorOscTypes.set(this, e.target.value)
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
          Carrier detune&nbsp;
          <input
            defaultValue={carrierDetunes.get(this)}
            max='32'
            min='-32'
            onInput={e => {
              carrierDetunes.set(this, Number(e.target.value))
              updateAudio.call(this)
            }}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Modulator freq&nbsp;
          <input
            defaultValue={modulatorRatios.get(this)}
            max='8'
            min='0.1'
            onInput={e => {
              modulatorRatios.set(this, Number(e.target.value))
              updateAudio.call(this)
            }}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Modulator detune&nbsp;
          <input
            defaultValue={modulatorDetunes.get(this)}
            max='128'
            min='-128'
            onInput={e => {
              modulatorDetunes.set(this, Number(e.target.value))
              updateAudio.call(this)
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
