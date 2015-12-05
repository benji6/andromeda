import capitalize from 'capitalize'
import {compose, identity, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import Selector from '../molecules/Selector'
import {
  updateControlPadInstrument,
  updateControlPadOctave,
  updateControlPadPortamento,
} from '../../actions'
import FullButton from '../atoms/FullButton'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'
import {
  eventValuePath,
  eventCheckedPath,
} from '../../tools/paths'

export default connect(identity)(({controlPad,
                                   dispatch,
                                   instruments}) =>
  <div className="flex-column text-center">
    <h2 className="text-center">Control Pad Settings</h2>
    <Selector
      defaultValue={controlPad.instrument}
      handleChange={(compose(dispatch, updateControlPadInstrument, eventValuePath))}
      label="Instrument"
      options={map(instrument => ({text: capitalize.words(instrument),
                                   value: instrument}),
                   instruments)}
    />
    <RangeSelector
      max="2"
      min="-3"
      onChange={compose(dispatch, updateControlPadOctave, Number, eventValuePath)}
      output={controlPad.octave}
      text="Octave"
      value={controlPad.octave}
    />
    <CheckboxSelector
      checked={controlPad.portamento}
      onChange={compose(dispatch, updateControlPadPortamento, eventCheckedPath)}
      text="Portamento"
    />
    <div>
      <span className="inline-label-text"></span><FullButton text="OK" to="/control-pad" />
    </div>
  </div>)
