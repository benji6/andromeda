import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const notes = new WeakMap()
const osc1Settings = new WeakMap()
const osc2Settings = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const notesToGraph = notes => notes.reduce((acc, {
  frequency, gain, id, startTime, stopTime
}) => ({
  ...acc,
  0: ['gain', 'output', {gain}],
  [id]: ['oscBank', 0, {
    gain,
    frequency,
    startTime,
    stopTime
  }],
}), {})

const updateAudio = function () {
  virtualAudioGraphs.get(this).update(notesToGraph(notes.get(this)))
}

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    notes.set(this, [])
    osc1Settings.set(this, {detune: 0, type: 'sine'})
    osc2Settings.set(this, {detune: 10, type: 'sine'})
    const virtualAudioGraph = createVirtualAudioGraph({audioContext, output})
    virtualAudioGraph.defineNodes({
      oscBank: ({gain, frequency, startTime, stopTime}) => ({
        0: ['gain', 'output', {gain}],
        1: ['oscillator', 0, {
          ...osc1Settings.get(this),
          frequency,
          startTime,
          stopTime
        }],
        2: ['oscillator', 0, {
          ...osc2Settings.get(this),
          frequency,
          startTime,
          stopTime
        }]
      })
    })
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
        <h3>Osc 1</h3>
        <ControlContainer>
          Type&nbsp;
          <select
            defaultValue={osc1Settings.get(this).type}
            onChange={({target: {value}}) => {
              osc1Settings.set(this, {
                ...osc1Settings.get(this),
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
          Detune&nbsp;
          <input
            defaultValue={osc1Settings.get(this).detune}
            max='50'
            min='-50'
            onInput={e => {
              osc1Settings.set(this, {
                ...osc1Settings.get(this),
                detune: Number(e.target.value)
              })
              updateAudio.call(this)
            }}
            type='range'
          />
        </ControlContainer>
        <h3>Osc 2</h3>
        <ControlContainer>
          Type&nbsp;
          <select
            defaultValue={osc2Settings.get(this).type}
            onChange={e => {
              osc2Settings.set(this, {
                ...osc1Settings.get(this),
                type: e.target.value
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
          Detune&nbsp;
          <input
            defaultValue={osc2Settings.get(this).detune}
            max='50'
            min='-50'
            onInput={e => {
              osc2Settings.set(this, {
                ...osc2Settings.get(this),
                detune: Number(e.target.value)
              })
              updateAudio.call(this)
            }}
            type='range'
          />
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
