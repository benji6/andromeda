import capitalize from 'capitalize'
import {map} from 'ramda'
import {connect} from 'react-redux'
import React from 'react'
import {bpmSet, updateRootNote, updateSelectedScale} from '../../actions'
import ButtonPrimary from '../atoms/ButtonPrimary'
import RangeSelector from '../molecules/RangeSelector'
import noteNameFromPitch from '../../audioHelpers/noteNameFromPitch'
import Selector from '../molecules/Selector'
import {eventValuePath} from '../../utils/helpers'
import scales from '../../constants/scales'

const minBpm = 32

const connectComponent = connect(({
  dispatch,
  microphone,
  settings: {bpm, rootNote, selectedScale},
}) => ({
  bpm,
  dispatch,
  microphone,
  rootNote,
  selectedScale,
}))

export default connectComponent(({
  bpm,
  dispatch,
  rootNote,
  selectedScale,
}) =>
  <div className='settings-view'>
    <div className='flex-column text-center'>
      <RangeSelector
        max='512'
        min={minBpm}
        onChange={comp(
          dispatch,
          bpmSet,
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
        onChange={comp(
          dispatch,
          updateRootNote,
          Number,
          eventValuePath
        )}
        output={noteNameFromPitch(rootNote)}
        text='Root Note'
        value={rootNote}
      />
      <Selector
        defaultValue={selectedScale}
        handleChange={comp(dispatch, updateSelectedScale, eventValuePath)}
        label='Scale'
        options={map(
          value => ({text: capitalize.words(value), value}),
          Object.keys(scales)
        )}
      />
      <div>
        <ButtonPrimary to='/controllers/keyboard/settings'>Keyboard Settings</ButtonPrimary>
      </div>
    </div>
  </div>)
