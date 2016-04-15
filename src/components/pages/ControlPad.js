import {
  always,
  assoc,
  compose,
  curry,
  ifElse,
  tap
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {instrumentInstance} from '../../utils/derivedData'
import {startArpeggiator, stopArpeggiator} from '../../audioHelpers/arpeggiator'
import ControlPad from '../organisms/ControlPad'
import FullButton from '../atoms/FullButton'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import scales from '../../constants/scales'
import store from '../../store'

const controlPadId = 'controlPad'

let stopLastNoteOnNoteChange = true
let currentlyPlayingPitch = null

const calculatePitch = ratio => {
  const scale = scales[store.getState().settings.selectedScale]
  const {length} = scale
  stopLastNoteOnNoteChange = true
  const i = Math.floor((length + 1) * ratio)
  return scale[(i % length + length) % length] + 12 * Math.floor(i / length)
}

const xYRatiosToNote = ({range, xRatio, yRatio}) => ({
  pitch: calculatePitch(range * xRatio),
  modulation: yRatio
})

const xYRatiosToNoScaleNote = ({range, xRatio, yRatio}) => ({
  pitch: 12 * range * xRatio,
  modulation: yRatio
})

const createSource = curry((
  {octave, rootNote},
  {id, pitch, modulation}
) => ({
  frequency: pitchToFrequency(pitch + 12 * octave + rootNote),
  gain: (1 - modulation) / 2,
  id
}))

const connectComponent = connect(({
  controlPad: {
    arpeggiatorIsOn,
    instrument,
    noScale,
    octave,
    portamento,
    range
  },
  plugins,
  settings: {rootNote},
}) => ({
  arpeggiatorIsOn,
  instrument,
  noScale,
  octave,
  plugins,
  portamento,
  range,
  rootNote,
}))

export default connectComponent(({
  arpeggiatorIsOn,
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
      <ControlPad
        inputEndHandler={compose(
          stopArpeggiator,
          instance => instance.inputNoteStop && instance.inputNoteStop(controlPadId),
          _ => instrumentInstance(instrument, plugins),
          tap(_ => currentlyPlayingPitch = null)
        )}
        inputHandler={compose(
          ifElse(
            always(arpeggiatorIsOn),
            startArpeggiator,
            compose(
              x => instrumentInstance(instrument, plugins).inputNoteStart(x),
              createSource({octave, rootNote})
            )
          ),
          tap(({pitch}) => currentlyPlayingPitch = pitch),
          tap(({pitch}) => !noScale && !portamento && (
            currentlyPlayingPitch !== pitch &&
            currentlyPlayingPitch !== null &&
            stopLastNoteOnNoteChange
          ) &&
            instrumentInstance(instrument, plugins).inputNoteStop &&
            instrumentInstance(instrument, plugins).inputNoteStop(controlPadId)),
          assoc('id', controlPadId),
          ifElse(_ => noScale, xYRatiosToNoScaleNote, xYRatiosToNote),
          assoc('range', range)
        )}
      />
    </div>
    <nav>
      <FullButton to='/controllers/control-pad/settings'>Options</FullButton>
    </nav>
  </div>)
