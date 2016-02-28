import {dissoc} from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import createVirtualAudioGraph from 'virtual-audio-graph'

const graphs = new WeakMap()
const outputs = new WeakMap()
const virtualAudioGraphs = new WeakMap()
const osc1Settings = new WeakMap()
const osc2Settings = new WeakMap()

export default class {
  constructor ({audioContext}) {
    const output = audioContext.createGain()
    outputs.set(this, output)
    graphs.set(this, {})
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
    outputs.get(this).disconnect()
  }
  inputNoteStart ({frequency, gain, id, startTime, stopTime}) {
    const newNodes = {
      ...graphs.get(this),
      0: ['gain', 'output', {gain}],
      [id]: ['oscBank', 0, {
        gain,
        frequency,
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
        <h2>Prometheus</h2>
        <h3>Osc 1</h3>

        <div>
          <label>
            Type&nbsp;
            <select
              defaultValue={osc1Settings.get(this).type}
              onChange={e => osc1Settings.set(
                this,
                {...osc1Settings.get(this), type: e.target.value}
              )}
            >
              <option value='sawtooth'>Sawtooth</option>
              <option value='sine'>Sine</option>
              <option value='square'>Square</option>
              <option value='triangle'>Triangle</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Detune&nbsp;
            <input
              defaultValue={osc1Settings.get(this).detune}
              max='50'
              min='-50'
              onInput={e => osc1Settings.set(
                this,
                {...osc1Settings.get(this), detune: Number(e.target.value)}
              )}
              type='range'
            />
          </label>
        </div>
        <h3>Osc 2</h3>
        <div>
          <label>
            Type&nbsp;
            <select
              defaultValue={osc2Settings.get(this).type}
              onChange={e => osc2Settings.set(
                this,
                {...osc1Settings.get(this), type: e.target.value}
              )}
            >
              <option value='sawtooth'>Sawtooth</option>
              <option value='sine'>Sine</option>
              <option value='square'>Square</option>
              <option value='triangle'>Triangle</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Detune&nbsp;
            <input
              defaultValue={osc2Settings.get(this).detune}
              max='50'
              min='-50'
              onInput={e => osc2Settings.set(
                this,
                {...osc2Settings.get(this), detune: Number(e.target.value)}
              )}
              type='range'
            />
          </label>
        </div>
      </div>,
      containerEl
    )
  }
}
