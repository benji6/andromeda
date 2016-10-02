import {createElement} from 'react'
import ReactDOM from 'react-dom'

const getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
).bind(navigator)

const audioContexts = new WeakMap()
const mediaStreamSources = new WeakMap()
const microphoneOns = new WeakMap()
const outputs = new WeakMap()

const ControlContainer = ({children}) => createElement('div', {
  children,
  style: {padding: '1rem'},
})

const turnMicOff = self => mediaStreamSources.get(self).disconnect()
const turnMicOn = self => getUserMedia(
  {audio: true},
  stream => {
    // microphone available
    const mediaStreamSource = audioContexts.get(self).createMediaStreamSource(stream)
    mediaStreamSources.set(self, mediaStreamSource)
    mediaStreamSource.connect(outputs.get(self))
  },
  () => null // microphone not available
)

export default class {
  constructor ({audioContext}) {
    audioContexts.set(this, audioContext)
    microphoneOns.set(this, false)
    outputs.set(this, audioContext.createGain())
  }
  connect (destination) { outputs.get(this).connect(destination) }
  disconnect (destination) { outputs.get(this).disconnect(destination) }
  render (containerEl) {
    ReactDOM.render(
      createElement('div', {style: {textAlign: 'center'}},
        createElement('h2', null, 'Microphone'),
        createElement(ControlContainer, null,
          createElement('label', null, 'Turn on',
            createElement('input', {
              defaultChecked: microphoneOns.get(this),
              onClick: () => {
                const microphoneOn = !microphoneOns.get(this)
                microphoneOns.set(this, microphoneOn)
                if (microphoneOn) turnMicOn(this); else turnMicOff(this)
              },
              type: 'checkbox',
            })
          )
        ),
        createElement(ControlContainer, null,
          createElement('label', null,
            'Volume ',
            createElement('input', {
              defaultValue: outputs.get(this).gain.value,
              max: 3,
              min: 0,
              onInput: e => outputs.get(this).gain.value = Number(e.target.value),
              step: 0.05,
              type: 'range',
            })
          )
        )
      ),
      containerEl
    )
  }
}
