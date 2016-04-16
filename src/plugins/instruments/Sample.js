import React from 'react'
import ReactDOM from 'react-dom'

const bucket = 'buckets/elemental-samples/standard-808-drumkit'

const samples = [
  'cl_hihat.wav',
  'claves.wav',
  'conga1.wav',
  'cowbell.wav',
  'crashcym.wav',
  'handclap.wav',
  'hi_conga.wav',
  'hightom.wav',
  'kick1.wav',
  'kick2.wav',
  'maracas.wav',
  'open_hh.wav',
  'rimshot.wav',
  'snare.wav',
  'tom1.wav'
]

const audioContexts = new WeakMap()
const buffers = new WeakMap()
const microphoneOns = new WeakMap()
const outputs = new WeakMap()
const selectedSamples = new WeakMap()

const ControlContainer = ({children}) => <div style={{padding: '1rem'}}>
  <label>
    {children}
  </label>
</div>

const loadSample = function (fileName) {
  window.fetch(`${bucket}/${fileName}`)
    .then(response => response.arrayBuffer())
    .then(data => audioContexts.get(this).decodeAudioData(data))
    .then(buffer => buffers.set(this, buffer))
}

export default class {
  constructor ({audioContext}) {
    const selectedSample = samples[0]

    loadSample.call(this, selectedSample)

    audioContexts.set(this, audioContext)
    buffers.set(this, [])
    microphoneOns.set(this, false)
    outputs.set(this, audioContext.createGain())
    selectedSamples.set(this, selectedSample)
  }
  connect (destination) { outputs.get(this).connect(destination) }
  disconnect (destination) { outputs.get(this).disconnect(destination) }
  noteStart ({frequency}) {
    const source = audioContexts.get(this).createBufferSource()
    source.buffer = buffers.get(this)
    source.playbackRate.value = frequency / 440
    source.connect(outputs.get(this))
    source.start()
  }
  render (containerEl) {
    ReactDOM.render(
      <div style={{textAlign: 'center'}}>
        <h2>Sample</h2>
        <ControlContainer>
          File&nbsp;
          <select defaultValue={selectedSamples.get(this)} onChange={({target: {value}}) => {
            selectedSamples.set(this, value)
            loadSample.call(this, value)
          }}>
            {
              samples.map((sample, i) => <option key={i} value={sample}>
                {sample}
              </option>)
            }
          </select>
        </ControlContainer>
      </div>,
      containerEl
    )
  }
}
