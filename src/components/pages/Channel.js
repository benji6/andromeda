import {difference, map, pluck} from 'ramda'
import {createElement} from 'react'
import {connect} from 'react-redux'
import {
  addEffectToChannel,
  addInstrumentToChannel,
  removeEffectFromChannel,
  removeInstrumentFromChannel,
} from '../../actions'
import ButtonPrimary from '../atoms/ButtonPrimary'
import {Cross, Plus} from '../atoms/ButtonIcons'
import InputSelect from '../atoms/InputSelect'
import {mapIndexed} from '../../utils/helpers'

let selectedAddEffect = null
let selectedAddSource = null

const connectComponent = connect(({
  dispatch,
  plugins: {channels, effectInstances, instrumentInstances},
}, {params}) => ({
  channelId: Number(params.channelId),
  channels,
  dispatch,
  effectInstances,
  instrumentInstances,
}))

export default connectComponent(({
  channelId,
  channels,
  dispatch,
  effectInstances,
  instrumentInstances,
}) => {
  const sources = channels[channelId].instruments
  const effects = channels[channelId].effects
  const addSources = difference(pluck('name', instrumentInstances), sources)
  const addEffects = difference(pluck('name', effectInstances), effects)
  selectedAddSource = head(addSources)
  selectedAddEffect = head(addEffects)

  return createElement('div', {className: 'Channel'},
    createElement('h1', null, `Channel ${channelId}`),
    createElement('h2', null, 'Effects'),
    mapIndexed(
      (name, i) => createElement('div', {key: i},
        createElement(ButtonPrimary, {to: `/plugins/effects/${name}`}, name),
        createElement(Cross, {onClick: () => dispatch(removeEffectFromChannel({
          channel: channelId,
          name,
        }))})
      ),
      effects
    ),
    Boolean(addEffects.length) && createElement('p', null, 'Add effect'),
    Boolean(addEffects.length) && createElement('div', null,
      createElement(InputSelect, {
        defaultValue: selectedAddEffect,
        onChange: e => selectedAddEffect = e.target.value,
        options: map(text => ({text, value: text}), addEffects),
      }),
      createElement(Plus, {onClick: () => dispatch(addEffectToChannel({
        channel: channelId,
        name: selectedAddEffect,
      }))})
    ),
    createElement('h2', null, 'Sources'),
    createElement('div', {className: 'Channel__Sources'},
      map(
        name => createElement('div', {key: name},
          createElement(
            ButtonPrimary,
            {small: true, to: `/plugins/instruments/${name}`},
            name
          ),
          createElement(Cross, {onClick: () => dispatch(removeInstrumentFromChannel({
            channel: channelId,
            name,
          }))})
        ),
        sources
      )
    ),
    Boolean(addSources.length) && createElement('p', null, 'Add source'),
    Boolean(addSources.length) && createElement('div', null,
      createElement(InputSelect, {
        defaultValue: selectedAddSource,
        onChange: e => selectedAddSource = e.target.value,
        options: map(text => ({text, value: text}), addSources),
      }),
      createElement(Plus, {onClick: () => {
        dispatch(addInstrumentToChannel({
          channel: channelId,
          name: selectedAddSource,
        }))
        selectedAddSource = addSources[1]
      }})
    )
  )
})
