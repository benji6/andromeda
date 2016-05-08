import {assoc} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'
import {createStore} from 'st88'

const audioContexts = new WeakMap()
const notes = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const stores = new WeakMap()

const oscBank = ({
  carrierDetune,
  carrierOscType,
  gain,
  frequency,
  masterGain,
  masterPan,
  modulatorDetune,
  modulatorOscType,
  modulatorRatio,
  startTime,
  stopTime,
}) => ({
  masterGain: ['gain', ['output'], {gain: masterGain}],
  masterPan: ['stereoPanner', ['masterGain'], {pan: masterPan}],
  0: ['gain', ['masterPan'], {gain}],
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

const notesToGraph = ({
  carrierDetune,
  carrierOscType,
  masterGain,
  masterPan,
  modulatorDetune,
  modulatorOscType,
  modulatorRatio,
}, notes) => notes.reduce((acc, {
  frequency, gain, id, startTime, stopTime
}) => ({
  ...acc,
  [id]: [oscBank, 'output', {
    carrierDetune,
    carrierOscType,
    masterGain,
    masterPan,
    modulatorDetune,
    modulatorOscType,
    modulatorRatio,
    frequency,
    gain,
    startTime,
    stopTime
  }],
}), {})

const updateAudio = function (state) {
  virtualAudioGraphs.get(this).update(notesToGraph(state, notes.get(this)))
}

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const store = createStore({
      carrierDetune: 0,
      carrierOscType: 'sine',
      masterGain: 1,
      masterPan: 0,
      modulatorDetune: 0,
      modulatorOscType: 'sine',
      modulatorRatio: 0.5,
      output,
    })
    store.subscribe(updateAudio.bind(this))

    audioContexts.set(this, audioContext)
    stores.set(this, store)
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
    const newNotes = [
      ...notes.get(this).filter(note => note.hasOwnProperty('stopTime')
        ? note.stopTime > audioContexts.get(this).currentTime
        : true),
      note
    ]
    notes.set(this, newNotes)
    updateAudio.call(this, stores.get(this).getState())
  }
  noteModify (note) {
    const currentNotes = notes.get(this)
    const extantNoteIdx = currentNotes.findIndex(({id}) => id === note.id)
    notes.set(this, [
      ...currentNotes.slice(0, extantNoteIdx),
      note,
      ...currentNotes.slice(extantNoteIdx + 1),
    ])
    updateAudio.call(this, stores.get(this).getState())
  }
  noteStop (id) {
    const newNotes = notes.get(this).filter(note => note.id !== id)
    notes.set(this, newNotes)
    updateAudio.call(this, stores.get(this).getState())
  }
  render (containerEl) {
    const store = stores.get(this)
    const state = store.getState()
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Ariadne</h2>
        <ControlContainer>
          Gain&nbsp;
          <input
            defaultValue={state.masterGain}
            max='1.25'
            min='0'
            onInput={e => store.dispatch(assoc('masterGain', Number(e.target.value)))}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Pan&nbsp;
          <input
            defaultValue={state.masterPan}
            max='1'
            min='-1'
            onInput={e => store.dispatch(assoc('masterPan', Number(e.target.value)))}
            step='0.01'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Carrier wave&nbsp;
          <select
            defaultValue={state.carrierOscType}
            onChange={e => store.dispatch(assoc('carrierOscType', e.target.value))}
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
            defaultValue={state.modulatorOscType}
            onChange={e => store.dispatch(assoc('modulatorOscType', e.target.value))}
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
            defaultValue={state.carrierDetune}
            max='32'
            min='-32'
            onInput={e => store.dispatch(assoc('carrierDetune', Number(e.target.value)))}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Modulator freq&nbsp;
          <input
            defaultValue={state.modulatorRatio}
            max='8'
            min='0.1'
            onInput={e => store.dispatch(assoc('modulatorRatio', Number(e.target.value)))}
            step='0.1'
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          Modulator detune&nbsp;
          <input
            defaultValue={state.modulatorDetune}
            max='128'
            min='-128'
            onInput={e => store.dispatch(assoc('modulatorDetune', Number(e.target.value)))}
            step='0.1'
            type='range'
          />
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
