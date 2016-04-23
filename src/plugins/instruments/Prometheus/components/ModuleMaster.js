import React from 'react'
import Module from './Module'
import ModuleRange from './ModuleRange'

export default ({masterGain, masterPan, updateProp}) =>
  <div>
    <Module title='Master'>
      <ModuleRange {...{
        defaultValue: masterGain,
        label: 'Gain',
        max: 1.5,
        min: 0,
        onInput: e => updateProp('masterGain', e.target.value),
        step: 0.01,
      }} />
      <ModuleRange {...{
        defaultValue: masterPan,
        label: 'Pan',
        max: 1,
        min: -1,
        onInput: e => updateProp('masterPan', e.target.value),
        step: 0.01,
      }} />
    </Module>
  </div>
