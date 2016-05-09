import React from 'react'
import ControlModule, {Range} from '../../../../components/organisms/ControlModule'

export default ({master: {gain, pan}, updateMaster}) =>
  <div>
    <ControlModule title='Master'>
      <Range {...{
        defaultValue: gain,
        label: 'Gain',
        max: 1.5,
        onInput: e => updateMaster('gain', Number(e.target.value)),
      }} />
      <Range {...{
        defaultValue: pan,
        label: 'Pan',
        min: -1,
        onInput: e => updateMaster('pan', Number(e.target.value)),
      }} />
    </ControlModule>
  </div>
