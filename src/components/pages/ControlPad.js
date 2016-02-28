import {
  always,
  assoc,
  compose,
  curry,
  ifElse,
  map,
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
        inputEndTransducer={compose(
          map(tap(_ => currentlyPlayingPitch = null)),
          map(_ => instrumentInstance(instrument, plugins).inputNoteStop(controlPadId)),
          map(stopArpeggiator)
        )}
        inputTransducer={compose(
          map(assoc('range', range)),
          map(ifElse(_ => noScale, xYRatiosToNoScaleNote, xYRatiosToNote)),
          map(assoc('id', controlPadId)),
          map(tap(({pitch}) => !noScale && !portamento && (
            currentlyPlayingPitch !== pitch &&
            currentlyPlayingPitch !== null &&
            stopLastNoteOnNoteChange
          ) && instrumentInstance(instrument, plugins).inputNoteStop(controlPadId))),
          map(tap(({pitch}) => currentlyPlayingPitch = pitch)),
          map(ifElse(
            always(arpeggiatorIsOn),
            startArpeggiator,
            compose(
              x => instrumentInstance(instrument, plugins).inputNoteStart(x),
              createSource({octave, rootNote})
            )
          ))
        )}
      />
    </div>
    <nav>
      <FullButton to='/controllers/control-pad/settings'>Options</FullButton>
    </nav>
  </div>)
