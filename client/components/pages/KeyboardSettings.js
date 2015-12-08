import capitalize from 'capitalize'
import {compose, identity, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import Selector from '../molecules/Selector'
import {
  updateKeyboardInstrument,
  updateKeyboardOctave,
} from '../../actions'
import FullButton from '../atoms/FullButton'
import RangeSelector from '../molecules/RangeSelector'
import {eventValuePath} from '../../tools/paths'

export default connect(identity)(({keyboard,
                                   dispatch,
                                   instruments}) =>
  <div className="flex-column text-center">
    <h2 className="text-center">Keyboard Settings</h2>
    <Selector
      defaultValue={keyboard.instrument}
      handleChange={(compose(dispatch, updateKeyboardInstrument, eventValuePath))}
      label="Instrument"
      options={map(instrument => ({text: capitalize.words(instrument),
                                   value: instrument}),
                   instruments)}
    />
    <RangeSelector
      max="2"
      min="-3"
      onChange={compose(dispatch, updateKeyboardOctave, Number, eventValuePath)}
      output={keyboard.octave}
      text="Octave"
      value={keyboard.octave}
    />
    <div>
      <span className="inline-label-text"></span><FullButton text="OK" to="/settings" />
    </div>
  </div>)
