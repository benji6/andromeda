import capitalize from 'capitalize'
import {compose, map} from 'ramda'
import React from 'react'
import {instrumentInstanceNames} from '../../utils/derivedData'
import {eventValuePath, rawConnect} from '../../utils/helpers'
import Selector from '../molecules/Selector'
import {
  updateKeyboardInstrument,
  updateKeyboardOctave,
  updateKeyboardVolume
} from '../../actions'
import FullButton from '../atoms/FullButton'
import RangeSelector from '../molecules/RangeSelector'

export default rawConnect(({keyboard, dispatch, plugins}) =>
  <div className='flex-column text-center'>
    <h2 className='text-center'>Keyboard Settings</h2>
    <Selector
      defaultValue={keyboard.instrument}
      handleChange={(compose(
        dispatch,
        updateKeyboardInstrument,
        eventValuePath
      ))}
      label='Instrument'
      options={map(
        instrument => ({text: capitalize.words(instrument), value: instrument}),
        instrumentInstanceNames(plugins)
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
      <span className='inline-label-text'></span>
      <FullButton to='/controllers'>OK</FullButton>
    </div>
  </div>)
