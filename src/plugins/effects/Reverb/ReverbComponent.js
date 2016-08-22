import {createElement} from 'react'
import ControlModule, {Range, Select} from '../../../components/organisms/ControlModule'

export default ({
  dryLevel,
  highCut,
  lowCut,
  reverbType,
  setProp,
  reverbTypes,
  wetLevel,
}) => createElement('div', {style: {textAlign: 'center'}},
  createElement('h2', null, 'Reverb'),
  createElement(ControlModule, null,
    createElement(
      Select,
      {
        defaultValue: reverbType,
        label: 'Type',
        onChange: e => setProp('reverbType', e.target.value),
      },
      reverbTypes.map((x, i) => createElement('option', {key: i, value: x}, x))
    ),
    createElement(Range, {
      defaultValue: dryLevel,
      label: 'Dry level',
      onInput: e => setProp('dryLevel', Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: wetLevel,
      label: 'Wet level',
      onInput: e => setProp('wetLevel', Number(e.target.value)),
    }),
    createElement(Range, {
      defaultValue: Math.log(lowCut),
      label: 'Low cutoff',
      max: Math.log(20000),
      min: Math.log(20),
      onInput: e => setProp('lowCut', Math.exp(Number(e.target.value))),
    }),
    createElement(Range, {
      defaultValue: Math.log(highCut),
      label: 'High cutoff',
      max: Math.log(20000),
      min: Math.log(20),
      onInput: e => setProp('highCut', Math.exp(Number(e.target.value))),
    })
  )
)
