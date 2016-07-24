import {map, merge, range, zipObj} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const audioContexts = new WeakMap()
const detunes = new WeakMap()
const masterGains = new WeakMap()
const notes = new WeakMap()
const oscTotals = new WeakMap()
const oscTypes = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()

const oscBank = ({
  detune,
  gain,
  frequency,
  masterGain,
  oscTotal,
  oscType,
  startTime,
  stopTime,
}) => {
  const totalOscillators = oscTotal
  const type = oscType
  const osc = i => ['oscillator', 0, {
    detune: (i - Math.floor(totalOscillators / 2)) * detune,
    frequency,
    startTime,
    stopTime,
    type: type === 'random'
      ? ['sawtooth', 'sine', 'square', 'triangle'][Math.floor(Math.random() * 4)]
      : type,
  }]
  const oscillators = zipObj(
    range(1, totalOscillators + 1),
    map(osc, range(0, totalOscillators))
  )
  return merge(oscillators, {
    masterGain: ['gain', 'output', {gain: masterGain}],
    0: ['gain', 'masterGain', {gain}],
  })
}

const notesToGraph = function (notes) {
  return notes.reduce((acc, {
    frequency, gain, id, startTime, stopTime,
  }) => ({
    ...acc,
    [id]: [oscBank, 'output', {
      detune: detunes.get(this),
      gain,
      frequency,
      masterGain: masterGains.get(this),
      oscTotal: oscTotals.get(this),
      oscType: oscTypes.get(this),
      startTime,
      stopTime,
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

    audioContexts.set(this, audioContext)
    detunes.set(this, 12)
    notes.set(this, [])
    masterGains.set(this, 0.75)
    oscTotals.set(this, 7)
    oscTypes.set(this, 'sawtooth')
    outputs.set(this, output)

    const virtualAudioGraph = createVirtualAudioGraph({
      audioContext,
      output,
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
    const newNotes = [
      ...notes.get(this).filter(note => note.hasOwnProperty('stopTime')
        ? note.stopTime > audioContexts.get(this).currentTime
        : true),
      note,
    ]
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
        <h2>Fate</h2>
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
          Osc type&nbsp;
          <select
            defaultValue={oscTypes.get(this)}
            onChange={e => {
              oscTypes.set(this, e.target.value)
              updateAudio.call(this)
            }}
          >
            <option value='random'>Random</option>
            <option value='sawtooth'>Sawtooth</option>
            <option value='sine'>Sine</option>
            <option value='square'>Square</option>
            <option value='triangle'>Triangle</option>
          </select>
        </ControlContainer>
        <ControlContainer>
          Detune&nbsp;
          <input
            defaultValue={detunes.get(this)}
            max='50'
            min='0'
            onInput={e => {
              detunes.set(this, Number(e.target.value))
              updateAudio.call(this)
            }}
            type='range'
          />
        </ControlContainer>
        <ControlContainer>
          totalOscillators&nbsp;
          <input
            defaultValue={oscTotals.get(this)}
            max='50'
            min='1'
            onInput={e => {
              oscTotals.set(this, Number(e.target.value))
            }}
            type='range'
          />
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
