import React from 'react'
import Module, {Range, Select} from './Module'
import capitalize from 'capitalize'

const paramsAll = ['frequency', 'gain', 'Q']
const paramsFrequencyGain = ['frequency', 'gain']
const paramsFrequencyQ = ['frequency', 'Q']

const typesToParams = {
  allpass: paramsFrequencyQ,
  bandpass: paramsFrequencyQ,
  highpass: paramsFrequencyQ,
  highshelf: paramsFrequencyGain,
  lowshelf: paramsFrequencyGain,
  lowpass: paramsFrequencyQ,
  notch: paramsFrequencyQ,
  peaking: paramsAll,
}

const ControlFrequency = ({frequency, updateFilter}) => <Range {...{
  defaultValue: Math.log(frequency),
  displayValue: Math.round(frequency),
  label: 'Frequency',
  max: Math.log(20000),
  min: Math.log(20),
  onInput: e => updateFilter('frequency', Math.exp(Number(e.target.value))),
  step: 0.001,
}} />

const ControlGain = ({gain, updateFilter}) => <Range {...{
  defaultValue: gain,
  label: 'Gain',
  max: 20,
  min: -20,
  onInput: e => updateFilter('gain', Number(e.target.value)),
  step: 0.1,
}} />

const ControlQ = ({Q, updateFilter}) => <Range {...{
  defaultValue: Q,
  label: 'Q',
  max: 24,
  min: 0,
  onInput: e => updateFilter('Q', Number(e.target.value)),
  step: 0.1,
}} />

export default ({frequency, gain, Q, type, updateFilter}) =>
  <Module {...{title: 'Filter'}}>
    <Select {...{
      defaultValue: type,
      onChange: e => updateFilter('type', e.target.value),
      label: 'Type',
    }}
    >
      {Object.keys(typesToParams).map(type => <option {...{
        key: type,
        value: type,
      }}>{capitalize(type)}</option>)}
    </Select>
    {
      typesToParams[type].map(param => param === 'frequency'
        ? <ControlFrequency {...{frequency, key: param, updateFilter}} />
        : param === 'gain'
          ? <ControlGain {...{gain, key: param, updateFilter}} />
          : <ControlQ {...{key: param, Q, updateFilter}} />)
    }
  </Module>
