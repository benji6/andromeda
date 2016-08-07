import capitalize from 'capitalize'
import {map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath} from '../../utils/helpers'
import InstrumentSelector from '../molecules/InstrumentSelector'
import {
  keyboardMonophonicSet,
  keyboardInstrumentSet,
  keyboardOctaveSet,
  keyboardVolumeSet,
} from '../../actions'
import ButtonPrimary from '../atoms/ButtonPrimary'
import InputLabel from '../atoms/InputLabel'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'

const connectComponent = connect(({keyboard, dispatch, plugins}) =>
  ({keyboard, dispatch, plugins}))

export default connectComponent(({keyboard, dispatch, plugins}) =>
  <div className='KeyboardSettings'>
    <h2>Keyboard Settings</h2>
    <InstrumentSelector
      defaultValue={keyboard.instrument}
      handleChange={(comp(
        dispatch,
        keyboardInstrumentSet,
        eventValuePath
      ))}
      label='Instrument'
      options={map(
        instrument => ({text: capitalize.words(instrument), value: instrument}),
        controllableInstrumentInstanceNames(plugins)
      )}
    />
    <RangeSelector
      max='1'
      min='0'
      step='0.01'
      onChange={comp(dispatch, keyboardVolumeSet, Number, eventValuePath)}
      output={Math.round(keyboard.volume * 100)}
      text='Volume'
      value={keyboard.volume}
    />
    <RangeSelector
      max='2'
      min='-3'
      onChange={comp(dispatch, keyboardOctaveSet, Number, eventValuePath)}
      output={keyboard.octave}
      text='Octave'
      value={keyboard.octave}
    />
    <CheckboxSelector {...{
      checked: keyboard.monophonic,
      onChange: e => dispatch(keyboardMonophonicSet(e.target.checked)),
      text: 'Monophonic',
    }} />
    <div>
      <InputLabel />
      <ButtonPrimary to='/settings'>OK</ButtonPrimary>
    </div>
  </div>)
