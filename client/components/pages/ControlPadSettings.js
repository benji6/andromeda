import capitalize from 'capitalize'
import {compose, identity, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import Selector from '../molecules/Selector'
import {
  updateControlPadArpeggiatorIsOn,
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
import {eventValuePath, eventCheckedPath} from '../../tools/paths'
import ArpeggiatorSelector from '../molecules/ArpeggiatorSelector'

export default connect(identity)(({
  arpeggiator,
  controlPad,
  dispatch,
  instruments
}) =>
  <div className='flex-column text-center'>
    <h2 className='text-center'>Control Pad Settings</h2>
    <Selector
      defaultValue={controlPad.instrument}
      handleChange={(compose(dispatch, updateControlPadInstrument, eventValuePath))}
      label='Instrument'
      options={map(instrument => ({
        text: capitalize.words(instrument),
        value: instrument
      }), instruments)}
    />
    <RangeSelector
      max='2'
      min='-3'
      onChange={compose(dispatch, updateControlPadOctave, Number, eventValuePath)}
      output={controlPad.octave}
      text='Octave'
      value={controlPad.octave}
    />
    <RangeSelector
      max='3'
      min='1'
      onChange={compose(dispatch, updateControlPadRange, Number, eventValuePath)}
      output={controlPad.range}
      text='Range'
      value={controlPad.range}
    />
    <ArpeggiatorSelector
      arpeggiatorIsOn={controlPad.arpeggiatorIsOn}
      dispatch={dispatch}
      patterns={arpeggiator.patterns}
      selectedPattern={controlPad.selectedArpeggiatorPattern}
      handleArpeggiatorIsOnChange={compose(
        dispatch,
        updateControlPadArpeggiatorIsOn,
        eventCheckedPath
      )}
      handlePatternSelect={compose(
        dispatch,
        updateControlPadSelectedArpeggiatorPattern,
        eventValuePath
      )}
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
      <span className='inline-label-text'></span><FullButton text='OK' to='/control-pad' />
    </div>
  </div>)
