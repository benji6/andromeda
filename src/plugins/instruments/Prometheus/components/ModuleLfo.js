import {createElement} from 'react'
import ControlModule, {Range} from '../../../../components/organisms/ControlModule'
import SelectOscType from './SelectOscType'

export default ({lfo: {gain, frequency, type}, updateLfo}) =>
  createElement(ControlModule, {title: 'LFO'},
    createElement(SelectOscType, {
      defaultValue: type,
      onChange: e => updateLfo('type', e.target.value),
    }),
    createElement(Range, {
      defaultValue: frequency,
      label: 'Rate',
      max: 16,
      min: 0.01,
      onInput: e => updateLfo('frequency', Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: gain,
      displayValue: Math.round(gain),
      label: 'Amount',
      max: 1024,
      onInput: e => updateLfo('gain', Number(e.target.value)),
    })
  )
