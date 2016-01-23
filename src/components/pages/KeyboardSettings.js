import capitalize from 'capitalize'
import { compose, identity, map } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import Selector from '../molecules/Selector'
import { updateKeyboardInstrument, updateKeyboardOctave, updateKeyboardVolume } from '../../actions'
import FullButton from '../atoms/FullButton'
import RangeSelector from '../molecules/RangeSelector'
import { eventValuePath } from '../../utils/helpers'

export default connect(identity)(({keyboard, dispatch, instruments}) => <div className='flex-column text-center'>
    <h2 className='text-center'>Keyboard Settings</h2>
    <Selector
  defaultValue={keyboard.instrument}
  handleChange={(compose(dispatch, updateKeyboardInstrument, eventValuePath))}
  label='Instrument'
  options={map(instrument => ({text: capitalize.words(instrument),
    value: instrument}),
    instruments)}
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
      <span className='inline-label-text'></span><FullButton text='OK' to='/settings' />
    </div>
  </div>)
