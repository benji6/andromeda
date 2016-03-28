import {
  always,
  assoc,
  compose,
  curry,
  ifElse,
  tap
} from 'ramda'
import React from 'react'
import {rawConnect} from '../../utils/helpers'
import {startArpeggiator, stopArpeggiator} from '../../audioHelpers/arpeggiator'
import ControlPad from '../organisms/ControlPad'
import FullButton from '../atoms/FullButton'
import {currentScale, instrumentInstance} from '../../utils/derivedData'
import pitchToFrequency from '../../audioHelpers/pitchToFrequency'
import store from '../../store'

const controlPadId = 'controlPad'

let stopLastNoteOnNoteChange = true
let currentlyPlayingPitch = null

const calculatePitch = ratio => {
  const scale = currentScale(store.getState().scale)
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

export default rawConnect(({
  controlPad: {
    arpeggiatorIsOn,
    instrument,
    noScale,
    octave,
    portamento,
    range
  },
  plugins,
  rootNote
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
