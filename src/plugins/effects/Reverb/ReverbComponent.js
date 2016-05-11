import React from 'react'
import ControlModule, {Range, Select} from '../../../components/organisms/ControlModule'

export default ({
  dryLevel,
  highCut,
  lowCut,
  reverbType,
  setProp,
  reverbTypes,
  wetLevel,
}) => <div style={{textAlign: 'center'}}>
  <h2>Reverb</h2>
  <ControlModule>
    <Select {...{
        defaultValue: reverbType,
        label: 'Type',
        onChange: e => setProp('reverbType', e.target.value),
      }}>
      {reverbTypes.map((x, i) => <option key={i} value={x}>
        {x}
      </option>)}
    </Select>
    <Range {...{
      label: 'Dry level',
      defaultValue: dryLevel,
      onInput: e => setProp('dryLevel', Number(e.target.value)),
    }}/>
    <Range {...{
      label: 'Wet level',
      defaultValue: wetLevel,
      onInput: e => setProp('wetLevel', Number(e.target.value)),
    }}/>
    <Range {...{
      label: 'Low cutoff',
      defaultValue: Math.log(lowCut),
      max: Math.log(20000),
      min: Math.log(20),
      onInput: e => setProp('lowCut', Math.exp(Number(e.target.value))),
    }}/>
    <Range {...{
      label: 'High cutoff',
      defaultValue: Math.log(highCut),
      max: Math.log(20000),
      min: Math.log(20),
      onInput: e => setProp('highCut', Math.exp(Number(e.target.value))),
    }}/>
  </ControlModule>
</div>
