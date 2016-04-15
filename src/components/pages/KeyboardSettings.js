import capitalize from 'capitalize'
import {compose, map} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {controllableInstrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath} from '../../utils/helpers'
import InstrumentSelector from '../molecules/InstrumentSelector'
import {
  updateKeyboardInstrument,
  updateKeyboardOctave,
  updateKeyboardVolume
} from '../../actions'
import FullButton from '../atoms/FullButton'
import InputLabel from '../atoms/InputLabel'
import RangeSelector from '../molecules/RangeSelector'

const connectComponent = connect(({keyboard, dispatch, plugins}) =>
  ({keyboard, dispatch, plugins}))

export default connectComponent(({keyboard, dispatch, plugins}) =>
  <div className='flex-column text-center'>
    <h2 className='text-center'>Keyboard Settings</h2>
    <InstrumentSelector
      defaultValue={keyboard.instrument}
      handleChange={(compose(
        dispatch,
        updateKeyboardInstrument,
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
      onChange={compose(dispatch, updateKeyboardVolume, Number, eventValuePath)}
      output={Math.round(keyboard.volume * 100)}
      text='Volume'
      value={keyboard.volume}
    />
    <RangeSelector
      max='2'
      min='-3'
      onChange={compose(dispatch, updateKeyboardOctave, Number, eventValuePath)}
      output={keyboard.octave}
      text='Octave'
      value={keyboard.octave}
    />
    <div>
      <InputLabel />
      <FullButton to='/settings'>OK</FullButton>
    </div>
  </div>)
