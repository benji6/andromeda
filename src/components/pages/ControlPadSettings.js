import capitalize from 'capitalize'
import {compose, identity, keys, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import Selector from '../molecules/Selector'
import {
  updateControlPadArpeggiatorIsOn,
  updateControlPadArpeggiatorOctaves,
  updateControlPadInstrument,
  updateControlPadNoScale,
  updateControlPadOctave,
  updateControlPadPortamento,
  updateControlPadRange,
  updateControlPadSelectedArpeggiatorPattern
} from '../../actions'
import FullButton from '../atoms/FullButton'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'
import {eventValuePath, eventCheckedPath} from '../../utils/helpers'

export default connect(identity)(({
  arpeggiatorPatterns,
  controlPad,
  dispatch,
  instruments
}) =>
  <div className='flex-column text-center'>
    <h2 className='text-center'>Control Pad Settings</h2>
    <Selector
      defaultValue={controlPad.instrument}
      handleChange={compose(
        dispatch,
        updateControlPadInstrument,
        eventValuePath
      )}
      label='Instrument'
      options={map(instrument => ({
        text: capitalize.words(instrument),
        value: instrument
      }), keys(instruments))}
    />
    <RangeSelector
      max='2'
      min='-3'
      onChange={compose(
        dispatch,
        updateControlPadOctave,
        Number,
        eventValuePath
      )}
      output={controlPad.octave}
      text='Octave'
      value={controlPad.octave}
    />
    <RangeSelector
      max='3'
      min='1'
      onChange={compose(
        dispatch,
        updateControlPadRange,
        Number,
        eventValuePath
      )}
      output={controlPad.range}
      text='Range'
      value={controlPad.range}
    />
    <CheckboxSelector
      checked={controlPad.arpeggiatorIsOn}
      onChange={compose(
        dispatch,
        updateControlPadArpeggiatorIsOn,
        eventCheckedPath
      )}
      text='Arpeggiator'
    />
    <Selector
      defaultValue={controlPad.selectedArpeggiatorPattern}
      disabled={!controlPad.arpeggiatorIsOn}
      handleChange={compose(
        dispatch,
        updateControlPadSelectedArpeggiatorPattern,
        eventValuePath
      )}
      label='Arpeggiator Pattern'
      options={map(value => ({
        text: capitalize.words(value),
        value
      }), Object.keys(arpeggiatorPatterns))}
    />
    <RangeSelector
      disabled={!controlPad.arpeggiatorIsOn}
      max='4'
      min='1'
      onChange={compose(
        dispatch,
        updateControlPadArpeggiatorOctaves,
        Number,
        eventValuePath
      )}
      output={controlPad.arpeggiatorOctaves}
      text='Arpeggiator Octaves'
      value={controlPad.arpeggiatorOctaves}
    />
    <CheckboxSelector
      checked={controlPad.portamento}
      onChange={compose(dispatch, updateControlPadPortamento, eventCheckedPath)}
      text='Portamento'
    />
    <CheckboxSelector
      checked={controlPad.noScale}
      onChange={compose(dispatch, updateControlPadNoScale, eventCheckedPath)}
      text='No Scale'
    />
    <div>
      <span className='inline-label-text'></span>
      <FullButton text='OK' to='/control-pad' />
    </div>
  </div>)
