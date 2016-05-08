import React from 'react'
import ModuleFilter from './ModuleFilter'
import ModuleLfo from './ModuleLfo'
import ModuleMaster from './ModuleMaster'
import ModuleOsc from './ModuleOsc'

const blue = '#ace'
const size5 = '1rem'
const size6 = '1.25rem'

export default ({
  filter,
  lfo,
  master,
  oscillators,
  updateFilter,
  updateLfo,
  updateMaster,
  updateOsc,
}) =>
  <div {...{style: {color: blue, textAlign: 'center'}}}>
    <h2 {...{style: {fontSize: size6, margin: size5}}}>PROMETHEUS</h2>
    <ModuleMaster {...{master, updateMaster}} />
    <div>
      <ModuleFilter {...{
        frequency: filter.frequency,
        gain: filter.gain,
        Q: filter.Q,
        type: filter.type,
        updateFilter,
      }}/>
      <ModuleLfo {...{lfo, updateLfo}} />
    </div>
    {oscillators.map((settings, i) => <ModuleOsc {...{
      i,
      key: i,
      settings,
      updateOsc: updateOsc(i),
    }} />)}
  </div>
