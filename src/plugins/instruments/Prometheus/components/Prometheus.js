import {createElement} from 'react'
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
  createElement('div', {style: {color: blue, textAlign: 'center'}},
    createElement('h2', {style: {fontSize: size6, margin: size5}}, 'PROMETHEUS'),
    createElement(ModuleMaster, {master, updateMaster}),
    createElement('div', null,
      createElement(ModuleFilter, {
        frequency: filter.frequency,
        gain: filter.gain,
        Q: filter.Q,
        type: filter.type,
        updateFilter,
      }),
      createElement(ModuleLfo, {lfo, updateLfo})
    ),
    oscillators.map((settings, i) => createElement(ModuleOsc, {
      i,
      key: i,
      settings,
      updateOsc: updateOsc(i),
    }))
  )
