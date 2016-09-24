import {createElement} from 'react'
import {connect} from 'react-redux'
import {controlPadTouched} from '../../actions'
import {instrumentInstance} from '../../utils/derivedData'
import ControlPad from '../organisms/ControlPad'
import ButtonPrimary from '../atoms/ButtonPrimary'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import scales from '../../constants/scales'
import store from '../../store'
import {makeClassName} from '../../utils/dom'

const controlPadId = 'controlPad'

let currentlyPlayingPitch = null

const calculatePitch = ratio => {
  const scale = scales[store.getState().settings.selectedScale]
  const {length} = scale
  const i = Math.floor((length + 1) * ratio)
  return scale[(i % length + length) % length] + 12 * Math.floor(i / length)
}

const mapStateToProps = ({
  controlPad: {
    instrument,
    noScale,
    octave,
    portamento,
    range,
    touched,
  },
  nav: {lastDirection},
  plugins,
  settings: {rootNote},
}) => ({
  instrument,
  lastDirection,
  noScale,
  octave,
  plugins,
  portamento,
  range,
  rootNote,
  touched,
})

const mapDispatchToProps = {controlPadTouched}

export default connect(mapStateToProps, mapDispatchToProps)(({
  controlPadTouched,
  instrument,
  lastDirection,
  noScale,
  octave,
  plugins,
  portamento,
  range,
  rootNote,
  touched,
}) =>
  createElement('div', {
    className: makeClassName(
      'ControlPadPage',
      lastDirection === 'left' ? 'slide-in-left' : 'slide-in-right'
    ),
  },
    createElement('div', null,
      createElement(ControlPad, {
        controlPadTouched,
        inputStopHandler () {
          currentlyPlayingPitch = null
          const instance = instrumentInstance(instrument, plugins)
          instance.noteStop(controlPadId)
        },
        inputStartHandler ({xRatio, yRatio}) {
          const instance = instrumentInstance(instrument, plugins)

          currentlyPlayingPitch = noScale
            ? 12 * range * xRatio
            : calculatePitch(range * xRatio)

          instance.noteStart({
            frequency: pitchToFrequency(currentlyPlayingPitch + 12 * octave + rootNote),
            gain: (1 - yRatio) / 2,
            id: controlPadId,
          })
        },
        inputModifyHandler ({xRatio, yRatio}) {
          const pitch = noScale
            ? 12 * range * xRatio
            : calculatePitch(range * xRatio)
          const instance = instrumentInstance(instrument, plugins)

          const isNewNote = !noScale &&
            !portamento &&
            currentlyPlayingPitch !== pitch &&
            currentlyPlayingPitch !== null

          if (isNewNote && instance.noteStop) {
            instance.noteStop(controlPadId)
          }

          currentlyPlayingPitch = pitch
          const note = {
            frequency: pitchToFrequency(pitch + 12 * octave + rootNote),
            gain: (1 - yRatio) / 2,
            id: controlPadId,
          }
          isNewNote
            ? instance.noteStart(note)
            : instance.noteModify(note)
        },
        touched,
      })
    ),
    createElement(
      ButtonPrimary,
      {to: '/controllers/control-pad/settings'},
      'Options'
    )
  ))
