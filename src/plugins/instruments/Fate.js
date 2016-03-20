import {assoc, dissoc, map, range, zipObj} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const graphs = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const oscTypes = new WeakMap()
const oscTotals = new WeakMap()
const detunes = new WeakMap()

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  {children}
</div>

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()

    outputs.set(this, output)
    graphs.set(this, {})
    oscTypes.set(this, 'sawtooth')
    oscTotals.set(this, 7)
    detunes.set(this, 12)

    const virtualAudioGraph = createVirtualAudioGraph({
      audioContext,
      output
    })

    virtualAudioGraph.defineNodes({
      oscBank: ({gain, frequency, startTime, stopTime}) => {
        const totalOscillators = oscTotals.get(this)
        const osc = i => ['oscillator', 0, {
          detune: (i - Math.floor(totalOscillators / 2)) * detunes.get(this),
          frequency,
          startTime,
          stopTime,
          type: oscTypes.get(this)
        }]
        const oscillators = zipObj(
          range(1, totalOscillators + 1),
          map(osc, range(0, totalOscillators))
        )
        return assoc(0, ['gain', 'output', {gain}], oscillators)
      }
    })
    virtualAudioGraphs.set(this, virtualAudioGraph)
  }
  connect (destination) {
    outputs.get(this).connect(destination)
  }
  disconnect (destination) {
    outputs.get(this).disconnect()
  }
  inputNoteStart ({frequency, gain, id, startTime, stopTime}) {
    const newNodes = {
      ...graphs.get(this),
      [id]: ['oscBank', 'output', {
        frequency,
        gain,
        oscType: oscTypes.get(this),
        startTime,
        stopTime
      }]
    }
    graphs.set(this, newNodes)
    virtualAudioGraphs.get(this).update(newNodes)
  }
  inputNoteStop (id) {
    const newGraph = dissoc(id, graphs.get(this))
    graphs.set(this, newGraph)
    virtualAudioGraphs.get(this).update(newGraph)
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Fate</h2>
        <ControlContainer>
          <label>
            Osc type&nbsp;
            <select
              defaultValue={oscTypes.get(this)}
              onChange={e => oscTypes.set(this, e.target.value)}
            >
              <option value='sawtooth'>Sawtooth</option>
              <option value='sine'>Sine</option>
              <option value='square'>Square</option>
              <option value='triangle'>Triangle</option>
            </select>
          </label>
        </ControlContainer>
        <ControlContainer>
          <label>
            Detune&nbsp;
            <input
              defaultValue={detunes.get(this)}
              max='50'
              min='0'
              onInput={e => detunes.set(this, Number(e.target.value))}
              type='range'
            />
          </label>
        </ControlContainer>
        <ControlContainer>
          <label>
            totalOscillators&nbsp;
            <input
              defaultValue={oscTotals.get(this)}
              max='50'
              min='1'
              onInput={e => oscTotals.set(this, Number(e.target.value))}
              type='range'
            />
          </label>
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
