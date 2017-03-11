import {createElement} from 'react'
import ReactDOM from 'react-dom'
import sampleNames from '../../constants/sampleNames'

const bucket = 'buckets/elemental-samples/standard-808-drumkit'

const audioContexts = new WeakMap()
const buffers = new WeakMap()
const microphoneOns = new WeakMap()
const outputs = new WeakMap()
const selectedSamples = new WeakMap()

const ControlContainer = ({children}) => createElement('div', {style: {padding: '1rem'}},
  createElement('label', null, children)
)

const loadSample = function (fileName) {
  fetch(`${bucket}/${fileName}`)
    .then(response => response.arrayBuffer())
    .then(data => audioContexts.get(this).decodeAudioData(data))
    .then(buffer => buffers.set(this, buffer))
}

export default class {
  constructor ({audioContext}) {
    const selectedSample = sampleNames[0]

    loadSample.call(this, selectedSample)

    audioContexts.set(this, audioContext)
    buffers.set(this, [])
    microphoneOns.set(this, false)
    outputs.set(this, audioContext.createGain())
    selectedSamples.set(this, selectedSample)
  }
  connect (destination) { outputs.get(this).connect(destination) }
  disconnect (destination) { outputs.get(this).disconnect(destination) }
  noteStart ({frequency, startTime}) {
    const source = audioContexts.get(this).createBufferSource()
    source.buffer = buffers.get(this)
    source.playbackRate.value = frequency / 440
    source.connect(outputs.get(this))
    source.start(startTime)
  }
  render (containerEl) {
    ReactDOM.render(
      createElement('div', {style: {textAlign: 'center'}},
        createElement('h2', null, 'Sample'),
        createElement(ControlContainer, null,
          'File ',
          createElement(
            'select',
            {
              defaultValue: selectedSamples.get(this),
              onChange: ({target: {value}}) => {
                selectedSamples.set(this, value)
                loadSample.call(this, value)
              },
            },
            sampleNames.map((sample, i) => createElement('option', {key: i, value: sample}, sample))
          )
        )
      ),
      containerEl
    )
  }
}
