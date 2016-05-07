import capitalize from 'capitalize'
import {compose, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath, eventCheckedPath} from '../../utils/helpers'
import {
  updateControlPadInstrument,
  updateControlPadNoScale,
  updateControlPadOctave,
  updateControlPadPortamento,
  updateControlPadRange,
} from '../../actions'
import ButtonPrimary from '../atoms/ButtonPrimary'
import InputLabel from '../atoms/InputLabel'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'
import InstrumentSelector from '../molecules/InstrumentSelector'

const connectComponent = connect(({
  controlPad,
  dispatch,
  plugins
}) => ({
  controlPad,
  dispatch,
  plugins
}))

export default connectComponent(({
  controlPad,
  dispatch,
  plugins
}) =>
  <div className='flex-column text-center'>
    <h2 className='text-center'>Control Pad Settings</h2>
    <InstrumentSelector
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
      }), controllableInstrumentInstanceNames(plugins))}
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
      <InputLabel />
      <ButtonPrimary to='/controllers/control-pad'>OK</ButtonPrimary>
    </div>
  </div>)
