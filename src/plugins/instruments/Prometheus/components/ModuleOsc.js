import React from 'react'
import Module, {Range} from '../../../../components/organisms/ControlModule'
import SelectOscType from './SelectOscType'

export default ({i, updateOsc, settings}) =>
  <Module {...{title: `Osc ${i + 1}`}} >
    <SelectOscType {...{
      defaultValue: settings.type,
      onChange: ({target: {value}}) => updateOsc('type', value),
    }}/>
    <Range {...{
      defaultValue: settings.gain,
      label: 'Gain',
      max: 2,
      min: 0,
      onInput: e => updateOsc('gain', Number(e.target.value)),
      step: 0.01,
    }} />
    <Range {...{
      defaultValue: settings.pan,
      label: 'Pan',
      max: 1,
      min: -1,
      onInput: e => updateOsc('pan', Number(e.target.value)),
      step: 0.01,
    }} />
    <Range {...{
      defaultValue: settings.pitch,
      displayValue: settings.pitch,
      label: 'Pitch',
      max: 24,
      min: -24,
      onInput: e => updateOsc('pitch', Number(e.target.value)),
    }} />
    <Range {...{
      defaultValue: settings.detune,
      displayValue: settings.detune,
      label: 'Detune',
      max: 50,
      min: -50,
      onInput: e => updateOsc('detune', Number(e.target.value)),
    }} />
  </Module>
