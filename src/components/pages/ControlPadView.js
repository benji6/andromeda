import {
  always,
  assoc,
  compose,
  curry,
  identity,
  ifElse,
  map,
  tap
} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {startArpeggiator, stopArpeggiator} from '../../audioHelpers/arpeggiator'
import ControlPad from '../organisms/ControlPad'
import Navigation from '../organisms/Navigation'
import PerformanceMenu from '../organisms/PerformanceMenu'
import {currentScale} from '../../utils/derivedData'
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

export default connect(identity)(({
  controlPad: {
    arpeggiatorIsOn,
    instrument,
    noScale,
    octave,
    portamento,
    range
  },
  instruments,
  rootNote
}) => <div>
    <Navigation />
    <div className='text-center'>
      <ControlPad
        inputEndTransducer={compose(
          map(tap(_ => currentlyPlayingPitch = null)),
          map(_ => instruments[instrument].inputNoteStop(controlPadId)),
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
          ) && instruments[instrument].inputNoteStop(controlPadId))),
          map(tap(({pitch}) => currentlyPlayingPitch = pitch)),
          map(ifElse(
            always(arpeggiatorIsOn),
            startArpeggiator,
            compose(
              x => instruments[instrument].inputNoteStart(x),
              createSource({octave, rootNote})
            )
          ))
        )}
      />
    </div>
    <PerformanceMenu />
  </div>)
