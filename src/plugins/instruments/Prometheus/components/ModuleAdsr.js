import React from 'react'
import Module, {Range} from './Module'

export default ({adsr: {a, d, s, r}, updateAdsr}) =>
  <Module title='ADSR'>
    <Range {...{
      defaultValue: a,
      label: 'A',
      max: 2,
      min: 0,
      onInput: e => updateAdsr('a', Number(e.target.value)),
      step: 0.01,
    }} />
    <Range {...{
      defaultValue: d,
      label: 'D',
      max: 2,
      min: 0,
      onInput: e => updateAdsr('d', Number(e.target.value)),
      step: 0.01,
    }} />
    <Range {...{
      defaultValue: s,
      label: 'S',
      max: 1,
      min: 0,
      onInput: e => updateAdsr('s', Number(e.target.value)),
      step: 0.01,
    }} />
    <Range {...{
      defaultValue: r,
      label: 'R',
      max: 2,
      min: 0,
      onInput: e => updateAdsr('r', Number(e.target.value)),
      step: 0.01,
    }} />
  </Module>
