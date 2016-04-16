import React from 'react'
import {connect} from 'react-redux'
import {instrumentInstance} from '../../utils/derivedData'
import ControlPad from '../organisms/ControlPad'
import FullButton from '../atoms/FullButton'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import scales from '../../constants/scales'
import store from '../../store'

const controlPadId = 'controlPad'

let currentlyPlayingPitch = null

const calculatePitch = ratio => {
  const scale = scales[store.getState().settings.selectedScale]
  const {length} = scale
  const i = Math.floor((length + 1) * ratio)
  return scale[(i % length + length) % length] + 12 * Math.floor(i / length)
}

const connectComponent = connect(({
  controlPad: {
    instrument,
    noScale,
    octave,
    portamento,
    range,
  },
  plugins,
  settings: {rootNote},
}) => ({
  instrument,
  noScale,
  octave,
  plugins,
  portamento,
  range,
  rootNote,
}))

export default connectComponent(({
  instrument,
  noScale,
  octave,
  plugins,
  portamento,
  range,
  rootNote,
}) =>
  <div>
    <div className='text-center'>
      <ControlPad {...{
        inputStopHandler: _ => {
          currentlyPlayingPitch = null
          const instance = instrumentInstance(instrument, plugins)
          instance.noteStop && instance.noteStop(controlPadId)
        },
        inputStartHandler: ({xRatio, yRatio}) => {
          const instance = instrumentInstance(instrument, plugins)

          currentlyPlayingPitch = noScale
            ? 12 * range * xRatio
            : calculatePitch(range * xRatio)

          instance.noteStart({
            frequency: pitchToFrequency(currentlyPlayingPitch + 12 * octave + rootNote),
            gain: (1 - yRatio) / 2,
            id: controlPadId
          })
        },
        inputModifyHandler: ({xRatio, yRatio}) => {
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
            id: controlPadId
          }
          isNewNote
            ? instance.noteStart && instance.noteStart(note)
            : instance.noteModify && instance.noteModify(note)
        },
      }}/>
    </div>
    <nav>
      <FullButton to='/controllers/control-pad/settings'>Options</FullButton>
    </nav>
  </div>)
