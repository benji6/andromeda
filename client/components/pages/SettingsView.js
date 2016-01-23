import capitalize from 'capitalize'
import {compose, identity, keys, map, tap} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {updateBpm, updateMicrophoneIsOn, updateSelectedRootNote, updateSelectedScale} from '../../actions'
import Navigation from '../organisms/Navigation'
import CheckboxSelector from '../molecules/CheckboxSelector'
import RangeSelector from '../molecules/RangeSelector'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import Selector from '../molecules/Selector'
import FullButton from '../atoms/FullButton'
import switchMicrophone from '../../switchMicrophone'
import {eventValuePath, eventCheckedPath} from '../../helpers'

const minBpm = 32

export default connect(identity)(({
  bpm,
  dispatch,
  microphone,
  rootNote,
  scale: {scaleName, scales}
}) => <div className='settings-view'>
    <Navigation />
    <h1 className='text-center'>Settings</h1>
    <div className='flex-column text-center'>
      <RangeSelector
        max='512'
        min={minBpm}
        onChange={compose(
          dispatch,
          updateBpm,
          Number,
          eventValuePath
        )}
        output={bpm}
        text='BPM'
        value={bpm}
      />
      <RangeSelector
        max='24'
        min='-36'
        onChange={compose(
          dispatch,
          updateSelectedRootNote,
          Number,
          eventValuePath
        )}
        output={noteNameFromPitch(rootNote)}
        text='Root Note'
        value={rootNote}
      />
      <Selector
        defaultValue={scaleName}
        handleChange={compose(dispatch, updateSelectedScale, eventValuePath)}
        label='Scale'
        options={map(
          value => ({text: capitalize.words(value), value}),
          keys(scales)
        )}
      />
      <CheckboxSelector
        checked={microphone.isOn}
        disabled={!microphone.isAvailable}
        onChange={compose(
          dispatch,
          updateMicrophoneIsOn,
          tap(switchMicrophone(dispatch)),
          eventCheckedPath
        )}
        text='Microphone'
      />
    </div>
    <div className='text-center'>
      <FullButton
        text='Keyboard Settings'
        to='/keyboard/settings'
      />
    </div>
  </div>)
