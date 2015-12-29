import capitalize from 'capitalize'
import React from 'react'
import {map} from 'ramda'
import InputLabel from '../atoms/InputLabel'
import Checkbox from '../atoms/Checkbox'
import FullSelect from '../atoms/FullSelect'
import RangeSelector from './RangeSelector'

export default ({
  arpeggiatorIsOn,
  arpeggiatorOctaves,
  handleArpeggiatorIsOnChange,
  handleArpeggiatorOctavesChange,
  handlePatternSelect,
  patterns,
  selectedPattern
}) =>
  <div className='flex-column'>
    <label>
      <InputLabel text='Arpeggiator' />
      <Checkbox checked={arpeggiatorIsOn}
                onChange={handleArpeggiatorIsOnChange} />
    </label>
    <label>
      <InputLabel text='Pattern' />
      <FullSelect defaultValue={selectedPattern}
                  disabled={!arpeggiatorIsOn}
                  onChange={handlePatternSelect}
                  options={map(value => ({text: capitalize.words(value),
                                          value}), patterns)} />
    </label>
    <RangeSelector
      max='4'
      min='1'
      onChange={handleArpeggiatorOctavesChange}
      output={arpeggiatorOctaves}
      text='Octaves'
      value={arpeggiatorOctaves}
    />
  </div>
