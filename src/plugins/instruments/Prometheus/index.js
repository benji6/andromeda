import React from 'react'
import ReactDOM from 'react-dom'
import createStore from 'st88'
import createVirtualAudioGraph from 'virtual-audio-graph'
import Prometheus from './components/Prometheus'
import notesToGraph from './notesToGraph'

const audioContexts = new WeakMap()
const stores = new WeakMap()
const notes = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const updateAudio = function (state) {
  virtualAudioGraphs.get(this).update(notesToGraph(state, notes.get(this)))
}

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})

    notes.set(this, [])
    const store = createStore({
      filter: {
        frequency: 1300,
        gain: -12,
        Q: 5,
        type: 'lowpass',
      },
      lfo: {
        frequency: 0.3,
        gain: 400,
        type: 'triangle',
      },
      master: {
        gain: 0.75,
        pan: 0,
      },
      oscillators: [
        {detune: 0, gain: 0.35, name: 1, pan: -0.3, pitch: 0, type: 'triangle'},
        {detune: 13, gain: 0.5, name: 2, pan: 0.4, pitch: 7, type: 'triangle'},
        {detune: -7, gain: 0.8, name: 3, pan: 0.1, pitch: -12, type: 'sawtooth'},
        {detune: 10, gain: 0.2, name: 4, pan: -0.4, pitch: 12, type: 'square'},
      ]
    })

    store.subscribe(updateAudio.bind(this))

    audioContexts.set(this, audioContext)
    stores.set(this, store)
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
    const updateProp = prop => (key, val) => store.dispatch(state => ({
      ...state,
      [prop]: {...state[prop], [key]: val},
    }))

    const updateFilter = updateProp('filter')
    const updateLfo = updateProp('lfo')
    const updateMaster = updateProp('master')

    const updateOsc = i => (key, val) => store.dispatch(state => ({
      ...state,
      oscillators: [
        ...state.oscillators.slice(0, i),
        {...state.oscillators[i], [key]: val},
        ...state.oscillators.slice(i + 1),
      ],
    }))

    ReactDOM.render(
      <Prometheus {...{
        store,
        updateFilter,
        updateLfo,
        updateOsc,
        updateMaster,
      }} />,
      containerEl
    )
  }
}
