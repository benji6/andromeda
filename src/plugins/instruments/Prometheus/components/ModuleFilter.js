import React from 'react'
import Module from './Module'
import ModuleRange from './ModuleRange'
import ModuleSelect from './ModuleSelect'
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

const ControlFrequency = ({frequency, updateFilterProp}) => <ModuleRange {...{
  defaultValue: Math.log(frequency),
  displayValue: Math.round(frequency),
  label: 'Frequency',
  max: Math.log(20000),
  min: Math.log(20),
  onInput: e => updateFilterProp('frequency', Math.exp(Number(e.target.value))),
  step: 0.001,
}} />

const ControlGain = ({gain, updateFilterProp}) => <ModuleRange {...{
  defaultValue: gain,
  label: 'Gain',
  max: 20,
  min: -20,
  onInput: e => updateFilterProp('gain', Number(e.target.value)),
  step: 0.1,
}} />

const ControlQ = ({Q, updateFilterProp}) => <ModuleRange {...{
  defaultValue: Q,
  label: 'Q',
  max: 24,
  min: 0,
  onInput: e => updateFilterProp('Q', Number(e.target.value)),
  step: 0.1,
}} />

export default ({frequency, gain, Q, type, updateFilterProp}) =>
  <div>
    <Module {...{title: 'Filter'}}>
      <ModuleSelect {...{
        defaultValue: type,
        onChange: e => updateFilterProp('type', e.target.value),
        label: 'Type',
      }}
      >
        {Object.keys(typesToParams).map(type => <option {...{
          key: type,
          value: type,
        }}>{capitalize(type)}</option>)}
      </ModuleSelect>
      {
        typesToParams[type].map(param => param === 'frequency'
          ? <ControlFrequency {...{frequency, key: param, updateFilterProp}} />
          : param === 'gain'
            ? <ControlGain {...{gain, key: param, updateFilterProp}} />
            : <ControlQ {...{key: param, Q, updateFilterProp}} />)
      }
    </Module>
  </div>
