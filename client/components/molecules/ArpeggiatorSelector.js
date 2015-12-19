import capitalize from 'capitalize'
import React from 'react'
import {map} from 'ramda'
import InputLabel from '../atoms/InputLabel'
import Checkbox from '../atoms/Checkbox'
import FullSelect from '../atoms/FullSelect'

export default ({arpeggiatorIsOn,
                 handleArpeggiatorIsOnChange,
                 handlePatternSelect,
                 patterns,
                 selectedPattern}) =>
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
  </div>
