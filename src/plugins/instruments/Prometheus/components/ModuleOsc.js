import {createElement} from 'react'
import ControlModule, {Range} from '../../../../components/organisms/ControlModule'
import SelectOscType from './SelectOscType'

export default ({i, updateOsc, settings}) =>
  createElement(ControlModule, {title: `Osc ${i + 1}`},
    createElement(SelectOscType, {
      defaultValue: settings.type,
      onChange: ({target: {value}}) => updateOsc('type', value),
    }),
    createElement(Range, {
      defaultValue: settings.gain,
      label: 'Gain',
      max: 2,
      onInput: e => updateOsc('gain', Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: settings.pan,
      label: 'Pan',
      min: -1,
      onInput: e => updateOsc('pan', Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: settings.pitch,
      displayValue: settings.pitch,
      label: 'Pitch',
      max: 24,
      min: -24,
      onInput: e => updateOsc('pitch', Number(e.target.value)),
      step: 1,
    }),
    createElement(Range, {
      defaultValue: settings.detune,
      displayValue: settings.detune,
      label: 'Detune',
      max: 50,
      min: -50,
      onInput: e => updateOsc('detune', Number(e.target.value)),
    })
  )
