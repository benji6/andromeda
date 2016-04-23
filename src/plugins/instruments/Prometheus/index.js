import React from 'react'
import ReactDOM from 'react-dom'
import createStore from 'st88'
import createVirtualAudioGraph from 'virtual-audio-graph'
import Prometheus from './components/Prometheus'
import notesToGraph from './notesToGraph'

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
        frequency: 4096,
        gain: 1,
        Q: 5,
        type: 'lowpass',
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

    store.subscribe(updateAudio.bind(this))

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
    const newNotes = [...notes.get(this), note]
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

    const updateProp = (key, val) => {
      store.dispatch(state => ({...state, [key]: val}))
    }

    const updateFilterProp = (key, val) => {
      store.dispatch(state => ({
        ...state,
        filter: {...state.filter, [key]: val},
      }))
    }

    const updateOsc = i => (key, val) => {
      store.dispatch(state => ({
        ...state,
        oscillators: [
          ...state.oscillators.slice(0, i),
          {...state.oscillators[i], [key]: val},
          ...state.oscillators.slice(i + 1),
        ],
      }))
    }

    ReactDOM.render(
      <Prometheus {...{
        store,
        updateProp,
        updateOsc,
        updateFilterProp,
      }} />,
      containerEl
    )
  }
}
